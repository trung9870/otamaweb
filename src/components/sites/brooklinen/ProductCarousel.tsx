"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductCardData } from "./data";
import { extractProductSlug } from "./catalog";
import { useCart } from "./CartContext";
import { useLanguage } from "./LanguageContext";
import { useStoreData } from "./StoreDataContext";
import {
  translateBadge,
  translateColor,
  translateDiscount,
  translateProductTitle,
  UI_COPY,
} from "./translations";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparkleIcon,
  StarRating,
} from "./icons";

type CarouselProduct = ProductCardData & { titleVi?: string };

function ProductCard({
  product,
  slideIndex,
  totalSlides,
}: {
  product: CarouselProduct;
  slideIndex: number;
  totalSlides: number;
}) {
  const { locale } = useLanguage();
  const { formatMoneyString } = useStoreData();
  const copy = UI_COPY[locale];
  const { openQuickView } = useCart();
  const [selectedSwatch, setSelectedSwatch] = useState(
    product.defaultSwatchIndex < product.swatches.length
      ? product.defaultSwatchIndex
      : 0
  );
  const swatchTrackRef = useRef<HTMLDivElement>(null);

  const activeSwatch = product.swatches[selectedSwatch];
  const displayMain = activeSwatch?.mainImage || product.mainImage;
  const displayHover = activeSwatch?.hoverImage || product.hoverImage;
  const displayTitle = translateProductTitle(product.title, locale, product.titleVi);
  const localProductHref = `/products/${extractProductSlug(product.href)}`;

  const scrollSwatches = (dir: -1 | 1) => {
    const el = swatchTrackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 160, behavior: "smooth" });
  };

  return (
    <article
      role="group"
      aria-roledescription="slide"
      aria-label={`${slideIndex + 1} of ${totalSlides}`}
      className="flex w-[262px] shrink-0 snap-start flex-col sm:w-[320px] lg:w-[411px]"
    >
      {/* Square Media Container */}
      <div className="group relative aspect-square w-full overflow-hidden bg-[#F4F4F6]">
        <Link
          href={localProductHref}
          aria-label={displayTitle}
          className="block h-full w-full"
        >
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

        {/* Top-left Pill Badge */}
        {product.topBadge && (
          <span className="pointer-events-none absolute top-3.5 left-3.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold tracking-[0.06em] uppercase text-[#283455] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            {translateBadge(product.topBadge, locale)}
          </span>
        )}

        {/* Top-right Award Seal */}
        {product.awardSeal && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.awardSeal}
            alt={locale === "vi" ? "Huy hiệu sản phẩm đạt giải" : "Award-winning product seal"}
            width={72}
            height={72}
            loading="lazy"
            className="pointer-events-none absolute top-3.5 right-3.5 h-[56px] w-[56px] object-contain lg:h-[72px] lg:w-[72px]"
          />
        )}

        {/* Desktop Hover Quick View Bar */}
        <button
          type="button"
          onClick={() => openQuickView(product, selectedSwatch)}
          className="hidden lg:flex absolute inset-x-4 bottom-4 h-11 translate-y-1 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[14px] font-bold text-[#283455] opacity-0 shadow-md transition-all duration-200 hover:bg-white focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {copy.quickView}
        </button>

        {/* Mobile Bottom-Right + Quick Add Button */}
        <button
          type="button"
          onClick={() => openQuickView(product, selectedSwatch)}
          aria-label={`${copy.quickView} ${displayTitle}`}
          className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[22px] font-normal leading-none text-[#283455] shadow-md lg:hidden"
        >
          +
        </button>
      </div>

      {/* Promo Eyebrow */}
      {product.promoEyebrow && (
        <p
          className={`mt-3.5 flex items-center gap-1.5 text-[12px] font-bold tracking-[0.08em] uppercase lg:mt-4 lg:text-[13px] ${
            product.promoTone === "urgent" ? "text-[#AA3F00]" : "text-[#417823]"
          }`}
        >
          <SparkleIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{translateBadge(product.promoEyebrow, locale)}</span>
        </p>
      )}

      {/* Product Title */}
      <h3 className="mt-1.5 text-[17.5px] leading-[1.28] font-bold text-[#283455] lg:text-[19.5px]">
        <Link href={localProductHref} className="hover:underline">
          {displayTitle}
        </Link>
      </h3>

      {/* Price + Discount Row */}
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[15px] text-[#283455] lg:text-[16px]">
        <span>{copy.fromPrice}</span>
        {product.originalPrice && (
          <span className="text-[#6E6E6E] line-through">
            {formatMoneyString(product.originalPrice, locale)}
          </span>
        )}
        <span className="font-bold text-[#283455]">
          {formatMoneyString(product.salePrice, locale)}
        </span>
        {product.discountBadge && (
          <span className="ml-0.5 rounded bg-[#EAF3E4] px-2 py-0.5 text-[12.5px] font-bold text-[#417823] lg:text-[13px]">
            {translateDiscount(product.discountBadge, locale)}
          </span>
        )}
      </div>

      {/* Star Rating & Review Count */}
      {product.reviewCount && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <StarRating rating={product.rating} size={13} />
          <Link
            href={`${localProductHref}#reviews`}
            className="text-[13.5px] text-[#6E6E6E] underline decoration-[#6E6E6E]/70 underline-offset-2 hover:text-[#283455]"
          >
            {product.reviewCount}
          </Link>
        </div>
      )}

      {/* Interactive Color Swatches */}
      {product.swatches.length > 0 && (
        <div className="mt-3 flex items-center gap-1">
          {product.swatches.length > 7 && (
            <button
              type="button"
              onClick={() => scrollSwatches(-1)}
              aria-label={
                locale === "vi"
                  ? `Xem màu trước của ${displayTitle}`
                  : `Scroll ${displayTitle} swatches left`
              }
              className="inline-flex h-6 w-5 shrink-0 items-center justify-center text-[#8B909E] hover:text-[#283455]"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5" />
            </button>
          )}

          <div
            ref={swatchTrackRef}
            role="radiogroup"
            aria-label={
              locale === "vi"
                ? `Tùy chọn màu sắc cho ${displayTitle}`
                : `${displayTitle} color options`
            }
            className="flex flex-1 items-center gap-[7px] overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {product.swatches.map((sw, idx) => {
              const isSelected = idx === selectedSwatch;
              const colorText = translateColor(sw.label, locale);
              return (
                <button
                  key={`${sw.label}-${idx}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${locale === "vi" ? "Màu" : "Color"}: ${colorText}`}
                  title={colorText}
                  onClick={() => setSelectedSwatch(idx)}
                  className={`relative h-[26px] w-[26px] shrink-0 cursor-pointer overflow-hidden rounded-[4px] border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#283455] ${
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
                      width={26}
                      height={26}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {product.swatches.length > 7 && (
            <button
              type="button"
              onClick={() => scrollSwatches(1)}
              aria-label={
                locale === "vi"
                  ? `Xem màu tiếp theo của ${displayTitle}`
                  : `Scroll ${displayTitle} swatches right`
              }
              className="inline-flex h-6 w-5 shrink-0 items-center justify-center text-[#283455] hover:opacity-75"
            >
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export function ProductCarousel({
  heading,
  products,
}: {
  heading: string;
  products: readonly CarouselProduct[];
}) {
  const { locale } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [statusText, setStatusText] = useState("");
  const lastAnnouncedIdx = useRef<number>(-1);
  const userScrolled = useRef(false);

  const syncScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const nextCanPrev = track.scrollLeft > 8;
    const nextCanNext = track.scrollLeft < maxScroll - 8;

    if (!nextCanPrev && document.activeElement === prevBtnRef.current) {
      nextBtnRef.current?.focus();
    } else if (!nextCanNext && document.activeElement === nextBtnRef.current) {
      prevBtnRef.current?.focus();
    }

    setCanPrev(nextCanPrev);
    setCanNext(nextCanNext);

    const firstChild = track.firstElementChild as HTMLElement | null;
    if (firstChild && userScrolled.current) {
      const stride = firstChild.offsetWidth + 32;
      const idx = Math.min(
        products.length - 1,
        Math.max(0, Math.round(track.scrollLeft / Math.max(stride, 1)))
      );
      if (idx !== lastAnnouncedIdx.current) {
        lastAnnouncedIdx.current = idx;
        setStatusText(
          locale === "vi"
            ? `Đang hiển thị sản phẩm ${idx + 1} trên ${products.length} trong mục ${heading}`
            : `Showing item ${idx + 1} of ${products.length} in ${heading}`
        );
      }
    }
  }, [heading, locale, products.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncScrollState();

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const supportsScrollEnd = "onscrollend" in window;

    const onScroll = () => {
      userScrolled.current = true;
      if (!supportsScrollEnd) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(syncScrollState, 140);
      }
    };

    const onScrollEnd = () => {
      syncScrollState();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    if (supportsScrollEnd) {
      track.addEventListener("scrollend", onScrollEnd);
    }
    window.addEventListener("resize", syncScrollState);

    return () => {
      track.removeEventListener("scroll", onScroll);
      if (supportsScrollEnd) {
        track.removeEventListener("scrollend", onScrollEnd);
      }
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [syncScrollState]);

  const scrollByCard = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    userScrolled.current = true;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + (window.innerWidth >= 1024 ? 40 : 20) : 400;
    track.scrollBy({ left: dir * step });
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={heading}
      className="w-full bg-[#FDFAF8] py-10 lg:py-12"
    >
      <div className="mx-auto mb-5 flex max-w-[1440px] items-center justify-between px-5 lg:mb-6 lg:px-16">
        <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#283455] lg:text-[24px]">
          {heading}
        </h2>

        <div className="flex items-center gap-2">
          <button
            ref={prevBtnRef}
            type="button"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            aria-label={locale === "vi" ? `Sản phẩm trước (${heading})` : `Previous ${heading} items`}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#283455] transition-colors hover:bg-[#EFEAE4] disabled:cursor-default disabled:text-[#C5C8D0] disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#283455]"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            ref={nextBtnRef}
            type="button"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
            aria-label={locale === "vi" ? `Sản phẩm tiếp theo (${heading})` : `Next ${heading} items`}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#283455] transition-colors hover:bg-[#EFEAE4] disabled:cursor-default disabled:text-[#C5C8D0] disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#283455]"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px]">
        <div
          ref={trackRef}
          tabIndex={0}
          role="group"
          aria-label={heading}
          className="bkl-carousel-track gap-5 px-5 scroll-pl-5 lg:gap-10 lg:px-16 lg:scroll-pl-16"
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              slideIndex={index}
              totalSlides={products.length}
            />
          ))}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {statusText}
      </p>
    </section>
  );
}
