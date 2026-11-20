"use client";

import { useId } from "react";
import type { PreviewDevice } from "./LivePreviewFrame";
import { ColorField } from "./StyleControls";
import type {
  BlockLayoutStyle,
  HomepageBlockKind,
  PointPercent,
  PromoStripTheme,
  StripLayoutOption,
  TextAlignOption,
} from "@/lib/store-types";

interface PositionControlsProps {
  kind: HomepageBlockKind;
  layout?: BlockLayoutStyle;
  theme?: PromoStripTheme;
  device: PreviewDevice;
  onDeviceSwitch?: (dev: PreviewDevice) => void;
  onChangeLayout: (next: BlockLayoutStyle | undefined) => void;
  onChangeTheme?: (theme: PromoStripTheme) => void;
}

const NINE_PRESETS: readonly {
  label: string;
  short: string;
  pt: PointPercent;
  align: TextAlignOption;
}[] = [
  { label: "Trên — Trái", short: "↖", pt: { x: 8, y: 14 }, align: "left" },
  { label: "Trên — Giữa", short: "↑", pt: { x: 50, y: 14 }, align: "center" },
  { label: "Trên — Phải", short: "↗", pt: { x: 92, y: 14 }, align: "right" },
  { label: "Giữa — Trái", short: "←", pt: { x: 8, y: 50 }, align: "left" },
  { label: "Chính giữa", short: "•", pt: { x: 50, y: 50 }, align: "center" },
  { label: "Giữa — Phải", short: "→", pt: { x: 92, y: 50 }, align: "right" },
  { label: "Dưới — Trái", short: "↙", pt: { x: 8, y: 86 }, align: "left" },
  { label: "Dưới — Giữa", short: "↓", pt: { x: 50, y: 86 }, align: "center" },
  { label: "Dưới — Phải", short: "↘", pt: { x: 92, y: 86 }, align: "right" },
];

export function PositionControls({
  kind,
  layout,
  theme,
  device,
  onDeviceSwitch,
  onChangeLayout,
}: PositionControlsProps) {
  const id = useId();
  const current = layout || {};

  const patch = (partial: Partial<BlockLayoutStyle>) => {
    const merged: BlockLayoutStyle = { ...current, ...partial };
    const cleaned = Object.fromEntries(
      Object.entries(merged).filter(([, v]) => v !== undefined)
    ) as BlockLayoutStyle;
    onChangeLayout(Object.keys(cleaned).length > 0 ? cleaned : undefined);
  };

  // ---------------- CAROUSEL / CATEGORIES ----------------
  if (kind === "carousel" || kind === "categories") {
    const align = current.textAlign || "left";
    return (
      <fieldset className="space-y-3 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
        <legend className="px-1 text-[13.5px] font-bold text-[#283455]">
          Vị trí Tiêu đề mục
        </legend>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Căn lề tiêu đề mục">
          {(
            [
              { v: "left", label: "Căn trái (Mặc định)" },
              { v: "center", label: "Căn giữa" },
            ] as const
          ).map((opt) => {
            const active = align === opt.v;
            return (
              <button
                key={opt.v}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  patch({ textAlign: opt.v === "left" ? undefined : "center" })
                }
                className={`min-h-[42px] cursor-pointer rounded-xl border text-[13px] font-bold transition-colors ${
                  active
                    ? "border-[#283455] bg-[#283455] text-white"
                    : "border-[#C9CFD9] bg-white text-[#283455] hover:bg-[#F9F3ED]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  // ---------------- PROMO STRIP ----------------
  if (kind === "strip") {
    const stripLayout: StripLayoutOption = current.stripLayout || "row";
    const defaultStripBg =
      theme === "slate-navy-cta"
        ? "#DDE3EC"
        : theme === "navy-adaptive-cta"
        ? "#283455"
        : "#740103";

    return (
      <div className="space-y-4">
        <fieldset className="space-y-3 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
          <legend className="px-1 text-[13.5px] font-bold text-[#283455]">
            Bố cục Dải băng
          </legend>
          <div className="grid grid-cols-1 gap-2" role="group" aria-label="Bố cục dải băng">
            {(
              [
                {
                  v: "row",
                  label: "Chữ trái — Mô tả giữa — Nút phải (Ngang)",
                },
                {
                  v: "stacked",
                  label: "Căn giữa xếp dọc (Tiêu đề trên, Nút dưới)",
                },
              ] as const
            ).map((opt) => {
              const active = stripLayout === opt.v;
              return (
                <button
                  key={opt.v}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    patch({ stripLayout: opt.v === "row" ? undefined : "stacked" })
                  }
                  className={`min-h-[42px] cursor-pointer rounded-xl border px-3 text-left text-[13px] font-bold transition-colors ${
                    active
                      ? "border-[#283455] bg-[#283455] text-white"
                      : "border-[#C9CFD9] bg-white text-[#283455] hover:bg-[#F9F3ED]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="rounded-xl border border-[#E5E0DB] bg-white p-3.5">
          <ColorField
            label="Màu nền dải băng tùy chỉnh"
            value={current.bgColor}
            defaultDisplayHex={defaultStripBg}
            onChange={(hex) => patch({ bgColor: hex })}
          />
        </div>
      </div>
    );
  }

  // ---------------- HERO & BANNER (Free Drag + 9-Point Grid) ----------------
  const isDesktop = device === "desktop";
  const activePos: PointPercent = isDesktop
    ? current.posDesktop || { x: 50, y: 50 }
    : current.posMobile || { x: 50, y: 50 };

  const setActivePos = (pt: PointPercent | undefined) => {
    if (isDesktop) {
      patch({ posDesktop: pt });
    } else {
      patch({ posMobile: pt });
    }
  };

  const align: TextAlignOption = current.textAlign || "center";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-3.5 py-2.5 text-[12.5px] text-[#1E3A8A]">
        <strong>💡 Kéo thả trực tiếp:</strong> Rê chuột lên khối chữ bên phải rồi cầm nút{" "}
        <span className="inline-block rounded-full bg-[#2563EB] px-2 py-0.5 text-[11px] font-bold text-white">
          ✥ Kéo đổi vị trí chữ
        </span>{" "}
        để đặt chữ đến đúng khoảng trống đẹp của video/ảnh.
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
        <legend className="px-1 text-[13.5px] font-bold text-[#283455]">
          Vị trí khối chữ ({isDesktop ? "🖥 Máy tính" : "📱 Điện thoại"})
        </legend>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {onDeviceSwitch && (
            <button
              type="button"
              onClick={() => onDeviceSwitch(isDesktop ? "mobile" : "desktop")}
              className="cursor-pointer text-[12px] font-bold text-[#2563EB] hover:underline"
            >
              Chuyển sang chỉnh {isDesktop ? "📱 Điện thoại" : "🖥 Máy tính"} →
            </button>
          )}

          {isDesktop && current.posDesktop && (
            <button
              type="button"
              onClick={() => patch({ posMobile: { ...current.posDesktop! } })}
              className="cursor-pointer rounded-lg border border-[#C9CFD9] px-2.5 py-1 text-[11.5px] font-bold text-[#283455] hover:bg-[#F9F3ED]"
            >
              Sao chép sang Điện thoại
            </button>
          )}
        </div>

        {/* 9-point quick position preset grid (single-pointer alternative per drag guide) */}
        <div>
          <p className="mb-1.5 text-[12.5px] font-bold text-[#5B647A]">
            Chọn nhanh 9 góc khung hình:
          </p>
          <div
            role="group"
            aria-label="Lưới 9 vị trí nhanh cho khối chữ"
            className="grid grid-cols-3 gap-1.5 rounded-xl bg-[#F3EDE7] p-2"
          >
            {NINE_PRESETS.map((preset) => {
              const active =
                Math.abs(activePos.x - preset.pt.x) <= 4 &&
                Math.abs(activePos.y - preset.pt.y) <= 4;
              return (
                <button
                  key={preset.label}
                  type="button"
                  title={preset.label}
                  aria-label={preset.label}
                  aria-pressed={active}
                  onClick={() => {
                    if (isDesktop) {
                      patch({ posDesktop: preset.pt, textAlign: preset.align });
                    } else {
                      patch({ posMobile: preset.pt });
                    }
                  }}
                  className={`flex min-h-[40px] cursor-pointer items-center justify-center gap-1 rounded-lg border text-[12px] font-bold transition-colors ${
                    active
                      ? "border-[#283455] bg-[#283455] text-white shadow-xs"
                      : "border-[#DDD6CE] bg-white text-[#283455] hover:bg-[#FDFAF8]"
                  }`}
                >
                  <span aria-hidden="true">{preset.short}</span>
                  <span className="text-[11px]">{preset.label.split(" — ")[1] || "Giữa"}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fine X / Y percentage sliders */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${id}-px`} className="block text-[12px] font-bold text-[#283455]">
              Trái ↔ Phải: {Math.round(activePos.x)}%
            </label>
            <input
              id={`${id}-px`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={activePos.x}
              onChange={(e) =>
                setActivePos({ x: Number(e.target.value), y: activePos.y })
              }
              className="mt-1 w-full cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor={`${id}-py`} className="block text-[12px] font-bold text-[#283455]">
              Trên ↕ Dưới: {Math.round(activePos.y)}%
            </label>
            <input
              id={`${id}-py`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={activePos.y}
              onChange={(e) =>
                setActivePos({ x: activePos.x, y: Number(e.target.value) })
              }
              className="mt-1 w-full cursor-pointer"
            />
          </div>
        </div>

        {/* Text alignment */}
        <div>
          <p className="text-[12.5px] font-bold text-[#283455]">Căn lề chữ &amp; nút</p>
          <div className="mt-1.5 grid grid-cols-3 gap-1.5" role="group" aria-label="Căn lề chữ">
            {(
              [
                { v: "left", label: "Căn trái" },
                { v: "center", label: "Căn giữa" },
                { v: "right", label: "Căn phải" },
              ] as const
            ).map((opt) => {
              const active = align === opt.v;
              return (
                <button
                  key={opt.v}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    patch({ textAlign: opt.v === "center" ? undefined : opt.v })
                  }
                  className={`min-h-[38px] cursor-pointer rounded-lg border text-[12.5px] font-bold transition-colors ${
                    active
                      ? "border-[#283455] bg-[#283455] text-white"
                      : "border-[#C9CFD9] bg-white text-[#283455] hover:bg-[#F9F3ED]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Max width */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={`${id}-mw`} className="text-[12.5px] font-bold text-[#283455]">
              Độ rộng tối đa khối chữ ({current.maxWidth ?? 760}px)
            </label>
            {current.maxWidth !== undefined && (
              <button
                type="button"
                onClick={() => patch({ maxWidth: undefined })}
                className="cursor-pointer text-[11.5px] font-bold text-[#5B647A] underline"
              >
                Mặc định
              </button>
            )}
          </div>
          <input
            id={`${id}-mw`}
            type="range"
            min={280}
            max={1050}
            step={10}
            value={current.maxWidth ?? 760}
            onChange={(e) => patch({ maxWidth: Number(e.target.value) })}
            className="mt-1 w-full cursor-pointer"
          />
        </div>

        {/* Backdrop scrim opacity */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={`${id}-scrim`} className="text-[12.5px] font-bold text-[#283455]">
              Độ tối lớp phủ nền ({current.scrimOpacity ?? 25}%)
            </label>
            {current.scrimOpacity !== undefined && (
              <button
                type="button"
                onClick={() => patch({ scrimOpacity: undefined })}
                className="cursor-pointer text-[11.5px] font-bold text-[#5B647A] underline"
              >
                Mặc định
              </button>
            )}
          </div>
          <input
            id={`${id}-scrim`}
            type="range"
            min={0}
            max={70}
            step={5}
            value={current.scrimOpacity ?? 25}
            onChange={(e) => patch({ scrimOpacity: Number(e.target.value) })}
            className="mt-1 w-full cursor-pointer"
          />
          <p className="mt-0.5 text-[11.5px] text-[#5B647A]">
            Tăng độ tối giúp chữ trắng nổi bật rõ ràng trên video hoặc ảnh sáng.
          </p>
        </div>

        {(current.posDesktop || current.posMobile || current.textAlign || current.maxWidth || current.scrimOpacity !== undefined) && (
          <button
            type="button"
            onClick={() => onChangeLayout(undefined)}
            className="min-h-[38px] w-full cursor-pointer rounded-xl border border-[#C9CFD9] bg-[#FDFAF8] text-[12.5px] font-bold text-[#283455] hover:bg-[#EFEAE4]"
          >
            ↺ Đặt lại vị trí mặc định (Chính giữa)
          </button>
        )}
      </fieldset>
    </div>
  );
}
