import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { readStoreDatabase, upsertCategory } from "@/lib/store-db";
import { slugifyText, type StoreCategory } from "@/lib/store-types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<StoreCategory>;
    const titleVi = (body.titleVi || "").trim();
    const titleEn = (body.titleEn || titleVi).trim();
    const slug = slugifyText(body.slug || titleEn || titleVi);

    if (!slug || !titleVi) {
      return NextResponse.json(
        { error: "Vui lòng nhập tên danh mục và đường dẫn." },
        { status: 400 }
      );
    }

    const db = await readStoreDatabase();
    const existing = db.categories.find((c) => c.slug === slug);

    const category: StoreCategory = {
      slug,
      titleEn,
      titleVi,
      subtitleEn: (body.subtitleEn ?? existing?.subtitleEn ?? "").trim(),
      subtitleVi: (body.subtitleVi ?? existing?.subtitleVi ?? "").trim(),
      bannerTone:
        body.bannerTone === "navy" || body.bannerTone === "burgundy"
          ? body.bannerTone
          : "cream",
      filterTag: body.filterTag || existing?.filterTag,
      image: body.image?.trim() || existing?.image,
      showOnHome: Boolean(body.showOnHome),
      sortOrder:
        typeof body.sortOrder === "number"
          ? body.sortOrder
          : existing?.sortOrder ?? db.categories.length + 1,
      active: body.active !== false,
    };

    const saved = await upsertCategory(category);
    return NextResponse.json({ category: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể lưu danh mục.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
