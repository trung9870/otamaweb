"use client";

import { useEffect, useRef, useState } from "react";
import type { StoreProduct, StoreSettings } from "@/lib/store-types";

export type PreviewDevice = "desktop" | "mobile";
export type PreviewLocale = "vi" | "en";

interface LivePreviewFrameProps {
  locale: PreviewLocale;
  device: PreviewDevice;
  /** Storefront path to render, e.g. "/" or "/products/__preview__". */
  path?: string;
  draftPatch?: Partial<StoreSettings>;
  productDraft?: StoreProduct | null;
  selectedId: string | null;
  focusRequest: { id: string; nonce: number } | null;
  onSelect: (id: string) => void;
  onPositionChange?: (
    id: string,
    viewport: PreviewDevice,
    x: number,
    y: number
  ) => void;
}

const DESKTOP_WIDTH = 1440;
const MOBILE_WIDTH = 390;

function postTo(iframe: HTMLIFrameElement | null, msg: Record<string, unknown>) {
  iframe?.contentWindow?.postMessage(msg, window.location.origin);
}

function buildUpdate(
  patch: Partial<StoreSettings> | undefined,
  product: StoreProduct | null | undefined,
  selId: string | null
): Record<string, unknown> {
  const msg: Record<string, unknown> = { type: "otama-preview-update", selectedId: selId };
  if (patch) msg.settings = patch;
  if (product !== undefined) msg.productDraft = product;
  return msg;
}

/**
 * Renders a real storefront page inside a same-origin iframe in "preview" mode,
 * scaled to fit the panel. Drafts (homepage layout and/or a product) are pushed
 * via postMessage so nothing is persisted until the admin presses save.
 */
export function LivePreviewFrame({
  locale,
  device,
  path = "/",
  draftPatch,
  productDraft,
  selectedId,
  focusRequest,
  onSelect,
  onPositionChange,
}: LivePreviewFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const src = `${path}?lang=${locale}&preview=1`;
  const [readySrc, setReadySrc] = useState<string | null>(null);

  const latest = useRef({
    draftPatch,
    productDraft,
    selectedId,
    onSelect,
    onPositionChange,
    src,
  });
  useEffect(() => {
    latest.current = {
      draftPatch,
      productDraft,
      selectedId,
      onSelect,
      onPositionChange,
      src,
    };
  });

  // Track available panel size for scaling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setSize({ w: rect.width, h: rect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Handshake + selection + drag-position messages coming back from the preview iframe
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.source !== iframeRef.current?.contentWindow) return;
      const data = e.data as {
        type?: string;
        id?: string;
        viewport?: string;
        x?: number;
        y?: number;
      };
      if (data?.type === "otama-preview-ready") {
        setReadySrc(latest.current.src);
        const l = latest.current;
        postTo(iframeRef.current, buildUpdate(l.draftPatch, l.productDraft, l.selectedId));
      } else if (data?.type === "otama-preview-select" && data.id) {
        latest.current.onSelect(data.id);
      } else if (
        data?.type === "otama-preview-position" &&
        data.id &&
        (data.viewport === "desktop" || data.viewport === "mobile") &&
        typeof data.x === "number" &&
        typeof data.y === "number"
      ) {
        latest.current.onSelect(data.id);
        latest.current.onPositionChange?.(data.id, data.viewport, data.x, data.y);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Push every draft change instantly
  useEffect(() => {
    postTo(iframeRef.current, buildUpdate(draftPatch, productDraft, selectedId));
  }, [draftPatch, productDraft, selectedId]);

  // Scroll preview to a section when it is chosen from the admin sidebar
  useEffect(() => {
    if (!focusRequest) return;
    postTo(iframeRef.current, { type: "otama-preview-focus", id: focusRequest.id });
  }, [focusRequest]);

  const baseWidth = device === "desktop" ? DESKTOP_WIDTH : MOBILE_WIDTH;
  const frameBorder = device === "mobile" ? 12 : 2;
  const scale = size.w > 0 ? Math.min(1, (size.w - frameBorder) / baseWidth) : 1;
  const frameHeight = size.h > 0 ? (size.h - frameBorder) / scale : 800;
  const loading = readySrc !== src;

  return (
    <div ref={containerRef} className="relative h-full w-full min-w-0 overflow-hidden">
      <div
        className={`mx-auto h-full overflow-hidden bg-white ${
          device === "mobile"
            ? "rounded-[22px] border-[6px] border-[#283455] shadow-xl"
            : "rounded-lg border border-[#E5E0DB] shadow-sm"
        }`}
        style={{ width: baseWidth * scale + frameBorder }}
      >
        <iframe
          key={src}
          ref={iframeRef}
          src={src}
          title="Xem trước (bản nháp)"
          style={{
            width: baseWidth,
            height: frameHeight,
            maxWidth: "none",
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
            border: 0,
            display: "block",
          }}
        />
      </div>
      {loading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-white/95 px-4 py-2 text-[13px] font-bold text-[#283455] shadow">
            Đang tải bản xem trước...
          </span>
        </div>
      )}
    </div>
  );
}
