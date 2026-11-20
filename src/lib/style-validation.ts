import { ALLOWED_FONT_IDS } from "./fonts";
import type {
  BlockLayoutStyle,
  ButtonElementStyle,
  ButtonRadiusOption,
  ButtonVariantOption,
  FontFamilyId,
  FontWeightOption,
  HomepageSectionConfig,
  HomepageSectionStyle,
  PointPercent,
  StripLayoutOption,
  TextAlignOption,
  TextElementStyle,
} from "./store-types";

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function sanitizeHexColor(val: unknown): string | undefined {
  if (typeof val !== "string") return undefined;
  const trimmed = val.trim();
  if (!HEX_COLOR_RE.test(trimmed)) return undefined;
  return trimmed.toUpperCase();
}

function clampNum(
  val: unknown,
  min: number,
  max: number,
  decimals = 0
): number | undefined {
  if (val === undefined || val === null || val === "") return undefined;
  const num = Number(val);
  if (!Number.isFinite(num)) return undefined;
  const clamped = Math.min(max, Math.max(min, num));
  if (decimals <= 0) return Math.round(clamped);
  const factor = 10 ** decimals;
  return Math.round(clamped * factor) / factor;
}

function sanitizeFontFamily(val: unknown): FontFamilyId | undefined {
  if (typeof val !== "string") return undefined;
  if (ALLOWED_FONT_IDS.has(val as FontFamilyId)) {
    return val === "default" ? undefined : (val as FontFamilyId);
  }
  return undefined;
}

function sanitizePoint(val: unknown): PointPercent | undefined {
  if (!val || typeof val !== "object") return undefined;
  const raw = val as Record<string, unknown>;
  const x = clampNum(raw.x, 0, 100, 1);
  const y = clampNum(raw.y, 0, 100, 1);
  if (x === undefined || y === undefined) return undefined;
  return { x, y };
}

function sanitizeTextElementStyle(val: unknown): TextElementStyle | undefined {
  if (!val || typeof val !== "object") return undefined;
  const raw = val as Record<string, unknown>;
  const out: TextElementStyle = {};

  const color = sanitizeHexColor(raw.color);
  if (color) out.color = color;

  const fontFamily = sanitizeFontFamily(raw.fontFamily);
  if (fontFamily) out.fontFamily = fontFamily;

  const fontSizeDesktop = clampNum(raw.fontSizeDesktop, 10, 120, 0);
  if (fontSizeDesktop !== undefined) out.fontSizeDesktop = fontSizeDesktop;

  const fontSizeMobile = clampNum(raw.fontSizeMobile, 10, 80, 0);
  if (fontSizeMobile !== undefined) out.fontSizeMobile = fontSizeMobile;

  if (raw.fontWeight === 400 || raw.fontWeight === 500 || raw.fontWeight === 700) {
    out.fontWeight = raw.fontWeight as FontWeightOption;
  }

  if (typeof raw.italic === "boolean") out.italic = raw.italic;
  if (typeof raw.uppercase === "boolean") out.uppercase = raw.uppercase;

  const letterSpacing = clampNum(raw.letterSpacing, -0.05, 0.3, 3);
  if (letterSpacing !== undefined) out.letterSpacing = letterSpacing;

  if (typeof raw.textShadow === "boolean") out.textShadow = raw.textShadow;

  return Object.keys(out).length > 0 ? out : undefined;
}

function sanitizeButtonElementStyle(val: unknown): ButtonElementStyle | undefined {
  if (!val || typeof val !== "object") return undefined;
  const raw = val as Record<string, unknown>;
  const out: ButtonElementStyle = {};

  if (raw.variant === "solid" || raw.variant === "outline") {
    out.variant = raw.variant as ButtonVariantOption;
  }

  const bgColor = sanitizeHexColor(raw.bgColor);
  if (bgColor) out.bgColor = bgColor;

  const textColor = sanitizeHexColor(raw.textColor);
  if (textColor) out.textColor = textColor;

  const borderColor = sanitizeHexColor(raw.borderColor);
  if (borderColor) out.borderColor = borderColor;

  const hoverBgColor = sanitizeHexColor(raw.hoverBgColor);
  if (hoverBgColor) out.hoverBgColor = hoverBgColor;

  if (
    raw.borderRadius === "sharp" ||
    raw.borderRadius === "rounded" ||
    raw.borderRadius === "pill"
  ) {
    out.borderRadius = raw.borderRadius as ButtonRadiusOption;
  }

  const fontFamily = sanitizeFontFamily(raw.fontFamily);
  if (fontFamily) out.fontFamily = fontFamily;

  const fontSizeDesktop = clampNum(raw.fontSizeDesktop, 11, 28, 0);
  if (fontSizeDesktop !== undefined) out.fontSizeDesktop = fontSizeDesktop;

  const fontSizeMobile = clampNum(raw.fontSizeMobile, 11, 24, 0);
  if (fontSizeMobile !== undefined) out.fontSizeMobile = fontSizeMobile;

  return Object.keys(out).length > 0 ? out : undefined;
}

function sanitizeBlockLayoutStyle(val: unknown): BlockLayoutStyle | undefined {
  if (!val || typeof val !== "object") return undefined;
  const raw = val as Record<string, unknown>;
  const out: BlockLayoutStyle = {};

  const posDesktop = sanitizePoint(raw.posDesktop);
  if (posDesktop) out.posDesktop = posDesktop;

  const posMobile = sanitizePoint(raw.posMobile);
  if (posMobile) out.posMobile = posMobile;

  if (
    raw.textAlign === "left" ||
    raw.textAlign === "center" ||
    raw.textAlign === "right"
  ) {
    out.textAlign = raw.textAlign as TextAlignOption;
  }

  const maxWidth = clampNum(raw.maxWidth, 260, 1100, 0);
  if (maxWidth !== undefined) out.maxWidth = maxWidth;

  const scrimOpacity = clampNum(raw.scrimOpacity, 0, 70, 0);
  if (scrimOpacity !== undefined) out.scrimOpacity = scrimOpacity;

  if (raw.stripLayout === "row" || raw.stripLayout === "stacked") {
    out.stripLayout = raw.stripLayout as StripLayoutOption;
  }

  const bgColor = sanitizeHexColor(raw.bgColor);
  if (bgColor) out.bgColor = bgColor;

  return Object.keys(out).length > 0 ? out : undefined;
}

export function sanitizeSectionStyle(val: unknown): HomepageSectionStyle | undefined {
  if (!val || typeof val !== "object") return undefined;
  const raw = val as Record<string, unknown>;
  const out: HomepageSectionStyle = {};

  const title = sanitizeTextElementStyle(raw.title);
  if (title) out.title = title;

  const subtitle = sanitizeTextElementStyle(raw.subtitle);
  if (subtitle) out.subtitle = subtitle;

  const button = sanitizeButtonElementStyle(raw.button);
  if (button) out.button = button;

  const secondaryButton = sanitizeButtonElementStyle(raw.secondaryButton);
  if (secondaryButton) out.secondaryButton = secondaryButton;

  const layout = sanitizeBlockLayoutStyle(raw.layout);
  if (layout) out.layout = layout;

  return Object.keys(out).length > 0 ? out : undefined;
}

export function sanitizeHomepageSections(
  sections: HomepageSectionConfig[]
): HomepageSectionConfig[] {
  return sections.map((sec) => {
    const cleanStyle = sanitizeSectionStyle(sec.style);
    const copy: HomepageSectionConfig = { ...sec };
    if (cleanStyle) {
      copy.style = cleanStyle;
    } else {
      delete copy.style;
    }
    return copy;
  });
}

// ============================================================================
// WCAG 2.1 Relative Luminance & Contrast Helpers (modern-web-guidance: color)
// ============================================================================

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = sanitizeHexColor(hex);
  if (!clean) return null;
  const r = parseInt(clean.slice(1, 3), 16);
  const g = parseInt(clean.slice(3, 5), 16);
  const b = parseInt(clean.slice(5, 7), 16);
  return [r, g, b];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function getContrastRatio(fgHex: string, bgHex: string): number | null {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  if (!fg || !bg) return null;
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

export function darkenHex(hex: string, ratio = 0.14): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#1D2742";
  const factor = Math.max(0, Math.min(1, 1 - ratio));
  const toHex = (n: number) =>
    Math.round(n * factor)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`.toUpperCase();
}
