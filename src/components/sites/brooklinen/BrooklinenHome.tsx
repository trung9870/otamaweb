"use client";

import { BROOKLINEN_DATA, type ProductCardData } from "./data";
import { CategoryCarousel } from "./CategoryCarousel";
import { useLanguage } from "./LanguageContext";
import { MiniHeroTote } from "./MiniHeroTote";
import { ProductCarousel } from "./ProductCarousel";
import { PromoStrip } from "./PromoStrip";
import { UI_COPY } from "./translations";
import { TrendingSection } from "./TrendingSection";
import {
  PressSection,
  ReviewsSection,
  WhyBrooklinenSection,
} from "./TrustAndFooter";
import { VideoHero } from "./VideoHero";

export function BrooklinenHome() {
  const { locale } = useLanguage();
  const copy = UI_COPY[locale];
  const heroPrimary = BROOKLINEN_DATA.heroPrimary;
  const heroSheets = BROOKLINEN_DATA.heroSheets;

  return (
    <>
      {/* #0 Primary Hero */}
      <VideoHero
        variant="primary"
        desktopVideo={heroPrimary.desktopVideo}
        desktopPoster={heroPrimary.desktopPoster}
        mobileVideo={heroPrimary.mobileVideo}
        mobilePoster={heroPrimary.mobilePoster}
        headingLines={copy.heroPrimary.headingLines}
        subtitleLines={copy.heroPrimary.subtitleLines}
        ctas={[{ label: copy.heroPrimary.ctaLabel, href: heroPrimary.ctaHref }]}
      />

      {/* #1 Promo Strip — Mystery Bundles */}
      <PromoStrip
        heading={copy.stripMystery.heading}
        body={copy.stripMystery.body}
        ctaLabel={copy.stripMystery.ctaLabel}
        ctaHref="/pages/all-bundles"
        theme="burgundy-blue-cta"
      />

      {/* #2 Product Carousel — Best of Sale */}
      <ProductCarousel
        heading={copy.bestOfSaleHeading}
        products={BROOKLINEN_DATA.bestOfSale as unknown as ProductCardData[]}
      />

      {/* #3 Mini Hero — Free Super Fluff Tote */}
      <MiniHeroTote />

      {/* #4 Shop by Category */}
      <CategoryCarousel />

      {/* #5 Promo Strip — Shop Gifts on Sale */}
      <PromoStrip
        heading={copy.stripGifts.heading}
        body={copy.stripGifts.body}
        ctaLabel={copy.stripGifts.ctaLabel}
        ctaHref="/collections/holiday-gift-guide"
        theme="burgundy-outline-cta"
      />

      {/* #6 Product Carousel — Shop the Gift Guide */}
      <ProductCarousel
        heading={copy.giftGuideHeading}
        products={BROOKLINEN_DATA.giftGuide as unknown as ProductCardData[]}
      />

      {/* #7 Secondary Video Hero — BEST. SHEETS. EVER. */}
      <VideoHero
        variant="sheets"
        desktopVideo={heroSheets.desktopVideo}
        desktopPoster={heroSheets.desktopPoster}
        mobileVideo={heroSheets.mobileVideo}
        mobilePoster={heroSheets.mobilePoster}
        lockupSvg={heroSheets.lockupSvg}
        lockupAlt="Best. Sheets. Ever."
        textHeadline={copy.heroSheets.textHeadline || undefined}
        subtitle={copy.heroSheets.subtitle}
        ctas={heroSheets.ctas.map((c, idx) => ({
          label: copy.heroSheets.ctas[idx] || c.label,
          href: c.href,
        }))}
        showPauseButton
        playLabel={copy.heroSheets.playVideo}
        pauseLabel={copy.heroSheets.pauseVideo}
      />

      {/* #8 Product Carousel — Shop the Collection */}
      <ProductCarousel
        heading={copy.collectionHeading}
        products={BROOKLINEN_DATA.collection as unknown as ProductCardData[]}
      />

      {/* #9 New & Trending */}
      <TrendingSection />

      {/* #10 Promo Strip — FSA/HSA Eligible */}
      <PromoStrip
        heading={copy.stripFsa.heading}
        body={copy.stripFsa.body}
        ctaLabel={copy.stripFsa.ctaLabel}
        ctaHref="/pages/hsa-fsa-eligible"
        theme="navy-adaptive-cta"
      />

      {/* #11 Why Brooklinen? */}
      <WhyBrooklinenSection />

      {/* #12 175k+ 5-Star Reviews Don't Lie */}
      <ReviewsSection />

      {/* #13 In the News */}
      <PressSection />

      {/* #14 Store Strip — Come Say Hi, IRL */}
      <PromoStrip
        heading={copy.stripStores.heading}
        body={copy.stripStores.body}
        ctaLabel={copy.stripStores.ctaLabel}
        ctaHref="/pages/our-stores"
        theme="slate-navy-cta"
      />
    </>
  );
}
