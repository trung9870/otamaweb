import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  deleteProductById,
  readStoreDatabase,
  saveSettings,
  upsertProduct,
} from "@/lib/store-db";
import {
  sanitizeGalleryImages,
  sanitizeProductDetailBlocks,
} from "@/lib/product-detail-defaults";
import {
  computeDiscountBadge,
  slugifyText,
  type HomepageBlockId,
  type HomepageSectionKey,
  type StoreProduct,
} from "@/lib/store-types";

const SECTION_KEY_TO_BLOCK_ID: Record<HomepageSectionKey, HomepageBlockId> = {
  bestOfSale: "carousel_best_of_sale",
  giftGuide: "carousel_gift_guide",
  collection: "carousel_collection",
};

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
      galleryImages:
        body.galleryImages !== undefined
          ? sanitizeGalleryImages(body.galleryImages)
          : existing.galleryImages,
      detailBlocks:
        body.detailBlocks !== undefined
          ? sanitizeProductDetailBlocks(body.detailBlocks)
          : existing.detailBlocks,
      updatedAt: new Date().toISOString(),
    };

    const saved = await upsertProduct(updated);

    // Sync homepage carousel productSlugs if slug changed or sections checkboxes changed
    const sectionsModified =
      Array.isArray(body.sections) &&
      JSON.stringify([...body.sections].sort()) !==
        JSON.stringify([...existing.sections].sort());

    if (
      db.settings.homepageSections?.length &&
      (sectionsModified || saved.slug !== existing.slug)
    ) {
      const targetBlockIds = new Set(
        saved.sections.map((sec) => SECTION_KEY_TO_BLOCK_ID[sec])
      );
      let settingsChanged = false;
      const updatedSections = db.settings.homepageSections.map((block) => {
        if (!block.productSlugs) return block;
        const isCarousel =
          block.id === "carousel_best_of_sale" ||
          block.id === "carousel_gift_guide" ||
          block.id === "carousel_collection";
        if (!isCarousel) return block;

        const mapped = block.productSlugs.map((s) =>
          s === existing.slug ? saved.slug : s
        );
        let nextSlugs = mapped;
        if (sectionsModified) {
          const hasSlug = mapped.includes(saved.slug);
          const shouldHave = targetBlockIds.has(block.id);
          if (shouldHave && !hasSlug) {
            nextSlugs = [saved.slug, ...mapped];
          } else if (!shouldHave && hasSlug) {
            nextSlugs = mapped.filter((s) => s !== saved.slug);
          }
        }
        if (JSON.stringify(nextSlugs) !== JSON.stringify(block.productSlugs)) {
          settingsChanged = true;
          return { ...block, productSlugs: nextSlugs };
        }
        return block;
      });
      if (settingsChanged) {
        await saveSettings({ ...db.settings, homepageSections: updatedSections });
      }
    }

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
