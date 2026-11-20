"use client";

import { useEffect, useRef, useState } from "react";
import type { StoreSettings } from "@/lib/store-types";

export type PreviewDevice = "desktop" | "mobile";
export type PreviewLocale = "vi" | "en";

interface LivePreviewFrameProps {
  locale: PreviewLocale;
  device: PreviewDevice;
  draftPatch: Partial<StoreSettings>;
  selectedId: string | null;
  focusRequest: { id: string; nonce: number } | null;
  onSelect: (id: string) => void;
}

const DESKTOP_WIDTH = 1440;
const MOBILE_WIDTH = 390;

function postTo(iframe: HTMLIFrameElement | null, msg: Record<string, unknown>) {
  iframe?.contentWindow?.postMessage(msg, window.location.origin);
}

/**
 * Renders the real storefront homepage inside a same-origin iframe in "preview"
 * mode, scaled to fit the panel. The draft layout is pushed via postMessage so
 * nothing is persisted until the admin presses "Lưu & Xuất bản".
 */
export function LivePreviewFrame({
  locale,
  device,
  draftPatch,
  selectedId,
  focusRequest,
  onSelect,
}: LivePreviewFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const src = `/?lang=${locale}&preview=1`;
  const [readySrc, setReadySrc] = useState<string | null>(null);

  const latest = useRef({ draftPatch, selectedId, onSelect, src });
  useEffect(() => {
    latest.current = { draftPatch, selectedId, onSelect, src };
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

  // Handshake + selection messages coming back from the preview iframe
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.source !== iframeRef.current?.contentWindow) return;
      const data = e.data as { type?: string; id?: string };
      if (data?.type === "otama-preview-ready") {
        setReadySrc(latest.current.src);
        postTo(iframeRef.current, {
          type: "otama-preview-update",
          settings: latest.current.draftPatch,
          selectedId: latest.current.selectedId,
        });
      } else if (data?.type === "otama-preview-select" && data.id) {
        latest.current.onSelect(data.id);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Push every draft change instantly
  useEffect(() => {
    postTo(iframeRef.current, {
      type: "otama-preview-update",
      settings: draftPatch,
      selectedId,
    });
  }, [draftPatch, selectedId]);

  // Scroll preview to a section when it is chosen from the admin list
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
          title="Xem trước trang chủ (bản nháp)"
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
