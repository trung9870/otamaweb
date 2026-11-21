/**
 * 2.5D Interactive Image-Mesh, Bone-Rig & Spring Physics Engine
 * -------------------------------------------------------------
 * Implements Rive-style 2D triangle image-mesh deformation, rigid 9-slice bone
 * anchoring, interruptible spring interpolation, and luminance-preserving PBR
 * fabric recoloring/pattern mapping directly on HTML5 Canvas 2D.
 */

export interface SpringState {
  value: number;
  velocity: number;
  target: number;
}

export function createSpring(initial: number): SpringState {
  return { value: initial, velocity: 0, target: initial };
}

/**
 * Advances a spring toward its target using 2 semi-implicit Euler sub-steps.
 * Returns true if the spring is still in motion.
 */
export function stepSpring(
  s: SpringState,
  dt: number,
  stiffness = 190,
  damping = 22,
  instant = false
): boolean {
  if (instant) {
    s.value = s.target;
    s.velocity = 0;
    return false;
  }
  const clampedDt = Math.min(dt, 0.033);
  const subDt = clampedDt * 0.5;
  for (let i = 0; i < 2; i++) {
    const force = (s.target - s.value) * stiffness;
    const damp = -s.velocity * damping;
    s.velocity += (force + damp) * subDt;
    s.value += s.velocity * subDt;
  }
  const settled =
    Math.abs(s.target - s.value) < 0.0005 && Math.abs(s.velocity) < 0.001;
  if (settled) {
    s.value = s.target;
    s.velocity = 0;
    return false;
  }
  return true;
}

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Renders one affine-mapped textured triangle from `img` (in source pixel coords)
 * onto destination canvas coords. Slightly expands the clip polygon outward from
 * its centroid (~0.65px) to prevent anti-aliasing hairline seams between triangles.
 */
export function drawTexturedTriangle(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  sx0: number,
  sy0: number,
  sx1: number,
  sy1: number,
  sx2: number,
  sy2: number,
  dx0: number,
  dy0: number,
  dx1: number,
  dy1: number,
  dx2: number,
  dy2: number,
  expandPx = 0.65
): void {
  const denom =
    sx0 * (sy1 - sy2) - sy0 * (sx1 - sx2) + (sx1 * sy2 - sx2 * sy1);
  if (Math.abs(denom) < 1e-5) return;

  const a =
    (dx0 * (sy1 - sy2) - sy0 * (dx1 - dx2) + (dx1 * sy2 - dx2 * sy1)) / denom;
  const b =
    (dy0 * (sy1 - sy2) - sy0 * (dy1 - dy2) + (dy1 * sy2 - dy2 * sy1)) / denom;
  const c =
    (sx0 * (dx1 - dx2) - dx0 * (sx1 - sx2) + (sx1 * dx2 - sx2 * dx1)) / denom;
  const d =
    (sx0 * (dy1 - dy2) - dy0 * (sx1 - sx2) + (sx1 * dy2 - sx2 * dy1)) / denom;
  const e =
    (sx0 * (sy1 * dx2 - sy2 * dx1) -
      sy0 * (sx1 * dx2 - sx2 * dx1) +
      dx0 * (sx1 * sy2 - sx2 * sy1)) /
    denom;
  const f =
    (sx0 * (sy1 * dy2 - sy2 * dy1) -
      sy0 * (sx1 * dy2 - sx2 * dy1) +
      dy0 * (sx1 * sy2 - sx2 * sy1)) /
    denom;

  // Outward centroid expansion for seamless triangle edges
  const cx = (dx0 + dx1 + dx2) / 3;
  const cy = (dy0 + dy1 + dy2) / 3;
  const expand = (px: number, py: number): [number, number] => {
    const vx = px - cx;
    const vy = py - cy;
    const len = Math.hypot(vx, vy) || 1;
    return [px + (vx / len) * expandPx, py + (vy / len) * expandPx];
  };

  const [ex0, ey0] = expand(dx0, dy0);
  const [ex1, ey1] = expand(dx1, dy1);
  const [ex2, ey2] = expand(dx2, dy2);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ex0, ey0);
  ctx.lineTo(ex1, ey1);
  ctx.lineTo(ex2, ey2);
  ctx.closePath();
  ctx.clip();
  ctx.transform(a, b, c, d, e, f);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

/**
 * Draws a subdivided grid mesh where `srcGrid[row][col]` are source pixel coords
 * and `dstGrid[row][col]` are deformed destination canvas coords.
 */
export function drawDeformedMeshGrid(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  srcGrid: Point2D[][],
  dstGrid: Point2D[][]
): void {
  const rows = srcGrid.length - 1;
  const cols = srcGrid[0].length - 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const s00 = srcGrid[r][c];
      const s10 = srcGrid[r][c + 1];
      const s01 = srcGrid[r + 1][c];
      const s11 = srcGrid[r + 1][c + 1];

      const d00 = dstGrid[r][c];
      const d10 = dstGrid[r][c + 1];
      const d01 = dstGrid[r + 1][c];
      const d11 = dstGrid[r + 1][c + 1];

      drawTexturedTriangle(
        ctx,
        img,
        s00.x,
        s00.y,
        s10.x,
        s10.y,
        s11.x,
        s11.y,
        d00.x,
        d00.y,
        d10.x,
        d10.y,
        d11.x,
        d11.y
      );
      drawTexturedTriangle(
        ctx,
        img,
        s00.x,
        s00.y,
        s11.x,
        s11.y,
        s01.x,
        s01.y,
        d00.x,
        d00.y,
        d11.x,
        d11.y,
        d01.x,
        d01.y
      );
    }
  }
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export type FabricPatternKind = "solid" | "tandem-stripe" | "calm-waters" | "windowpane";

export interface SwatchVisual {
  base: RGB;
  stripe: RGB;
  pattern: FabricPatternKind;
  patternStrength: number; // 0 for solid, 1 for patterned
}

function parseColorToRgb(raw?: string): RGB | null {
  if (!raw) return null;
  const s = raw.trim();
  const rgbMatch = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
    };
  }
  const hexMatch = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }
  return null;
}

/**
 * Resolves any Brooklinen swatch name/color into a photorealistic PBR tint +
 * procedural woven stripe descriptor so all 27 swatches transition fluidly.
 */
export function resolveSwatchVisual(label: string, rawColor?: string): SwatchVisual {
  const lower = label.toLowerCase();
  const parsed = parseColorToRgb(rawColor);

  // Named palette fallbacks for patterned swatches whose swatch only has a tiny thumbnail
  const namedAccent = (): RGB => {
    if (lower.includes("storm")) return { r: 109, g: 132, b: 154 };
    if (lower.includes("moss") || lower.includes("olive") || lower.includes("sage")) {
      return { r: 124, g: 130, b: 92 };
    }
    if (lower.includes("coral") || lower.includes("terracotta") || lower.includes("clay")) {
      return { r: 186, g: 102, b: 86 };
    }
    if (lower.includes("pebble") || lower.includes("taupe") || lower.includes("oat")) {
      return { r: 162, g: 152, b: 138 };
    }
    if (lower.includes("frost") || lower.includes("ice") || lower.includes("sky")) {
      return { r: 158, g: 175, b: 190 };
    }
    if (lower.includes("navy") || lower.includes("abyss") || lower.includes("indigo")) {
      return { r: 58, g: 72, b: 98 };
    }
    if (lower.includes("graphite") || lower.includes("charcoal") || lower.includes("slate")) {
      return { r: 86, g: 88, b: 96 };
    }
    if (lower.includes("rose") || lower.includes("blush") || lower.includes("pink")) {
      return { r: 196, g: 148, b: 146 };
    }
    if (lower.includes("marigold") || lower.includes("ochre") || lower.includes("mustard")) {
      return { r: 196, g: 156, b: 82 };
    }
    if (lower.includes("plum") || lower.includes("fig") || lower.includes("berry")) {
      return { r: 122, g: 82, b: 98 };
    }
    return parsed || { r: 126, g: 142, b: 160 };
  };

  if (lower.includes("tandem stripe") || lower.includes("stripe") || lower.includes("ticking")) {
    return {
      base: { r: 247, g: 246, b: 243 },
      stripe: namedAccent(),
      pattern: "tandem-stripe",
      patternStrength: 1,
    };
  }

  if (lower.includes("calm waters") || lower.includes("tonal") || lower.includes("wave")) {
    const accent = namedAccent();
    return {
      base: {
        r: Math.round(accent.r * 0.35 + 245 * 0.65),
        g: Math.round(accent.g * 0.35 + 244 * 0.65),
        b: Math.round(accent.b * 0.35 + 240 * 0.65),
      },
      stripe: accent,
      pattern: "calm-waters",
      patternStrength: 1,
    };
  }

  if (lower.includes("windowpane") || lower.includes("plaid") || lower.includes("check")) {
    return {
      base: { r: 246, g: 245, b: 241 },
      stripe: namedAccent(),
      pattern: "windowpane",
      patternStrength: 1,
    };
  }

  const solid = parsed || namedAccent();
  return {
    base: solid,
    stripe: solid,
    pattern: "solid",
    patternStrength: 0,
  };
}

export function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  const k = Math.max(0, Math.min(1, t));
  return {
    r: Math.round(a.r + (b.r - a.r) * k),
    g: Math.round(a.g + (b.g - a.g) * k),
    b: Math.round(a.b + (b.b - a.b) * k),
  };
}

/**
 * Generates an offscreen woven fabric texture tile (solid percale weave,
 * tandem pinstripes, calm-waters organic stripes, or windowpane plaid)
 * ready to be multiply-composited over crisp white studio bedding.
 */
export function buildFabricPatternCanvas(
  base: RGB,
  stripe: RGB,
  pattern: FabricPatternKind,
  patternAlpha: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = `rgb(${base.r}, ${base.g}, ${base.b})`;
  ctx.fillRect(0, 0, 256, 256);

  // Subtle woven percale cross-hatch micro-texture
  ctx.fillStyle = "rgba(0, 0, 0, 0.018)";
  for (let y = 0; y < 256; y += 4) {
    ctx.fillRect(0, y, 256, 1);
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
  for (let x = 0; x < 256; x += 4) {
    ctx.fillRect(x, 0, 1, 256);
  }

  if (patternAlpha > 0.01 && pattern !== "solid") {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, patternAlpha));
    ctx.fillStyle = `rgb(${stripe.r}, ${stripe.g}, ${stripe.b})`;
    ctx.strokeStyle = `rgb(${stripe.r}, ${stripe.g}, ${stripe.b})`;

    if (pattern === "tandem-stripe") {
      // Brooklinen iconic double-line tandem stripe repeating horizontally across the bed
      const period = 32;
      for (let x = 0; x < 256; x += period) {
        ctx.fillRect(x + 4, 0, 3.2, 256);
        ctx.fillRect(x + 10.5, 0, 1.8, 256);
      }
    } else if (pattern === "calm-waters") {
      // Soft organic painterly horizontal wave stripes
      ctx.lineWidth = 4;
      for (let y = 10; y < 256; y += 28) {
        ctx.beginPath();
        for (let x = 0; x <= 256; x += 8) {
          const wy = y + Math.sin((x / 256) * Math.PI * 4) * 3.5;
          if (x === 0) ctx.moveTo(x, wy);
          else ctx.lineTo(x, wy);
        }
        ctx.stroke();
      }
    } else if (pattern === "windowpane") {
      const step = 42;
      for (let i = 0; i < 256; i += step) {
        ctx.fillRect(i + 2, 0, 2.2, 256);
        ctx.fillRect(0, i + 2, 256, 2.2);
      }
    }
    ctx.restore();
  }

  return canvas;
}
