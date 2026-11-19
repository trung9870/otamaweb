"use client";

import Link from "next/link";
import { useRef } from "react";
import { BROOKLINEN_DATA } from "./data";
import { toLocalHref } from "./catalog";
import { useLanguage } from "./LanguageContext";
import { UI_COPY } from "./translations";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export function TrendingSection() {
  const { locale } = useLanguage();
  const copy = UI_COPY[locale];
  const trackRef = useRef<HTMLDivElement>(null);
  const cards = BROOKLINEN_DATA.trending;

  const scrollTrack = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * 300 });
  };

  return (
    <section
      aria-label={copy.newTrendingHeading}
      className="w-full bg-[#FDFAF8] py-10 lg:py-16"
    >
      <div className="mx-auto max-w-[1440px] px-5 lg:px-16">
        <div className="mb-6 flex items-center justify-between lg:mb-10 lg:justify-center">
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#283455] lg:text-[24px]">
            {copy.newTrendingHeading}
          </h2>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => scrollTrack(-1)}
              aria-label={locale === "vi" ? "Mục trước" : "Previous New & Trending items"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#283455] hover:bg-[#EFEAE4]"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollTrack(1)}
              aria-label={locale === "vi" ? "Mục tiếp theo" : "Next New & Trending items"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#283455] hover:bg-[#EFEAE4]"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="bkl-carousel-track gap-5 scroll-pl-0 lg:grid lg:grid-cols-4 lg:gap-9 lg:overflow-visible"
        >
          {cards.map((card, idx) => {
            const title = copy.trendingTitles[idx] || card.title;
            return (
              <article
                key={card.title}
                className="flex w-[275px] shrink-0 snap-start flex-col items-center text-center sm:w-[300px] lg:w-auto"
              >
                <Link
                  href={toLocalHref(card.href)}
                  className="group block aspect-[8/9] w-full overflow-hidden bg-[#ECE7E2]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={title}
                    width={310}
                    height={349}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </Link>

                <h3 className="mt-5 text-[18px] font-bold text-[#283455] lg:text-[20px]">
                  <Link href={toLocalHref(card.href)} className="hover:underline">
                    {title}
                  </Link>
                </h3>

                <Link
                  href={toLocalHref(card.href)}
                  className="mt-4 inline-flex h-[54px] min-w-[172px] items-center justify-center rounded-[20px] border border-[#283455] bg-transparent px-7 text-[14px] font-bold text-[#283455] transition-colors hover:bg-[#283455] hover:text-white"
                >
                  {copy.shopNow}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
