import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  deleteProductById,
  readStoreDatabase,
  upsertProduct,
} from "@/lib/store-db";
import {
  computeDiscountBadge,
  slugifyText,
  type StoreProduct,
} from "@/lib/store-types";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<StoreProduct>;
    const db = await readStoreDatabase();
    const existing = db.products.find((p) => p.id === id);

    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm." }, { status: 404 });
    }

    const salePriceUsd =
      typeof body.salePriceUsd === "number"
        ? Math.max(1, Math.round(body.salePriceUsd))
        : existing.salePriceUsd;
    const originalPriceUsd =
      typeof body.originalPriceUsd === "number"
        ? Math.max(0, Math.round(body.originalPriceUsd))
        : existing.originalPriceUsd;

    const nextSlug = body.slug ? slugifyText(body.slug) || existing.slug : existing.slug;
    const updated: StoreProduct = {
      ...existing,
      ...body,
      id: existing.id,
      slug: nextSlug,
      titleEn: (body.titleEn ?? existing.titleEn).trim(),
      titleVi: (body.titleVi ?? existing.titleVi).trim(),
      salePriceUsd,
      originalPriceUsd,
      discountBadge:
        typeof body.discountBadge === "string" && body.discountBadge.trim()
          ? body.discountBadge.trim()
          : computeDiscountBadge(salePriceUsd, originalPriceUsd),
      mainImage: (body.mainImage ?? existing.mainImage).trim(),
      hoverImage:
        (body.hoverImage ?? existing.hoverImage).trim() ||
        (body.mainImage ?? existing.mainImage).trim(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await upsertProduct(updated);
    return NextResponse.json({ product: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể cập nhật sản phẩm.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const ok = await deleteProductById(id);
    if (!ok) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể xóa sản phẩm.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
