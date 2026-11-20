"use client";

import { useId, useState } from "react";
import type { PreviewDevice } from "./LivePreviewFrame";
import { BRAND_COLOR_SWATCHES, FONT_OPTIONS, resolveFontStack } from "@/lib/fonts";
import { getContrastRatio, sanitizeHexColor } from "@/lib/style-validation";
import type {
  FontFamilyId,
  FontWeightOption,
  TextElementStyle,
} from "@/lib/store-types";

interface ColorFieldProps {
  label: string;
  value?: string;
  defaultDisplayHex: string;
  contrastAgainstHex?: string;
  minContrast?: number;
  contrastHintVi?: string;
  onChange: (nextHex: string | undefined) => void;
}

export function ColorField({
  label,
  value,
  defaultDisplayHex,
  contrastAgainstHex,
  minContrast = 3,
  contrastHintVi,
  onChange,
}: ColorFieldProps) {
  const id = useId();
  const [prevPropValue, setPrevPropValue] = useState(value);
  const [hexDraft, setHexDraft] = useState(value ?? "");
  if (value !== prevPropValue) {
    setPrevPropValue(value);
    setHexDraft(value ?? "");
  }

  const activeHex = (value || defaultDisplayHex).toUpperCase();
  const ratio =
    contrastAgainstHex && sanitizeHexColor(activeHex)
      ? getContrastRatio(activeHex, contrastAgainstHex)
      : null;
  const lowContrast = ratio !== null && ratio < minContrast;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={`${id}-hex`} className="text-[13px] font-bold text-[#283455]">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="cursor-pointer text-[11.5px] font-bold text-[#5B647A] underline hover:text-[#283455]"
          >
            Dùng mặc định
          </button>
        )}
      </div>

      {/* Quick brand color swatches */}
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={`Bảng màu nhanh: ${label}`}>
        {BRAND_COLOR_SWATCHES.map((sw) => {
          const isCurrent = activeHex === sw.hex.toUpperCase();
          const isLight =
            sw.hex === "#FFFFFF" || sw.hex === "#FDFAF8" || sw.hex === "#F9F3ED";
          return (
            <button
              key={sw.hex}
              type="button"
              title={`${sw.label} (${sw.hex})`}
              aria-label={`${sw.label} (${sw.hex})`}
              aria-pressed={isCurrent}
              onClick={() => onChange(sw.hex)}
              style={{ backgroundColor: sw.hex }}
              className={`otama-color-swatch inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border text-[12px] font-bold transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#283455] ${
                isCurrent
                  ? "border-[#283455] ring-2 ring-[#283455] ring-offset-1"
                  : "border-[#9AA3B5]"
              } ${isLight ? "text-[#283455]" : "text-white"}`}
            >
              {isCurrent ? "✓" : ""}
            </button>
          );
        })}
      </div>

      {/* Native color input + Hex code input */}
      <div className="flex items-center gap-2">
        <label
          htmlFor={`${id}-picker`}
          className="otama-color-swatch relative inline-flex h-10 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[#8E96A8] shadow-xs"
          style={{ backgroundColor: sanitizeHexColor(activeHex) || defaultDisplayHex }}
          title="Mở bảng chọn màu tự do"
        >
          <span className="visually-hidden">Bảng chọn màu {label}</span>
          <input
            id={`${id}-picker`}
            type="color"
            value={sanitizeHexColor(activeHex) || defaultDisplayHex}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>

        <input
          id={`${id}-hex`}
          type="text"
          spellCheck={false}
          maxLength={7}
          value={hexDraft}
          placeholder={`Mặc định (${defaultDisplayHex})`}
          onChange={(e) => {
            const raw = e.target.value;
            setHexDraft(raw);
            const trimmed = raw.trim();
            if (!trimmed) {
              onChange(undefined);
              return;
            }
            const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
            if (/^#[0-9a-fA-F]{6}$/.test(withHash)) {
              onChange(withHash.toUpperCase());
            }
          }}
          onBlur={() => setHexDraft(value ?? "")}
          className="h-10 min-w-0 flex-1 rounded-xl border border-[#8E96A8] bg-white px-3 font-mono text-[13px] text-[#283455]"
        />
      </div>

      {/* WCAG contrast warning with icon + text (never color alone) */}
      {lowContrast && (
        <p
          role="status"
          className="rounded-lg border border-[#F59E0B]/50 bg-[#FEF3C7] px-2.5 py-1.5 text-[12px] text-[#92400E]"
        >
          <span aria-hidden="true">⚠️ </span>
          <strong>Độ tương phản thấp ({ratio}:1):</strong>{" "}
          {contrastHintVi ||
            "Màu chữ hơi tiệp vào nền, khách có thể khó đọc. Hãy chọn màu sáng/đậm hơn hoặc bật Đổ bóng chữ."}
        </p>
      )}
    </div>
  );
}

interface TextStyleControlsProps {
  heading: string;
  style?: TextElementStyle;
  device: PreviewDevice;
  onDeviceSwitch?: (dev: PreviewDevice) => void;
  defaultColorHex: string;
  contrastAgainstHex?: string;
  minContrast?: number;
  defaultDesktopSize: number;
  defaultMobileSize: number;
  maxDesktopSize?: number;
  showShadowToggle?: boolean;
  sampleText?: string;
  onChange: (next: TextElementStyle | undefined) => void;
}

export function TextStyleControls({
  heading,
  style,
  device,
  onDeviceSwitch,
  defaultColorHex,
  contrastAgainstHex,
  minContrast = 3,
  defaultDesktopSize,
  defaultMobileSize,
  maxDesktopSize = 84,
  showShadowToggle = true,
  sampleText,
  onChange,
}: TextStyleControlsProps) {
  const id = useId();
  const current = style || {};

  const patch = (partial: Partial<TextElementStyle>) => {
    const merged: TextElementStyle = { ...current, ...partial };
    const cleaned = Object.fromEntries(
      Object.entries(merged).filter(([, v]) => v !== undefined)
    ) as TextElementStyle;
    onChange(Object.keys(cleaned).length > 0 ? cleaned : undefined);
  };

  const selectedFontId: FontFamilyId = current.fontFamily || "default";
  const selectedFontMeta =
    FONT_OPTIONS.find((f) => f.id === selectedFontId) || FONT_OPTIONS[0];

  const isDesktop = device === "desktop";
  const activeSize = isDesktop
    ? current.fontSizeDesktop ?? defaultDesktopSize
    : current.fontSizeMobile ?? defaultMobileSize;
  const hasCustomSize = isDesktop
    ? current.fontSizeDesktop !== undefined
    : current.fontSizeMobile !== undefined;
  const maxSize = isDesktop ? maxDesktopSize : Math.min(56, maxDesktopSize);

  const setActiveSize = (val: number | undefined) => {
    if (isDesktop) {
      patch({ fontSizeDesktop: val });
    } else {
      patch({ fontSizeMobile: val });
    }
  };

  const weights: { value: FontWeightOption; label: string }[] = [
    { value: 400, label: "Thường" },
    { value: 500, label: "Vừa" },
    { value: 700, label: "Đậm" },
  ];

  const previewFontStack = resolveFontStack(selectedFontId);

  return (
    <fieldset className="space-y-3.5 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
      <legend className="px-1 text-[13.5px] font-bold text-[#283455]">
        {heading}
      </legend>

      {/* Color */}
      <ColorField
        label="Màu chữ"
        value={current.color}
        defaultDisplayHex={defaultColorHex}
        contrastAgainstHex={contrastAgainstHex}
        minContrast={minContrast}
        onChange={(hex) => patch({ color: hex })}
      />

      {/* Font family */}
      <div>
        <label htmlFor={`${id}-font`} className="block text-[13px] font-bold text-[#283455]">
          Font chữ
        </label>
        <select
          id={`${id}-font`}
          value={selectedFontId}
          onChange={(e) => {
            const val = e.target.value as FontFamilyId;
            patch({ fontFamily: val === "default" ? undefined : val });
          }}
          style={previewFontStack ? { fontFamily: previewFontStack } : undefined}
          className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3 text-[14px]"
        >
          {FONT_OPTIONS.map((f) => (
            <option
              key={f.id}
              value={f.id}
              style={f.cssStack ? { fontFamily: f.cssStack } : undefined}
            >
              {f.label}
            </option>
          ))}
        </select>

        {/* Live font preview card */}
        <div className="mt-2 rounded-lg border border-[#ECE7E2] bg-[#FDFAF8] px-3 py-2">
          <p
            className="truncate text-[16px] text-[#283455]"
            style={{
              fontFamily: previewFontStack,
              fontWeight: current.fontWeight,
              fontStyle: current.italic ? "italic" : undefined,
              textTransform: current.uppercase ? "uppercase" : undefined,
              letterSpacing:
                current.letterSpacing !== undefined
                  ? `${current.letterSpacing}em`
                  : undefined,
            }}
          >
            {(sampleText || selectedFontMeta.sampleVi).split("\n")[0]}
          </p>
          <p className="mt-0.5 text-[11.5px] text-[#5B647A]">
            {selectedFontMeta.hintVi}
          </p>
        </div>

        {!selectedFontMeta.vietnameseSupport && (
          <p className="mt-1.5 rounded-lg bg-[#FEF3C7] px-2.5 py-1.5 text-[11.5px] text-[#92400E]">
            <span aria-hidden="true">ℹ️ </span>
            Font gốc tiếng Anh không hỗ trợ dấu tiếng Việt. Chữ có dấu sẽ tự mượn font dự phòng.
          </p>
        )}
      </div>

      {/* Font size (Desktop / Mobile synced with preview switch) */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-1">
          <label htmlFor={`${id}-size`} className="text-[13px] font-bold text-[#283455]">
            Cỡ chữ ({isDesktop ? "🖥 Máy tính" : "📱 Điện thoại"})
          </label>
          <div className="flex items-center gap-2">
            {onDeviceSwitch && (
              <button
                type="button"
                onClick={() => onDeviceSwitch(isDesktop ? "mobile" : "desktop")}
                className="cursor-pointer text-[11.5px] font-bold text-[#2563EB] hover:underline"
              >
                Đổi sang {isDesktop ? "Điện thoại" : "Máy tính"}
              </button>
            )}
            {hasCustomSize && (
              <button
                type="button"
                onClick={() => setActiveSize(undefined)}
                className="cursor-pointer text-[11.5px] font-bold text-[#5B647A] underline"
              >
                Mặc định
              </button>
            )}
          </div>
        </div>
        <div className="mt-1.5 flex items-center gap-3">
          <input
            id={`${id}-size`}
            type="range"
            min={12}
            max={maxSize}
            step={1}
            value={activeSize}
            onChange={(e) => setActiveSize(Number(e.target.value))}
            className="min-w-0 flex-1 cursor-pointer"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              aria-label={`Số pixel cỡ chữ (${isDesktop ? "Máy tính" : "Điện thoại"})`}
              min={10}
              max={120}
              value={activeSize}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n) && n >= 10) setActiveSize(Math.min(120, Math.round(n)));
              }}
              className="h-9 w-16 rounded-lg border border-[#8E96A8] bg-white px-2 text-center text-[13px] font-bold"
            />
            <span className="text-[12px] text-[#5B647A]">px</span>
          </div>
        </div>
      </div>

      {/* Font weight + Italic + Uppercase */}
      <div className="space-y-2">
        <p className="text-[13px] font-bold text-[#283455]">Độ đậm &amp; Kiểu chữ</p>
        <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Độ đậm chữ">
          {weights.map((w) => {
            const active = current.fontWeight === w.value;
            return (
              <button
                key={w.value}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  patch({ fontWeight: active ? undefined : w.value })
                }
                className={`min-h-[38px] cursor-pointer rounded-lg border text-[12.5px] font-bold transition-colors ${
                  active
                    ? "border-[#283455] bg-[#283455] text-white"
                    : "border-[#C9CFD9] bg-white text-[#283455] hover:bg-[#F9F3ED]"
                }`}
              >
                {w.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 pt-0.5">
          <button
            type="button"
            aria-pressed={Boolean(current.italic)}
            onClick={() =>
              patch({ italic: current.italic ? undefined : true })
            }
            className={`min-h-[36px] cursor-pointer rounded-lg border px-3 text-[12.5px] italic transition-colors ${
              current.italic
                ? "border-[#283455] bg-[#283455] font-bold text-white"
                : "border-[#C9CFD9] bg-white font-semibold text-[#283455] hover:bg-[#F9F3ED]"
            }`}
          >
            I — Chữ nghiêng
          </button>

          <button
            type="button"
            aria-pressed={Boolean(current.uppercase)}
            onClick={() =>
              patch({
                uppercase:
                  current.uppercase === true
                    ? false
                    : current.uppercase === false
                    ? undefined
                    : true,
              })
            }
            className={`min-h-[36px] cursor-pointer rounded-lg border px-3 text-[12.5px] font-bold transition-colors ${
              current.uppercase === true
                ? "border-[#283455] bg-[#283455] text-white"
                : current.uppercase === false
                ? "border-[#283455] bg-[#F9F3ED] text-[#283455]"
                : "border-[#C9CFD9] bg-white text-[#283455] hover:bg-[#F9F3ED]"
            }`}
          >
            {current.uppercase === false ? "Aa — Thường" : "AA — IN HOA"}
          </button>

          {showShadowToggle && (
            <button
              type="button"
              aria-pressed={current.textShadow ?? true}
              onClick={() =>
                patch({
                  textShadow:
                    current.textShadow === false ? undefined : false,
                })
              }
              className={`min-h-[36px] cursor-pointer rounded-lg border px-3 text-[12.5px] font-bold transition-colors ${
                current.textShadow !== false
                  ? "border-[#283455] bg-[#F9F3ED] text-[#283455]"
                  : "border-[#C9CFD9] bg-white text-[#5B647A]"
              }`}
            >
              {current.textShadow !== false ? "✓ Đổ bóng chữ" : "Tắt đổ bóng"}
            </button>
          )}
        </div>
      </div>

      {/* Letter spacing */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor={`${id}-ls`} className="text-[12.5px] font-bold text-[#283455]">
            Khoảng cách chữ ({((current.letterSpacing ?? 0) * 100).toFixed(0)}%)
          </label>
          {current.letterSpacing !== undefined && (
            <button
              type="button"
              onClick={() => patch({ letterSpacing: undefined })}
              className="cursor-pointer text-[11.5px] font-bold text-[#5B647A] underline"
            >
              Mặc định
            </button>
          )}
        </div>
        <input
          id={`${id}-ls`}
          type="range"
          min={-0.04}
          max={0.22}
          step={0.01}
          value={current.letterSpacing ?? 0}
          onChange={(e) => patch({ letterSpacing: Number(e.target.value) })}
          className="mt-1 w-full cursor-pointer"
        />
      </div>
    </fieldset>
  );
}
