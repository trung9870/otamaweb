import type { SwatchItem } from "@/components/sites/brooklinen/data";
import type {
  CatalogProduct,
  CategoryTag,
  CollectionMeta,
} from "@/components/sites/brooklinen/catalog";

export type StorageMode = "local" | "supabase";

export type HomepageSectionKey = "bestOfSale" | "giftGuide" | "collection";

export type StoreOrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cod" | "bank_transfer";

export interface StoreProduct {
  id: string;
  slug: string;
  titleEn: string;
  titleVi: string;
  categorySlug: string;
  tags: CategoryTag[];
  salePriceUsd: number;
  originalPriceUsd: number;
  discountBadge: string;
  topBadge: string;
  promoEyebrow: string;
  promoTone: "sale" | "urgent";
  mainImage: string;
  hoverImage: string;
  awardSeal?: string;
  reviewCount: string;
  rating: number;
  defaultSwatchIndex: number;
  swatches: SwatchItem[];
  descriptionEn: string;
  descriptionVi: string;
  includesEn: string[];
  includesVi: string[];
  careEn: string;
  careVi: string;
  sections: HomepageSectionKey[];
  active: boolean;
  sortOrder: number;
  updatedAt: string;
}

export interface StoreCategory {
  slug: string;
  titleEn: string;
  titleVi: string;
  subtitleEn: string;
  subtitleVi: string;
  bannerTone: "cream" | "navy" | "burgundy";
  filterTag?: CategoryTag;
  image?: string;
  showOnHome: boolean;
  sortOrder: number;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  vndRate: number;
  freeShippingThresholdUsd: number;
  freeGiftThresholdUsd: number;
  shippingFeeUsd: number;
  promoCode: string;
  announcementEn: string[];
  announcementVi: string[];
  heroHeadingEn: string[];
  heroHeadingVi: string[];
  heroSubtitleEn: string[];
  heroSubtitleVi: string[];
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface StoreOrderItem {
  slug: string;
  title: string;
  color: string;
  size: string;
  qty: number;
  priceUsd: number;
  image: string;
}

export interface StoreOrder {
  id: string;
  createdAt: string;
  status: StoreOrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  paymentMethod: PaymentMethod;
  promoCode: string;
  locale: "en" | "vi";
  vndRateAtOrder: number;
  subtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  freeToteIncluded: boolean;
  items: StoreOrderItem[];
  note: string;
}

export interface StoreDatabase {
  products: StoreProduct[];
  categories: StoreCategory[];
  settings: StoreSettings;
  orders: StoreOrder[];
}

export interface PublicStorePayload {
  mode: StorageMode;
  products: StoreProduct[];
  categories: StoreCategory[];
  settings: StoreSettings;
}

export interface AdminDashboardPayload extends PublicStorePayload {
  orders: StoreOrder[];
  usingDefaultCredentials: boolean;
  adminEmail: string;
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
    revenueUsd: number;
    revenueVnd: number;
  };
}

export function computeDiscountBadge(
  salePriceUsd: number,
  originalPriceUsd: number,
  fallback = ""
): string {
  if (originalPriceUsd > salePriceUsd && originalPriceUsd > 0) {
    const pct = Math.round(((originalPriceUsd - salePriceUsd) / originalPriceUsd) * 100);
    if (pct >= 5) return `${pct}% Off`;
  }
  return fallback;
}

export function storeProductToCatalogProduct(
  p: StoreProduct,
  categoryMap?: Map<string, StoreCategory>
): CatalogProduct & { titleVi?: string } {
  const cat = categoryMap?.get(p.categorySlug);
  const sale = `$${Math.round(p.salePriceUsd)}`;
  const orig = p.originalPriceUsd > p.salePriceUsd ? `$${Math.round(p.originalPriceUsd)}` : "";
  return {
    id: p.id,
    slug: p.slug,
    title: p.titleEn,
    titleVi: p.titleVi,
    href: `/products/${p.slug}`,
    topBadge: p.topBadge,
    promoEyebrow: p.promoEyebrow,
    promoTone: p.promoTone,
    originalPrice: orig,
    salePrice: sale,
    discountBadge: p.discountBadge || computeDiscountBadge(p.salePriceUsd, p.originalPriceUsd),
    reviewCount: p.reviewCount,
    rating: p.rating,
    mainImage: p.mainImage,
    hoverImage: p.hoverImage || p.mainImage,
    awardSeal: p.awardSeal,
    defaultSwatchIndex: p.defaultSwatchIndex,
    swatches: p.swatches,
    tags: p.tags,
    categorySlug: p.categorySlug,
    enCategoryName: cat?.titleEn || "Shop All",
    viCategoryName: cat?.titleVi || "Tất Cả Sản Phẩm",
    enDescription: p.descriptionEn,
    viDescription: p.descriptionVi,
    enIncludes: p.includesEn,
    viIncludes: p.includesVi,
    enCare: p.careEn,
    viCare: p.careVi,
  };
}

export function storeCategoryToCollectionMeta(c: StoreCategory): CollectionMeta {
  return {
    slug: c.slug,
    enTitle: c.titleEn,
    viTitle: c.titleVi,
    enSubtitle: c.subtitleEn,
    viSubtitle: c.subtitleVi,
    bannerTone: c.bannerTone,
    filterTag: c.filterTag,
  };
}

export function slugifyText(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
