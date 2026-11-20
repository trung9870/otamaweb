import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { readStoreDatabase, saveSettings, upsertProduct } from "@/lib/store-db";
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

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<StoreProduct>;
    const titleVi = (body.titleVi || "").trim();
    const titleEn = (body.titleEn || titleVi).trim();

    if (!titleEn && !titleVi) {
      return NextResponse.json(
        { error: "Vui lòng nhập tên sản phẩm." },
        { status: 400 }
      );
    }

    const db = await readStoreDatabase();
    let slug = slugifyText(body.slug || titleEn || titleVi);
    if (!slug) slug = `product-${Date.now()}`;

    // Ensure unique slug on create
    if (db.products.some((p) => p.slug === slug)) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const salePriceUsd = Math.max(1, Math.round(Number(body.salePriceUsd) || 1));
    const originalPriceUsd = Math.max(0, Math.round(Number(body.originalPriceUsd) || 0));

    const product: StoreProduct = {
      id: `prod-${Date.now()}`,
      slug,
      titleEn,
      titleVi: titleVi || titleEn,
      categorySlug: body.categorySlug || "all-sheets",
      tags: Array.isArray(body.tags) && body.tags.length > 0 ? body.tags : ["sale"],
      salePriceUsd,
      originalPriceUsd,
      discountBadge:
        body.discountBadge?.trim() ||
        computeDiscountBadge(salePriceUsd, originalPriceUsd),
      topBadge: (body.topBadge || "").trim(),
      promoEyebrow: (body.promoEyebrow || "").trim(),
      promoTone: body.promoTone === "urgent" ? "urgent" : "sale",
      mainImage:
        (body.mainImage || "").trim() ||
        "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
      hoverImage:
        (body.hoverImage || "").trim() ||
        (body.mainImage || "").trim() ||
        "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
      awardSeal: body.awardSeal?.trim() || undefined,
      reviewCount: (body.reviewCount || "(Mới)").trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      defaultSwatchIndex: Math.max(0, Math.round(Number(body.defaultSwatchIndex) || 0)),
      swatches: Array.isArray(body.swatches) ? body.swatches : [],
      descriptionEn: (body.descriptionEn || "").trim(),
      descriptionVi: (body.descriptionVi || "").trim(),
      includesEn: Array.isArray(body.includesEn) ? body.includesEn : [],
      includesVi: Array.isArray(body.includesVi) ? body.includesVi : [],
      careEn:
        (body.careEn || "").trim() ||
        "Machine wash cold with like colors. Tumble dry low.",
      careVi:
        (body.careVi || "").trim() ||
        "Giặt máy chế độ nước lạnh với đồ cùng màu. Sấy nhẹ ở nhiệt độ thấp.",
      sections: Array.isArray(body.sections) ? body.sections : ["bestOfSale"],
      active: body.active !== false,
      sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
      updatedAt: new Date().toISOString(),
    };

    const saved = await upsertProduct(product);

    // Sync newly created product into selected homepage carousel section lists automatically
    if (saved.sections.length > 0 && db.settings.homepageSections?.length) {
      const targetBlockIds = new Set(
        saved.sections.map((sec) => SECTION_KEY_TO_BLOCK_ID[sec])
      );
      let changed = false;
      const updatedSections = db.settings.homepageSections.map((block) => {
        if (!targetBlockIds.has(block.id)) return block;
        const list = block.productSlugs || [];
        if (list.includes(saved.slug)) return block;
        changed = true;
        return { ...block, productSlugs: [saved.slug, ...list] };
      });
      if (changed) {
        await saveSettings({ ...db.settings, homepageSections: updatedSections });
      }
    }

    return NextResponse.json({ product: saved }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể tạo sản phẩm.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
