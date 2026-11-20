"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useStoreData } from "./StoreDataContext";
import {
  alignToFlexItems,
  describePositionVi,
} from "@/lib/section-style-helpers";
import type { BlockLayoutStyle, PointPercent } from "@/lib/store-types";

interface PositionedOverlayBoxProps {
  sectionId?: string;
  sectionLabel?: string;
  layout?: BlockLayoutStyle;
  defaultMaxWidthPx?: number;
  children: ReactNode;
}

const DEFAULT_POINT: PointPercent = { x: 50, y: 50 };
const SNAP_THRESHOLD = 3;

function clampPct(v: number): number {
  return Math.round(Math.min(100, Math.max(0, v)) * 10) / 10;
}

export function PositionedOverlayBox({
  sectionId,
  sectionLabel,
  layout,
  defaultMaxWidthPx = 760,
  children,
}: PositionedOverlayBoxProps) {
  const {
    previewMode,
    previewSelectedId,
    selectPreviewSection,
    updatePreviewPosition,
  } = useStoreData();

  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);

  const [dragState, setDragState] = useState<{
    viewport: "desktop" | "mobile";
    pos: PointPercent;
    active: boolean;
  } | null>(null);
  const [showKeyHelp, setShowKeyHelp] = useState(false);
  const [liveMsg, setLiveMsg] = useState("");

  const gestureRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    offsetX: number;
    offsetY: number;
    containerW: number;
    containerH: number;
    boxW: number;
    boxH: number;
    viewport: "desktop" | "mobile";
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    if (!liveMsg) return;
    const t = setTimeout(() => setLiveMsg(""), 1400);
    return () => clearTimeout(t);
  }, [liveMsg]);

  const hasCustomLayout = Boolean(
    layout?.posDesktop ||
      layout?.posMobile ||
      layout?.textAlign ||
      layout?.maxWidth
  );

  // Untouched live storefront fast-path: zero layout shift from original markup
  if (!hasCustomLayout && !previewMode) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        {children}
      </div>
    );
  }

  const savedDesktop = layout?.posDesktop || DEFAULT_POINT;
  const savedMobile = layout?.posMobile || DEFAULT_POINT;

  const effDesktop =
    dragState?.active && dragState.viewport === "desktop"
      ? dragState.pos
      : savedDesktop;
  const effMobile =
    dragState?.active && dragState.viewport === "mobile"
      ? dragState.pos
      : savedMobile;

  const activeDragPos = dragState?.active ? dragState.pos : null;
  const isSelected = Boolean(sectionId && previewSelectedId === sectionId);

  // Place handle below text block when dragged near the top edge so it never clips
  const currentActiveY =
    typeof window !== "undefined" && window.innerWidth < 1024
      ? effMobile.y
      : effDesktop.y;
  const placeHandleBelow = currentActiveY < 22;

  const boxVars: CSSProperties & Record<string, string | number | undefined> = {
    "--ot-pos-d-x": `${effDesktop.x}%`,
    "--ot-pos-d-y": `${effDesktop.y}%`,
    "--ot-pos-m-x": `${effMobile.x}%`,
    "--ot-pos-m-y": `${effMobile.y}%`,
    "--ot-max-w": `${layout?.maxWidth ?? defaultMaxWidthPx}px`,
  };

  const commitPosition = (
    viewport: "desktop" | "mobile",
    pt: PointPercent,
    announce: boolean
  ) => {
    if (!sectionId) return;
    updatePreviewPosition(sectionId, viewport, pt.x, pt.y);
    if (announce) {
      setLiveMsg(describePositionVi(pt));
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (!previewMode || !sectionId || e.button !== 0) return;
    const container = containerRef.current;
    const box = boxRef.current;
    const handle = handleRef.current;
    if (!container || !box || !handle) return;

    e.stopPropagation();
    selectPreviewSection(sectionId);

    const cRect = container.getBoundingClientRect();
    const bRect = box.getBoundingClientRect();
    const viewport: "desktop" | "mobile" =
      window.innerWidth >= 1024 ? "desktop" : "mobile";

    gestureRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      offsetX: e.clientX - bRect.left,
      offsetY: e.clientY - bRect.top,
      containerW: cRect.width,
      containerH: cRect.height,
      boxW: bRect.width,
      boxH: bRect.height,
      viewport,
      moved: false,
    };

    handle.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const g = gestureRef.current;
    const handle = handleRef.current;
    const container = containerRef.current;
    if (!g || !handle || !container || !handle.hasPointerCapture(e.pointerId)) {
      return;
    }

    const dx = e.clientX - g.startClientX;
    const dy = e.clientY - g.startClientY;
    if (!g.moved && Math.hypot(dx, dy) < 4) return;
    g.moved = true;

    const cRect = container.getBoundingClientRect();
    const maxLeft = Math.max(0, cRect.width - g.boxW);
    const maxTop = Math.max(0, cRect.height - g.boxH);

    const clampedLeft = Math.max(
      0,
      Math.min(maxLeft, e.clientX - cRect.left - g.offsetX)
    );
    const clampedTop = Math.max(
      0,
      Math.min(maxTop, e.clientY - cRect.top - g.offsetY)
    );

    let xPct = maxLeft > 1 ? (clampedLeft / maxLeft) * 100 : 50;
    let yPct = maxTop > 1 ? (clampedTop / maxTop) * 100 : 50;

    if (!e.altKey) {
      if (Math.abs(xPct - 50) <= SNAP_THRESHOLD) xPct = 50;
      if (Math.abs(yPct - 50) <= SNAP_THRESHOLD) yPct = 50;
    }

    const nextPt: PointPercent = {
      x: clampPct(xPct),
      y: clampPct(yPct),
    };

    setDragState({ viewport: g.viewport, pos: nextPt, active: true });
    commitPosition(g.viewport, nextPt, false);
  };

  const finishPointerGesture = () => {
    const g = gestureRef.current;
    gestureRef.current = null;
    setDragState((prev) => {
      if (prev?.active && g?.moved) {
        setLiveMsg(describePositionVi(prev.pos));
      }
      return null;
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!previewMode || !sectionId) return;
    const step = e.shiftKey ? 5 : 2;
    let dx = 0;
    let dy = 0;
    if (e.key === "ArrowLeft") dx = -step;
    else if (e.key === "ArrowRight") dx = step;
    else if (e.key === "ArrowUp") dy = -step;
    else if (e.key === "ArrowDown") dy = step;
    else return;

    e.preventDefault();
    e.stopPropagation();

    const viewport: "desktop" | "mobile" =
      window.innerWidth >= 1024 ? "desktop" : "mobile";
    const base = viewport === "desktop" ? savedDesktop : savedMobile;
    const nextPt: PointPercent = {
      x: clampPct(base.x + dx),
      y: clampPct(base.y + dy),
    };
    commitPosition(viewport, nextPt, true);
  };

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      {/* Center alignment snap guides shown during active drag */}
      {previewMode && activeDragPos && (
        <>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-1/2 z-30 -translate-x-1/2 transition-opacity ${
              Math.abs(activeDragPos.x - 50) < 0.2
                ? "w-[2px] bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]"
                : "w-px border-l border-dashed border-white/45"
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-1/2 z-30 -translate-y-1/2 transition-opacity ${
              Math.abs(activeDragPos.y - 50) < 0.2
                ? "h-[2px] bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]"
                : "h-px border-t border-dashed border-white/45"
            }`}
          />
        </>
      )}

      <div
        ref={boxRef}
        style={boxVars}
        className={`group/pos pointer-events-auto otama-pos-box flex flex-col px-6 py-4 text-white ${alignToFlexItems(
          layout?.textAlign
        )} ${
          previewMode && (isSelected || activeDragPos)
            ? "rounded-2xl outline-1 outline-dashed outline-white/65"
            : ""
        }`}
      >
        {previewMode && sectionId && (
          <div
            data-preview-interactive="true"
            className={`absolute z-50 flex items-center gap-1 transition-opacity ${
              placeHandleBelow ? "top-full mt-1" : "bottom-full mb-1"
            } ${
              isSelected || activeDragPos
                ? "opacity-100"
                : "opacity-0 group-hover/pos:opacity-100 focus-within:opacity-100"
            }`}
          >
            <button
              ref={handleRef}
              type="button"
              aria-label={`Tay cầm di chuyển khối chữ ${
                sectionLabel || ""
              }. Kéo chuột hoặc dùng các phím mũi tên để dịch chuyển.`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onLostPointerCapture={finishPointerGesture}
              onKeyDown={handleKeyDown}
              className={`otama-drag-handle inline-flex min-h-[30px] items-center gap-1.5 rounded-full bg-[#2563EB] px-3 py-1 text-[12px] font-bold text-white shadow-lg hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                activeDragPos ? "dragging ring-2 ring-white" : ""
              }`}
            >
              <span aria-hidden="true">✥</span>
              <span>
                {activeDragPos
                  ? `${Math.round(activeDragPos.x)}% · ${Math.round(activeDragPos.y)}%`
                  : "Kéo đổi vị trí chữ"}
              </span>
            </button>

            <button
              type="button"
              aria-label="Hướng dẫn phím tắt di chuyển khối chữ"
              aria-expanded={showKeyHelp}
              onClick={() => setShowKeyHelp((v) => !v)}
              className="inline-flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full bg-[#1E293B]/90 text-[12px] font-bold text-white shadow hover:bg-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ?
            </button>

            {showKeyHelp && (
              <span
                role="note"
                className="rounded-lg bg-[#0F172A]/95 px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap text-white shadow-lg"
              >
                Phím ← ↑ → ↓ dịch 2% · Giữ Shift dịch 5%
              </span>
            )}
          </div>
        )}

        {children}

        {previewMode && (
          <div className="visually-hidden" aria-live="polite">
            {liveMsg}
          </div>
        )}
      </div>
    </div>
  );
}
