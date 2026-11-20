"use client";

import { useId } from "react";
import type { PreviewDevice } from "./LivePreviewFrame";
import { ColorField } from "./StyleControls";
import { FONT_OPTIONS } from "@/lib/fonts";
import type {
  ButtonElementStyle,
  ButtonRadiusOption,
  ButtonVariantOption,
  FontFamilyId,
} from "@/lib/store-types";

interface ButtonStyleControlsProps {
  heading?: string;
  style?: ButtonElementStyle;
  device: PreviewDevice;
  defaultBgHex?: string;
  defaultTextHex?: string;
  onChange: (next: ButtonElementStyle | undefined) => void;
}

export function ButtonStyleControls({
  heading = "Kiểu dáng Nút bấm",
  style,
  device,
  defaultBgHex = "#283455",
  defaultTextHex = "#FFFFFF",
  onChange,
}: ButtonStyleControlsProps) {
  const id = useId();
  const current = style || {};

  const patch = (partial: Partial<ButtonElementStyle>) => {
    const merged: ButtonElementStyle = { ...current, ...partial };
    const cleaned = Object.fromEntries(
      Object.entries(merged).filter(([, v]) => v !== undefined)
    ) as ButtonElementStyle;
    onChange(Object.keys(cleaned).length > 0 ? cleaned : undefined);
  };

  const variant: ButtonVariantOption = current.variant || "solid";
  const effectiveBg =
    variant === "outline"
      ? current.bgColor || "#262321"
      : current.bgColor || defaultBgHex;

  const isDesktop = device === "desktop";
  const activeSize = isDesktop
    ? current.fontSizeDesktop ?? 14
    : current.fontSizeMobile ?? 14;

  const radii: { value: ButtonRadiusOption | "default"; label: string }[] = [
    { value: "sharp", label: "Vuông" },
    { value: "rounded", label: "Bo nhẹ" },
    { value: "default", label: "Chuẩn" },
    { value: "pill", label: "Tròn hẳn" },
  ];

  return (
    <fieldset className="space-y-3.5 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
      <legend className="px-1 text-[13.5px] font-bold text-[#283455]">
        {heading}
      </legend>

      {/* Solid vs Outline */}
      <div>
        <p className="text-[13px] font-bold text-[#283455]">Kiểu nút</p>
        <div className="mt-1.5 grid grid-cols-2 gap-2" role="group" aria-label="Kiểu nút">
          {(
            [
              { v: "solid", label: "Nền đặc" },
              { v: "outline", label: "Viền rỗng" },
            ] as const
          ).map((opt) => {
            const active = variant === opt.v;
            return (
              <button
                key={opt.v}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  if (opt.v === "outline") {
                    patch({
                      variant: "outline",
                      borderColor: current.borderColor || current.textColor || "#FFFFFF",
                    });
                  } else {
                    patch({ variant: undefined });
                  }
                }}
                className={`min-h-[40px] cursor-pointer rounded-xl border text-[13px] font-bold transition-colors ${
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

      {variant === "solid" && (
        <ColorField
          label="Màu nền nút"
          value={current.bgColor}
          defaultDisplayHex={defaultBgHex}
          onChange={(hex) => patch({ bgColor: hex })}
        />
      )}

      <ColorField
        label="Màu chữ trên nút"
        value={current.textColor}
        defaultDisplayHex={defaultTextHex}
        contrastAgainstHex={effectiveBg}
        minContrast={3}
        contrastHintVi="Màu chữ trên nút hơi giống màu nền nút — khách có thể khó nhìn thấy chữ."
        onChange={(hex) => patch({ textColor: hex })}
      />

      <ColorField
        label={variant === "outline" ? "Màu đường viền nút" : "Màu viền nút (tùy chọn)"}
        value={current.borderColor}
        defaultDisplayHex={variant === "outline" ? "#FFFFFF" : defaultBgHex}
        onChange={(hex) => patch({ borderColor: hex })}
      />

      <ColorField
        label="Màu nền khi rê chuột (bỏ trống = tự tính đậm hơn)"
        value={current.hoverBgColor}
        defaultDisplayHex="#1D2742"
        onChange={(hex) => patch({ hoverBgColor: hex })}
      />

      {/* Corner radius */}
      <div>
        <p className="text-[13px] font-bold text-[#283455]">Độ bo góc</p>
        <div className="mt-1.5 grid grid-cols-4 gap-1.5" role="group" aria-label="Độ bo góc nút">
          {radii.map((r) => {
            const active = (current.borderRadius || "default") === r.value;
            return (
              <button
                key={r.value}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  patch({
                    borderRadius: r.value === "default" ? undefined : r.value,
                  })
                }
                className={`min-h-[38px] cursor-pointer rounded-lg border text-[12px] font-bold transition-colors ${
                  active
                    ? "border-[#283455] bg-[#283455] text-white"
                    : "border-[#C9CFD9] bg-white text-[#283455] hover:bg-[#F9F3ED]"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font family + size */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-bfont`} className="block text-[12.5px] font-bold text-[#283455]">
            Font trên nút
          </label>
          <select
            id={`${id}-bfont`}
            value={current.fontFamily || "default"}
            onChange={(e) => {
              const val = e.target.value as FontFamilyId;
              patch({ fontFamily: val === "default" ? undefined : val });
            }}
            className="admin-input mt-1 w-full rounded-xl border border-[#8E96A8] px-2.5 text-[13px]"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${id}-bsize`} className="block text-[12.5px] font-bold text-[#283455]">
            Cỡ chữ ({isDesktop ? "Máy tính" : "ĐT"})
          </label>
          <div className="mt-1 flex items-center gap-1.5">
            <input
              id={`${id}-bsize`}
              type="number"
              min={11}
              max={24}
              value={activeSize}
              onChange={(e) => {
                const n = Math.min(24, Math.max(11, Math.round(Number(e.target.value) || 14)));
                if (isDesktop) patch({ fontSizeDesktop: n });
                else patch({ fontSizeMobile: n });
              }}
              className="admin-input w-full rounded-xl border border-[#8E96A8] px-3 text-[13.5px] font-bold"
            />
            <span className="text-[12px] text-[#5B647A]">px</span>
          </div>
        </div>
      </div>
    </fieldset>
  );
}
