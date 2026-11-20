import {
  CATALOG,
  COLLECTION_META,
  extractProductSlug,
  toLocalHref,
} from "@/components/sites/brooklinen/catalog";
import { BROOKLINEN_DATA } from "@/components/sites/brooklinen/data";
import {
  translateProductTitle,
  UI_COPY,
  USD_TO_VND_RATE,
} from "@/components/sites/brooklinen/translations";
import type {
  HeaderNavConfigItem,
  HomepageSectionConfig,
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

function uniqueSlugs(items: readonly { href: string }[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const slug = extractProductSlug(item.href);
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      out.push(slug);
    }
  }
  return out;
}

export function buildDefaultHomepageSections(): HomepageSectionConfig[] {
  const heroPrimary = BROOKLINEN_DATA.heroPrimary;
  const heroSheets = BROOKLINEN_DATA.heroSheets;
  const miniTote = BROOKLINEN_DATA.miniHeroTote;

  return [
    {
      id: "hero_primary",
      visible: true,
      labelVi: "Hero chính (Video / Ảnh nền đầu trang)",
      kind: "hero",
      titleVi: UI_COPY.vi.heroPrimary.headingLines.join("\n"),
      titleEn: UI_COPY.en.heroPrimary.headingLines.join("\n"),
      subtitleVi: UI_COPY.vi.heroPrimary.subtitleLines.join("\n"),
      subtitleEn: UI_COPY.en.heroPrimary.subtitleLines.join("\n"),
      ctaLabelVi: UI_COPY.vi.heroPrimary.ctaLabel,
      ctaLabelEn: UI_COPY.en.heroPrimary.ctaLabel,
      ctaHref: toLocalHref(heroPrimary.ctaHref),
      mediaType: "video",
      desktopMedia: heroPrimary.desktopVideo,
      mobileMedia: heroPrimary.mobileVideo,
      desktopPoster: heroPrimary.desktopPoster,
      mobilePoster: heroPrimary.mobilePoster,
    },
    {
      id: "strip_mystery",
      visible: true,
      labelVi: "Dải băng khuyến mãi 48h (Đỏ rượu)",
      kind: "strip",
      titleVi: UI_COPY.vi.stripMystery.heading,
      titleEn: UI_COPY.en.stripMystery.heading,
      subtitleVi: UI_COPY.vi.stripMystery.body,
      subtitleEn: UI_COPY.en.stripMystery.body,
      ctaLabelVi: UI_COPY.vi.stripMystery.ctaLabel,
      ctaLabelEn: UI_COPY.en.stripMystery.ctaLabel,
      ctaHref: "/pages/all-bundles",
      theme: "burgundy-blue-cta",
    },
    {
      id: "carousel_best_of_sale",
      visible: true,
      labelVi: "Danh sách sản phẩm: Sale Nổi Bật",
      kind: "carousel",
      titleVi: UI_COPY.vi.bestOfSaleHeading,
      titleEn: UI_COPY.en.bestOfSaleHeading,
      productSlugs: uniqueSlugs(BROOKLINEN_DATA.bestOfSale),
    },
    {
      id: "mini_hero_tote",
      visible: true,
      labelVi: "Banner quà tặng Túi Super-Fluff Tote",
      kind: "banner",
      titleVi: UI_COPY.vi.miniHeroTote.lines.join("\n"),
      titleEn: UI_COPY.en.miniHeroTote.lines.join("\n"),
      ctaLabelVi: UI_COPY.vi.miniHeroTote.ctaLabel,
      ctaLabelEn: UI_COPY.en.miniHeroTote.ctaLabel,
      ctaHref: toLocalHref(miniTote.ctaHref),
      desktopMedia: miniTote.desktopImage,
      mobileMedia: miniTote.mobileImage,
    },
    {
      id: "category_carousel",
      visible: true,
      labelVi: "Danh mục nổi bật (Mua sắm theo danh mục)",
      kind: "categories",
      titleVi: UI_COPY.vi.shopByCategoryHeading,
      titleEn: UI_COPY.en.shopByCategoryHeading,
    },
    {
      id: "strip_gifts",
      visible: true,
      labelVi: "Dải băng Quà Tặng Đang Sale",
      kind: "strip",
      titleVi: UI_COPY.vi.stripGifts.heading,
      titleEn: UI_COPY.en.stripGifts.heading,
      subtitleVi: UI_COPY.vi.stripGifts.body,
      subtitleEn: UI_COPY.en.stripGifts.body,
      ctaLabelVi: UI_COPY.vi.stripGifts.ctaLabel,
      ctaLabelEn: UI_COPY.en.stripGifts.ctaLabel,
      ctaHref: "/collections/holiday-gift-guide",
      theme: "burgundy-outline-cta",
    },
    {
      id: "carousel_gift_guide",
      visible: true,
      labelVi: "Danh sách sản phẩm: Gợi Ý Quà Tặng",
      kind: "carousel",
      titleVi: UI_COPY.vi.giftGuideHeading,
      titleEn: UI_COPY.en.giftGuideHeading,
      productSlugs: uniqueSlugs(BROOKLINEN_DATA.giftGuide),
    },
    {
      id: "hero_sheets",
      visible: true,
      labelVi: "Hero thứ 2 (Ga Giường Đỉnh Nhất — Video / Ảnh)",
      kind: "hero",
      titleVi: UI_COPY.vi.heroSheets.textHeadline || "GA GIƯỜNG. ĐỈNH. NHẤT.",
      titleEn: "BEST. SHEETS. EVER.",
      subtitleVi: UI_COPY.vi.heroSheets.subtitle,
      subtitleEn: UI_COPY.en.heroSheets.subtitle,
      ctaLabelVi: UI_COPY.vi.heroSheets.ctas[0] || "Mua Ga Giường",
      ctaLabelEn: UI_COPY.en.heroSheets.ctas[0] || "Shop Sheets",
      ctaHref: toLocalHref(heroSheets.ctas[0]?.href || "/collections/all-sheets"),
      secondaryCtaLabelVi: UI_COPY.vi.heroSheets.ctas[1] || "Tìm Hiểu Thêm",
      secondaryCtaLabelEn: UI_COPY.en.heroSheets.ctas[1] || "Learn More",
      secondaryCtaHref: toLocalHref(heroSheets.ctas[1]?.href || "/pages/best-sheets-ever"),
      mediaType: "video",
      desktopMedia: heroSheets.desktopVideo,
      mobileMedia: heroSheets.mobileVideo,
      desktopPoster: heroSheets.desktopPoster,
      mobilePoster: heroSheets.mobilePoster,
    },
    {
      id: "carousel_collection",
      visible: true,
      labelVi: "Danh sách sản phẩm: Bộ Sưu Tập",
      kind: "carousel",
      titleVi: UI_COPY.vi.collectionHeading,
      titleEn: UI_COPY.en.collectionHeading,
      productSlugs: uniqueSlugs(BROOKLINEN_DATA.collection),
    },
    {
      id: "trending",
      visible: true,
      labelVi: "Mới & Thịnh Hành (4 ảnh nổi bật)",
      kind: "static",
    },
    {
      id: "strip_fsa",
      visible: true,
      labelVi: "Dải băng FSA / HSA (Xanh Navy)",
      kind: "strip",
      titleVi: UI_COPY.vi.stripFsa.heading,
      titleEn: UI_COPY.en.stripFsa.heading,
      subtitleVi: UI_COPY.vi.stripFsa.body,
      subtitleEn: UI_COPY.en.stripFsa.body,
      ctaLabelVi: UI_COPY.vi.stripFsa.ctaLabel,
      ctaLabelEn: UI_COPY.en.stripFsa.ctaLabel,
      ctaHref: "/pages/hsa-fsa-eligible",
      theme: "navy-adaptive-cta",
    },
    {
      id: "why_brooklinen",
      visible: true,
      labelVi: "Vì sao chọn chúng tôi (4 điểm nổi bật)",
      kind: "static",
    },
    {
      id: "reviews",
      visible: true,
      labelVi: "Đánh giá 5 sao của khách hàng",
      kind: "static",
    },
    {
      id: "press",
      visible: true,
      labelVi: "Báo chí & Truyền thông nói về chúng tôi",
      kind: "static",
    },
    {
      id: "strip_stores",
      visible: true,
      labelVi: "Dải băng Hệ thống Cửa hàng",
      kind: "strip",
      titleVi: UI_COPY.vi.stripStores.heading,
      titleEn: UI_COPY.en.stripStores.heading,
      subtitleVi: UI_COPY.vi.stripStores.body,
      subtitleEn: UI_COPY.en.stripStores.body,
      ctaLabelVi: UI_COPY.vi.stripStores.ctaLabel,
      ctaLabelEn: UI_COPY.en.stripStores.ctaLabel,
      ctaHref: "/pages/our-stores",
      theme: "slate-navy-cta",
    },
  ];
}

export function buildDefaultHeaderNav(): HeaderNavConfigItem[] {
  return BROOKLINEN_DATA.navItems.map((item, idx) => ({
    id: `nav-${idx + 1}`,
    sourceIndex: idx,
    labelVi: UI_COPY.vi.navItems[idx]?.label || item.label,
    labelEn: UI_COPY.en.navItems[idx]?.label || item.label,
    href: toLocalHref(item.href),
    visible: true,
  }));
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
    homepageSections: buildDefaultHomepageSections(),
    headerNav: buildDefaultHeaderNav(),
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
  const homeCatOrder = new Map<
    string,
    { order: number; image: string; badgeImage?: string }
  >();

  BROOKLINEN_DATA.categories.forEach((cat, idx) => {
    const match = cat.href.match(/\/(?:collections|pages)\/([^/?#]+)/);
    if (match?.[1]) {
      homeCatOrder.set(match[1], {
        order: idx + 1,
        image: cat.image,
        badgeImage: "badgeImage" in cat ? cat.badgeImage : undefined,
      });
    }
  });

  let extraOrder = homeCatOrder.size + 1;
  const list = Object.values(COLLECTION_META).map((c) => {
    const featured = homeCatOrder.get(c.slug);
    const sortOrder = featured ? featured.order : extraOrder++;
    return {
      slug: c.slug,
      titleEn: c.enTitle,
      titleVi: c.viTitle,
      subtitleEn: c.enSubtitle,
      subtitleVi: c.viSubtitle,
      bannerTone: c.bannerTone,
      filterTag: c.filterTag,
      image: featured?.image,
      badgeImage: featured?.badgeImage,
      showOnHome: Boolean(featured),
      sortOrder,
      active: true,
    };
  });

  return list.sort((a, b) => a.sortOrder - b.sortOrder);
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
