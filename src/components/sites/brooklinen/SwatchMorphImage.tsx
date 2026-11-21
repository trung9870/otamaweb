"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "./LanguageContext";

/**
 * SwatchMorphImage
 * ----------------
 * Smooth "dye-flow" colour morph between the ORIGINAL studio product photos.
 *
 * - Swatches that own a real studio photo morph photo → photo.
 * - Swatches without a dedicated photo are synthesised from the closest real
 *   photo by luminance-preserving recolouring (solid colours re-dye a solid
 *   fabric photo, stripes re-dye only the stripe threads of a striped photo,
 *   with the stripe colour sampled from the swatch thumbnail).
 * - The transition is a fabric-aware wavefront (direction follows swatch
 *   order, darker folds absorb "dye" a touch later, organic noise edge, wet
 *   sheen on the front) plus a tiny settle "squish" — no image jumping.
 */

export interface MorphSwatch {
  label: string;
  color?: string;
  mainImage?: string;
  swatchImage?: string;
}

interface SwatchMorphImageProps {
  swatches: MorphSwatch[];
  selectedIdx: number;
  previewIdx: number | null;
  locale: Locale;
}

type RGB = [number, number, number];

const S = 600; // working resolution (studio photos are 600×600)
const BG = 242; // studio backdrop grey (#F2F2F2)
const DURATION_MS = 720;

const imageCache = new Map<string, Promise<HTMLImageElement>>();
function loadImage(src: string): Promise<HTMLImageElement> {
  let p = imageCache.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    imageCache.set(src, p);
  }
  return p;
}

function makeCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  return c;
}

function getCtx(c: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas unavailable");
  return ctx;
}

function parseRgb(raw?: string): RGB | null {
  if (!raw) return null;
  const m = raw.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  const h = raw.match(/^#([0-9a-f]{6})$/i);
  if (h) {
    return [
      parseInt(h[1].slice(0, 2), 16),
      parseInt(h[1].slice(2, 4), 16),
      parseInt(h[1].slice(4, 6), 16),
    ];
  }
  return null;
}

const lumOf = (r: number, g: number, b: number) => r * 0.299 + g * 0.587 + b * 0.114;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Soft highlight knee so recoloured fabric never clips to flat white. */
function knee(v: number): number {
  if (v <= 228) return v;
  return Math.min(255, 228 + (v - 228) * 0.45);
}

/** Decides which swatches own a genuine studio photo (vs. a shared placeholder). */
function detectRealPhotos(swatches: MorphSwatch[]): Set<number> {
  const groups = new Map<string, number[]>();
  swatches.forEach((sw, i) => {
    if (!sw.mainImage) return;
    const list = groups.get(sw.mainImage) || [];
    list.push(i);
    groups.set(sw.mainImage, list);
  });
  const real = new Set<number>();
  for (const [src, idxs] of groups) {
    if (idxs.length === 1) {
      real.add(idxs[0]);
      continue;
    }
    const file = norm(src.split("/").pop() || "");
    let best = -1;
    let bestLen = 0;
    for (const i of idxs) {
      const n = norm(swatches[i].label);
      if (n.length > bestLen && file.includes(n)) {
        best = i;
        bestLen = n.length;
      }
    }
    if (best >= 0) real.add(best);
  }
  return real;
}

/** Extracts base + stripe colour from a swatch thumbnail (patterned fabrics). */
async function extractPalette(src: string): Promise<{ base: RGB; accent: RGB; patterned: boolean }> {
  const img = await loadImage(src);
  const c = document.createElement("canvas");
  c.width = 40;
  c.height = 40;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { base: [245, 245, 242], accent: [120, 130, 150], patterned: true };
  ctx.drawImage(img, 0, 0, 40, 40);
  const d = ctx.getImageData(0, 0, 40, 40).data;
  const px: { r: number; g: number; b: number; l: number }[] = [];
  for (let i = 0; i < d.length; i += 4) {
    px.push({ r: d[i], g: d[i + 1], b: d[i + 2], l: lumOf(d[i], d[i + 1], d[i + 2]) });
  }
  px.sort((a, b) => a.l - b.l);
  const avg = (arr: typeof px): RGB => {
    const n = Math.max(1, arr.length);
    return [
      arr.reduce((s, p) => s + p.r, 0) / n,
      arr.reduce((s, p) => s + p.g, 0) / n,
      arr.reduce((s, p) => s + p.b, 0) / n,
    ];
  };
  // Dominant stripe colour: seed on the most saturated dark thread, then average its cluster
  // (multi-colour stripes like "Skyline" would otherwise blend into a muddy average).
  const dark = px.slice(0, Math.floor(px.length * 0.35));
  const satOf = (p: (typeof px)[number]) => Math.max(p.r, p.g, p.b) - Math.min(p.r, p.g, p.b);
  let seed = dark[0];
  for (const p of dark) if (satOf(p) > satOf(seed)) seed = p;
  const cluster = dark.filter(
    (p) => Math.hypot(p.r - seed.r, p.g - seed.g, p.b - seed.b) < 42
  );
  const accent = avg(cluster.length >= 4 ? cluster : px.slice(0, Math.floor(px.length * 0.18)));
  const base = avg(px.slice(Math.floor(px.length * 0.7)));
  const dist = Math.hypot(base[0] - accent[0], base[1] - accent[1], base[2] - accent[2]);
  return { base, accent, patterned: dist > 38 };
}

interface SolidBase {
  data: Uint8ClampedArray;
  mask: Float32Array;
  lRef: number;
  lum: number;
}

/** Builds a fabric matte for a solid-colour photo from its own chroma direction. */
function analyseSolidBase(data: Uint8ClampedArray): SolidBase {
  let sr = 0;
  let sg = 0;
  let sb = 0;
  let n = 0;
  for (let y = 270; y < 330; y += 2) {
    for (let x = 200; x < 400; x += 2) {
      const i = (y * S + x) * 4;
      sr += data[i];
      sg += data[i + 1];
      sb += data[i + 2];
      n++;
    }
  }
  const c0: RGB = [sr / n, sg / n, sb / n];
  const l0 = lumOf(c0[0], c0[1], c0[2]);
  const dir: RGB = [c0[0] - l0, c0[1] - l0, c0[2] - l0];
  const mag = Math.hypot(dir[0], dir[1], dir[2]) || 1;
  dir[0] /= mag;
  dir[1] /= mag;
  dir[2] /= mag;

  const mask = new Float32Array(S * S);
  const ls: number[] = [];
  for (let p = 0, i = 0; p < S * S; p++, i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const l = lumOf(r, g, b);
    const proj = (r - l) * dir[0] + (g - l) * dir[1] + (b - l) * dir[2];
    const m = clamp01((proj - mag * 0.22) / (mag * 0.42));
    mask[p] = m;
    if (m > 0.6 && (p & 7) === 0) ls.push(l);
  }
  ls.sort((a, b) => a - b);
  // Anchor the recolour on the lit pillow face (what shoppers read as "the colour"),
  // so a swatch like Abyss renders as deep navy on the top face, with folds falling darker.
  const median = ls.length ? ls[Math.floor(ls.length / 2)] : l0;
  const lRef = Math.max(median, l0 * 0.97);
  return { data, mask, lRef, lum: l0 };
}

function recolorSolid(base: SolidBase, target: RGB, out: ImageData): void {
  const d = out.data;
  const src = base.data;
  const tl = lumOf(target[0], target[1], target[2]);
  const contrast = tl > 200 ? 0.5 : tl > 165 ? 0.66 : tl > 120 ? 0.85 : 1;
  for (let p = 0, i = 0; p < S * S; p++, i += 4) {
    const m = base.mask[p];
    const r = src[i];
    const g = src[i + 1];
    const b = src[i + 2];
    if (m <= 0.001) {
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = 255;
      continue;
    }
    const k = 1 + (lumOf(r, g, b) / base.lRef - 1) * contrast;
    d[i] = r + (knee(target[0] * k) - r) * m;
    d[i + 1] = g + (knee(target[1] * k) - g) * m;
    d[i + 2] = b + (knee(target[2] * k) - b) * m;
    d[i + 3] = 255;
  }
}

interface StripeBase {
  data: Uint8ClampedArray;
  weight: Float32Array;
  neutral: Float32Array;
  lRef: number;
}

/** Isolates the coloured stripe threads of a striped studio photo. */
function analyseStripeBase(data: Uint8ClampedArray): StripeBase {
  // Find dominant stripe chroma direction from the most saturated pixels.
  let sr = 0;
  let sg = 0;
  let sb = 0;
  let n = 0;
  for (let p = 0, i = 0; p < S * S; p += 3, i += 12) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const l = lumOf(r, g, b);
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat > 18 && l < 230) {
      sr += r - l;
      sg += g - l;
      sb += b - l;
      n++;
    }
  }
  const dir: RGB = n ? [sr / n, sg / n, sb / n] : [-8, 0, 8];
  const mag = Math.hypot(dir[0], dir[1], dir[2]) || 1;
  dir[0] /= mag;
  dir[1] /= mag;
  dir[2] /= mag;

  const weight = new Float32Array(S * S);
  const neutral = new Float32Array(S * S);
  let lSum = 0;
  let lN = 0;
  for (let p = 0, i = 0; p < S * S; p++, i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const l = lumOf(r, g, b);
    // Normalise chroma by brightness so stripes inside shadowed folds are still caught
    const proj =
      ((r - l) * dir[0] + (g - l) * dir[1] + (b - l) * dir[2]) * (200 / Math.max(l, 70));
    const w = clamp01((proj - 3) / 9);
    weight[p] = w;
    neutral[p] = clamp01((proj - 1) / 3) * (1 - w);
    if (w > 0.85) {
      lSum += l;
      lN++;
    }
  }
  return { data, weight, neutral, lRef: lN ? lSum / lN : 142 };
}

function recolorStripe(base: StripeBase, accent: RGB, out: ImageData): void {
  const d = out.data;
  const src = base.data;
  for (let p = 0, i = 0; p < S * S; p++, i += 4) {
    let r = src[i];
    let g = src[i + 1];
    let b = src[i + 2];
    const l = lumOf(r, g, b);
    const nt = base.neutral[p];
    if (nt > 0) {
      r += (l - r) * nt;
      g += (l - g) * nt;
      b += (l - b) * nt;
    }
    const w = base.weight[p];
    if (w > 0) {
      const k = l / base.lRef;
      r += (knee(accent[0] * k) - r) * w;
      g += (knee(accent[1] * k) - g) * w;
      b += (knee(accent[2] * k) - b) * w;
    }
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = 255;
  }
}

interface Look {
  canvas: HTMLCanvasElement;
  data: Uint8ClampedArray;
  synthetic: boolean;
}

export function SwatchMorphImage({ swatches, selectedIdx, previewIdx, locale }: SwatchMorphImageProps) {
  const isVi = locale === "vi";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [shownSynthetic, setShownSynthetic] = useState(false);

  const realSet = useMemo(() => detectRealPhotos(swatches), [swatches]);
  const swatchKey = useMemo(
    () => swatches.map((s) => `${s.label}|${s.mainImage || ""}|${s.color || ""}`).join(";"),
    [swatches]
  );

  // Engine state kept in refs (rAF-driven, never re-renders per frame)
  const engine = useRef<{
    looks: Map<number, Promise<Look>>;
    solidBases: { light?: Promise<SolidBase | null>; dark?: Promise<SolidBase | null> };
    stripeBase?: Promise<StripeBase | null>;
    stage: HTMLCanvasElement | null;
    from: HTMLCanvasElement | null;
    maskC: HTMLCanvasElement | null;
    glowC: HTMLCanvasElement | null;
    tmp: HTMLCanvasElement | null;
    maskImg: ImageData | null;
    glowImg: ImageData | null;
    arrival: Float32Array | null;
    nonBg: Uint8Array | null;
    noise: Float32Array | null;
    current: Look | null;
    currentIdx: number;
    target: Look | null;
    t0: number;
    raf: number | null;
    requestId: number;
  }>({
    looks: new Map(),
    solidBases: {},
    stage: null,
    from: null,
    maskC: null,
    glowC: null,
    tmp: null,
    maskImg: null,
    glowImg: null,
    arrival: null,
    nonBg: null,
    noise: null,
    current: null,
    currentIdx: -1,
    target: null,
    t0: 0,
    raf: null,
    requestId: 0,
  });

  // Reset caches if the product's swatches change
  useEffect(() => {
    const e = engine.current;
    e.looks = new Map();
    e.solidBases = {};
    e.stripeBase = undefined;
  }, [swatchKey]);

  const displayIdx = previewIdx ?? selectedIdx;

  useEffect(() => {
    const e = engine.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const out = canvas.getContext("2d");
    if (!out) return;

    if (!e.stage) {
      e.stage = makeCanvas();
      e.from = makeCanvas();
      e.maskC = makeCanvas();
      e.glowC = makeCanvas();
      e.tmp = makeCanvas();
      e.maskImg = getCtx(e.maskC).createImageData(S, S);
      e.glowImg = getCtx(e.glowC).createImageData(S, S);
      // Low-frequency value noise for an organic, fabric-like wavefront
      const G = 14;
      const grid = new Float32Array((G + 1) * (G + 1));
      for (let i = 0; i < grid.length; i++) grid[i] = Math.random();
      const noise = new Float32Array(S * S);
      for (let y = 0; y < S; y++) {
        const gy = (y / S) * G;
        const y0 = Math.floor(gy);
        const fy = gy - y0;
        const sy = fy * fy * (3 - 2 * fy);
        for (let x = 0; x < S; x++) {
          const gx = (x / S) * G;
          const x0 = Math.floor(gx);
          const fx = gx - x0;
          const sx = fx * fx * (3 - 2 * fx);
          const a = grid[y0 * (G + 1) + x0];
          const b = grid[y0 * (G + 1) + x0 + 1];
          const c = grid[(y0 + 1) * (G + 1) + x0];
          const d = grid[(y0 + 1) * (G + 1) + x0 + 1];
          noise[y * S + x] = a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
        }
      }
      e.noise = noise;
      e.arrival = new Float32Array(S * S);
      e.nonBg = new Uint8Array(S * S);
    }

    const readPixels = (img: CanvasImageSource): { canvas: HTMLCanvasElement; data: Uint8ClampedArray } => {
      const c = makeCanvas();
      const ctx = getCtx(c);
      ctx.fillStyle = `rgb(${BG},${BG},${BG})`;
      ctx.fillRect(0, 0, S, S);
      ctx.drawImage(img, 0, 0, S, S);
      return { canvas: c, data: ctx.getImageData(0, 0, S, S).data };
    };

    const findReal = (pred: (sw: MorphSwatch) => boolean): number => {
      for (const i of realSet) if (pred(swatches[i])) return i;
      return -1;
    };

    const getSolidBase = (wantLight: boolean): Promise<SolidBase | null> => {
      const key = wantLight ? "light" : "dark";
      const cached = e.solidBases[key];
      if (cached) return cached;
      const promise = (async () => {
        // Prefer a mid-tone solid photo (rich shading) for dark targets and a light warm one for pale targets
        let best = -1;
        let bestScore = Infinity;
        for (const i of realSet) {
          const sw = swatches[i];
          const c = parseRgb(sw.color);
          if (!c || sw.swatchImage) continue;
          const l = lumOf(c[0], c[1], c[2]);
          if (l > 236) continue; // pure white/cream photos have no usable chroma matte
          const score = Math.abs(l - (wantLight ? 205 : 115));
          if (score < bestScore) {
            bestScore = score;
            best = i;
          }
        }
        if (best < 0 || !swatches[best].mainImage) return null;
        const img = await loadImage(swatches[best].mainImage as string);
        return analyseSolidBase(readPixels(img).data);
      })();
      e.solidBases[key] = promise;
      return promise;
    };

    const getStripeBase = (): Promise<StripeBase | null> => {
      if (e.stripeBase) return e.stripeBase;
      e.stripeBase = (async () => {
        let idx = findReal((sw) => /storm/i.test(sw.label) && /stripe/i.test(sw.label));
        if (idx < 0) idx = findReal((sw) => /stripe/i.test(sw.label));
        if (idx < 0 || !swatches[idx].mainImage) return null;
        const img = await loadImage(swatches[idx].mainImage as string);
        return analyseStripeBase(readPixels(img).data);
      })();
      return e.stripeBase;
    };

    const buildLook = (idx: number): Promise<Look> => {
      const cached = e.looks.get(idx);
      if (cached) return cached;
      const promise = (async (): Promise<Look> => {
        const sw = swatches[idx];
        const fallback = async (): Promise<Look> => {
          const src = sw?.mainImage || swatches.find((s) => s.mainImage)?.mainImage;
          if (!src) {
            const c = makeCanvas();
            const ctx = getCtx(c);
            ctx.fillStyle = `rgb(${BG},${BG},${BG})`;
            ctx.fillRect(0, 0, S, S);
            return { canvas: c, data: ctx.getImageData(0, 0, S, S).data, synthetic: false };
          }
          const img = await loadImage(src);
          const r = readPixels(img);
          return { ...r, synthetic: false };
        };
        if (!sw) return fallback();
        if (realSet.has(idx)) return fallback();

        const solid = parseRgb(sw.color);
        const patternedHint = !solid || Boolean(sw.swatchImage);
        if (patternedHint) {
          const pal = sw.swatchImage ? await extractPalette(sw.swatchImage).catch(() => null) : null;
          if (pal && !pal.patterned) {
            const base = await getSolidBase(lumOf(...pal.base) >= 165);
            if (base) {
              const c = makeCanvas();
              const ctx = getCtx(c);
              const out = ctx.createImageData(S, S);
              recolorSolid(base, pal.base, out);
              ctx.putImageData(out, 0, 0);
              return { canvas: c, data: out.data, synthetic: true };
            }
          }
          const stripe = await getStripeBase();
          if (stripe && pal) {
            const c = makeCanvas();
            const ctx = getCtx(c);
            const out = ctx.createImageData(S, S);
            recolorStripe(stripe, pal.accent, out);
            ctx.putImageData(out, 0, 0);
            return { canvas: c, data: out.data, synthetic: true };
          }
          return fallback();
        }

        const base = await getSolidBase(lumOf(solid[0], solid[1], solid[2]) >= 165);
        if (!base) return fallback();
        const c = makeCanvas();
        const ctx = getCtx(c);
        const out = ctx.createImageData(S, S);
        recolorSolid(base, solid, out);
        ctx.putImageData(out, 0, 0);
        return { canvas: c, data: out.data, synthetic: true };
      })();
      e.looks.set(idx, promise);
      return promise;
    };

    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const drawFinal = (look: Look) => {
      out.setTransform(1, 0, 0, 1, 0, 0);
      out.clearRect(0, 0, S, S);
      out.drawImage(look.canvas, 0, 0);
    };

    const frame = (now: number) => {
      const target = e.target;
      const from = e.from;
      if (!target || !from || !e.stage || !e.maskC || !e.glowC || !e.tmp) return;
      const arrival = e.arrival as Float32Array;
      const nonBg = e.nonBg as Uint8Array;
      const maskImg = e.maskImg as ImageData;
      const glowImg = e.glowImg as ImageData;

      const t = clamp01((now - e.t0) / DURATION_MS);
      const p = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const soft = 0.17;
      const threshold = p * (1 + soft);

      const md = maskImg.data;
      const gd = glowImg.data;
      for (let q = 0, i = 0; q < S * S; q++, i += 4) {
        let a = (threshold - arrival[q]) / soft;
        a = a < 0 ? 0 : a > 1 ? 1 : a;
        a = a * a * (3 - 2 * a);
        md[i + 3] = a * 255;
        // Wet "dye" sheen riding the wavefront, only over fabric (never on the backdrop)
        if (nonBg[q]) {
          const band = 4 * a * (1 - a);
          gd[i] = 255;
          gd[i + 1] = 252;
          gd[i + 2] = 246;
          gd[i + 3] = band * 70;
        } else {
          gd[i + 3] = 0;
        }
      }
      getCtx(e.maskC).putImageData(maskImg, 0, 0);
      getCtx(e.glowC).putImageData(glowImg, 0, 0);

      const tctx = getCtx(e.tmp);
      tctx.globalCompositeOperation = "source-over";
      tctx.clearRect(0, 0, S, S);
      tctx.drawImage(target.canvas, 0, 0);
      tctx.globalCompositeOperation = "destination-in";
      tctx.drawImage(e.maskC, 0, 0);
      tctx.globalCompositeOperation = "source-over";

      const sctx = getCtx(e.stage);
      sctx.globalCompositeOperation = "source-over";
      sctx.drawImage(from, 0, 0);
      sctx.drawImage(e.tmp, 0, 0);
      sctx.globalCompositeOperation = "screen";
      sctx.drawImage(e.glowC, 0, 0);
      sctx.globalCompositeOperation = "source-over";

      // Gentle settle: pillows compress ~1.2% then spring back, anchored at their base
      const squish = 1 - 0.012 * Math.sin(Math.PI * p);
      out.setTransform(1, 0, 0, 1, 0, 0);
      out.fillStyle = `rgb(${BG},${BG},${BG})`;
      out.fillRect(0, 0, S, S);
      const sx = 1 + (1 - squish) * 0.35;
      out.setTransform(sx, 0, 0, squish, -(S / 2) * (sx - 1), 500 * (1 - squish));
      out.drawImage(e.stage, 0, 0);
      out.setTransform(1, 0, 0, 1, 0, 0);

      if (t < 1) {
        e.raf = requestAnimationFrame(frame);
      } else {
        e.raf = null;
        e.current = target;
        drawFinal(target);
      }
    };

    const startTransition = (look: Look, idx: number) => {
      const from = e.from as HTMLCanvasElement;
      const fctx = getCtx(from);
      if (e.raf !== null) {
        // Interrupted mid-flight: freeze what is on screen and morph onward from there
        cancelAnimationFrame(e.raf);
        e.raf = null;
        fctx.clearRect(0, 0, S, S);
        fctx.drawImage(canvas, 0, 0);
      } else if (e.current) {
        fctx.clearRect(0, 0, S, S);
        fctx.drawImage(e.current.canvas, 0, 0);
      }

      const dir = e.currentIdx < 0 ? 1 : idx >= e.currentIdx ? 1 : -1;
      e.currentIdx = idx;
      e.target = look;

      if (!e.current || reduced()) {
        e.current = look;
        drawFinal(look);
        return;
      }

      // Fabric-aware arrival map: sweep direction + slight vertical pour + noise + darker folds later
      const arrival = e.arrival as Float32Array;
      const nonBg = e.nonBg as Uint8Array;
      const noise = e.noise as Float32Array;
      const fromData = fctx.getImageData(0, 0, S, S).data;
      const toData = look.data;
      let mn = Infinity;
      let mx = -Infinity;
      for (let y = 0, q = 0; y < S; y++) {
        const ny = y / S;
        for (let x = 0; x < S; x++, q++) {
          const i = q * 4;
          const nx = x / S;
          const tl = lumOf(toData[i], toData[i + 1], toData[i + 2]);
          const fd =
            Math.abs(fromData[i] - BG) + Math.abs(fromData[i + 1] - BG) + Math.abs(fromData[i + 2] - BG);
          const td = Math.abs(toData[i] - BG) + Math.abs(toData[i + 1] - BG) + Math.abs(toData[i + 2] - BG);
          nonBg[q] = fd > 16 || td > 16 ? 1 : 0;
          const v =
            (dir > 0 ? nx : 1 - nx) * 0.6 + ny * 0.2 + noise[q] * 0.13 + (1 - tl / 255) * 0.07;
          arrival[q] = v;
          if (v < mn) mn = v;
          if (v > mx) mx = v;
        }
      }
      const range = mx - mn || 1;
      for (let q = 0; q < S * S; q++) arrival[q] = (arrival[q] - mn) / range;

      e.t0 = performance.now();
      e.raf = requestAnimationFrame(frame);
    };

    const requestId = ++e.requestId;
    let cancelled = false;
    buildLook(displayIdx)
      .then((look) => {
        if (cancelled || requestId !== e.requestId) return;
        startTransition(look, displayIdx);
        setShownSynthetic(look.synthetic);
        setReady(true);
        // Warm up neighbouring looks so the next hover/click morphs instantly
        for (const n of [displayIdx + 1, displayIdx - 1]) {
          if (n >= 0 && n < swatches.length) void buildLook(n).catch(() => undefined);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [displayIdx, swatches, realSet, swatchKey]);

  useEffect(() => {
    const e = engine.current;
    return () => {
      if (e.raf !== null) cancelAnimationFrame(e.raf);
      e.raf = null;
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={S}
        height={S}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-200 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
      {ready && (
        <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#283455] shadow-xs backdrop-blur-xs">
          <span
            aria-hidden="true"
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              shownSynthetic ? "bg-[#F59E0B]" : "bg-[#22C55E]"
            }`}
          />
          {shownSynthetic
            ? isVi
              ? "Mô phỏng màu từ ảnh gốc"
              : "Colour simulated from studio photo"
            : isVi
            ? "Ảnh chụp thật"
            : "Real studio photo"}
        </span>
      )}
    </>
  );
}
