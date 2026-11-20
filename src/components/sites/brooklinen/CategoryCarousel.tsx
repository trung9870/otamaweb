"use client";

import Link from "next/link";
import { useRef } from "react";
import { BROOKLINEN_DATA } from "./data";
import { toLocalHref } from "./catalog";
import { useLanguage } from "./LanguageContext";
import { useStoreData } from "./StoreDataContext";
import { UI_COPY } from "./translations";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { buildTextStyleProps } from "@/lib/section-style-helpers";
import type { HomepageSectionStyle } from "@/lib/store-types";

export function CategoryCarousel({
  headingOverride,
  sectionStyle,
}: {
  headingOverride?: string;
  sectionStyle?: HomepageSectionStyle;
}) {
  const { locale } = useLanguage();
  const { categories: liveCategories } = useStoreData();
  const copy = UI_COPY[locale];
  const trackRef = useRef<HTMLDivElement>(null);

  const heading = headingOverride || copy.shopByCategoryHeading;

  const featuredLive = liveCategories.filter((c) => c.active && c.showOnHome && c.image);
  const cards =
    featuredLive.length > 0
      ? featuredLive.map((c) => ({
          key: c.slug,
          label: locale === "vi" ? c.titleVi : c.titleEn,
          href: `/collections/${c.slug}`,
          image: c.image!,
          badgeImage: c.badgeImage,
        }))
      : BROOKLINEN_DATA.categories.map((cat, idx) => ({
          key: cat.title,
          label: copy.categories[idx] || cat.title,
          href: toLocalHref(cat.href),
          image: cat.image,
          badgeImage: "badgeImage" in cat ? cat.badgeImage : undefined,
        }));

  const scrollTrack = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 270 });
  };

  const isCenteredHeading = sectionStyle?.layout?.textAlign === "center";
  const headingProps = buildTextStyleProps(
    sectionStyle?.title,
    `text-[20px] font-bold tracking-[-0.01em] text-[#283455] lg:text-[24px] ${
      isCenteredHeading ? "flex-1 text-center" : ""
    }`
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label={heading}
      className="w-full bg-[#FDFAF8] py-9 lg:py-12"
    >
      <div className="mx-auto mb-5 flex max-w-[1440px] items-center justify-between gap-4 px-5 lg:mb-6 lg:px-16">
        {isCenteredHeading && <div aria-hidden="true" className="hidden w-[76px] sm:block" />}
        <h2 className={headingProps.className} style={headingProps.style}>
          {heading}
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollTrack(-1)}
            aria-label={locale === "vi" ? "Danh mục trước" : "Previous categories"}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#283455] transition-colors hover:bg-[#EFEAE4]"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollTrack(1)}
            aria-label={locale === "vi" ? "Danh mục tiếp theo" : "Next categories"}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#283455] transition-colors hover:bg-[#EFEAE4]"
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
          className="bkl-carousel-track gap-3 px-5 scroll-pl-5 lg:gap-6 lg:px-16 lg:scroll-pl-16"
        >
          {cards.map((cat, idx) => (
            <Link
              key={cat.key}
              href={cat.href}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${cards.length}: ${cat.label}`}
              className="group relative h-[156px] w-[140px] shrink-0 snap-start overflow-hidden rounded-[14px] bg-[#ECE7E2] sm:h-[220px] sm:w-[198px] lg:h-[271px] lg:w-[244px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={cat.label}
                width={244}
                height={271}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 via-black/25 to-transparent"
              />
              {cat.badgeImage &&
                (locale === "vi" ? (
                  <span className="pointer-events-none absolute top-2.5 right-2.5 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#283455] p-1 text-center text-[10.5px] leading-[1.15] font-bold text-white shadow lg:top-3 lg:right-3 lg:h-[64px] lg:w-[64px] lg:text-[11.5px]">
                    {copy.badgeUpTo40}
                  </span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.badgeImage}
                    alt={copy.badgeUpTo40}
                    width={62}
                    height={62}
                    loading="lazy"
                    className="pointer-events-none absolute top-2.5 right-2.5 h-[52px] w-[52px] object-contain lg:top-3 lg:right-3 lg:h-[62px] lg:w-[62px]"
                  />
                ))}
              <span className="absolute bottom-3 left-3 right-3 text-[13px] font-bold text-white underline decoration-white/90 underline-offset-[3px] lg:bottom-4 lg:left-4 lg:text-[14px]">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
