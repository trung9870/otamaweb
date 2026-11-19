import fs from "node:fs";
import path from "node:path";

const FONTS_DIR = "/Users/trung9870/.gemini/antigravity/scratch/brooklinen-clone/public/sites/brooklinen/fonts";
fs.mkdirSync(FONTS_DIR, { recursive: true });

const CSS_URL =
  "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,700;1,400&family=Playfair+Display:wght@700&display=swap";

async function run() {
  const res = await fetch(CSS_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const css = await res.text();

  // Extract /* vietnamese */ and /* latin */ blocks
  const blockRe = /\/\*\s*(vietnamese|latin|latin-ext)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g;
  const faces = [];
  let idx = 0;
  for (const m of css.matchAll(blockRe)) {
    const subset = m[1];
    const body = m[2];
    const family = body.match(/font-family:\s*'([^']+)'/)?.[1] || "";
    const style = body.match(/font-style:\s*([^;]+)/)?.[1]?.trim() || "normal";
    const weight = body.match(/font-weight:\s*([^;]+)/)?.[1]?.trim() || "400";
    const url = body.match(/url\(([^)]+)\)/)?.[1]?.replace(/['"]/g, "") || "";
    const unicodeRange = body.match(/unicode-range:\s*([^;]+)/)?.[1]?.trim() || "";
    if (!url || !family) continue;

    const slug = `${family.replace(/\s+/g, "")}-${weight}-${style}-${subset}-${idx++}.woff2`;
    const fileRes = await fetch(url);
    if (!fileRes.ok) throw new Error(`Font download HTTP ${fileRes.status} for ${url}`);
    const buf = Buffer.from(await fileRes.arrayBuffer());
    fs.writeFileSync(path.join(FONTS_DIR, slug), buf);
    faces.push({ family, weight, style, subset, unicodeRange, localPath: `/sites/brooklinen/fonts/${slug}`, bytes: buf.length });
  }

  const outCss = faces
    .map(
      (f) => `/* ${f.subset} */
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

  fs.writeFileSync(
    "/Users/trung9870/.gemini/antigravity/scratch/brooklinen-clone/docs/research/brooklinen/vi-fonts.css",
    outCss + "\n"
  );
  console.log(`Downloaded ${faces.length} Vietnamese/Latin woff2 font files.`);
  for (const f of faces) console.log(`  ${f.family} ${f.weight} ${f.style} [${f.subset}] -> ${f.localPath} (${f.bytes} B)`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
