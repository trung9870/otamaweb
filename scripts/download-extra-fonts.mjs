import fs from "node:fs";
import path from "node:path";

const FONTS_DIR =
  "/Users/trung9870/.gemini/antigravity/scratch/brooklinen-clone/public/sites/brooklinen/fonts";
fs.mkdirSync(FONTS_DIR, { recursive: true });

const CSS_URL =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Playfair+Display:ital,wght@0,400;1,400;1,700",
    "family=Montserrat:ital,wght@0,400;0,500;0,700;1,400",
    "family=Lora:ital,wght@0,400;0,500;0,700;1,400",
    "family=Nunito:ital,wght@0,400;0,500;0,700;1,400",
    "family=Oswald:wght@400;500;700",
    "family=Merriweather:ital,wght@0,400;0,700;1,400",
    "family=Dancing+Script:wght@400;500;700",
    "display=swap",
  ].join("&");

async function run() {
  const res = await fetch(CSS_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const css = await res.text();

  const blockRe =
    /\/\*\s*(vietnamese|latin-ext|latin)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g;
  const faces = [];
  let idx = 0;

  for (const m of css.matchAll(blockRe)) {
    const subset = m[1];
    const body = m[2];
    const family = body.match(/font-family:\s*'([^']+)'/)?.[1] || "";
    const style = body.match(/font-style:\s*([^;]+)/)?.[1]?.trim() || "normal";
    const weight = body.match(/font-weight:\s*([^;]+)/)?.[1]?.trim() || "400";
    const url = body.match(/url\(([^)]+)\)/)?.[1]?.replace(/['"]/g, "") || "";
    const unicodeRange =
      body.match(/unicode-range:\s*([^;]+)/)?.[1]?.trim() || "";
    if (!url || !family) continue;

    const cleanFam = family.replace(/\s+/g, "");
    const cleanWeight = weight.replace(/\s+/g, "-");
    const slug = `${cleanFam}-${cleanWeight}-${style}-${subset}-x${idx++}.woff2`;
    const fileRes = await fetch(url);
    if (!fileRes.ok) {
      throw new Error(`Font download HTTP ${fileRes.status} for ${url}`);
    }
    const buf = Buffer.from(await fileRes.arrayBuffer());
    fs.writeFileSync(path.join(FONTS_DIR, slug), buf);
    faces.push({
      family,
      weight,
      style,
      subset,
      unicodeRange,
      localPath: `/sites/brooklinen/fonts/${slug}`,
      bytes: buf.length,
    });
  }

  const outCss = faces
    .map(
      (f) => `/* ${f.family} (${f.subset}) */
@font-face {
  font-family: "${f.family}";
  src: url("${f.localPath}") format("woff2");
  font-weight: ${f.weight};
  font-style: ${f.style};
  font-display: swap;
  unicode-range: ${f.unicodeRange};
}`
    )
    .join("\n\n");

  const outFile =
    "/Users/trung9870/.gemini/antigravity/scratch/brooklinen-clone/docs/research/brooklinen/extra-vi-fonts.css";
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, outCss + "\n");
  console.log(`Downloaded ${faces.length} extra woff2 font files.`);
  const byFam = new Map();
  for (const f of faces) {
    byFam.set(f.family, (byFam.get(f.family) || 0) + 1);
  }
  for (const [fam, count] of byFam.entries()) {
    console.log(`  - ${fam}: ${count} woff2 subsets`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
