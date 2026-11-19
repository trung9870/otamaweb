"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getCollectionMeta,
  getProductsForCollection,
  type CatalogProduct,
  type CategoryTag,
} from "./catalog";
import { parseDollar, useCart } from "./CartContext";
import { useLanguage } from "./LanguageContext";
import {
  formatPriceString,
  translateBadge,
  translateColor,
  translateDiscount,
  translateProductTitle,
  UI_COPY,
} from "./translations";
import { SparkleIcon, StarRating } from "./icons";

type SortKey = "featured" | "price-asc" | "price-desc" | "reviews";

const FILTER_CHIPS: { tag: "all" | CategoryTag; en: string; vi: string }[] = [
  { tag: "all", en: "All", vi: "Tất cả" },
  { tag: "sheets", en: "Sheets", vi: "Ga giường" },
  { tag: "bed", en: "Bedding", vi: "Chăn gối" },
  { tag: "bath", en: "Bath & Robes", vi: "Phòng tắm" },
  { tag: "throws", en: "Throws & Blankets", vi: "Chăn đắp" },
  { tag: "bundles", en: "Bundles", vi: "Combo" },
  { tag: "awards", en: "Award Winners", vi: "Đạt giải" },
];

function parseReviews(str?: string): number {
  if (!str) return 0;
  return Number(str.replace(/[^0-9]/g, "")) || 0;
}

function GridProductCard({ product }: { product: CatalogProduct }) {
  const { locale } = useLanguage();
  const copy = UI_COPY[locale];
  const { openQuickView } = useCart();
  const [selectedSwatch, setSelectedSwatch] = useState(
    product.defaultSwatchIndex < product.swatches.length
      ? product.defaultSwatchIndex
      : 0
  );

  const activeSwatch = product.swatches[selectedSwatch];
  const displayMain = activeSwatch?.mainImage || product.mainImage;
  const displayHover = activeSwatch?.hoverImage || product.hoverImage;
  const displayTitle = translateProductTitle(product.title, locale);

  return (
    <article className="flex flex-col">
      <div className="group relative aspect-square w-full overflow-hidden bg-[#F4F4F6]">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayMain}
            alt={displayTitle}
            width={411}
            height={411}
            loading="lazy"
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayHover}
            alt=""
            width={411}
            height={411}
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </Link>

        {product.topBadge && (
          <span className="pointer-events-none absolute top-3.5 left-3.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold tracking-[0.06em] uppercase text-[#283455] shadow-xs">
            {translateBadge(product.topBadge, locale)}
          </span>
        )}

        {product.awardSeal && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.awardSeal}
            alt=""
            width={64}
            height={64}
            loading="lazy"
            className="pointer-events-none absolute top-3.5 right-3.5 h-[54px] w-[54px] object-contain lg:h-[64px] lg:w-[64px]"
          />
        )}

        <button
          type="button"
          onClick={() => openQuickView(product, selectedSwatch)}
          className="hidden lg:flex absolute inset-x-4 bottom-4 h-11 translate-y-1 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[14px] font-bold text-[#283455] opacity-0 shadow-md transition-all duration-200 hover:bg-white focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {copy.quickView}
        </button>

        <button
          type="button"
          onClick={() => openQuickView(product, selectedSwatch)}
          aria-label={`${copy.quickView} ${displayTitle}`}
          className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[20px] leading-none text-[#283455] shadow-md lg:hidden"
        >
          +
        </button>
      </div>

      {product.promoEyebrow && (
        <p
          className={`mt-3.5 flex items-center gap-1.5 text-[12px] font-bold tracking-[0.08em] uppercase ${
            product.promoTone === "urgent" ? "text-[#AA3F00]" : "text-[#417823]"
          }`}
        >
          <SparkleIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{translateBadge(product.promoEyebrow, locale)}</span>
        </p>
      )}

      <h3 className="mt-1.5 text-[17px] leading-[1.28] font-bold text-[#283455] lg:text-[19px]">
        <Link href={`/products/${product.slug}`} className="hover:underline">
          {displayTitle}
        </Link>
      </h3>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[15px] text-[#283455]">
        <span>{copy.fromPrice}</span>
        {product.originalPrice && (
          <span className="text-[#6E6E6E] line-through">
            {formatPriceString(product.originalPrice, locale)}
          </span>
        )}
        <span className="font-bold">
          {formatPriceString(product.salePrice, locale)}
        </span>
        {product.discountBadge && (
          <span className="rounded bg-[#EAF3E4] px-2 py-0.5 text-[12px] font-bold text-[#417823]">
            {translateDiscount(product.discountBadge, locale)}
          </span>
        )}
      </div>

      {product.reviewCount && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <StarRating rating={product.rating} size={13} />
          <span className="text-[13px] text-[#6E6E6E]">{product.reviewCount}</span>
        </div>
      )}

      {product.swatches.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {product.swatches.slice(0, 8).map((sw, idx) => {
            const isSelected = idx === selectedSwatch;
            const colorLabel = translateColor(sw.label, locale);
            return (
              <button
                key={`${sw.label}-${idx}`}
                type="button"
                aria-label={colorLabel}
                title={colorLabel}
                onClick={() => setSelectedSwatch(idx)}
                className={`h-6 w-6 cursor-pointer overflow-hidden rounded-[4px] border transition-all ${
                  isSelected
                    ? "border-[#283455] ring-[1.5px] ring-[#283455] ring-offset-1"
                    : "border-[#D6D2CC] hover:border-[#283455]/70"
                }`}
                style={
                  !sw.swatchImage && sw.color
                    ? { backgroundColor: sw.color }
                    : undefined
                }
              >
                {sw.swatchImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sw.swatchImage}
                    alt=""
                    width={24}
                    height={24}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </button>
            );
          })}
          {product.swatches.length > 8 && (
            <Link
              href={`/products/${product.slug}`}
              className="text-[12px] font-bold text-[#5B647A] hover:text-[#283455]"
            >
              +{product.swatches.length - 8}
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

export function CollectionView({ slug }: { slug: string }) {
  const { locale } = useLanguage();
  const meta = getCollectionMeta(slug);
  const baseProducts = useMemo(() => getProductsForCollection(slug), [slug]);
  const [activeTag, setActiveTag] = useState<"all" | CategoryTag>("all");
  const [sortBy, setSortBy] = useState<SortKey>("featured");

  const products = useMemo(() => {
    const filtered =
      activeTag === "all"
        ? baseProducts
        : baseProducts.filter((p) => p.tags.includes(activeTag));
    const list = [...filtered];
    if (sortBy === "price-asc") {
      list.sort((a, b) => parseDollar(a.salePrice) - parseDollar(b.salePrice));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => parseDollar(b.salePrice) - parseDollar(a.salePrice));
    } else if (sortBy === "reviews") {
      list.sort((a, b) => parseReviews(b.reviewCount) - parseReviews(a.reviewCount));
    }
    return list;
  }, [activeTag, baseProducts, sortBy]);

  const bannerClass =
    meta.bannerTone === "burgundy"
      ? "bg-[#740103] text-white"
      : meta.bannerTone === "navy"
        ? "bg-[#283455] text-white"
        : "bg-[#F9F3ED] text-[#283455] border-b border-[#ECE5DD]";

  return (
    <div className="w-full bg-[#FDFAF8]">
      {/* Collection Banner */}
      <section className={`w-full ${bannerClass}`}>
        <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-16 lg:py-14">
          <nav
            aria-label="Breadcrumb"
            className={`mb-4 flex items-center gap-2 text-[13px] ${
              meta.bannerTone === "cream" ? "text-[#5B647A]" : "text-white/80"
            }`}
          >
            <Link href="/" className="hover:underline">
              {locale === "vi" ? "Trang chủ" : "Home"}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-bold">
              {locale === "vi" ? meta.viTitle : meta.enTitle}
            </span>
          </nav>

          <h1 className="font-toledo text-[34px] leading-[1.15] lg:text-[46px]">
            {locale === "vi" ? meta.viTitle : meta.enTitle}
          </h1>
          <p
            className={`mt-3 max-w-[680px] text-[16px] leading-[1.5] lg:text-[18px] ${
              meta.bannerTone === "cream" ? "text-[#3D4866]" : "text-white/90"
            }`}
          >
            {locale === "vi" ? meta.viSubtitle : meta.enSubtitle}
          </p>
        </div>
      </section>

      {/* Filter & Sort Toolbar */}
      <section className="mx-auto max-w-[1440px] px-5 pt-7 pb-4 lg:px-16">
        <div className="flex flex-col gap-4 border-b border-[#ECE7E2] pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_CHIPS.map((chip) => {
              const active = activeTag === chip.tag;
              return (
                <button
                  key={chip.tag}
                  type="button"
                  onClick={() => setActiveTag(chip.tag)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-bold transition-colors ${
                    active
                      ? "bg-[#283455] text-white"
                      : "border border-[#D5D9E2] bg-white text-[#283455] hover:border-[#283455]"
                  }`}
                >
                  {locale === "vi" ? chip.vi : chip.en}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <p className="text-[13.5px] text-[#5B647A]">
              {products.length}{" "}
              {locale === "vi" ? "sản phẩm" : products.length === 1 ? "item" : "items"}
            </p>

            <label className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#283455]">
              <span>{locale === "vi" ? "Sắp xếp:" : "Sort:"}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="rounded-full border border-[#C9CFD9] bg-white px-3.5 py-1.5 text-[13px] font-normal text-[#283455] focus:border-[#283455] focus:outline-none"
              >
                <option value="featured">
                  {locale === "vi" ? "Nổi bật" : "Featured"}
                </option>
                <option value="price-asc">
                  {locale === "vi" ? "Giá: Thấp → Cao" : "Price: Low to High"}
                </option>
                <option value="price-desc">
                  {locale === "vi" ? "Giá: Cao → Thấp" : "Price: High to Low"}
                </option>
                <option value="reviews">
                  {locale === "vi" ? "Nhiều đánh giá nhất" : "Most Reviewed"}
                </option>
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-[1440px] px-5 pt-4 pb-16 lg:px-16">
        {products.length === 0 ? (
          <div className="rounded-2xl bg-[#F9F3ED] px-6 py-14 text-center">
            <p className="font-toledo text-[24px] text-[#283455]">
              {locale === "vi"
                ? "Không có sản phẩm nào trong bộ lọc này"
                : "No products match this filter"}
            </p>
            <button
              type="button"
              onClick={() => setActiveTag("all")}
              className="mt-4 cursor-pointer rounded-[20px] bg-[#283455] px-6 py-2.5 text-[14px] font-bold text-white"
            >
              {locale === "vi" ? "Xem tất cả sản phẩm" : "Reset Filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <GridProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
