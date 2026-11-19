import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const PROJECT_ROOT = "/Users/trung9870/.gemini/antigravity/scratch/brooklinen-clone";
const RESEARCH_DIR = path.join(PROJECT_ROOT, "docs/research/brooklinen");
const PUBLIC_SITE_DIR = path.join(PROJECT_ROOT, "public/sites/brooklinen");

const mobileData = JSON.parse(fs.readFileSync(path.join(RESEARCH_DIR, "inspection-mobile.json"), "utf8"));
const deepData = JSON.parse(fs.readFileSync(path.join(RESEARCH_DIR, "site-data-deep.json"), "utf8"));
const menusSwatches = JSON.parse(fs.readFileSync(path.join(RESEARCH_DIR, "menus-and-swatches.json"), "utf8"));

function normalizeUrl(url) {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("/")) return "https://www.brooklinen.com" + url;
  if (!url.startsWith("http")) return null;
  return url;
}

function detectExtFromBuffer(buf, contentType, fallbackUrl) {
  const ct = (contentType || "").toLowerCase();
  if (buf.length >= 12) {
    // AVIF / MP4 (ISO BMFF)
    const ftyp = buf.subarray(4, 12).toString("ascii");
    if (ftyp.startsWith("ftypavif") || ftyp.startsWith("ftypavis")) return ".avif";
    if (ftyp.startsWith("ftyp")) return ".mp4";
    // WebP
    if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return ".webp";
    // PNG
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return ".png";
    // JPEG
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return ".jpg";
    // WOFF2
    if (buf.subarray(0, 4).toString("ascii") === "wOF2") return ".woff2";
    // OTF / TTF
    if (buf.subarray(0, 4).toString("ascii") === "OTTO") return ".otf";
    if (buf[0] === 0x00 && buf[1] === 0x01 && buf[2] === 0x00 && buf[3] === 0x00) return ".ttf";
  }
  const head = buf.subarray(0, 256).toString("utf8").trimStart();
  if (head.startsWith("<svg") || head.startsWith("<?xml") || ct.includes("svg")) return ".svg";
  if (ct.includes("avif")) return ".avif";
  if (ct.includes("webp")) return ".webp";
  if (ct.includes("png")) return ".png";
  if (ct.includes("jpeg") || ct.includes("jpg")) return ".jpg";
  if (ct.includes("mp4")) return ".mp4";
  if (ct.includes("woff2")) return ".woff2";
  if (ct.includes("opentype") || ct.includes("otf")) return ".otf";
  const urlPath = new URL(fallbackUrl).pathname;
  const ext = path.extname(urlPath).toLowerCase();
  return ext || ".bin";
}

function slugFromUrl(url, prefix) {
  const u = new URL(url);
  const base = path.basename(u.pathname, path.extname(u.pathname))
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 8);
  return `${prefix ? prefix + "-" : ""}${base || "asset"}-${hash}`;
}

// Collect download queue: { url, dir, preferredName }
const tasks = new Map();
function enqueue(rawUrl, subDir, preferredName = null, upgradeWidth = null) {
  let url = normalizeUrl(rawUrl);
  if (!url) return null;
  let fetchUrl = url;
  if (upgradeWidth && /[?&]width=\d+/.test(fetchUrl)) {
    fetchUrl = fetchUrl.replace(/([?&]width=)\d+/, `$1${upgradeWidth}`);
  }
  if (!tasks.has(url)) {
    tasks.set(url, { originalUrl: url, fetchUrl, subDir, preferredName });
  }
  return url;
}

// 1. Fonts
enqueue("https://www.brooklinen.com/cdn/shop/files/f__BrandonTextRegular.woff2?v=2923255800735255676", "fonts", "BrandonTextRegular");
enqueue("https://www.brooklinen.com/cdn/shop/files/wf_BrandonTextWeb-Medium--360967_B_0.woff2?v=18048165408412969505", "fonts", "BrandonTextMedium");
enqueue("https://www.brooklinen.com/cdn/shop/files/f__BrandonTextBold.woff2?v=9945025441678652657", "fonts", "BrandonTextBold");
enqueue("https://www.brooklinen.com/cdn/shop/files/f__BrandonTextWeb-Italic--360967_8_0.woff2?v=13318003604299643776", "fonts", "BrandonTextItalic");
enqueue("https://www.brooklinen.com/cdn/shop/files/ToledoSerial-Bold.otf?v=1751402923", "fonts", "ToledoSerialBold");

// 2. Brand assets
if (deepData.header?.logoImg?.src) {
  enqueue(deepData.header.logoImg.src, "brand", "brooklinen-logo");
}
enqueue("https://www.brooklinen.com/cdn/shop/files/BEST._SHEETS._EVER._Lockup.svg?v=1785445569&width=600", "brand", "best-sheets-ever-lockup");
enqueue("https://www.brooklinen.com/cdn/shop/files/40_off_Badge.png?v=1750176995&width=184", "brand", "badge-40-off");

// 3. Videos & posters (desktop + mobile)
for (const v of [...(deepData.heroPrimary?.videos || []), ...(deepData.heroSheets?.videos || [])]) {
  if (v.currentSrc) enqueue(v.currentSrc, "videos");
  if (v.poster) enqueue(v.poster, "videos");
  for (const s of v.sources || []) {
    if (s.src) enqueue(s.src, "videos");
  }
}
for (const secIdx of [0, 7]) {
  for (const v of mobileData.sections?.[secIdx]?.videos || []) {
    if (v.currentSrc) enqueue(v.currentSrc, "videos");
    if (v.poster) enqueue(v.poster, "videos");
  }
}

// 4. Mini Hero banners (desktop & mobile)
enqueue("https://www.brooklinen.com/cdn/shop/files/MiniHero_Desktop_WO.jpg?v=1793917996&width=2000", "banners", "mini-hero-desktop");
enqueue("https://www.brooklinen.com/cdn/shop/files/MiniHero_Mobile_WO.jpg?v=1793917996&width=800", "banners", "mini-hero-mobile");

// 5. Shop by Category images (upgrade width=300 -> 600 for sharp retina)
for (const c of deepData.shopByCategory?.cards || []) {
  if (c.img) enqueue(c.img, "categories", null, 600);
}

// 6. New & Trending images (upgrade width=450 -> 800)
for (const c of deepData.newAndTrending?.cards || []) {
  if (c.img) enqueue(c.img, "trending", null, 800);
}

// 7. Press logos
for (const l of deepData.press?.logos || []) {
  if (l.src) enqueue(l.src, "press", null, 400);
}

// 8. Product carousels (product imgs + hover imgs + awards)
for (const key of ["carouselBestOfSale", "carouselGiftGuide", "carouselCollection"]) {
  for (const card of deepData[key]?.cards || []) {
    if (card.awardImg?.src) enqueue(card.awardImg.src, "awards");
    for (const im of card.productImgs || []) {
      if (im.src) enqueue(im.src, "products");
    }
  }
}

// 9. Clicked swatch variant product images
for (const arr of Object.values(deepData.swatchSamples || {})) {
  for (const item of arr) {
    for (const v of item.variants || []) {
      if (v.mainImg) enqueue(v.mainImg, "products");
      if (v.hoverImg) enqueue(v.hoverImg, "products");
    }
  }
}

// 10. Swatch pattern thumbnail images
for (const key of ["swatchesBestOfSale", "swatchesGiftGuide", "swatchesCollection"]) {
  for (const card of menusSwatches[key] || []) {
    for (const sw of card.swatches || []) {
      if (sw.imgSrc) enqueue(sw.imgSrc, "swatches");
    }
  }
}

console.log(`Queued ${tasks.size} unique assets for download.`);

async function downloadOne(item) {
  const targetDir = path.join(PUBLIC_SITE_DIR, item.subDir);
  fs.mkdirSync(targetDir, { recursive: true });
  const res = await fetch(item.fetchUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Referer: "https://www.brooklinen.com/",
      Accept: "*/*",
    },
  });
  if (!res.ok) {
    // fallback to originalUrl if upgraded width failed
    if (item.fetchUrl !== item.originalUrl) {
      const res2 = await fetch(item.originalUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Referer: "https://www.brooklinen.com/",
        },
      });
      if (!res2.ok) throw new Error(`HTTP ${res2.status} for ${item.originalUrl}`);
      const buf = Buffer.from(await res2.arrayBuffer());
      return saveBuffer(item, buf, res2.headers.get("content-type"), targetDir);
    }
    throw new Error(`HTTP ${res.status} for ${item.fetchUrl}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 32) throw new Error(`Empty/tiny body (${buf.length} bytes) for ${item.fetchUrl}`);
  return saveBuffer(item, buf, res.headers.get("content-type"), targetDir);
}

function saveBuffer(item, buf, contentType, targetDir) {
  const ext = detectExtFromBuffer(buf, contentType, item.fetchUrl);
  const baseName = item.preferredName || slugFromUrl(item.originalUrl, "");
  const fileName = `${baseName}${ext}`;
  const absPath = path.join(targetDir, fileName);
  fs.writeFileSync(absPath, buf);
  return {
    originalUrl: item.originalUrl,
    fetchUrl: item.fetchUrl,
    localPath: `/sites/brooklinen/${item.subDir}/${fileName}`,
    contentType: contentType || "",
    ext,
    bytes: buf.length,
  };
}

async function run() {
  const entries = Array.from(tasks.values());
  const results = {};
  const failed = [];
  const CONCURRENCY = 8;
  let idx = 0;

  async function worker() {
    while (idx < entries.length) {
      const cur = entries[idx++];
      try {
        const info = await downloadOne(cur);
        results[cur.originalUrl] = info;
      } catch (err) {
        failed.push({ url: cur.originalUrl, error: err.message });
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  const mapPath = path.join(RESEARCH_DIR, "asset-map.json");
  fs.writeFileSync(mapPath, JSON.stringify({ total: entries.length, downloaded: Object.keys(results).length, failed, assets: results }, null, 2));
  console.log(`Downloaded ${Object.keys(results).length}/${entries.length} assets. Failed: ${failed.length}`);
  if (failed.length) {
    console.log("Failed samples:", failed.slice(0, 10));
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
