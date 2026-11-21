"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  buildFabricPatternCanvas,
  createSpring,
  drawDeformedMeshGrid,
  lerpRgb,
  resolveSwatchVisual,
  stepSpring,
  type Point2D,
  type SwatchVisual,
} from "./bedMeshEngine";
import type { Locale } from "./LanguageContext";
import { translateColor, translateSize } from "./translations";

export interface BedSizeSpec {
  label: string;
  delta: number;
  widthCm: number;
  lengthCm: number;
  /** Rigid outward horizontal shift per side in canonical 1200px image space. */
  dx: number;
  /** Foot overhang longitudinal shift in canonical 896px image space. */
  dyFoot: number;
}

export const BED_STUDIO_SIZES: readonly BedSizeSpec[] = [
  { label: "Twin", delta: 0, widthCm: 99, lengthCm: 190, dx: -62, dyFoot: -10 },
  { label: "Twin XL", delta: 10, widthCm: 99, lengthCm: 203, dx: -58, dyFoot: 12 },
  { label: "Full", delta: 20, widthCm: 137, lengthCm: 190, dx: -26, dyFoot: -6 },
  { label: "Queen", delta: 30, widthCm: 152, lengthCm: 203, dx: 0, dyFoot: 0 },
  { label: "King", delta: 45, widthCm: 193, lengthCm: 203, dx: 50, dyFoot: 2 },
  { label: "Cal King", delta: 45, widthCm: 183, lengthCm: 213, dx: 38, dyFoot: 22 },
];

export const EURO_PILLOWS_ADDON_USD = 45;
export const WAFFLE_THROW_ADDON_USD = 149;

const SRC_W = 1200;
const SRC_H = 896;
const MASK_W = 600;
const MASK_H = 448;

// Canonical source grid lines measured directly from the 4 pixel-locked 1200x896 studio passes
const SRC_COLS = [0, 195, 365, 445, 522, 600, 678, 755, 835, 1005, 1200];
const SRC_ROWS = [0, 360, 520, 667, 748, 835, 896];

interface StudioAssets {
  day: HTMLImageElement;
  night: HTMLImageElement;
  deluxe: HTMLImageElement;
  folded: HTMLImageElement;
  beddingMaskDay: HTMLCanvasElement;
  beddingMaskFolded: HTMLCanvasElement;
  euroPillowLayer: HTMLCanvasElement;
  euroPillowMask: HTMLCanvasElement;
  waffleMask: HTMLCanvasElement;
}

interface BedStudioConfiguratorProps {
  locale: Locale;
  selectedSizeIdx: number;
  onSelectSizeIdx: (idx: number) => void;
  swatchLabel: string;
  swatchColor?: string;
  includeEuroPillows: boolean;
  onToggleEuroPillows: (next: boolean) => void;
  includeWaffleThrow: boolean;
  onToggleWaffleThrow: (next: boolean) => void;
  formatMoney: (usd: number, locale: Locale) => string;
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Computes pixel-accurate anti-aliased chroma-key mattes for crisp pure-white
 * percale bedding (which has R-B ~ 0 while warm oak/wall/lamps have R-B >= 32),
 * plus diff-extracted Euro pillows & waffle blanket mattes from the pixel-locked
 * deluxe pass. Executes once on mount (~5ms total).
 */
function buildStudioMasks(
  day: HTMLImageElement,
  deluxe: HTMLImageElement,
  folded: HTMLImageElement
): Omit<StudioAssets, "day" | "night" | "deluxe" | "folded"> {
  const samplePixels = (img: HTMLImageElement): Uint8ClampedArray => {
    const c = document.createElement("canvas");
    c.width = MASK_W;
    c.height = MASK_H;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return new Uint8ClampedArray(MASK_W * MASK_H * 4);
    ctx.drawImage(img, 0, 0, MASK_W, MASK_H);
    return ctx.getImageData(0, 0, MASK_W, MASK_H).data;
  };

  const dayPx = samplePixels(day);
  const deluxePx = samplePixels(deluxe);
  const foldedPx = samplePixels(folded);

  const makeWhiteMask = (
    px: Uint8ClampedArray,
    yMinNorm: number,
    yMaxNorm: number
  ): HTMLCanvasElement => {
    const c = document.createElement("canvas");
    c.width = MASK_W;
    c.height = MASK_H;
    const ctx = c.getContext("2d");
    if (!ctx) return c;
    const out = ctx.createImageData(MASK_W, MASK_H);
    const d = out.data;

    const yMin = Math.floor(MASK_H * yMinNorm);
    const yMax = Math.ceil(MASK_H * yMaxNorm);

    for (let y = yMin; y < yMax; y++) {
      const ny = y / MASK_H;
      // Tight perspective bed trapezoid so bare wall & bedside lamps are 100% excluded
      let xMinNorm = 0.322;
      let xMaxNorm = 0.680;
      if (ny >= 0.568 && ny < 0.655) {
        const t = (ny - 0.568) / (0.655 - 0.568);
        xMinNorm = 0.305 - t * 0.090;
        xMaxNorm = 0.695 + t * 0.090;
      } else if (ny >= 0.655) {
        const t = clamp((ny - 0.655) / (0.885 - 0.655), 0, 1);
        xMinNorm = 0.215 - t * 0.033;
        xMaxNorm = 0.785 + t * 0.033;
      }
      const xMin = Math.floor(MASK_W * xMinNorm);
      const xMax = Math.ceil(MASK_W * xMaxNorm);

      for (let x = xMin; x < xMax; x++) {
        if (ny > 0.885) continue;

        const idx = (y * MASK_W + x) * 4;
        const r = px[idx];
        const g = px[idx + 1];
        const b = px[idx + 2];
        const warmth = r - b;
        const lum = (r + g + b) / 3;
        // Inside the tight bed trapezoid: white cotton (including warm oak bounce light)
        // has R-B <= 36 while oak headboard/rail/floor has R-B >= 61.
        const chromaScore = clamp((46 - Math.max(0, warmth)) / 14, 0, 1);
        const lumScore = clamp((lum - 114) / 22, 0, 1);
        const a = Math.round(chromaScore * lumScore * 255);
        if (a > 0) {
          d[idx] = 255;
          d[idx + 1] = 255;
          d[idx + 2] = 255;
          d[idx + 3] = a;
        }
      }
    }
    ctx.putImageData(out, 0, 0);
    return c;
  };

  const beddingMaskDay = makeWhiteMask(dayPx, 0.455, 0.885);
  const beddingMaskFolded = makeWhiteMask(foldedPx, 0.455, 0.885);
  const waffleMask = makeWhiteMask(deluxePx, 0.575, 0.86);

  // Extract Euro backrest pillows (pixels in deluxe upper pillow zone that are crisp white
  // AND visibly different from the day headboard/wall AND NOT already front pillows in day)
  const euroMaskCanvas = document.createElement("canvas");
  euroMaskCanvas.width = MASK_W;
  euroMaskCanvas.height = MASK_H;
  const eCtx = euroMaskCanvas.getContext("2d");
  if (eCtx) {
    const out = eCtx.createImageData(MASK_W, MASK_H);
    const d = out.data;
    const yMin = Math.floor(MASK_H * 0.39);
    const yMax = Math.ceil(MASK_H * 0.56);
    const xMin = Math.floor(MASK_W * 0.315);
    const xMax = Math.ceil(MASK_W * 0.695);

    for (let y = yMin; y < yMax; y++) {
      for (let x = xMin; x < xMax; x++) {
        const idx = (y * MASK_W + x) * 4;
        const dr = deluxePx[idx];
        const dg = deluxePx[idx + 1];
        const db = deluxePx[idx + 2];
        const br = dayPx[idx];
        const bg = dayPx[idx + 1];
        const bb = dayPx[idx + 2];

        const diff = (Math.abs(dr - br) + Math.abs(dg - bg) + Math.abs(db - bb)) / 3;
        const deluxeWarmth = dr - db;
        const dayWarmth = br - bb;
        const deluxeLum = (dr + dg + db) / 3;

        // Pure Euro pillow pixels: neutral white in deluxe, warm wall/wood in day
        // (against cream wall above headboard the brightness diff is smaller ~12-18, while chroma drop is huge!)
        const chromaDrop = dayWarmth - deluxeWarmth;
        const isWhiteInDeluxe = clamp((24 - Math.max(0, deluxeWarmth)) / 10, 0, 1);
        const isNotFrontPillow = clamp((dayWarmth - 16) / 12, 0, 1);
        const diffScore = clamp((Math.max(diff, chromaDrop) - 8) / 12, 0, 1);
        const lumScore = clamp((deluxeLum - 125) / 25, 0, 1);
        const a = Math.round(isWhiteInDeluxe * isNotFrontPillow * diffScore * lumScore * 255);
        if (a > 0) {
          d[idx] = 255;
          d[idx + 1] = 255;
          d[idx + 2] = 255;
          d[idx + 3] = a;
        }
      }
    }
    eCtx.putImageData(out, 0, 0);
  }

  // Pre-bake RGB+Alpha cutout of the Euro pillows at full 1200x896 resolution
  const euroPillowLayer = document.createElement("canvas");
  euroPillowLayer.width = SRC_W;
  euroPillowLayer.height = SRC_H;
  const elCtx = euroPillowLayer.getContext("2d");
  if (elCtx) {
    elCtx.drawImage(deluxe, 0, 0, SRC_W, SRC_H);
    elCtx.globalCompositeOperation = "destination-in";
    elCtx.drawImage(euroMaskCanvas, 0, 0, SRC_W, SRC_H);
    elCtx.globalCompositeOperation = "source-over";
  }

  return {
    beddingMaskDay,
    beddingMaskFolded,
    euroPillowLayer,
    euroPillowMask: euroMaskCanvas,
    waffleMask,
  };
}

/** Builds the canonical source grid & spring-deformed destination grid for our 2.5D bed rig. */
function buildRigGrids(dx: number, dyFoot: number): {
  srcGrid: Point2D[][];
  dstGrid: Point2D[][];
} {
  const coreHalf = 235; // 600 - 365
  const coreScale = (coreHalf + dx) / coreHalf;

  const mapX = (sx: number): number => {
    if (sx <= 0) return 0;
    if (sx >= SRC_W) return SRC_W;
    if (sx <= 195) return (sx / 195) * (195 - dx);
    if (sx <= 365) return sx - dx; // Rigid left nightstand + lamp + left drape/leg
    if (sx <= 835) return 600 + (sx - 600) * coreScale; // Stretchable bed core
    if (sx <= 1005) return sx + dx; // Rigid right drape/leg + nightstand + lamp
    return 1005 + dx + ((sx - 1005) / 195) * (195 - dx);
  };

  const mapY = (sx: number, sy: number): number => {
    if (sy <= 520 || sy >= SRC_H) return sy;
    // Keep wall & nightstands completely grounded on floor; only elongate bed foot region
    const inBed = sx >= 365 && sx <= 835 ? 1 : sx > 195 && sx < 1005 ? 0.55 : 0;
    if (inBed === 0) return sy;
    if (sy <= 667) return sy + dyFoot * 0.25 * (sx >= 365 && sx <= 835 ? 1 : 0);
    if (sy <= 748) return sy + dyFoot * 0.78 * inBed;
    return clamp(sy + dyFoot * inBed, 760, 882);
  };

  const srcGrid: Point2D[][] = [];
  const dstGrid: Point2D[][] = [];
  for (let r = 0; r < SRC_ROWS.length; r++) {
    const sy = SRC_ROWS[r];
    const sRow: Point2D[] = [];
    const dRow: Point2D[] = [];
    for (let c = 0; c < SRC_COLS.length; c++) {
      const sx = SRC_COLS[c];
      sRow.push({ x: sx, y: sy });
      dRow.push({ x: mapX(sx), y: mapY(sx, sy) });
    }
    srcGrid.push(sRow);
    dstGrid.push(dRow);
  }
  return { srcGrid, dstGrid };
}

export function BedStudioConfigurator({
  locale,
  selectedSizeIdx,
  onSelectSizeIdx,
  swatchLabel,
  swatchColor,
  includeEuroPillows,
  onToggleEuroPillows,
  includeWaffleThrow,
  onToggleWaffleThrow,
  formatMoney,
}: BedStudioConfiguratorProps) {
  const isVi = locale === "vi";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);

  const [assetsReady, setAssetsReady] = useState(false);
  const [leftLampOn, setLeftLampOn] = useState(false);
  const [rightLampOn, setRightLampOn] = useState(false);
  const [showDimensions, setShowDimensions] = useState(true);
  const [whiteDuvetContrast, setWhiteDuvetContrast] = useState(false);
  const [duvetFoldTarget, setDuvetFoldTarget] = useState(0); // 0 = closed, 1 = folded open
  const [isDraggingDuvet, setIsDraggingDuvet] = useState(false);
  const [liveStatus, setLiveStatus] = useState("");
  const [priceDeltaPop, setPriceDeltaPop] = useState<{
    text: string;
    nonce: number;
  } | null>(null);

  // Sync UI-overlay dynamic coordinates (updated smoothly inside rAF when springs move)
  const [rigMetrics, setRigMetrics] = useState(() => {
    const init = BED_STUDIO_SIZES[selectedSizeIdx] || BED_STUDIO_SIZES[3];
    return {
      dx: init.dx,
      dyFoot: init.dyFoot,
      widthCm: init.widthCm,
      lengthCm: init.lengthCm,
      fold: 0,
    };
  });

  const assetsRef = useRef<StudioAssets | null>(null);
  const buffersRef = useRef<{
    composed: HTMLCanvasElement;
    tint: HTMLCanvasElement;
    maskUnion: HTMLCanvasElement;
    lampLayer: HTMLCanvasElement;
    foldedTint: HTMLCanvasElement;
  } | null>(null);

  // Spring physics states (all continuously interruptible mid-flight)
  const initSize = BED_STUDIO_SIZES[selectedSizeIdx] || BED_STUDIO_SIZES[3];
  const springsRef = useRef({
    dx: createSpring(initSize.dx),
    dyFoot: createSpring(initSize.dyFoot),
    widthCm: createSpring(initSize.widthCm),
    lengthCm: createSpring(initSize.lengthCm),
    leftLamp: createSpring(0),
    rightLamp: createSpring(0),
    duvetFold: createSpring(0),
    euro: createSpring(includeEuroPillows ? 1 : 0),
    waffle: createSpring(includeWaffleThrow ? 1 : 0),
    contrast: createSpring(0),
    swatchMix: createSpring(1),
  });

  const swatchTransitionRef = useRef<{
    from: SwatchVisual;
    to: SwatchVisual;
    key: string;
  }>({
    from: resolveSwatchVisual(swatchLabel, swatchColor),
    to: resolveSwatchVisual(swatchLabel, swatchColor),
    key: `${swatchLabel}::${swatchColor || ""}`,
  });

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const kickRenderRef = useRef<() => void>(() => {});

  // Load 4 pixel-locked studio images & build chroma/diff alpha masks once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [day, night, deluxe, folded] = await Promise.all([
          loadImg("/sites/brooklinen/configurator/bed-master-day.jpg"),
          loadImg("/sites/brooklinen/configurator/bed-master-night.jpg"),
          loadImg("/sites/brooklinen/configurator/bed-master-deluxe.jpg"),
          loadImg("/sites/brooklinen/configurator/bed-master-folded.jpg"),
        ]);
        if (cancelled) return;

        const masks = buildStudioMasks(day, deluxe, folded);
        assetsRef.current = { day, night, deluxe, folded, ...masks };

        const mkCanvas = () => {
          const c = document.createElement("canvas");
          c.width = SRC_W;
          c.height = SRC_H;
          return c;
        };
        buffersRef.current = {
          composed: mkCanvas(),
          tint: mkCanvas(),
          maskUnion: mkCanvas(),
          lampLayer: mkCanvas(),
          foldedTint: mkCanvas(),
        };
        setAssetsReady(true);
        kickRenderRef.current();
      } catch {
        // Keep base static photo visible if canvas image load fails
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Push targets into springs whenever React props/controls change
  useEffect(() => {
    const spec = BED_STUDIO_SIZES[selectedSizeIdx] || BED_STUDIO_SIZES[3];
    const sp = springsRef.current;
    sp.dx.target = spec.dx;
    sp.dyFoot.target = spec.dyFoot;
    sp.widthCm.target = spec.widthCm;
    sp.lengthCm.target = spec.lengthCm;
    kickRenderRef.current();
  }, [selectedSizeIdx]);

  useEffect(() => {
    const sp = springsRef.current;
    sp.leftLamp.target = leftLampOn ? 1 : 0;
    sp.rightLamp.target = rightLampOn ? 1 : 0;
    kickRenderRef.current();
  }, [leftLampOn, rightLampOn]);

  useEffect(() => {
    springsRef.current.duvetFold.target = duvetFoldTarget;
    kickRenderRef.current();
  }, [duvetFoldTarget]);

  useEffect(() => {
    springsRef.current.euro.target = includeEuroPillows ? 1 : 0;
    kickRenderRef.current();
  }, [includeEuroPillows]);

  useEffect(() => {
    springsRef.current.waffle.target = includeWaffleThrow ? 1 : 0;
    kickRenderRef.current();
  }, [includeWaffleThrow]);

  useEffect(() => {
    springsRef.current.contrast.target = whiteDuvetContrast ? 1 : 0;
    kickRenderRef.current();
  }, [whiteDuvetContrast]);

  useEffect(() => {
    const nextKey = `${swatchLabel}::${swatchColor || ""}`;
    const st = swatchTransitionRef.current;
    if (st.key === nextKey) return;
    const curMix = springsRef.current.swatchMix.value;
    const blendedCurrent: SwatchVisual = {
      base: lerpRgb(st.from.base, st.to.base, curMix),
      stripe: lerpRgb(st.from.stripe, st.to.stripe, curMix),
      pattern: curMix > 0.5 ? st.to.pattern : st.from.pattern,
      patternStrength:
        st.from.patternStrength + (st.to.patternStrength - st.from.patternStrength) * curMix,
    };
    st.from = blendedCurrent;
    st.to = resolveSwatchVisual(swatchLabel, swatchColor);
    st.key = nextKey;
    springsRef.current.swatchMix.value = 0;
    springsRef.current.swatchMix.velocity = 0;
    springsRef.current.swatchMix.target = 1;
    kickRenderRef.current();
  }, [swatchLabel, swatchColor]);

  // Clear temporary price delta badge after 1.6s
  useEffect(() => {
    if (!priceDeltaPop) return;
    const t = setTimeout(() => setPriceDeltaPop(null), 1600);
    return () => clearTimeout(t);
  }, [priceDeltaPop]);

  // Main 2.5D Render Pipeline
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const assets = assetsRef.current;
    const bufs = buffersRef.current;
    if (!canvas || !assets || !bufs) return;

    const sp = springsRef.current;
    const cCtx = bufs.composed.getContext("2d");
    const tCtx = bufs.tint.getContext("2d");
    const mCtx = bufs.maskUnion.getContext("2d");
    const lCtx = bufs.lampLayer.getContext("2d");
    const fCtx = bufs.foldedTint.getContext("2d");
    const outCtx = canvas.getContext("2d");
    if (!cCtx || !tCtx || !mCtx || !lCtx || !fCtx || !outCtx) return;

    const fold = clamp(sp.duvetFold.value, 0, 1);
    const euro = clamp(sp.euro.value, 0, 1);
    const waffle = clamp(sp.waffle.value, 0, 1);
    const leftLamp = clamp(sp.leftLamp.value, 0, 1);
    const rightLamp = clamp(sp.rightLamp.value, 0, 1);
    const contrast = clamp(sp.contrast.value, 0, 1);
    const nightAmbience = Math.max(leftLamp, rightLamp);

    // ------------------------------------------------------------------
    // 1. COMPOSITE BASE BEDROOM + PHOTOGRAPHIC LIGHTING PASS (1200x896)
    // ------------------------------------------------------------------
    cCtx.globalCompositeOperation = "source-over";
    cCtx.globalAlpha = 1;
    cCtx.drawImage(assets.day, 0, 0, SRC_W, SRC_H);

    // 2. RISING EURO BACKREST PILLOWS (depth-sorted cleanly behind front pillows)
    if (euro > 0.005) {
      cCtx.save();
      // Slide upward from behind front pillows (+42px -> 0px) with spring overshoot
      const riseY = (1 - sp.euro.value) * 42;
      cCtx.globalAlpha = clamp(euro * 1.15, 0, 1);
      cCtx.drawImage(assets.euroPillowLayer, 0, riseY, SRC_W, SRC_H);
      cCtx.restore();
    }

    // 3. FOLDED-BACK DUVET + EXPOSED SMOOTH SHEET LAYER (driven by drag handle `fold`)
    const foldEdgeY = 532 + fold * 165; // Rolls from pillow seam (532) down to mid-lower bed (697)
    if (fold > 0.01) {
      // Reveal smooth tucked percale sheet from `folded` pass across upper mattress
      cCtx.save();
      cCtx.beginPath();
      cCtx.rect(200, 510, 800, foldEdgeY - 506);
      cCtx.clip();
      cCtx.globalAlpha = clamp(fold * 1.4, 0, 1);
      cCtx.drawImage(assets.folded, 0, 0, SRC_W, SRC_H);
      cCtx.restore();
    }

    // 4. WAFFLE-WEAVE BED BLANKET ADD-ON (unfolds smoothly over lower duvet)
    if (waffle > 0.01) {
      const waffleTopY = 548 + (1 - waffle) * 195;
      cCtx.save();
      cCtx.beginPath();
      cCtx.rect(190, waffleTopY, 820, 860 - waffleTopY);
      cCtx.clip();
      cCtx.globalAlpha = clamp(waffle * 1.25, 0, 1);
      cCtx.drawImage(assets.deluxe, 0, 0, SRC_W, SRC_H);
      cCtx.restore();
    }

    // 5. LUMINANCE-PRESERVING PBR FABRIC COLOR & PROCEDURAL WOVEN STRIPES
    const st = swatchTransitionRef.current;
    const mix = clamp(sp.swatchMix.value, 0, 1);
    const curBase = lerpRgb(st.from.base, st.to.base, mix);
    const curStripe = lerpRgb(st.from.stripe, st.to.stripe, mix);
    const patAlpha =
      st.from.patternStrength + (st.to.patternStrength - st.from.patternStrength) * mix;
    const activePattern =
      st.to.pattern !== "solid" && mix > 0.15
        ? st.to.pattern
        : st.from.pattern !== "solid"
        ? st.from.pattern
        : "solid";

    const isPureWhite =
      curBase.r > 249 && curBase.g > 249 && curBase.b > 249 && patAlpha < 0.02;

    if (!isPureWhite) {
      const tile = buildFabricPatternCanvas(curBase, curStripe, activePattern, patAlpha);
      const patternObj = tCtx.createPattern(tile, "repeat");

      tCtx.clearRect(0, 0, SRC_W, SRC_H);
      if (patternObj) {
        tCtx.fillStyle = patternObj;
        tCtx.fillRect(0, 0, SRC_W, SRC_H);
      } else {
        tCtx.fillStyle = `rgb(${curBase.r}, ${curBase.g}, ${curBase.b})`;
        tCtx.fillRect(0, 0, SRC_W, SRC_H);
      }

      // Build true UNION of all active bedding masks (front pillows + duvet + rising Euro pillows + folded sheet)
      mCtx.globalCompositeOperation = "source-over";
      mCtx.globalAlpha = 1;
      mCtx.clearRect(0, 0, SRC_W, SRC_H);
      mCtx.drawImage(assets.beddingMaskDay, 0, 0, SRC_W, SRC_H);
      if (euro > 0.01) {
        mCtx.globalAlpha = clamp(euro * 1.15, 0, 1);
        mCtx.drawImage(assets.euroPillowMask, 0, (1 - sp.euro.value) * 42, SRC_W, SRC_H);
        mCtx.globalAlpha = 1;
      }
      if (fold > 0.02) {
        mCtx.drawImage(assets.beddingMaskFolded, 0, 0, SRC_W, SRC_H);
      }

      // Single clean destination-in pass so Euro pillows & sheets are unified (never intersected!)
      tCtx.globalCompositeOperation = "destination-in";
      tCtx.drawImage(bufs.maskUnion, 0, 0, SRC_W, SRC_H);
      tCtx.globalCompositeOperation = "source-over";

      // When Waffle Bed Blanket add-on is draped over the duvet, keep the waffle throw in
      // refined warm ivory-cream (lightly harmonized 25% with sheet tint) for hotel layering contrast!
      if (waffle > 0.01) {
        const waffleTopY = 548 + (1 - waffle) * 195;
        tCtx.save();
        tCtx.globalCompositeOperation = "destination-out";
        const wGrad = tCtx.createLinearGradient(0, waffleTopY - 8, 0, waffleTopY + 18);
        wGrad.addColorStop(0, "rgba(0,0,0,0)");
        wGrad.addColorStop(1, `rgba(0,0,0,${waffle * 0.72})`);
        tCtx.fillStyle = wGrad;
        tCtx.fillRect(160, waffleTopY - 8, 880, 340);
        tCtx.restore();
      }

      // If "White Hotel Duvet Contrast" is active, keep the lower duvet below foldEdgeY crisp white
      // so pulling back the duvet dramatically reveals the colored/striped sheets & pillows!
      if (contrast > 0.01) {
        tCtx.save();
        tCtx.globalCompositeOperation = "destination-out";
        const contrastClipY = fold > 0.02 ? foldEdgeY : 548;
        const grad = tCtx.createLinearGradient(0, contrastClipY - 12, 0, contrastClipY + 18);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, `rgba(0,0,0,${contrast * 0.94})`);
        tCtx.fillStyle = grad;
        tCtx.fillRect(160, contrastClipY - 12, 880, 380);
        tCtx.restore();
      }

      // Apply multiply pass (preserves 100% of real studio cotton creases & shadows)
      cCtx.save();
      cCtx.globalCompositeOperation = "multiply";
      cCtx.globalAlpha = 0.92;
      cCtx.drawImage(bufs.tint, 0, 0);

      // Gentle highlight lift for deep dark colors (Abyss, Slate) so cotton texture never crushes to black
      const darkness = 1 - (curBase.r + curBase.g + curBase.b) / (3 * 255);
      if (darkness > 0.32) {
        cCtx.globalCompositeOperation = "screen";
        cCtx.globalAlpha = darkness * 0.14;
        cCtx.drawImage(bufs.tint, 0, 0);
      }
      cCtx.restore();
    }

    // 6. PHYSICAL ROLLING DUVET CUFF + DYNAMIC CAST CONTACT SHADOW WHEN DRAGGING/FOLDING
    if (fold > 0.015) {
      const cuffH = 44 + fold * 14;
      const cuffTop = foldEdgeY - 8;
      // Soft contact shadow directly above & below the rolled duvet edge
      cCtx.save();
      const shadowGrad = cCtx.createLinearGradient(0, cuffTop - 16, 0, cuffTop + cuffH + 22);
      shadowGrad.addColorStop(0, "rgba(38, 30, 22, 0)");
      shadowGrad.addColorStop(0.22, `rgba(38, 30, 22, ${0.18 * fold})`);
      shadowGrad.addColorStop(0.5, "rgba(38, 30, 22, 0)");
      shadowGrad.addColorStop(0.82, `rgba(38, 30, 22, ${0.22 * fold})`);
      shadowGrad.addColorStop(1, "rgba(38, 30, 22, 0)");
      cCtx.fillStyle = shadowGrad;

      // Clip cast shadow neatly within the mattress/duvet width
      cCtx.beginPath();
      cCtx.moveTo(275, cuffTop - 16);
      cCtx.lineTo(925, cuffTop - 16);
      cCtx.lineTo(960, cuffTop + cuffH + 22);
      cCtx.lineTo(240, cuffTop + cuffH + 22);
      cCtx.closePath();
      cCtx.fill();

      // Draw crisp rolled-back duvet cuff (tinted or white depending on contrast mode)
      fCtx.clearRect(0, 0, SRC_W, SRC_H);
      // Sample the clean horizontal duvet cuff band from `folded` (y: 572..626)
      fCtx.drawImage(assets.folded, 240, 572, 720, 54, 248, cuffTop, 704, cuffH);
      // Softly feather top/bottom edges of the cuff band so it melts seamlessly into the bed
      fCtx.globalCompositeOperation = "destination-in";
      const cuffMask = fCtx.createLinearGradient(0, cuffTop, 0, cuffTop + cuffH);
      cuffMask.addColorStop(0, "rgba(0,0,0,0)");
      cuffMask.addColorStop(0.18, "rgba(0,0,0,0.96)");
      cuffMask.addColorStop(0.84, "rgba(0,0,0,0.96)");
      cuffMask.addColorStop(1, "rgba(0,0,0,0)");
      fCtx.fillStyle = cuffMask;
      fCtx.fillRect(240, cuffTop, 720, cuffH);

      // Tint the rolled cuff lightly when matching full set (keep crisp white in contrast mode)
      if (!isPureWhite && contrast < 0.95) {
        fCtx.globalCompositeOperation = "multiply";
        fCtx.globalAlpha = (1 - contrast) * 0.88;
        fCtx.fillStyle = `rgb(${curBase.r}, ${curBase.g}, ${curBase.b})`;
        fCtx.fillRect(240, cuffTop, 720, cuffH);
      }
      fCtx.globalCompositeOperation = "source-over";
      fCtx.globalAlpha = 1;

      cCtx.globalAlpha = clamp(fold * 1.35, 0, 1);
      cCtx.drawImage(bufs.foldedTint, 0, 0);
      cCtx.restore();
    }

    // 7. INDEPENDENT LEFT & RIGHT BEDSIDE LAMP RAYTRACED EVENING PASS
    if (nightAmbience > 0.005) {
      // First dim the daytime scene softly into cozy twilight proportional to nightAmbience
      cCtx.save();
      cCtx.globalCompositeOperation = "multiply";
      cCtx.fillStyle = `rgba(116, 102, 88, ${nightAmbience * 0.82})`;
      cCtx.fillRect(0, 0, SRC_W, SRC_H);
      cCtx.restore();

      // Build soft feathered illumination mask for whichever lamp(s) are ON
      lCtx.clearRect(0, 0, SRC_W, SRC_H);
      lCtx.drawImage(assets.night, 0, 0, SRC_W, SRC_H);

      // If bedding is colored, multiply the exact color onto the night pass bedding too so
      // colored sheets glow warmly under the 2700K golden lamps instead of reverting to white!
      if (!isPureWhite) {
        lCtx.save();
        lCtx.globalCompositeOperation = "multiply";
        lCtx.globalAlpha = 0.88;
        lCtx.drawImage(bufs.tint, 0, 0);
        lCtx.restore();
      }

      // Compute combined spatial mask of left lamp + right lamp
      if (leftLamp < 0.99 || rightLamp < 0.99) {
        lCtx.save();
        lCtx.globalCompositeOperation = "destination-in";
        if (leftLamp > 0.005) {
          const gL = lCtx.createRadialGradient(296, 422, 40, 296, 460, 680);
          gL.addColorStop(0, `rgba(255,255,255,${leftLamp})`);
          gL.addColorStop(0.55, `rgba(255,255,255,${leftLamp * 0.92})`);
          gL.addColorStop(1, "rgba(255,255,255,0)");
          lCtx.fillStyle = gL;
          lCtx.fillRect(0, 0, SRC_W, SRC_H);
        }
        if (rightLamp > 0.005) {
          lCtx.globalCompositeOperation =
            leftLamp > 0.005 ? "source-over" : "destination-in";
          // When both are partially transitioning, blend cleanly using full-alpha screen below
        }
        lCtx.restore();
      }

      // Clean two-lamp independent compositing
      if (leftLamp > 0.005 && rightLamp > 0.005 && Math.abs(leftLamp - rightLamp) < 0.03) {
        // Both lamps in sync -> direct full-scene blend (zero radial seams!)
        cCtx.save();
        cCtx.globalAlpha = leftLamp;
        cCtx.drawImage(bufs.lampLayer, 0, 0);
        cCtx.restore();
      } else {
        // Draw each lamp's lit contribution independently through a wide soft radial cone
        const drawSingleLamp = (cx: number, cy: number, intensity: number) => {
          if (intensity <= 0.005) return;
          lCtx.clearRect(0, 0, SRC_W, SRC_H);
          lCtx.drawImage(assets.night, 0, 0, SRC_W, SRC_H);
          if (!isPureWhite) {
            lCtx.save();
            lCtx.globalCompositeOperation = "multiply";
            lCtx.globalAlpha = 0.88;
            lCtx.drawImage(bufs.tint, 0, 0);
            lCtx.restore();
          }
          lCtx.globalCompositeOperation = "destination-in";
          const rad = lCtx.createRadialGradient(cx, cy, 45, cx, cy + 50, 740);
          rad.addColorStop(0, `rgba(255,255,255,${intensity})`);
          rad.addColorStop(0.45, `rgba(255,255,255,${intensity * 0.88})`);
          rad.addColorStop(0.85, `rgba(255,255,255,${intensity * 0.25})`);
          rad.addColorStop(1, "rgba(255,255,255,0)");
          lCtx.fillStyle = rad;
          lCtx.fillRect(0, 0, SRC_W, SRC_H);
          lCtx.globalCompositeOperation = "source-over";

          cCtx.save();
          cCtx.globalCompositeOperation = "lighten";
          cCtx.drawImage(bufs.lampLayer, 0, 0);
          cCtx.restore();
        };
        drawSingleLamp(296, 418, leftLamp);
        drawSingleLamp(908, 418, rightLamp);
      }
    }

    // ------------------------------------------------------------------
    // 8. WARP UNIFIED 1200x896 STAGE THROUGH RIGGED 2D TRIANGLE IMAGE MESH
    // ------------------------------------------------------------------
    outCtx.clearRect(0, 0, SRC_W, SRC_H);
    const { srcGrid, dstGrid } = buildRigGrids(sp.dx.value, sp.dyFoot.value);
    drawDeformedMeshGrid(outCtx, bufs.composed, srcGrid, dstGrid);
  }, []);

  // Interruptible rAF loop — runs only while springs are moving, sleeps at 0% CPU when settled!
  useEffect(() => {
    const step = (now: number) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dt = lastTimeRef.current ? (now - lastTimeRef.current) / 1000 : 1 / 60;
      lastTimeRef.current = now;

      const sp = springsRef.current;
      let moving = false;
      moving = stepSpring(sp.dx, dt, 185, 22, reduced) || moving;
      moving = stepSpring(sp.dyFoot, dt, 185, 22, reduced) || moving;
      moving = stepSpring(sp.widthCm, dt, 185, 24, reduced) || moving;
      moving = stepSpring(sp.lengthCm, dt, 185, 24, reduced) || moving;
      moving = stepSpring(sp.leftLamp, dt, 150, 22, reduced) || moving;
      moving = stepSpring(sp.rightLamp, dt, 150, 22, reduced) || moving;
      moving = stepSpring(sp.duvetFold, dt, 210, 24, reduced) || moving;
      moving = stepSpring(sp.euro, dt, 195, 20, reduced) || moving;
      moving = stepSpring(sp.waffle, dt, 175, 22, reduced) || moving;
      moving = stepSpring(sp.contrast, dt, 180, 22, reduced) || moving;
      moving = stepSpring(sp.swatchMix, dt, 145, 22, reduced) || moving;

      renderFrame();
      setRigMetrics({
        dx: sp.dx.value,
        dyFoot: sp.dyFoot.value,
        widthCm: Math.round(sp.widthCm.value),
        lengthCm: Math.round(sp.lengthCm.value),
        fold: clamp(sp.duvetFold.value, 0, 1),
      });

      if (moving) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        lastTimeRef.current = 0;
      }
    };

    kickRenderRef.current = () => {
      if (rafRef.current !== null) return;
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(step);
    };

    if (assetsReady) kickRenderRef.current();

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [assetsReady, renderFrame]);

  // Step bed size up or down with floating price delta pop (homage to Daria's Shelving Unit)
  const stepSize = (dir: -1 | 1) => {
    const nextIdx = clamp(selectedSizeIdx + dir, 0, BED_STUDIO_SIZES.length - 1);
    if (nextIdx === selectedSizeIdx) return;
    const prevSpec = BED_STUDIO_SIZES[selectedSizeIdx];
    const nextSpec = BED_STUDIO_SIZES[nextIdx];
    const diffUsd = nextSpec.delta - prevSpec.delta;
    onSelectSizeIdx(nextIdx);
    if (diffUsd !== 0) {
      const sign = diffUsd > 0 ? "+" : "−";
      setPriceDeltaPop({
        text: `${sign}${formatMoney(Math.abs(diffUsd), locale)}`,
        nonce: Date.now(),
      });
    }
    setLiveStatus(
      isVi
        ? `Đã đổi kích cỡ giường sang ${translateSize(nextSpec.label, locale)} (${nextSpec.widthCm} × ${nextSpec.lengthCm} cm)`
        : `Bed size changed to ${nextSpec.label} (${nextSpec.widthCm} × ${nextSpec.lengthCm} cm)`
    );
  };

  // Dedicated accessible duvet drag handle (modern-web-guidance: drag)
  const foldFromClientY = (clientY: number): number => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || rect.height === 0) return duvetFoldTarget;
    const relY = (clientY - rect.top) / rect.height;
    // Map canvas normalized Y [0.585 .. 0.785] -> fold [0 .. 1]
    return clamp((relY - 0.585) / 0.2, 0, 1);
  };

  const handleDuvetPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingDuvet(true);
    const f = foldFromClientY(e.clientY);
    setDuvetFoldTarget(f);
  };

  const handleDuvetPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const f = foldFromClientY(e.clientY);
    setDuvetFoldTarget(f);
  };

  const handleDuvetPointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDraggingDuvet(false);
    const pct = Math.round(duvetFoldTarget * 100);
    setLiveStatus(
      isVi
        ? pct > 15
          ? `Đã kéo mở chăn ${pct}% để lộ lớp ga bên dưới`
          : "Đã kéo chăn đắp gọn lên"
        : pct > 15
        ? `Duvet folded back ${pct}% revealing sheet layer`
        : "Duvet pulled up"
    );
  };

  const handleDuvetKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = clamp(duvetFoldTarget + 0.2, 0, 1);
      setDuvetFoldTarget(next);
      setLiveStatus(
        isVi
          ? `Mở chăn ${Math.round(next * 100)}%`
          : `Duvet folded back ${Math.round(next * 100)}%`
      );
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = clamp(duvetFoldTarget - 0.2, 0, 1);
      setDuvetFoldTarget(next);
      setLiveStatus(
        isVi
          ? `Mở chăn ${Math.round(next * 100)}%`
          : `Duvet folded back ${Math.round(next * 100)}%`
      );
    }
  };

  const toggleDuvetFoldQuick = () => {
    const opening = duvetFoldTarget < 0.45;
    setDuvetFoldTarget(opening ? 0.85 : 0);
    setLiveStatus(
      isVi
        ? opening
          ? "Đã kéo mở chăn để xem lớp ga bên dưới"
          : "Đã kéo chăn đắp gọn lại"
        : opening
        ? "Folded duvet back to reveal fitted sheet"
        : "Pulled duvet neatly up"
    );
  };

  const activeSize = BED_STUDIO_SIZES[selectedSizeIdx] || BED_STUDIO_SIZES[3];
  const anyLampOn = leftLampOn || rightLampOn;

  // Normalized live overlay anchor coordinates (track the rigged bones 1-to-1!)
  const bedLeftPct = ((270 - rigMetrics.dx) / SRC_W) * 100;
  const bedRightPct = ((930 + rigMetrics.dx) / SRC_W) * 100;
  const bedFootPct = ((834 + rigMetrics.dyFoot) / SRC_H) * 100;
  const leftLampPct = ((230 - rigMetrics.dx) / SRC_W) * 100;
  const rightLampPct = ((974 + rigMetrics.dx) / SRC_W) * 100;
  const duvetHandleTopPct = ((545 + rigMetrics.fold * 165) / SRC_H) * 100;

  return (
    <div className="flex flex-col gap-3">
      {/* ================= INTERACTIVE 2.5D STUDIO STAGE ================= */}
      <div
        ref={stageRef}
        className="relative aspect-[1200/896] w-full overflow-hidden rounded-2xl border border-[#E5E0DB] bg-[#E8DFD3] shadow-xs"
      >
        {/* Static LCP fallback image visible instantly before Canvas initializes */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sites/brooklinen/configurator/bed-master-day.jpg"
          alt={
            isVi
              ? `Mô phỏng 2.5D Bộ Ga Giường Classic Percale Core - ${translateColor(swatchLabel, locale)} - cỡ ${translateSize(activeSize.label, locale)}`
              : `2.5D Interactive Preview - Classic Percale Core Sheet Set - ${swatchLabel} - ${activeSize.label}`
          }
          width={SRC_W}
          height={SRC_H}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            assetsReady ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Real-time 60fps 2D Triangle Image-Mesh Canvas */}
        <canvas
          ref={canvasRef}
          width={SRC_W}
          height={SRC_H}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
            assetsReady ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Subtle interactive studio badge (top-left) */}
        <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#1C243B]/78 px-3 py-1 text-[11px] font-bold tracking-[0.04em] text-white backdrop-blur-xs">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#86EFAC]"
          />
          <span>{isVi ? "MÔ PHỎNG 2.5D TRỰC TIẾP" : "LIVE 2.5D STUDIO"}</span>
        </div>

        {/* Live Color & Size pill (top-right) */}
        <div className="pointer-events-none absolute top-3 right-3 hidden items-center gap-2 rounded-full bg-white/88 px-3 py-1 text-[11.5px] font-bold text-[#283455] shadow-xs backdrop-blur-xs sm:inline-flex">
          <span>{translateColor(swatchLabel, locale)}</span>
          <span aria-hidden="true" className="text-[#9AA3B5]">
            ·
          </span>
          <span>{translateSize(activeSize.label, locale)}</span>
        </div>

        {/* ---- ON-STAGE SIZE STEPPER (- / +) + PRICE DELTA POP (like Daria's Shelving Unit) ---- */}
        <div className="absolute top-[22%] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5">
          {priceDeltaPop && (
            <span
              key={priceDeltaPop.nonce}
              className="bkl-delta-pop pointer-events-none absolute -top-8 left-1/2 rounded-full bg-[#1C243B] px-2.5 py-0.5 text-[11.5px] font-bold whitespace-nowrap text-white shadow-md"
            >
              {priceDeltaPop.text}
            </span>
          )}
          <div
            role="group"
            aria-label={isVi ? "Đổi nhanh kích cỡ giường" : "Quick bed size stepper"}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/92 p-1 shadow-md backdrop-blur-xs"
          >
            <button
              type="button"
              disabled={selectedSizeIdx <= 0}
              onClick={() => stepSize(-1)}
              aria-label={isVi ? "Thu nhỏ cỡ giường" : "Smaller bed size"}
              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#283455] text-[15px] leading-none font-bold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-35"
            >
              &minus;
            </button>
            <span className="min-w-[68px] px-1 text-center text-[11.5px] font-bold text-[#283455]">
              {translateSize(activeSize.label, locale)}
            </span>
            <button
              type="button"
              disabled={selectedSizeIdx >= BED_STUDIO_SIZES.length - 1}
              onClick={() => stepSize(1)}
              aria-label={isVi ? "Mở rộng cỡ giường" : "Larger bed size"}
              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#283455] text-[15px] leading-none font-bold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-35"
            >
              +
            </button>
          </div>
        </div>

        {/* ---- ON-STAGE LEFT & RIGHT BEDSIDE LAMP ON/OFF TOGGLES (like Daria's Wardrobe!) ---- */}
        <button
          type="button"
          aria-pressed={leftLampOn}
          onClick={() => {
            setLeftLampOn((v) => !v);
            setLiveStatus(
              isVi
                ? !leftLampOn
                  ? "Đã bật đèn ngủ bên trái"
                  : "Đã tắt đèn ngủ bên trái"
                : !leftLampOn
                ? "Left bedside lamp turned on"
                : "Left bedside lamp turned off"
            );
          }}
          style={{ left: `${clamp(leftLampPct, 6, 32)}%`, top: "47%" }}
          className={`bkl-spring-pill absolute z-10 inline-flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border text-[10.5px] font-bold shadow-md transition-colors ${
            leftLampOn
              ? "border-[#FCD34D] bg-[#FEF3C7] text-[#92400E]"
              : "border-white/70 bg-[#1C243B]/72 text-white hover:bg-[#1C243B]"
          }`}
          title={isVi ? "Bật/tắt đèn ngủ trái" : "Toggle left bedside lamp"}
        >
          {leftLampOn ? "On" : "Off"}
        </button>

        <button
          type="button"
          aria-pressed={rightLampOn}
          onClick={() => {
            setRightLampOn((v) => !v);
            setLiveStatus(
              isVi
                ? !rightLampOn
                  ? "Đã bật đèn ngủ bên phải"
                  : "Đã tắt đèn ngủ bên phải"
                : !rightLampOn
                ? "Right bedside lamp turned on"
                : "Right bedside lamp turned off"
            );
          }}
          style={{ left: `${clamp(rightLampPct, 68, 94)}%`, top: "47%" }}
          className={`bkl-spring-pill absolute z-10 inline-flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border text-[10.5px] font-bold shadow-md transition-colors ${
            rightLampOn
              ? "border-[#FCD34D] bg-[#FEF3C7] text-[#92400E]"
              : "border-white/70 bg-[#1C243B]/72 text-white hover:bg-[#1C243B]"
          }`}
          title={isVi ? "Bật/tắt đèn ngủ phải" : "Toggle right bedside lamp"}
        >
          {rightLampOn ? "On" : "Off"}
        </button>

        {/* ---- DEDICATED ACCESSIBLE DRAGGABLE DUVET FOLD HANDLE (like Daria's Sliding Door!) ---- */}
        {assetsReady && (
          <button
            ref={handleRef}
            type="button"
            onPointerDown={handleDuvetPointerDown}
            onPointerMove={handleDuvetPointerMove}
            onPointerUp={handleDuvetPointerUp}
            onLostPointerCapture={() => setIsDraggingDuvet(false)}
            onKeyDown={handleDuvetKeyDown}
            aria-label={
              isVi
                ? "Tay nắm kéo mở chăn xem lớp ga bên dưới. Kéo lên xuống hoặc dùng phím mũi tên lên xuống."
                : "Drag handle to fold duvet back and reveal sheet underneath. Drag vertically or use arrow keys."
            }
            style={{ left: "50%", top: `${duvetHandleTopPct}%` }}
            className={`bkl-duvet-handle absolute z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-[#283455]/25 bg-white/94 px-3 py-1 text-[11px] font-bold text-[#283455] shadow-md backdrop-blur-xs hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#283455] ${
              isDraggingDuvet ? "dragging ring-2 ring-[#283455]/30" : ""
            }`}
          >
            <span aria-hidden="true" className="text-[12px] leading-none">
              ↕
            </span>
            <span>
              {duvetFoldTarget > 0.25
                ? isVi
                  ? "Kéo chăn lên"
                  : "Pull duvet up"
                : isVi
                ? "Kéo mở chăn"
                : "Drag to fold"}
            </span>
          </button>
        )}

        {/* ---- LIVE ARCHITECTURAL DIMENSION LINES (like Daria's Lamp & Shelf!) ---- */}
        {showDimensions && (
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${SRC_W} ${SRC_H}`}
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {(() => {
              const xL = 270 - rigMetrics.dx;
              const xR = 930 + rigMetrics.dx;
              const yW = Math.min(866, 840 + rigMetrics.dyFoot);
              const xLen = Math.min(1145, xR + 46);
              const yLenTop = 534;
              const yLenBot = Math.min(830, 810 + rigMetrics.dyFoot);
              const stroke = anyLampOn ? "rgba(255, 248, 232, 0.86)" : "rgba(40, 52, 85, 0.78)";
              const pillBg = anyLampOn ? "rgba(28, 36, 59, 0.82)" : "rgba(255, 255, 255, 0.88)";
              const pillText = anyLampOn ? "#FFF8E8" : "#283455";
              return (
                <>
                  {/* Horizontal Width Dimension Line */}
                  <line x1={xL} y1={yW} x2={xR} y2={yW} stroke={stroke} strokeWidth="2" />
                  <line x1={xL} y1={yW - 7} x2={xL} y2={yW + 7} stroke={stroke} strokeWidth="2" />
                  <line x1={xR} y1={yW - 7} x2={xR} y2={yW + 7} stroke={stroke} strokeWidth="2" />
                  <rect
                    x={(xL + xR) / 2 - 44}
                    y={yW - 14}
                    width="88"
                    height="26"
                    rx="13"
                    fill={pillBg}
                  />
                  <text
                    x={(xL + xR) / 2}
                    y={yW + 4}
                    textAnchor="middle"
                    fill={pillText}
                    fontSize="15"
                    fontWeight="700"
                    fontFamily="Be Vietnam Pro, system-ui, sans-serif"
                  >
                    {rigMetrics.widthCm} cm
                  </text>

                  {/* Vertical Mattress Length Dimension Line */}
                  <line x1={xLen} y1={yLenTop} x2={xLen} y2={yLenBot} stroke={stroke} strokeWidth="2" />
                  <line x1={xLen - 7} y1={yLenTop} x2={xLen + 7} y2={yLenTop} stroke={stroke} strokeWidth="2" />
                  <line x1={xLen - 7} y1={yLenBot} x2={xLen + 7} y2={yLenBot} stroke={stroke} strokeWidth="2" />
                  <rect
                    x={xLen - 42}
                    y={(yLenTop + yLenBot) / 2 - 13}
                    width="84"
                    height="26"
                    rx="13"
                    fill={pillBg}
                  />
                  <text
                    x={xLen}
                    y={(yLenTop + yLenBot) / 2 + 5}
                    textAnchor="middle"
                    fill={pillText}
                    fontSize="14.5"
                    fontWeight="700"
                    fontFamily="Be Vietnam Pro, system-ui, sans-serif"
                  >
                    {rigMetrics.lengthCm} cm
                  </text>
                </>
              );
            })()}
          </svg>
        )}

        {/* Bottom-left Dimensions switch pill (homage to Daria's Lamp `dimensions` toggle) */}
        <button
          type="button"
          aria-pressed={showDimensions}
          onClick={() => setShowDimensions((v) => !v)}
          className={`absolute bottom-3 left-3 z-10 inline-flex min-h-[32px] cursor-pointer items-center gap-1.5 rounded-full px-3 text-[11.5px] font-bold shadow-xs backdrop-blur-xs transition-colors ${
            showDimensions
              ? "bg-[#283455]/90 text-white"
              : "bg-white/88 text-[#283455] hover:bg-white"
          }`}
        >
          <span aria-hidden="true">↔</span>
          <span>{isVi ? "Kích thước" : "Dimensions"}</span>
        </button>

        {/* Hidden accessibility anchor summary for width/length */}
        <span className="visually-hidden">
          {`${bedLeftPct.toFixed(0)} ${bedRightPct.toFixed(0)} ${bedFootPct.toFixed(0)}`}
        </span>
      </div>

      {/* ================= COMPACT TACTILE INTERACTION DOCK ================= */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#E5E0DB] bg-white p-3">
        {/* 1-click duvet fold button (single-pointer alternative to dragging per WCAG / drag guide) */}
        <button
          type="button"
          aria-pressed={duvetFoldTarget > 0.25}
          onClick={toggleDuvetFoldQuick}
          className={`inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-bold transition-colors ${
            duvetFoldTarget > 0.25
              ? "border-[#283455] bg-[#283455] text-white"
              : "border-[#D4D8E0] bg-[#FDFAF8] text-[#283455] hover:border-[#283455]"
          }`}
        >
          <span aria-hidden="true">↕</span>
          <span>
            {duvetFoldTarget > 0.25
              ? isVi
                ? "Đắp gọn chăn"
                : "Close duvet"
              : isVi
              ? "Mở chăn xem lớp ga"
              : "Fold duvet back"}
          </span>
        </button>

        {/* White hotel duvet contrast styling */}
        <button
          type="button"
          aria-pressed={whiteDuvetContrast}
          onClick={() => {
            const next = !whiteDuvetContrast;
            setWhiteDuvetContrast(next);
            if (next && duvetFoldTarget < 0.3) setDuvetFoldTarget(0.75);
          }}
          className={`inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-bold transition-colors ${
            whiteDuvetContrast
              ? "border-[#283455] bg-[#283455] text-white"
              : "border-[#D4D8E0] bg-[#FDFAF8] text-[#283455] hover:border-[#283455]"
          }`}
        >
          <span aria-hidden="true">◧</span>
          <span>{isVi ? "Phối vỏ chăn trắng" : "White duvet contrast"}</span>
        </button>

        {/* Add-on 1: +2 Euro Backrest Pillows */}
        <button
          type="button"
          aria-pressed={includeEuroPillows}
          onClick={() => onToggleEuroPillows(!includeEuroPillows)}
          className={`inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-bold transition-colors ${
            includeEuroPillows
              ? "border-[#283455] bg-[#283455] text-white"
              : "border-[#D4D8E0] bg-[#FDFAF8] text-[#283455] hover:border-[#283455]"
          }`}
        >
          <span>
            {includeEuroPillows ? "✓ " : "+ "}
            {isVi ? "2 Gối tựa Euro" : "2 Euro Pillows"}
          </span>
          <span
            className={`text-[11px] ${
              includeEuroPillows ? "text-white/80" : "text-[#5B647A]"
            }`}
          >
            +{formatMoney(EURO_PILLOWS_ADDON_USD, locale)}
          </span>
        </button>

        {/* Add-on 2: +Waffle Bed Blanket */}
        <button
          type="button"
          aria-pressed={includeWaffleThrow}
          onClick={() => onToggleWaffleThrow(!includeWaffleThrow)}
          className={`inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-bold transition-colors ${
            includeWaffleThrow
              ? "border-[#283455] bg-[#283455] text-white"
              : "border-[#D4D8E0] bg-[#FDFAF8] text-[#283455] hover:border-[#283455]"
          }`}
        >
          <span>
            {includeWaffleThrow ? "✓ " : "+ "}
            {isVi ? "Chăn phủ Waffle" : "Waffle Blanket"}
          </span>
          <span
            className={`text-[11px] ${
              includeWaffleThrow ? "text-white/80" : "text-[#5B647A]"
            }`}
          >
            +{formatMoney(WAFFLE_THROW_ADDON_USD, locale)}
          </span>
        </button>

        {/* Quick Day / Night ambience button */}
        <button
          type="button"
          aria-pressed={anyLampOn}
          onClick={() => {
            const turnOn = !anyLampOn;
            setLeftLampOn(turnOn);
            setRightLampOn(turnOn);
          }}
          className={`ml-auto inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-bold transition-colors ${
            anyLampOn
              ? "border-[#D97706] bg-[#FEF3C7] text-[#92400E]"
              : "border-[#D4D8E0] bg-[#FDFAF8] text-[#283455] hover:border-[#283455]"
          }`}
        >
          <span aria-hidden="true">{anyLampOn ? "🌙" : "☀️"}</span>
          <span>
            {anyLampOn
              ? isVi
                ? "Đèn ngủ 2700K"
                : "2700K Night"
              : isVi
              ? "Ánh sáng ngày"
              : "Daylight"}
          </span>
        </button>
      </div>

      {/* Screen-reader live region announcing size/fold/lamp state changes */}
      <div className="visually-hidden" aria-live="polite">
        {liveStatus}
      </div>
    </div>
  );
}
