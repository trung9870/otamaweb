"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getLocalizedCategoryName,
  getProductBySlug,
  getRelatedProducts,
  type CatalogProduct,
} from "./catalog";
import { parseDollar, useCart } from "./CartContext";
import { useLanguage } from "./LanguageContext";
import {
  formatPrice,
  formatPriceString,
  translateBadge,
  translateColor,
  translateDiscount,
  translateProductTitle,
  translateSize,
  UI_COPY,
} from "./translations";
import { SparkleIcon, StarRating } from "./icons";

const BED_SIZES: { label: string; delta: number }[] = [
  { label: "Twin", delta: 0 },
  { label: "Twin XL", delta: 10 },
  { label: "Full", delta: 20 },
  { label: "Queen", delta: 30 },
  { label: "King", delta: 45 },
  { label: "Cal King", delta: 45 },
];

const APPAREL_SIZES: { label: string; delta: number }[] = [
  { label: "XS/S", delta: 0 },
  { label: "M/L", delta: 0 },
  { label: "XL", delta: 0 },
];

const GIFTCARD_AMOUNTS: { label: string; delta: number }[] = [
  { label: "$50", delta: -50 },
  { label: "$100", delta: 0 },
  { label: "$150", delta: 50 },
  { label: "$250", delta: 150 },
];

function sizeOptionsFor(product: CatalogProduct) {
  const lower = product.title.toLowerCase();
  if (product.slug === "rise-ai-giftcard") return GIFTCARD_AMOUNTS;
  if (lower.includes("robe") || lower.includes("slipper")) return APPAREL_SIZES;
  if (lower.includes("pouch") || lower.includes("eyemask") || lower.includes("throw")) {
    return [{ label: "One Size", delta: 0 }];
  }
  return BED_SIZES;
}

export function ProductDetailView({ slug }: { slug: string }) {
  const { locale } = useLanguage();
  const qvCopy = UI_COPY[locale].quickViewModal;
  const { addItem, openCart } = useCart();

  const product = getProductBySlug(slug);

  const [selectedSwatch, setSelectedSwatch] = useState(
    product && product.defaultSwatchIndex < product.swatches.length
      ? product.defaultSwatchIndex
      : 0
  );
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(() => {
    if (!product) return 0;
    const opts = sizeOptionsFor(product);
    const queenIdx = opts.findIndex((o) => o.label === "Queen" || o.label === "$100");
    return queenIdx >= 0 ? queenIdx : 0;
  });
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-[960px] px-6 py-24 text-center">
        <h1 className="font-toledo text-[36px] text-[#283455]">
          {locale === "vi" ? "Không tìm thấy sản phẩm" : "Product Not Found"}
        </h1>
        <p className="mt-3 text-[16px] text-[#5B647A]">
          {locale === "vi"
            ? "Sản phẩm bạn tìm không có trong danh mục hiện tại."
            : "The product you are looking for is not in this local catalog."}
        </p>
        <Link
          href="/collections/best-sellers"
          className="mt-6 inline-flex h-[52px] items-center justify-center rounded-[20px] bg-[#283455] px-8 text-[14px] font-bold text-white"
        >
          {locale === "vi" ? "Xem tất cả sản phẩm" : "Browse All Products"}
        </Link>
      </div>
    );
  }

  const sizes = sizeOptionsFor(product);
  const activeSize = sizes[selectedSizeIdx] || sizes[0];
  const activeSwatch = product.swatches[selectedSwatch];
  const mainImg = activeSwatch?.mainImage || product.mainImage;
  const hoverImg = activeSwatch?.hoverImage || product.hoverImage;
  const gallery = mainImg === hoverImg ? [mainImg] : [mainImg, hoverImg];
  const currentImg = gallery[activePhotoIdx] || gallery[0];

  const baseSale = parseDollar(product.salePrice);
  const baseOrig = parseDollar(product.originalPrice);
  const finalSale = Math.max(10, baseSale + activeSize.delta);
  const finalOrig = baseOrig > 0 ? Math.max(finalSale, baseOrig + activeSize.delta) : 0;
  const displayTitle = translateProductTitle(product.title, locale);
  const activeColorRaw = activeSwatch?.label || "Default";
  const categoryName = getLocalizedCategoryName(product, locale);
  const related = getRelatedProducts(product.slug, 4);

  const handleAddToBag = () => {
    addItem(
      {
        key: `${product.slug}::${activeColorRaw}::${activeSize.label}`,
        slug: product.slug,
        title: product.title,
        color: activeColorRaw,
        size: activeSize.label,
        price: finalSale,
        originalPrice: finalOrig || finalSale,
        image: mainImg,
        href: `/products/${product.slug}`,
      },
      qty
    );
    openCart();
  };

  return (
    <div className="w-full bg-[#FDFAF8]">
      <div className="mx-auto max-w-[1440px] px-5 pt-6 pb-16 lg:px-16 lg:pt-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-[13px] text-[#5B647A]"
        >
          <Link href="/" className="hover:underline">
            {locale === "vi" ? "Trang chủ" : "Home"}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/collections/${product.categorySlug}`} className="hover:underline">
            {categoryName}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-bold text-[#283455]">{displayTitle}</span>
        </nav>

        {/* Main 2-Column Product Layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          {/* Left Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F4F6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImg}
                alt={displayTitle}
                width={720}
                height={720}
                className="h-full w-full object-cover"
              />
              {product.topBadge && (
                <span className="absolute top-4 left-4 rounded-full bg-white px-3.5 py-1.5 text-[11.5px] font-bold tracking-[0.06em] uppercase text-[#283455] shadow-xs">
                  {translateBadge(product.topBadge, locale)}
                </span>
              )}
              {product.awardSeal && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.awardSeal}
                  alt=""
                  width={82}
                  height={82}
                  className="absolute top-4 right-4 h-[72px] w-[72px] object-contain lg:h-[82px] lg:w-[82px]"
                />
              )}
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={`${imgUrl}-${idx}`}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    aria-label={
                      locale === "vi" ? `Xem ảnh ${idx + 1}` : `View photo ${idx + 1}`
                    }
                    className={`aspect-square cursor-pointer overflow-hidden rounded-xl border-2 bg-[#F4F4F6] transition-all ${
                      activePhotoIdx === idx
                        ? "border-[#283455]"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt=""
                      width={180}
                      height={180}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Purchase Column */}
          <div className="flex flex-col">
            {product.promoEyebrow && (
              <p
                className={`flex items-center gap-1.5 text-[13px] font-bold tracking-[0.08em] uppercase ${
                  product.promoTone === "urgent" ? "text-[#AA3F00]" : "text-[#417823]"
                }`}
              >
                <SparkleIcon className="h-3.5 w-3.5" />
                <span>{translateBadge(product.promoEyebrow, locale)}</span>
              </p>
            )}

            <h1 className="mt-2 font-toledo text-[32px] leading-[1.15] text-[#283455] lg:text-[40px]">
              {displayTitle}
            </h1>

            {product.reviewCount && (
              <div className="mt-3 flex items-center gap-2">
                <StarRating rating={product.rating} size={15} />
                <a
                  href="#reviews"
                  className="text-[14px] text-[#5B647A] underline underline-offset-2 hover:text-[#283455]"
                >
                  {product.reviewCount} {qvCopy.reviewsSuffix}
                </a>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2.5 text-[22px]">
              {finalOrig > finalSale && (
                <span className="text-[#7E8596] line-through">
                  {formatPrice(finalOrig, locale)}
                </span>
              )}
              <span className="font-bold text-[#283455]">
                {formatPrice(finalSale, locale)}
              </span>
              {product.discountBadge && (
                <span className="rounded-md bg-[#EAF3E4] px-2.5 py-1 text-[13px] font-bold text-[#417823]">
                  {translateDiscount(product.discountBadge, locale)}
                </span>
              )}
            </div>

            <p className="mt-4 text-[15.5px] leading-[1.6] text-[#3D4866]">
              {locale === "vi" ? product.viDescription : product.enDescription}
            </p>

            {/* Color Swatches */}
            {product.swatches.length > 0 && (
              <div className="mt-6">
                <p className="text-[14px] font-bold text-[#283455]">
                  {qvCopy.colorLabel}{" "}
                  <span className="font-normal">
                    {translateColor(activeColorRaw, locale)}
                  </span>
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {product.swatches.map((sw, idx) => {
                    const isSelected = idx === selectedSwatch;
                    const cLabel = translateColor(sw.label, locale);
                    return (
                      <button
                        key={`${sw.label}-${idx}`}
                        type="button"
                        aria-label={cLabel}
                        title={cLabel}
                        onClick={() => {
                          setSelectedSwatch(idx);
                          setActivePhotoIdx(0);
                        }}
                        className={`h-8 w-8 cursor-pointer overflow-hidden rounded-[6px] border transition-all ${
                          isSelected
                            ? "border-[#283455] ring-2 ring-[#283455] ring-offset-1"
                            : "border-[#D6D2CC] hover:border-[#283455]"
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
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="mt-6">
              <p className="text-[14px] font-bold text-[#283455]">{qvCopy.sizeLabel}</p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {sizes.map((sz, idx) => (
                  <button
                    key={sz.label}
                    type="button"
                    onClick={() => setSelectedSizeIdx(idx)}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-[13.5px] font-bold transition-colors ${
                      selectedSizeIdx === idx
                        ? "border-[#283455] bg-[#283455] text-white"
                        : "border-[#C9CFD9] bg-white text-[#283455] hover:border-[#283455]"
                    }`}
                  >
                    {translateSize(sz.label, locale)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Bag */}
            <div className="mt-7 flex items-center gap-3">
              <div className="inline-flex h-[54px] items-center rounded-[20px] border border-[#C9CFD9] bg-white px-2">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label={locale === "vi" ? "Giảm số lượng" : "Decrease quantity"}
                  className="h-10 w-10 cursor-pointer text-lg font-bold text-[#283455]"
                >
                  &minus;
                </button>
                <span className="w-8 text-center text-[15px] font-bold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label={locale === "vi" ? "Tăng số lượng" : "Increase quantity"}
                  className="h-10 w-10 cursor-pointer text-lg font-bold text-[#283455]"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToBag}
                className="h-[54px] flex-1 cursor-pointer rounded-[20px] bg-[#283455] px-6 text-[15px] font-bold text-white shadow-xs transition-colors hover:bg-[#1D2742]"
              >
                {qvCopy.addToBag} &mdash; {formatPrice(finalSale * qty, locale)}
              </button>
            </div>

            {/* Trust Callout Strip */}
            <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-[#F9F3ED] p-4 text-center text-[12px] font-bold text-[#283455]">
              <div>
                {locale === "vi" ? "Miễn phí ship từ 2.500.000₫" : "Free Shipping $100+"}
              </div>
              <div>
                {locale === "vi" ? "Bảo hành 365 ngày" : "365-Day Guarantee"}
              </div>
              <div>
                {locale === "vi" ? "Hỗ trợ FSA/HSA" : "FSA/HSA Eligible"}
              </div>
            </div>

            {/* Native Accordion Details */}
            <div className="mt-6 divide-y divide-[#E5E0DB] border-y border-[#E5E0DB]">
              <details open className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-bold text-[#283455]">
                  <span>{locale === "vi" ? "Bộ sản phẩm bao gồm" : "What's Included"}</span>
                  <span className="text-lg transition-transform group-open:rotate-45">+</span>
                </summary>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] text-[#3D4866]">
                  {(locale === "vi" ? product.viIncludes : product.enIncludes).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </details>

              <details className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-bold text-[#283455]">
                  <span>{locale === "vi" ? "Hướng dẫn bảo quản" : "Care Instructions"}</span>
                  <span className="text-lg transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-[#3D4866]">
                  {locale === "vi" ? product.viCare : product.enCare}
                </p>
              </details>

              <details className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-bold text-[#283455]">
                  <span>
                    {locale === "vi" ? "Giao hàng & Đổi trả 365 ngày" : "Shipping & 365-Day Returns"}
                  </span>
                  <span className="text-lg transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-[#3D4866]">
                  {locale === "vi"
                    ? "Miễn phí giao hàng tiêu chuẩn cho đơn từ 2.500.000₫ trở lên. Tặng kèm túi Super-Fluff Tote (trị giá 1.875.000₫) cho đơn từ 6.250.000₫. Đổi trả dễ dàng trong vòng 365 ngày nếu bạn chưa hoàn toàn hài lòng."
                    : "Free standard shipping on orders $100+. Orders $250+ automatically receive a FREE Super-Fluff Tote ($75 value). Easy returns or exchanges within 365 days."}
                </p>
              </details>
            </div>
          </div>
        </div>

        {/* Customer Reviews Anchor */}
        <section id="reviews" className="mt-16 rounded-2xl bg-[#F9F3ED] p-8 lg:p-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-toledo text-[28px] text-[#283455] lg:text-[34px]">
                {locale === "vi" ? "Đánh Giá Từ Khách Hàng" : "Customer Reviews"}
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={5} size={18} />
                <span className="text-[15px] font-bold text-[#283455]">
                  4.8 / 5 {product.reviewCount || ""}
                </span>
              </div>
            </div>
            <Link
              href="/pages/reviews"
              className="inline-flex h-[46px] items-center justify-center rounded-full border border-[#283455] px-6 text-[13.5px] font-bold text-[#283455] hover:bg-[#283455] hover:text-white"
            >
              {UI_COPY[locale].readOurReviews}
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {UI_COPY[locale].reviews.map((rev) => (
              <article key={rev.author} className="rounded-2xl bg-white p-6">
                <StarRating rating={5} size={14} />
                <h3 className="mt-3 font-toledo text-[21px] text-[#283455]">{rev.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#3D4866]">{rev.quote}</p>
                <p className="mt-4 text-[13.5px] font-bold text-[#283455]">{rev.author}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-[22px] font-bold text-[#283455] lg:text-[26px]">
            {locale === "vi" ? "Có Thể Bạn Sẽ Thích" : "You May Also Like"}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.map((rel) => {
              const title = translateProductTitle(rel.title, locale);
              return (
                <Link
                  key={rel.slug}
                  href={`/products/${rel.slug}`}
                  className="group block"
                >
                  <div className="aspect-square overflow-hidden rounded-xl bg-[#F4F4F6]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.mainImage}
                      alt={title}
                      width={320}
                      height={320}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-3 text-[15px] font-bold text-[#283455] group-hover:underline">
                    {title}
                  </p>
                  <p className="mt-1 text-[14px] text-[#283455]">
                    {rel.originalPrice && (
                      <span className="mr-1.5 text-[#7E8596] line-through">
                        {formatPriceString(rel.originalPrice, locale)}
                      </span>
                    )}
                    <span className="font-bold">
                      {formatPriceString(rel.salePrice, locale)}
                    </span>
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
