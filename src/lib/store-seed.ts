import {
  CATALOG,
  COLLECTION_META,
  extractProductSlug,
} from "@/components/sites/brooklinen/catalog";
import { BROOKLINEN_DATA } from "@/components/sites/brooklinen/data";
import {
  translateProductTitle,
  UI_COPY,
  USD_TO_VND_RATE,
} from "@/components/sites/brooklinen/translations";
import type {
  HomepageSectionKey,
  StoreCategory,
  StoreDatabase,
  StoreOrder,
  StoreProduct,
  StoreSettings,
} from "./store-types";

function parsePriceNum(raw: string): number {
  const n = Number((raw || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? Math.round(n) : 0;
}

export function buildDefaultSettings(): StoreSettings {
  return {
    storeName: "Brooklinen",
    vndRate: USD_TO_VND_RATE,
    freeShippingThresholdUsd: 100,
    freeGiftThresholdUsd: 250,
    shippingFeeUsd: 10,
    promoCode: "BFCM26",
    announcementEn: [...UI_COPY.en.announcements],
    announcementVi: [...UI_COPY.vi.announcements],
    heroHeadingEn: [...UI_COPY.en.heroPrimary.headingLines],
    heroHeadingVi: [...UI_COPY.vi.heroPrimary.headingLines],
    heroSubtitleEn: [...UI_COPY.en.heroPrimary.subtitleLines],
    heroSubtitleVi: [...UI_COPY.vi.heroPrimary.subtitleLines],
    bankName: "MB Bank (Ngân hàng Quân đội)",
    bankAccountNo: "098765432100",
    bankAccountName: "CONG TY OTAMAWEB",
    contactEmail: "hotro@otamaweb.vn",
    contactPhone: "0901 234 567",
  };
}

export function buildDefaultProducts(): StoreProduct[] {
  const sectionMap = new Map<string, Set<HomepageSectionKey>>();

  const addSection = (
    items: readonly { href: string }[],
    section: HomepageSectionKey
  ) => {
    for (const item of items) {
      const slug = extractProductSlug(item.href);
      if (!sectionMap.has(slug)) sectionMap.set(slug, new Set());
      sectionMap.get(slug)!.add(section);
    }
  };

  addSection(BROOKLINEN_DATA.bestOfSale, "bestOfSale");
  addSection(BROOKLINEN_DATA.giftGuide, "giftGuide");
  addSection(BROOKLINEN_DATA.collection, "collection");

  const now = new Date().toISOString();

  return CATALOG.map((p, idx) => ({
    id: p.id || `prod-${idx + 1}`,
    slug: p.slug,
    titleEn: p.title,
    titleVi: translateProductTitle(p.title, "vi"),
    categorySlug: p.categorySlug,
    tags: [...p.tags],
    salePriceUsd: parsePriceNum(p.salePrice) || 99,
    originalPriceUsd: parsePriceNum(p.originalPrice),
    discountBadge: p.discountBadge || "",
    topBadge: p.topBadge || "",
    promoEyebrow: p.promoEyebrow || "",
    promoTone: p.promoTone === "urgent" ? "urgent" : "sale",
    mainImage: p.mainImage,
    hoverImage: p.hoverImage || p.mainImage,
    awardSeal: p.awardSeal,
    reviewCount: p.reviewCount || "",
    rating: p.rating || 5,
    defaultSwatchIndex: p.defaultSwatchIndex || 0,
    swatches: p.swatches.map((s) => ({ ...s })),
    descriptionEn: p.enDescription,
    descriptionVi: p.viDescription,
    includesEn: [...p.enIncludes],
    includesVi: [...p.viIncludes],
    careEn: p.enCare,
    careVi: p.viCare,
    sections: Array.from(sectionMap.get(p.slug) || []),
    active: true,
    sortOrder: idx + 1,
    updatedAt: now,
  }));
}

export function buildDefaultCategories(): StoreCategory[] {
  const homeCatImageBySlug = new Map<string, string>();
  for (const cat of BROOKLINEN_DATA.categories) {
    const match = cat.href.match(/\/collections\/([^/?#]+)/);
    if (match?.[1]) {
      homeCatImageBySlug.set(match[1], cat.image);
    }
  }

  return Object.values(COLLECTION_META).map((c, idx) => {
    const img = homeCatImageBySlug.get(c.slug);
    return {
      slug: c.slug,
      titleEn: c.enTitle,
      titleVi: c.viTitle,
      subtitleEn: c.enSubtitle,
      subtitleVi: c.viSubtitle,
      bannerTone: c.bannerTone,
      filterTag: c.filterTag,
      image: img,
      showOnHome: Boolean(img),
      sortOrder: idx + 1,
      active: true,
    };
  });
}

export function buildDefaultOrders(): StoreOrder[] {
  return [
    {
      id: "OTM-261119-1042",
      createdAt: "2026-11-19T08:15:00.000Z",
      status: "pending",
      customerName: "Nguyễn Minh Anh",
      customerEmail: "minhanh.nguyen@example.com",
      customerPhone: "0912 345 678",
      shippingAddress: "Tầng 12, Tòa nhà Lotte, 54 Liễu Giai, Ba Đình",
      city: "Hà Nội",
      paymentMethod: "bank_transfer",
      promoCode: "BFCM26",
      locale: "vi",
      vndRateAtOrder: USD_TO_VND_RATE,
      subtotalUsd: 268,
      shippingUsd: 0,
      totalUsd: 268,
      freeToteIncluded: true,
      items: [
        {
          slug: "classic-core-sheet-set",
          title: "Classic Percale Core Sheet Set",
          color: "Tandem Stripe in Storm",
          size: "Queen",
          qty: 1,
          priceUsd: 119,
          image: BROOKLINEN_DATA.bestOfSale[0]?.mainImage || "",
        },
        {
          slug: "luxe-core-sheet-set",
          title: "Luxe Sateen Core Sheet Set",
          color: "Solid White",
          size: "King",
          qty: 1,
          priceUsd: 149,
          image: BROOKLINEN_DATA.bestOfSale[1]?.mainImage || "",
        },
      ],
      note: "Giao giờ hành chính, gọi trước 15 phút.",
    },
    {
      id: "OTM-261118-0917",
      createdAt: "2026-11-18T14:40:00.000Z",
      status: "confirmed",
      customerName: "Trần Quốc Bảo",
      customerEmail: "quocbao.tran@example.com",
      customerPhone: "0988 221 900",
      shippingAddress: "128 Nguyễn Huệ, Phường Bến Nghé, Quận 1",
      city: "TP. Hồ Chí Minh",
      paymentMethod: "cod",
      promoCode: "BFCM26",
      locale: "vi",
      vndRateAtOrder: USD_TO_VND_RATE,
      subtotalUsd: 104,
      shippingUsd: 0,
      totalUsd: 104,
      freeToteIncluded: false,
      items: [
        {
          slug: "super-plush-robe",
          title: "Super-Plush Robe",
          color: "Striped Abyss",
          size: "M/L",
          qty: 1,
          priceUsd: 104,
          image: BROOKLINEN_DATA.bestOfSale[2]?.mainImage || "",
        },
      ],
      note: "Đơn mẫu minh họa (đã xác nhận).",
    },
  ];
}

export function buildDefaultStoreDatabase(): StoreDatabase {
  return {
    products: buildDefaultProducts(),
    categories: buildDefaultCategories(),
    settings: buildDefaultSettings(),
    orders: buildDefaultOrders(),
  };
}
