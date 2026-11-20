import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getUploadsDir } from "@/lib/store-db";

export const dynamic = "force-dynamic";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function GET(
  request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const safeName = path.basename(filename || "");
  if (!safeName || !/^[a-zA-Z0-9._-]+$/.test(safeName)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const ext = path.extname(safeName).toLowerCase();
  const contentType = MIME_BY_EXT[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Unsupported media type" }, { status: 400 });
  }

  try {
    const filePath = path.join(getUploadsDir(), safeName);
    const stat = await fs.stat(filePath);
    const totalSize = stat.size;
    const rangeHeader = request.headers.get("range");

    // Support HTTP byte-range streaming so uploaded <video> plays & loops smoothly in Safari/Chrome
    if (rangeHeader && rangeHeader.startsWith("bytes=")) {
      const [startRaw, endRaw] = rangeHeader.replace(/^bytes=/, "").split("-");
      const start = Math.max(0, Number.parseInt(startRaw || "0", 10) || 0);
      const end = endRaw
        ? Math.min(totalSize - 1, Number.parseInt(endRaw, 10))
        : totalSize - 1;

      if (start >= totalSize || end < start) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${totalSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const handle = await fs.open(filePath, "r");
      try {
        const buf = Buffer.alloc(chunkSize);
        await handle.read(buf, 0, chunkSize, start);
        return new NextResponse(buf, {
          status: 206,
          headers: {
            "Content-Type": contentType,
            "Content-Length": String(chunkSize),
            "Content-Range": `bytes ${start}-${end}/${totalSize}`,
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } finally {
        await handle.close();
      }
    }

    const data = await fs.readFile(filePath);
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(totalSize),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
