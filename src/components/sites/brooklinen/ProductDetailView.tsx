"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getLocalizedCategoryName,
  type CatalogProduct,
  type ProductDetailBlock,
} from "./catalog";
import { parseDollar, useCart } from "./CartContext";
import { useLanguage, type Locale } from "./LanguageContext";
import { useStoreData } from "./StoreDataContext";
import {
  translateBadge,
  translateColor,
  translateDiscount,
  translateProductTitle,
  translateSize,
  UI_COPY,
} from "./translations";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparkleIcon,
  StarRating,
} from "./icons";
import { getDefaultProductDetailBlocks } from "@/lib/product-detail-defaults";

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

function RichBodyContent({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const segments: ({ kind: "p"; text: string } | { kind: "ul"; items: string[] })[] = [];

  for (const line of lines) {
    if (/^[-•*]\s+/.test(line)) {
      const cleaned = line.replace(/^[-•*]\s+/, "").trim();
      const prev = segments[segments.length - 1];
      if (prev && prev.kind === "ul") {
        prev.items.push(cleaned);
      } else {
        segments.push({ kind: "ul", items: [cleaned] });
      }
    } else {
      segments.push({ kind: "p", text: line });
    }
  }

  return (
    <div className="mt-4 space-y-3.5 text-[15.5px] leading-[1.68] text-[#3D4866] lg:text-[16.5px]">
      {segments.map((seg, i) =>
        seg.kind === "p" ? (
          <p key={i}>{seg.text}</p>
        ) : (
          <ul key={i} className="space-y-2 pt-1">
            {seg.items.map((item, j) => (
              <li key={j} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#283455]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

function EditorialStoryBlock({
  block,
  locale,
}: {
  block: ProductDetailBlock;
  locale: Locale;
}) {
  const eyebrow = (locale === "vi" ? block.eyebrowVi : block.eyebrowEn) || block.eyebrowVi || block.eyebrowEn;
  const heading = (locale === "vi" ? block.headingVi : block.headingEn) || block.headingVi || block.headingEn;
  const body = (locale === "vi" ? block.bodyVi : block.bodyEn) || block.bodyVi || block.bodyEn;
  const caption = (locale === "vi" ? block.captionVi : block.captionEn) || block.captionVi || block.captionEn;

  const hasMedia =
    block.layout !== "text-only" &&
    Boolean(block.image || block.secondaryImage);
  const hasCopy = Boolean(eyebrow || heading || body);

  if (block.layout === "full-banner") {
    return (
      <article className="space-y-5">
        {block.image && (
          <figure className="overflow-hidden rounded-2xl bg-[#F4F4F6]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.image}
              alt={heading || caption || ""}
              width={1320}
              height={680}
              loading="lazy"
              className="max-h-[680px] w-full object-cover"
            />
            {caption && (
              <figcaption className="bg-[#F9F3ED] px-5 py-3 text-center text-[13.5px] text-[#5B647A]">
                {caption}
              </figcaption>
            )}
          </figure>
        )}
        {hasCopy && (
          <div className="mx-auto max-w-[780px] text-center">
            {eyebrow && (
              <p className="text-[12px] font-bold tracking-[0.12em] text-[#5B647A] uppercase">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h3 className="bkl-detail-heading mt-2 font-toledo text-[#283455]">
                {heading}
              </h3>
            )}
            {body && (
              <div className="text-left sm:text-center">
                <RichBodyContent text={body} />
              </div>
            )}
          </div>
        )}
      </article>
    );
  }

  if (block.layout === "two-images") {
    return (
      <article className="space-y-6">
        {hasCopy && (
          <div className="max-w-[760px]">
            {eyebrow && (
              <p className="text-[12px] font-bold tracking-[0.12em] text-[#5B647A] uppercase">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h3 className="bkl-detail-heading mt-2 font-toledo text-[#283455]">
                {heading}
              </h3>
            )}
            {body && <RichBodyContent text={body} />}
          </div>
        )}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-8">
          {[block.image, block.secondaryImage].filter(Boolean).map((imgUrl, idx) => (
            <div
              key={`${imgUrl}-${idx}`}
              className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#F4F4F6]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt={heading || ""}
                width={640}
                height={480}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        {caption && (
          <p className="text-center text-[13.5px] text-[#5B647A]">{caption}</p>
        )}
      </article>
    );
  }

  // split-left, split-right, or text-only (powered by .bkl-detail-block :has(.bkl-detail-media))
  const isRightMedia = block.layout === "split-right";

  return (
    <article
      data-layout={block.layout}
      className={`bkl-detail-block ${hasMedia ? "has-media" : ""}`}
    >
      {hasMedia && block.image && (
        <figure
          className={`bkl-detail-media overflow-hidden rounded-2xl bg-[#F4F4F6] ${
            isRightMedia ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div className="aspect-[4/3] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.image}
              alt={heading || caption || ""}
              width={680}
              height={510}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          {caption && (
            <figcaption className="bg-[#F9F3ED] px-4 py-2.5 text-[13px] text-[#5B647A]">
              {caption}
            </figcaption>
          )}
        </figure>
      )}

      {hasCopy && (
        <div
          className={`${
            hasMedia
              ? isRightMedia
                ? "lg:order-1"
                : "lg:order-2"
              : "mx-auto max-w-[820px]"
          }`}
        >
          {eyebrow && (
            <p className="text-[12px] font-bold tracking-[0.12em] text-[#5B647A] uppercase">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h3 className="bkl-detail-heading mt-2 font-toledo text-[#283455]">
              {heading}
            </h3>
          )}
          {body && <RichBodyContent text={body} />}
        </div>
      )}
    </article>
  );
}

export function ProductDetailView({ slug }: { slug: string }) {
  const { getProductBySlug } = useStoreData();
  const product = getProductBySlug(slug);
  // Re-mount when the product appears (preview draft arrives) or its default colour
  // changes, so the initial swatch / size selection always follows the data.
  const remountKey = `${slug}-${product ? product.id : "none"}-${product?.defaultSwatchIndex ?? 0}`;
  return <ProductDetailInner key={remountKey} slug={slug} />;
}

type RegionAttrs = {
  "data-section-id"?: string;
  "data-section-label"?: string;
  className?: string;
};

function ProductDetailInner({ slug }: { slug: string }) {
  const { locale } = useLanguage();
  const {
    getProductBySlug,
    getRelatedProducts,
    formatMoney,
    formatMoneyString,
    settings,
    previewMode,
    previewSelectedId,
    previewFocus,
  } = useStoreData();
  const qvCopy = UI_COPY[locale].quickViewModal;
  const { addItem, openCart } = useCart();

  const product = getProductBySlug(slug);

  /** Click-to-select region attributes, only emitted inside the admin preview. */
  const region = (id: string, label: string, extraClass = ""): RegionAttrs => {
    if (!previewMode) return extraClass ? { className: extraClass } : {};
    const cls = [extraClass, previewSelectedId === id ? "otama-preview-selected" : ""]
      .filter(Boolean)
      .join(" ");
    return {
      "data-section-id": id,
      "data-section-label": label,
      ...(cls ? { className: cls } : {}),
    };
  };
  const interactive = previewMode ? { "data-preview-interactive": "true" } : {};

  const [selectedSwatch, setSelectedSwatch] = useState(
    product && product.defaultSwatchIndex < product.swatches.length
      ? product.defaultSwatchIndex
      : 0
  );
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(() => {
    if (!product) return 0;
    const opts = sizeOptionsFor(product);
    if (previewMode) {
      const baseIdx = opts.findIndex((o) => o.delta === 0);
      return baseIdx >= 0 ? baseIdx : 0;
    }
    const queenIdx = opts.findIndex((o) => o.label === "Queen" || o.label === "$100");
    return queenIdx >= 0 ? queenIdx : 0;
  });
  const [qty, setQty] = useState(1);

  const [syncedFocusNonce, setSyncedFocusNonce] = useState(0);
  if (
    previewMode &&
    previewFocus &&
    previewFocus.nonce !== syncedFocusNonce &&
    previewFocus.id.startsWith("pd-swatch:")
  ) {
    setSyncedFocusNonce(previewFocus.nonce);
    const idx = Number(previewFocus.id.slice("pd-swatch:".length));
    if (Number.isFinite(idx) && product && idx >= 0 && idx < product.swatches.length) {
      setSelectedSwatch(idx);
      setActivePhotoIdx(0);
    }
  }

  const gallery = useMemo(() => {
    if (!product) return [];
    const activeSwatch = product.swatches[selectedSwatch];
    const mainImg = activeSwatch?.mainImage || product.mainImage;
    const hoverImg = activeSwatch?.hoverImage || product.hoverImage;
    const raw = [
      mainImg,
      hoverImg,
      ...(product.galleryImages || []),
    ].filter((u): u is string => Boolean(u && u.trim()));
    return Array.from(new Set(raw));
  }, [product, selectedSwatch]);

  const storyBlocks = useMemo(() => {
    if (!product) return [];
    if (product.detailBlocks !== undefined) {
      return product.detailBlocks;
    }
    return getDefaultProductDetailBlocks(product);
  }, [product]);

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
  const currentImg = gallery[activePhotoIdx] || gallery[0] || mainImg;

  const baseSale = parseDollar(product.salePrice);
  const baseOrig = parseDollar(product.originalPrice);
  const finalSale = Math.max(10, baseSale + activeSize.delta);
  const finalOrig = baseOrig > 0 ? Math.max(finalSale, baseOrig + activeSize.delta) : 0;
  const displayTitle = translateProductTitle(product.title, locale, product.titleVi);
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
          {...region(
            "pd-title",
            "Thông tin cơ bản",
            "mb-6 flex flex-wrap items-center gap-2 text-[13px] text-[#5B647A]"
          )}
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
          <div {...region("pd-gallery", "Ảnh sản phẩm", "flex flex-col gap-4")}>
            <div className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F4F6]">
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

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    {...interactive}
                    aria-label={locale === "vi" ? "Ảnh trước" : "Previous photo"}
                    onClick={() =>
                      setActivePhotoIdx((prev) => (prev - 1 + gallery.length) % gallery.length)
                    }
                    className="absolute top-1/2 left-3 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#283455] shadow-md transition-opacity hover:bg-white lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    {...interactive}
                    aria-label={locale === "vi" ? "Ảnh tiếp theo" : "Next photo"}
                    onClick={() =>
                      setActivePhotoIdx((prev) => (prev + 1) % gallery.length)
                    }
                    className="absolute top-1/2 right-3 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#283455] shadow-md transition-opacity hover:bg-white lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={`${imgUrl}-${idx}`}
                    type="button"
                    {...interactive}
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
                      width={160}
                      height={160}
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
                {...region(
                  "pd-pricing",
                  "Giá & Nhãn khuyến mãi",
                  `flex items-center gap-1.5 text-[13px] font-bold tracking-[0.08em] uppercase ${
                    product.promoTone === "urgent" ? "text-[#AA3F00]" : "text-[#417823]"
                  }`
                )}
              >
                <SparkleIcon className="h-3.5 w-3.5" />
                <span>{translateBadge(product.promoEyebrow, locale)}</span>
              </p>
            )}

            <h1
              {...region(
                "pd-title",
                "Thông tin cơ bản",
                "mt-2 font-toledo text-[32px] leading-[1.15] text-[#283455] lg:text-[40px]"
              )}
            >
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

            <div
              {...region(
                "pd-pricing",
                "Giá & Nhãn khuyến mãi",
                "mt-4 flex items-center gap-2.5 text-[22px]"
              )}
            >
              {finalOrig > finalSale && (
                <span className="text-[#7E8596] line-through">
                  {formatMoney(finalOrig, locale)}
                </span>
              )}
              <span className="font-bold text-[#283455]">
                {formatMoney(finalSale, locale)}
              </span>
              {product.discountBadge && (
                <span className="rounded-md bg-[#EAF3E4] px-2.5 py-1 text-[13px] font-bold text-[#417823]">
                  {translateDiscount(product.discountBadge, locale)}
                </span>
              )}
            </div>

            <p
              {...region(
                "pd-description",
                "Mô tả & Thông số",
                "mt-4 text-[15.5px] leading-[1.6] text-[#3D4866]"
              )}
            >
              {locale === "vi" ? product.viDescription : product.enDescription}
            </p>

            {/* Color Swatches */}
            {product.swatches.length > 0 && (
              <div {...region("pd-swatches", "Màu sắc", "mt-6")}>
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
                        {...interactive}
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
                    {...interactive}
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
                {qvCopy.addToBag} &mdash; {formatMoney(finalSale * qty, locale)}
              </button>
            </div>

            {/* Trust Callout Strip */}
            <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-[#F9F3ED] p-4 text-center text-[12px] font-bold text-[#283455]">
              <div>
                {locale === "vi"
                  ? `Miễn phí ship từ ${formatMoney(settings.freeShippingThresholdUsd, "vi")}`
                  : `Free Shipping ${formatMoney(settings.freeShippingThresholdUsd, "en")}+`}
              </div>
              <div>
                {locale === "vi" ? "Bảo hành 365 ngày" : "365-Day Guarantee"}
              </div>
              <div>
                {locale === "vi" ? "Hỗ trợ FSA/HSA" : "FSA/HSA Eligible"}
              </div>
            </div>

            {/* Native Accordion Details */}
            <div
              {...region(
                "pd-description",
                "Mô tả & Thông số",
                "mt-6 divide-y divide-[#E5E0DB] border-y border-[#E5E0DB]"
              )}
            >
              <details open className="group py-4">
                <summary {...interactive} className="flex cursor-pointer list-none items-center justify-between text-[15px] font-bold text-[#283455]">
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
                <summary {...interactive} className="flex cursor-pointer list-none items-center justify-between text-[15px] font-bold text-[#283455]">
                  <span>{locale === "vi" ? "Hướng dẫn bảo quản" : "Care Instructions"}</span>
                  <span className="text-lg transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-[#3D4866]">
                  {locale === "vi" ? product.viCare : product.enCare}
                </p>
              </details>

              <details className="group py-4">
                <summary {...interactive} className="flex cursor-pointer list-none items-center justify-between text-[15px] font-bold text-[#283455]">
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

        {/* =================================================================== */}
        {/* BELOW-THE-FOLD RICH PRODUCT STORY & DETAIL IMAGERY                  */}
        {/* =================================================================== */}
        {storyBlocks.length > 0 && (
          <section
            aria-label={
              locale === "vi"
                ? "Thông tin & hình ảnh chi tiết sản phẩm"
                : "Product details and story"
            }
            className="mt-16 space-y-14 border-t border-[#E5E0DB] pt-14 lg:mt-20 lg:space-y-20 lg:pt-16"
          >
            {storyBlocks.map((blk, idx) => (
              <div
                key={blk.id}
                {...region(`story:${blk.id}`, `Bài viết chi tiết · Mục ${idx + 1}`)}
              >
                <EditorialStoryBlock block={blk} locale={locale} />
              </div>
            ))}
          </section>
        )}

        {/* Quality Highlights Bar */}
        <section
          aria-label={locale === "vi" ? "Cam kết chất lượng" : "Quality Standards"}
          className="mt-16 grid grid-cols-1 gap-4 rounded-2xl border border-[#ECE7E2] bg-white p-6 sm:grid-cols-3 lg:p-8"
        >
          {UI_COPY[locale].valueProps.map((vp) => (
            <div key={vp.title} className="text-center sm:px-3">
              <p className="text-[12.5px] font-bold tracking-[0.1em] text-[#283455] uppercase">
                {vp.title}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#5B647A]">{vp.body}</p>
            </div>
          ))}
        </section>

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
              const title = translateProductTitle(rel.title, locale, rel.titleVi);
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
                        {formatMoneyString(rel.originalPrice, locale)}
                      </span>
                    )}
                    <span className="font-bold">
                      {formatMoneyString(rel.salePrice, locale)}
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
