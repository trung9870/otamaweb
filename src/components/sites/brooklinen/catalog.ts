import { BROOKLINEN_DATA, type ProductCardData } from "./data";
import type { Locale } from "./LanguageContext";

export type CategoryTag =
  | "sheets"
  | "bed"
  | "bath"
  | "bundles"
  | "gifts"
  | "home"
  | "trending"
  | "sale"
  | "awards"
  | "waffle"
  | "silk"
  | "percale"
  | "sateen"
  | "linen"
  | "duvets"
  | "pillows"
  | "throws"
  | "robes";

export type ProductDetailBlockLayout =
  | "split-left"
  | "split-right"
  | "full-banner"
  | "two-images"
  | "text-only";

export interface ProductDetailBlock {
  id: string;
  layout: ProductDetailBlockLayout;
  eyebrowVi?: string;
  eyebrowEn?: string;
  headingVi?: string;
  headingEn?: string;
  bodyVi?: string;
  bodyEn?: string;
  image?: string;
  secondaryImage?: string;
  captionVi?: string;
  captionEn?: string;
}

export interface CatalogProduct extends ProductCardData {
  slug: string;
  tags: CategoryTag[];
  categorySlug: string;
  enCategoryName: string;
  viCategoryName: string;
  enDescription: string;
  viDescription: string;
  enIncludes: string[];
  viIncludes: string[];
  enCare: string;
  viCare: string;
  galleryImages?: string[];
  detailBlocks?: ProductDetailBlock[];
}

export function extractProductSlug(rawHref: string): string {
  try {
    const clean = rawHref.startsWith("http")
      ? new URL(rawHref).pathname
      : rawHref.split("?")[0].split("#")[0];
    const match = clean.match(/\/products\/([^/?#]+)/);
    if (match?.[1]) return match[1];
  } catch {
    // ignore
  }
  return rawHref
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Rewrites any brooklinen.com URL into a local Next.js App Router path
 * so visitors never leave the local storefront, while preserving custom
 * external URLs (Shopee, Zalo, Facebook, etc.) configured in Admin.
 */
export function toLocalHref(rawHref: string): string {
  if (!rawHref) return "/";
  const trimmed = rawHref.trim();
  if (!trimmed) return "/";
  if (trimmed.startsWith("#") || /^(mailto:|tel:)/i.test(trimmed)) return trimmed;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      if (!/^(www\.)?brooklinen\.com$/i.test(u.hostname)) {
        return trimmed;
      }
      const pathname = u.pathname.replace(/\/+$/, "") || "/";
      if (pathname === "/") return "/";
      if (pathname === "/cart") return "/checkout";
      return pathname;
    } catch {
      return "/";
    }
  }

  try {
    const u = new URL(trimmed, "https://www.brooklinen.com");
    const pathname = u.pathname.replace(/\/+$/, "") || "/";
    if (pathname === "/") return "/";
    if (pathname === "/cart") return "/checkout";
    return pathname;
  } catch {
    return "/";
  }
}

function classifyProduct(p: ProductCardData): {
  tags: CategoryTag[];
  categorySlug: string;
  enCategoryName: string;
  viCategoryName: string;
  enDescription: string;
  viDescription: string;
  enIncludes: string[];
  viIncludes: string[];
  enCare: string;
  viCare: string;
} {
  const t = p.title.toLowerCase();
  const tags = new Set<CategoryTag>(["sale"]);
  if (p.awardSeal) tags.add("awards");
  if (p.topBadge === "NEW") tags.add("trending");
  if (p.topBadge === "BEST SELLER") tags.add("gifts");

  if (t.includes("sheet") || t.includes("pillowcase")) tags.add("sheets");
  if (t.includes("percale")) tags.add("percale");
  if (t.includes("sateen") || t.includes("luxe")) tags.add("sateen");
  if (t.includes("linen")) tags.add("linen");
  if (t.includes("duvet") || t.includes("comforter")) {
    tags.add("bed");
    tags.add("duvets");
  }
  if (t.includes("pillow")) {
    tags.add("bed");
    tags.add("pillows");
  }
  if (t.includes("robe") || t.includes("slipper") || t.includes("pouch") || t.includes("super-plush")) {
    tags.add("bath");
    tags.add("gifts");
    if (t.includes("robe")) tags.add("robes");
  }
  if (t.includes("bundle")) {
    tags.add("bundles");
    tags.add("gifts");
  }
  if (t.includes("blanket") || t.includes("throw")) {
    tags.add("home");
    tags.add("bed");
    tags.add("throws");
    tags.add("gifts");
  }
  if (t.includes("waffle")) {
    tags.add("waffle");
    tags.add("home");
    tags.add("trending");
  }
  if (t.includes("silk")) {
    tags.add("silk");
    tags.add("gifts");
    tags.add("home");
  }
  if (t.includes("wool")) {
    tags.add("home");
    tags.add("bed");
    tags.add("trending");
  }
  if (tags.has("sheets")) tags.add("bed");

  // Primary category + rich bilingual descriptions
  if (t.includes("robe") || t.includes("slipper") || t.includes("pouch")) {
    return {
      tags: Array.from(tags),
      categorySlug: "all-bath",
      enCategoryName: "Bath & Robes",
      viCategoryName: "Phòng Tắm & Áo Choàng",
      enDescription:
        "Crafted from 100% long-staple Turkish cotton with a plush, spa-weight weave that absorbs effortlessly and stays cloud-soft wash after wash. OEKO-TEX® certified free from harmful chemicals.",
      viDescription:
        "Dệt từ 100% sợi cotton Thổ Nhĩ Kỳ dài cao cấp, mềm mịn dày dặn chuẩn spa, thấm hút nhanh và giữ độ êm ái dài lâu sau nhiều lần giặt. Đạt chứng nhận OEKO-TEX® an toàn tuyệt đối cho làn da.",
      enIncludes: [
        "100% long-staple Turkish cotton (380–820 GSM plush weave)",
        "OEKO-TEX® Standard 100 certified safe for sensitive skin",
        "Covered by Brooklinen’s 365-Day Happiness Guarantee",
      ],
      viIncludes: [
        "100% cotton Thổ Nhĩ Kỳ sợi dài dày dặn, mềm mịn",
        "Chứng nhận OEKO-TEX® Standard 100 an toàn cho da nhạy cảm",
        "Áp dụng Bảo hành Hài lòng 365 ngày từ Brooklinen",
      ],
      enCare: "Machine wash cold on gentle cycle with like colors. Tumble dry low; avoid fabric softeners to preserve peak absorbency.",
      viCare: "Giặt máy chế độ nhẹ với nước lạnh cùng đồ cùng màu. Sấy nhiệt thấp; tránh dùng nước xả vải để giữ khả năng thấm hút tối ưu.",
    };
  }

  if (t.includes("blanket") || t.includes("throw") || t.includes("silk")) {
    return {
      tags: Array.from(tags),
      categorySlug: "home-accessories",
      enCategoryName: "Home & Throws",
      viCategoryName: "Nhà Cửa & Chăn Đắp",
      enDescription:
        "Designed for effortless layering on the sofa or at the foot of your bed. Ultra-tactile textures, breathable comfort, and timeless colorways built to elevate every corner of home.",
      viDescription:
        "Thiết kế tinh tế để phủ sofa hay phối lớp cuối giường ngủ. Chất vải giàu kết cấu, thoáng khí êm ái cùng bảng màu vượt thời gian giúp nâng tầm mọi góc nhỏ trong nhà.",
      enIncludes: [
        "Responsibly sourced premium fibers with rich tactile finish",
        "Gift-ready presentation with 25–30% Black Friday savings",
        "Covered by Brooklinen’s 365-Day Happiness Guarantee",
      ],
      viIncludes: [
        "Chất liệu tuyển chọn cao cấp với bề mặt êm mượt tự nhiên",
        "Sẵn sàng làm quà tặng kèm ưu đãi Black Friday 25–30%",
        "Áp dụng Bảo hành Hài lòng 365 ngày từ Brooklinen",
      ],
      enCare: "Machine wash cold on delicate cycle or hand wash. Lay flat or tumble dry low.",
      viCare: "Giặt máy chế độ đồ mỏng với nước lạnh hoặc giặt tay. Phơi phẳng hoặc sấy ở mức nhiệt thấp.",
    };
  }

  if (t.includes("comforter") || t.includes("pillow")) {
    return {
      tags: Array.from(tags),
      categorySlug: "duvet-inserts-pillows",
      enCategoryName: "Duvet Inserts & Pillows",
      viCategoryName: "Ruột Chăn & Gối",
      enDescription:
        "Responsibly sourced Downfill crafted in baffle-box construction for even loft, temperature regulation, and hotel-caliber support all night long.",
      viDescription:
        "Lông vũ tuyển chọn có trách nhiệm với kết cấu ô hộp giúp phân bổ độ phồng đồng đều, điều hòa nhiệt độ và nâng đỡ êm ái chuẩn khách sạn 5 sao suốt đêm dài.",
      enIncludes: [
        "100% cotton sateen shell with responsibly sourced down clusters",
        "Corner loops (comforters) or multi-chamber support (pillows)",
        "OEKO-TEX® certified & 365-Day Happiness Guarantee",
      ],
      viIncludes: [
        "Vỏ bọc 100% cotton sateen cùng ruột lông vũ chọn lọc",
        "Dây buộc cố định 4 góc (ruột chăn) hoặc cấu trúc đa khoang nâng đỡ (gối)",
        "Chứng nhận OEKO-TEX® & Bảo hành Hài lòng 365 ngày",
      ],
      enCare: "Spot clean or dry clean recommended; use with a Brooklinen duvet cover or pillow protector.",
      viCare: "Khuyến nghị giặt khô hoặc vệ sinh điểm; sử dụng cùng vỏ chăn hoặc bọc bảo vệ gối Brooklinen.",
    };
  }

  if (t.includes("bundle")) {
    return {
      tags: Array.from(tags),
      categorySlug: "all-bundles",
      enCategoryName: "Bundle Savings",
      viCategoryName: "Combo Tiết Kiệm",
      enDescription:
        "Everything you need for an instant bedroom upgrade in one curated bundle—stacking bundle savings with 25% off sitewide for our lowest prices of the year.",
      viDescription:
        "Tất cả những gì bạn cần để làm mới phòng ngủ chỉ trong một combo trọn gói — cộng dồn ưu đãi combo cùng giảm 25% Black Friday với mức giá tốt nhất năm.",
      enIncludes: [
        "1 Fitted Sheet + 1 Flat Sheet (excluded in No-Flat bundles)",
        "1 Duvet Cover + 4 Pillowcases (Hardcore & Move-In sets)",
        "100% long-staple cotton, OEKO-TEX® certified",
      ],
      viIncludes: [
        "1 Ga chun bọc đệm + 1 Ga phẳng (tùy theo gói tiêu chuẩn/tối giản)",
        "1 Vỏ chăn + 4 Vỏ gối (đối với các combo Đầy đủ & Trọn bộ)",
        "100% cotton sợi dài đạt chứng nhận OEKO-TEX®",
      ],
      enCare: "Machine wash cold with gentle detergent. Tumble dry low and remove promptly to minimize wrinkles.",
      viCare: "Giặt máy nước lạnh với nước giặt dịu nhẹ. Sấy nhiệt thấp và lấy ra ngay khi khô để hạn chế nhăn.",
    };
  }

  const isPercale = t.includes("percale");
  return {
    tags: Array.from(tags),
    categorySlug: "all-sheets",
    enCategoryName: "Sheets",
    viCategoryName: "Ga Giường",
    enDescription: isPercale
      ? "Our crisp, cool 270-thread-count Classic Percale weave delivers breathable matte softness inspired by five-star hotel beds—ideal for hot sleepers."
      : "Our buttery-smooth 480-thread-count Luxe Sateen weave pairs a subtly luminous sheen with cloud-like drape that gets even softer with every wash.",
    viDescription: isPercale
      ? "Vải dệt Classic Percale mật độ 270 sợi thoáng mát, bề mặt lì sắc nét như giường khách sạn 5 sao — lựa chọn hoàn hảo cho người dễ nóng khi ngủ."
      : "Vải dệt Luxe Sateen mật độ 480 sợi mượt mà như bơ, ánh bóng nhẹ tinh tế và độ rủ mềm mại, càng giặt càng êm ái hơn.",
    enIncludes: t.includes("duvet")
      ? [
          "1 Duvet Cover with hidden button closure & interior corner ties",
          "100% long-staple cotton, OEKO-TEX® certified",
          "365-Day Happiness Guarantee",
        ]
      : [
          "1 Fitted Sheet (16\" deep pockets with 'long' & 'short' side tags)",
          "1 Flat Sheet + 2 Pillowcases with envelope closures",
          "100% long-staple cotton, OEKO-TEX® certified",
        ],
    viIncludes: t.includes("duvet")
      ? [
          "1 Vỏ chăn khuy cài ẩn kèm dây buộc 4 góc bên trong",
          "100% cotton sợi dài đạt chứng nhận OEKO-TEX®",
          "Bảo hành Hài lòng 365 ngày",
        ]
      : [
          "1 Ga chun bọc đệm sâu 40cm kèm nhãn đánh dấu cạnh dài/ngắn",
          "1 Ga phủ phẳng + 2 Vỏ gối khóa phong bì gọn gàng",
          "100% cotton sợi dài đạt chứng nhận OEKO-TEX®",
        ],
    enCare: "Machine wash cold on gentle cycle. Tumble dry low; warm iron if desired.",
    viCare: "Giặt máy nước lạnh chế độ nhẹ. Sấy ở mức nhiệt thấp; có thể là ấm nếu cần.",
  };
}

// Build deduplicated unified catalog from all 3 homepage carousels
function buildCatalog(): CatalogProduct[] {
  const seen = new Map<string, CatalogProduct>();
  const allRaw = [
    ...BROOKLINEN_DATA.bestOfSale,
    ...BROOKLINEN_DATA.giftGuide,
    ...BROOKLINEN_DATA.collection,
  ] as unknown as ProductCardData[];

  for (const item of allRaw) {
    const slug = extractProductSlug(item.href);
    if (seen.has(slug)) {
      // Merge extra badges/award seal if present
      const existing = seen.get(slug)!;
      if (!existing.awardSeal && item.awardSeal) {
        existing.awardSeal = item.awardSeal;
        if (!existing.tags.includes("awards")) existing.tags.push("awards");
      }
      continue;
    }
    const meta = classifyProduct(item);
    seen.set(slug, {
      ...item,
      slug,
      href: `/products/${slug}`,
      ...meta,
    });
  }

  // Add E-Gift Card product so the footer/nav E-Gift Card route resolves locally too
  seen.set("rise-ai-giftcard", {
    id: "brooklinen-e-gift-card",
    slug: "rise-ai-giftcard",
    title: "Brooklinen E-Gift Card",
    href: "/products/rise-ai-giftcard",
    topBadge: "BEST SELLER",
    promoEyebrow: "BLACK FRIDAY SALE",
    promoTone: "sale",
    originalPrice: "",
    salePrice: "$100",
    discountBadge: "",
    reviewCount: "(1,240)",
    rating: 5,
    mainImage: BROOKLINEN_DATA.trending[0]?.image || "",
    hoverImage: BROOKLINEN_DATA.trending[2]?.image || "",
    defaultSwatchIndex: 0,
    swatches: [],
    tags: ["gifts"],
    categorySlug: "holiday-gift-guide",
    enCategoryName: "Gift Guide",
    viCategoryName: "Gợi Ý Quà Tặng",
    enDescription:
      "Give the gift of great sleep. Delivered instantly by email with no expiration date, redeemable online and in Brooklinen stores.",
    viDescription:
      "Trao tặng món quà giấc ngủ êm ái. Gửi ngay tức thì qua email, không giới hạn thời hạn sử dụng, áp dụng cả trực tuyến và tại cửa hàng Brooklinen.",
    enIncludes: [
      "Instant digital delivery via email",
      "Valid online and at all Brooklinen retail stores",
      "Never expires and zero hidden fees",
    ],
    viIncludes: [
      "Gửi mã quà tặng điện tử tức thì qua email",
      "Sử dụng trực tuyến và tại mọi cửa hàng Brooklinen",
      "Không hết hạn và không phụ phí",
    ],
    enCare: "Redeemable at checkout using your unique digital card code.",
    viCare: "Nhập mã thẻ điện tử tại bước thanh toán để sử dụng.",
  });

  return Array.from(seen.values());
}

export const CATALOG: CatalogProduct[] = buildCatalog();

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return CATALOG.find((p) => p.slug === slug);
}

export interface CollectionMeta {
  slug: string;
  enTitle: string;
  viTitle: string;
  enSubtitle: string;
  viSubtitle: string;
  bannerTone: "cream" | "burgundy" | "navy";
  filterTag?: CategoryTag;
}

export const COLLECTION_META: Record<string, CollectionMeta> = {
  "black-friday-cyber-monday-deals": {
    slug: "black-friday-cyber-monday-deals",
    enTitle: "25% Off Sitewide — Black Friday Deals",
    viTitle: "Giảm 25% Toàn Cửa Hàng — Ưu Đãi Black Friday",
    enSubtitle: "Our biggest sale of the year. Plus get a FREE Super-Fluff Tote on orders $250+.",
    viSubtitle: "Đợt giảm giá lớn nhất năm. Tặng ngay túi Super-Fluff Tote miễn phí cho đơn từ 6.250.000₫.",
    bannerTone: "burgundy",
  },
  "best-sellers": {
    slug: "best-sellers",
    enTitle: "Best of Sale",
    viTitle: "Sản Phẩm Sale Bán Chạy",
    enSubtitle: "Most-loved sheets, robes, comforters, and pillows—all 25% to 35% off.",
    viSubtitle: "Những bộ ga giường, áo choàng, ruột chăn và gối được yêu thích nhất — giảm 25% đến 35%.",
    bannerTone: "cream",
  },
  "holiday-gift-guide": {
    slug: "holiday-gift-guide",
    enTitle: "Shop the Gift Guide",
    viTitle: "Gợi Ý Quà Tặng Lễ Hội",
    enSubtitle: "Cozy throws, plush robes, Mulberry silk, and curated gift bundles on sale.",
    viSubtitle: "Chăn đắp ấm áp, áo choàng bông mịn, lụa Mulberry và combo quà tặng đang giảm giá.",
    bannerTone: "burgundy",
    filterTag: "gifts",
  },
  "all-sheets": {
    slug: "all-sheets",
    enTitle: "All Sheets",
    viTitle: "Tất Cả Ga Giường",
    enSubtitle: "From cool, crisp Classic Percale to buttery-soft Luxe Sateen and European Linen.",
    viSubtitle: "Từ Classic Percale mát mịn sắc nét đến Luxe Sateen mềm mượt và Vải Lanh Châu Âu.",
    bannerTone: "cream",
    filterTag: "sheets",
  },
  "luxe-sateen-sheets": {
    slug: "luxe-sateen-sheets",
    enTitle: "Luxe Sateen Sheets",
    viTitle: "Bộ Sưu Tập Luxe Sateen",
    enSubtitle: "480-thread-count buttery softness with a subtly luminous hotel finish.",
    viSubtitle: "Mật độ 480 sợi mềm mịn như bơ với độ bóng mờ tinh tế chuẩn khách sạn.",
    bannerTone: "cream",
    filterTag: "sateen",
  },
  "classic-percale-sheets": {
    slug: "classic-percale-sheets",
    enTitle: "Classic Percale Sheets",
    viTitle: "Bộ Sưu Tập Classic Percale",
    enSubtitle: "Crisp, breathable 270-thread-count cotton made for cool sleepers.",
    viSubtitle: "Cotton 270 sợi thoáng khí mát rượi, lý tưởng cho người thích cảm giác giòn mịn.",
    bannerTone: "cream",
    filterTag: "percale",
  },
  "linen-sheets": {
    slug: "linen-sheets",
    enTitle: "Washed European Linen",
    viTitle: "Ga Giường Vải Lanh Châu Âu",
    enSubtitle: "Relaxed, breathable flax linen pre-washed for lived-in softness.",
    viSubtitle: "Vải lanh châu Âu thoáng mát, được giặt mềm sẵn cho cảm giác thư thái tự nhiên.",
    bannerTone: "cream",
    filterTag: "linen",
  },
  "heathered-cashmere": {
    slug: "heathered-cashmere",
    enTitle: "Heathered Cashmere & Cozy Bedding",
    viTitle: "Chăn Ga Ấm Áp & Cashmere",
    enSubtitle: "Plush cold-weather layers crafted for ultra-cozy nights.",
    viSubtitle: "Các lớp chăn ga ấm áp cho những đêm se lạnh trọn vẹn.",
    bannerTone: "cream",
    filterTag: "bed",
  },
  "sheet-sets": {
    slug: "sheet-sets",
    enTitle: "Core Sheet Sets",
    viTitle: "Bộ Ga Giường Cơ Bản Core",
    enSubtitle: "Essential 4-piece sheet sets in Percale, Sateen, and Washed Linen.",
    viSubtitle: "Bộ ga 4 món thiết yếu với chất liệu Percale, Sateen và Vải Lanh.",
    bannerTone: "cream",
    filterTag: "sheets",
  },
  "sheet-bundles": {
    slug: "sheet-bundles",
    enTitle: "Bedding Bundles — Save Up to 35%",
    viTitle: "Combo Chăn Ga — Tiết Kiệm Tới 35%",
    enSubtitle: "Bundle sheets, duvet covers, and extra pillowcases for maximum Black Friday savings.",
    viSubtitle: "Kết hợp ga giường, vỏ chăn và vỏ gối thêm với mức tiết kiệm lớn nhất mùa Black Friday.",
    bannerTone: "navy",
    filterTag: "bundles",
  },
  "all-bundles": {
    slug: "all-bundles",
    enTitle: "Bundle Savings — Up to 40% Off",
    viTitle: "Combo Tiết Kiệm — Giảm Tới 40%",
    enSubtitle: "Mystery 48-hour bundles plus curated bed & bath sets stacked with Black Friday deals.",
    viSubtitle: "Combo bí ẩn đổi mới mỗi 48 giờ cùng các bộ sản phẩm phòng ngủ & phòng tắm tiết kiệm nhất.",
    bannerTone: "burgundy",
    filterTag: "bundles",
  },
  "all-bed": {
    slug: "all-bed",
    enTitle: "All Bedding",
    viTitle: "Tất Cả Chăn Ga Gối",
    enSubtitle: "Build your dream bed from sheets and duvet covers to down comforters and blankets.",
    viSubtitle: "Hoàn thiện chiếc giường mơ ước với ga giường, vỏ chăn, ruột chăn lông vũ và chăn phủ.",
    bannerTone: "cream",
    filterTag: "bed",
  },
  "duvet-covers": {
    slug: "duvet-covers",
    enTitle: "Duvet Covers",
    viTitle: "Vỏ Chăn Cao Cấp",
    enSubtitle: "Crisp Percale and buttery Luxe Sateen duvet covers with secure interior corner ties.",
    viSubtitle: "Vỏ chăn Percale thoáng mát và Luxe Sateen mềm mịn kèm dây buộc 4 góc chắc chắn.",
    bannerTone: "cream",
    filterTag: "duvets",
  },
  comforters: {
    slug: "comforters",
    enTitle: "Comforters",
    viTitle: "Ruột Chăn Lông Vũ",
    enSubtitle: "Award-winning Down Comforters in Lightweight, All-Season, and Ultra-Warm.",
    viSubtitle: "Ruột chăn lông vũ đạt giải thưởng với các độ ấm Nhẹ, Bốn mùa và Siêu ấm.",
    bannerTone: "cream",
    filterTag: "duvets",
  },
  pillows: {
    slug: "pillows",
    enTitle: "Pillows & Pillowcases",
    viTitle: "Gối & Vỏ Gối",
    enSubtitle: "Cloud-like Down Pillows and breathable cotton pillowcase sets.",
    viSubtitle: "Gối lông vũ êm ái như mây cùng bộ vỏ gối cotton thoáng khí.",
    bannerTone: "cream",
    filterTag: "pillows",
  },
  pillowcases: {
    slug: "pillowcases",
    enTitle: "Pillowcases",
    viTitle: "Bộ Vỏ Gối",
    enSubtitle: "Extra sets in Classic Percale, Luxe Sateen, and Mulberry Silk.",
    viSubtitle: "Vỏ gối rời chất liệu Classic Percale, Luxe Sateen và Lụa Mulberry.",
    bannerTone: "cream",
    filterTag: "pillows",
  },
  "fitted-sheets": {
    slug: "fitted-sheets",
    enTitle: "Fitted Sheets & Sets",
    viTitle: "Ga Chun Bọc Đệm & Bộ Ga",
    enSubtitle: "Deep-pocket fitted sheets engineered to stay snug all night.",
    viSubtitle: "Ga chun bọc đệm sâu 40cm ôm sát chắc chắn suốt đêm.",
    bannerTone: "cream",
    filterTag: "sheets",
  },
  "duvet-inserts-pillows": {
    slug: "duvet-inserts-pillows",
    enTitle: "Duvet Inserts & Pillows",
    viTitle: "Ruột Chăn & Gối",
    enSubtitle: "Responsibly sourced Down comforters and pillows designed for restorative sleep.",
    viSubtitle: "Ruột chăn và gối lông vũ tuyển chọn cho giấc ngủ sâu trọn vẹn.",
    bannerTone: "cream",
    filterTag: "duvets",
  },
  "all-bath": {
    slug: "all-bath",
    enTitle: "All Bath & Robes",
    viTitle: "Tất Cả Đồ Phòng Tắm & Áo Choàng",
    enSubtitle: "Oprah’s Favorite Things Super-Plush robes, waffle robes, slippers, and spa bundles.",
    viSubtitle: "Áo choàng Super-Plush đạt giải Oprah's Favorite Things, áo tổ ong Waffle, dép bông và combo spa.",
    bannerTone: "cream",
    filterTag: "bath",
  },
  "bath-towels": {
    slug: "bath-towels",
    enTitle: "Super-Plush Bath & Towels",
    viTitle: "Khăn Tắm & Đồ Tắm Super-Plush",
    enSubtitle: "Ultra-absorbent Turkish cotton essentials for an everyday spa feel.",
    viSubtitle: "Cotton Thổ Nhĩ Kỳ siêu thấm hút mang cảm giác spa về ngay nhà bạn.",
    bannerTone: "cream",
    filterTag: "bath",
  },
  robes: {
    slug: "robes",
    enTitle: "Robes",
    viTitle: "Áo Choàng Tắm",
    enSubtitle: "Cloud-soft Super-Plush Robes and breathable Dreamweave Waffle Robes.",
    viSubtitle: "Áo choàng bông dày Super-Plush và áo choàng tổ ong Dreamweave Waffle thoáng nhẹ.",
    bannerTone: "cream",
    filterTag: "robes",
  },
  "bath-mats": {
    slug: "bath-mats",
    enTitle: "Bath Accessories & Essentials",
    viTitle: "Phụ Kiện Phòng Tắm",
    enSubtitle: "Plush bath accessories, pouches, slippers, and cozy Turkish cotton essentials.",
    viSubtitle: "Phụ kiện phòng tắm mềm mịn, dép đi trong nhà, túi đựng đồ và bộ chăm sóc cá nhân.",
    bannerTone: "cream",
    filterTag: "bath",
  },
  "bath-bundles": {
    slug: "bath-bundles",
    enTitle: "Bath Bundles — Up to 40% Off",
    viTitle: "Combo Phòng Tắm — Giảm Tới 40%",
    enSubtitle: "Complete bath & robe bundles at maximum Black Friday savings.",
    viSubtitle: "Combo phòng tắm & áo choàng trọn gói với ưu đãi lớn nhất năm.",
    bannerTone: "navy",
    filterTag: "bath",
  },
  "home-accessories": {
    slug: "home-accessories",
    enTitle: "Home & Accents",
    viTitle: "Nhà Cửa & Phụ Kiện",
    enSubtitle: "Throw blankets, heritage wool, waffle weaves, and silk accessories.",
    viSubtitle: "Chăn đắp sofa, chăn len Heritage Wool, dệt tổ ong Waffle và phụ kiện lụa.",
    bannerTone: "cream",
    filterTag: "home",
  },
  "blankets-throws": {
    slug: "blankets-throws",
    enTitle: "Blankets & Throws",
    viTitle: "Chăn Đắp & Chăn Phủ",
    enSubtitle: "Super Fluff throws, Dreamweave Waffle blankets, and Heritage Wool layers.",
    viSubtitle: "Chăn đắp Super Fluff, chăn tổ ong Dreamweave Waffle và chăn len Heritage Wool.",
    bannerTone: "cream",
    filterTag: "throws",
  },
  "decorative-pillows": {
    slug: "decorative-pillows",
    enTitle: "Decorative Layers & Accents",
    viTitle: "Gối & Phụ Kiện Trang Trí",
    enSubtitle: "Textural throws, pillows, and warm seasonal finishes for every room.",
    viSubtitle: "Chăn gối giàu kết cấu và sắc màu ấm áp cho mọi không gian sống.",
    bannerTone: "cream",
    filterTag: "home",
  },
  "dreamweave-waffle": {
    slug: "dreamweave-waffle",
    enTitle: "Waffle World",
    viTitle: "Thế Giới Waffle",
    enSubtitle: "Tactile, airy Dreamweave Waffle robes, bed blankets, and throw blankets.",
    viSubtitle: "Áo choàng, chăn phủ giường và chăn đắp tổ ong Dreamweave Waffle nhẹ thoáng.",
    bannerTone: "cream",
    filterTag: "waffle",
  },
  "cozy-shop": {
    slug: "cozy-shop",
    enTitle: "The Cozy Shop",
    viTitle: "Góc Ấm Cúng",
    enSubtitle: "Plush robes, Super Fluff throws, heritage wool, and warm bedding layers.",
    viSubtitle: "Áo choàng bông mịn, chăn Super Fluff, chăn len và các lớp chăn ga ấm áp.",
    bannerTone: "cream",
    filterTag: "gifts",
  },
  "hosting-essentials": {
    slug: "hosting-essentials",
    enTitle: "Hosting Essentials",
    viTitle: "Đón Khách Chu Đáo",
    enSubtitle: "Hotel-grade guest room sheets, pillows, and plush towels ready for holiday guests.",
    viSubtitle: "Chăn ga gối và đồ tắm chuẩn khách sạn giúp phòng khách luôn sẵn sàng đón người thân.",
    bannerTone: "cream",
    filterTag: "bed",
  },
  "new-arrivals": {
    slug: "new-arrivals",
    enTitle: "New & Trending",
    viTitle: "Hàng Mới Về & Nổi Bật",
    enSubtitle: "Fresh holiday stripes, cozy textures, and newly released Brooklinen favorites.",
    viSubtitle: "Họa tiết sọc mùa mới, chất liệu ấm áp và những sản phẩm mới ra mắt được săn đón.",
    bannerTone: "cream",
    filterTag: "trending",
  },
  "award-winners": {
    slug: "award-winners",
    enTitle: "Award-Winning Favorites",
    viTitle: "Sản Phẩm Đạt Giải Thưởng",
    enSubtitle: "Recognized by Wirecutter, Architectural Digest, Oprah’s Favorite Things, and Vogue.",
    viSubtitle: "Được vinh danh bởi Wirecutter, Architectural Digest, Oprah’s Favorite Things và Vogue.",
    bannerTone: "navy",
    filterTag: "awards",
  },
  "best-sheets-ever": {
    slug: "best-sheets-ever",
    enTitle: "Best. Sheets. Ever.",
    viTitle: "Ga Giường. Đỉnh. Nhất.",
    enSubtitle: "Discover why over 175,000 5-star reviewers swear by Classic Percale and Luxe Sateen.",
    viSubtitle: "Khám phá lý do hơn 175.000 đánh giá 5 sao tin chọn Classic Percale và Luxe Sateen.",
    bannerTone: "navy",
    filterTag: "sheets",
  },
  "hsa-fsa-eligible": {
    slug: "hsa-fsa-eligible",
    enTitle: "FSA/HSA Eligible Sleep Essentials",
    viTitle: "Sản Phẩm Hỗ Trợ Thanh Toán FSA/HSA",
    enSubtitle: "Use pre-tax wellness dollars on breathable bedding, pillows, and restorative sleep essentials.",
    viSubtitle: "Sử dụng nguồn tiền trước thuế cho chăn ga thoáng khí, gối nâng đỡ và giấc ngủ chất lượng.",
    bannerTone: "navy",
    filterTag: "bed",
  },
  "shop-explore": {
    slug: "shop-explore",
    enTitle: "All Product Collections",
    viTitle: "Tất Cả Bộ Sưu Tập Sản Phẩm",
    enSubtitle: "Browse every Brooklinen homepage essential in one place.",
    viSubtitle: "Khám phá trọn bộ sản phẩm Brooklinen ngay tại một trang duy nhất.",
    bannerTone: "cream",
  },
};

export function getCollectionMeta(slug: string): CollectionMeta {
  if (COLLECTION_META[slug]) return COLLECTION_META[slug];
  const readable = slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
  return {
    slug,
    enTitle: readable || "All Products",
    viTitle: readable || "Tất Cả Sản Phẩm",
    enSubtitle: "25% Off Sitewide Black Friday Sale — shop Brooklinen favorites locally.",
    viSubtitle: "Ưu đãi Black Friday giảm 25% toàn cửa hàng — khám phá các sản phẩm Brooklinen.",
    bannerTone: "cream",
  };
}

export function getProductsForCollection(slug: string): CatalogProduct[] {
  const meta = COLLECTION_META[slug];
  if (!meta?.filterTag) return CATALOG;
  const filtered = CATALOG.filter((p) => p.tags.includes(meta.filterTag!));
  return filtered.length > 0 ? filtered : CATALOG;
}

export function isShoppingHubPage(slug: string): boolean {
  return slug in COLLECTION_META;
}

export function getRelatedProducts(slug: string, count = 4): CatalogProduct[] {
  const current = getProductBySlug(slug);
  const others = CATALOG.filter((p) => p.slug !== slug && p.slug !== "rise-ai-giftcard");
  if (!current) return others.slice(0, count);
  const scored = others
    .map((p) => ({
      p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((x) => x.p);
}

export function getLocalizedCategoryName(p: CatalogProduct, locale: Locale): string {
  return locale === "vi" ? p.viCategoryName : p.enCategoryName;
}
