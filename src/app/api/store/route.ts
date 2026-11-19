import { NextResponse } from "next/server";
import { getStorageMode, readStoreDatabase } from "@/lib/store-db";
import type { PublicStorePayload } from "@/lib/store-types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await readStoreDatabase();
    const payload: PublicStorePayload = {
      mode: getStorageMode(),
      products: db.products
        .filter((p) => p.active)
        .sort((a, b) => a.sortOrder - b.sortOrder),
      categories: db.categories
        .filter((c) => c.active)
        .sort((a, b) => a.sortOrder - b.sortOrder),
      settings: db.settings,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load store data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
