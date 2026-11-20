import type { CSSProperties } from "react";
import { resolveFontStack } from "./fonts";
import { darkenHex } from "./style-validation";
import type {
  ButtonElementStyle,
  PointPercent,
  TextAlignOption,
  TextElementStyle,
} from "./store-types";

export interface ComputedStyleProps {
  className: string;
  style?: CSSProperties;
  dataAttrs?: Record<string, string>;
}

export function buildTextStyleProps(
  textStyle: TextElementStyle | undefined,
  baseClassName: string
): ComputedStyleProps {
  if (!textStyle) {
    return { className: baseClassName };
  }

  const classes = [baseClassName];
  const css: CSSProperties & Record<string, string | number | undefined> = {};

  if (textStyle.color) {
    css.color = textStyle.color;
  }

  const stack = resolveFontStack(textStyle.fontFamily);
  if (stack) {
    css.fontFamily = stack;
  }

  if (textStyle.fontSizeMobile !== undefined) {
    classes.push("otama-fs-m");
    css["--ot-fs-m"] = `${textStyle.fontSizeMobile}px`;
  }

  if (textStyle.fontSizeDesktop !== undefined) {
    classes.push("otama-fs-d");
    css["--ot-fs-d"] = `${textStyle.fontSizeDesktop}px`;
  }

  if (textStyle.fontWeight !== undefined) {
    css.fontWeight = textStyle.fontWeight;
  }

  if (textStyle.italic !== undefined) {
    css.fontStyle = textStyle.italic ? "italic" : "normal";
  }

  if (textStyle.uppercase !== undefined) {
    css.textTransform = textStyle.uppercase ? "uppercase" : "none";
  }

  if (textStyle.letterSpacing !== undefined) {
    css.letterSpacing = `${textStyle.letterSpacing}em`;
  }

  if (textStyle.textShadow !== undefined) {
    css.textShadow = textStyle.textShadow
      ? "0 2px 14px rgba(0, 0, 0, 0.55)"
      : "none";
    if (!textStyle.textShadow) {
      css.filter = "none";
    }
  }

  return {
    className: classes.join(" "),
    style: Object.keys(css).length > 0 ? css : undefined,
  };
}

export function buildButtonStyleProps(
  btnStyle: ButtonElementStyle | undefined,
  baseClassName: string
): ComputedStyleProps {
  if (!btnStyle) {
    return { className: baseClassName };
  }

  const classes = [baseClassName, "otama-custom-btn"];
  const css: CSSProperties & Record<string, string | number | undefined> = {};
  const dataAttrs: Record<string, string> = {};

  const isOutline = btnStyle.variant === "outline";
  if (isOutline) {
    dataAttrs["data-variant"] = "outline";
  } else if (btnStyle.variant === "solid") {
    dataAttrs["data-variant"] = "solid";
  }

  if (btnStyle.bgColor && !isOutline) {
    dataAttrs["data-has-bg"] = "true";
    css["--ot-btn-bg"] = btnStyle.bgColor;
    css["--ot-btn-hover-fallback"] =
      btnStyle.hoverBgColor || darkenHex(btnStyle.bgColor, 0.14);
    if (btnStyle.hoverBgColor) {
      css["--ot-btn-hover-bg"] = btnStyle.hoverBgColor;
    }
  } else if (isOutline) {
    if (btnStyle.bgColor) {
      css["--ot-btn-bg"] = btnStyle.bgColor;
    }
    if (btnStyle.hoverBgColor) {
      css["--ot-btn-hover-bg"] = btnStyle.hoverBgColor;
    }
  }

  if (btnStyle.textColor) {
    dataAttrs["data-has-fg"] = "true";
    css["--ot-btn-fg"] = btnStyle.textColor;
  }

  if (btnStyle.borderColor) {
    dataAttrs["data-has-border"] = "true";
    css["--ot-btn-border"] = btnStyle.borderColor;
  }

  if (btnStyle.borderRadius === "sharp") {
    css.borderRadius = "0px";
  } else if (btnStyle.borderRadius === "rounded") {
    css.borderRadius = "10px";
  } else if (btnStyle.borderRadius === "pill") {
    css.borderRadius = "9999px";
  }

  const stack = resolveFontStack(btnStyle.fontFamily);
  if (stack) {
    css.fontFamily = stack;
  }

  if (btnStyle.fontSizeMobile !== undefined) {
    classes.push("otama-fs-m");
    css["--ot-fs-m"] = `${btnStyle.fontSizeMobile}px`;
  }

  if (btnStyle.fontSizeDesktop !== undefined) {
    classes.push("otama-fs-d");
    css["--ot-fs-d"] = `${btnStyle.fontSizeDesktop}px`;
  }

  return {
    className: classes.join(" "),
    style: Object.keys(css).length > 0 ? css : undefined,
    dataAttrs,
  };
}

export function alignToFlexItems(align?: TextAlignOption): string {
  if (align === "left") return "items-start text-left";
  if (align === "right") return "items-end text-right";
  return "items-center text-center";
}

export function alignToJustify(align?: TextAlignOption): string {
  if (align === "left") return "justify-start";
  if (align === "right") return "justify-end";
  return "justify-center";
}

export function describePositionVi(pt: PointPercent): string {
  const horiz =
    pt.x < 34 ? "bên trái" : pt.x > 66 ? "bên phải" : "chính giữa ngang";
  const vert =
    pt.y < 34 ? "phía trên" : pt.y > 66 ? "phía dưới" : "chính giữa dọc";
  if (horiz === "chính giữa ngang" && vert === "chính giữa dọc") {
    return "Đã đặt khối chữ vào chính giữa khung";
  }
  return `Đã chuyển khối chữ sang ${vert}, ${horiz}`;
}
