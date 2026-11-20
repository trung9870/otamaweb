"use client";

import { BROOKLINEN_DATA } from "./data";
import { CategoryCarousel } from "./CategoryCarousel";
import { useLanguage } from "./LanguageContext";
import { MiniHeroTote } from "./MiniHeroTote";
import { ProductCarousel } from "./ProductCarousel";
import { PromoStrip } from "./PromoStrip";
import { useStoreData, type LiveCatalogProduct } from "./StoreDataContext";
import { UI_COPY } from "./translations";
import { TrendingSection } from "./TrendingSection";
import {
  PressSection,
  ReviewsSection,
  WhyBrooklinenSection,
} from "./TrustAndFooter";
import { VideoHero } from "./VideoHero";
import type { HomepageSectionConfig } from "@/lib/store-types";

function splitLines(text: string | undefined, fallback: readonly string[]): string[] {
  if (!text || !text.trim()) return [...fallback];
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function BrooklinenHome() {
  const { locale } = useLanguage();
  const {
    bestOfSale,
    giftGuide,
    collection,
    settings,
    resolveProductsBySlugs,
  } = useStoreData();
  const copy = UI_COPY[locale];
  const heroPrimaryFallback = BROOKLINEN_DATA.heroPrimary;
  const heroSheetsFallback = BROOKLINEN_DATA.heroSheets;

  const visibleSections = (settings.homepageSections || []).filter((s) => s.visible);

  const renderSection = (block: HomepageSectionConfig) => {
    switch (block.id) {
      case "hero_primary": {
        const headingLines = splitLines(
          locale === "vi" ? block.titleVi : block.titleEn,
          copy.heroPrimary.headingLines
        );
        const subtitleLines = splitLines(
          locale === "vi" ? block.subtitleVi : block.subtitleEn,
          copy.heroPrimary.subtitleLines
        );
        const ctaLabel =
          (locale === "vi" ? block.ctaLabelVi : block.ctaLabelEn)?.trim() ||
          copy.heroPrimary.ctaLabel;
        return (
          <VideoHero
            key={block.id}
            variant="primary"
            mediaType={block.mediaType || "video"}
            desktopVideo={block.desktopMedia || heroPrimaryFallback.desktopVideo}
            desktopPoster={block.desktopPoster || heroPrimaryFallback.desktopPoster}
            mobileVideo={
              block.mobileMedia || block.desktopMedia || heroPrimaryFallback.mobileVideo
            }
            mobilePoster={
              block.mobilePoster || block.desktopPoster || heroPrimaryFallback.mobilePoster
            }
            headingLines={headingLines}
            subtitleLines={subtitleLines}
            ctas={[{ label: ctaLabel, href: block.ctaHref || heroPrimaryFallback.ctaHref }]}
          />
        );
      }

      case "hero_sheets": {
        const defaultEnTitle = "BEST. SHEETS. EVER.";
        const useLockupSvg =
          locale === "en" &&
          (!block.titleEn || block.titleEn.trim().toUpperCase() === defaultEnTitle);
        const headline =
          locale === "vi"
            ? block.titleVi || copy.heroSheets.textHeadline || undefined
            : useLockupSvg
            ? undefined
            : block.titleEn;
        const subtitle =
          (locale === "vi" ? block.subtitleVi : block.subtitleEn)?.trim() ||
          copy.heroSheets.subtitle;
        const ctas = [
          {
            label:
              (locale === "vi" ? block.ctaLabelVi : block.ctaLabelEn)?.trim() ||
              copy.heroSheets.ctas[0] ||
              "Shop Sheets",
            href: block.ctaHref || heroSheetsFallback.ctas[0]?.href || "/collections/all-sheets",
          },
        ];
        const secLabel = (
          locale === "vi" ? block.secondaryCtaLabelVi : block.secondaryCtaLabelEn
        )?.trim();
        if (secLabel) {
          ctas.push({
            label: secLabel,
            href:
              block.secondaryCtaHref ||
              heroSheetsFallback.ctas[1]?.href ||
              "/pages/best-sheets-ever",
          });
        }
        return (
          <VideoHero
            key={block.id}
            variant="sheets"
            mediaType={block.mediaType || "video"}
            desktopVideo={block.desktopMedia || heroSheetsFallback.desktopVideo}
            desktopPoster={block.desktopPoster || heroSheetsFallback.desktopPoster}
            mobileVideo={
              block.mobileMedia || block.desktopMedia || heroSheetsFallback.mobileVideo
            }
            mobilePoster={
              block.mobilePoster || block.desktopPoster || heroSheetsFallback.mobilePoster
            }
            lockupSvg={useLockupSvg ? heroSheetsFallback.lockupSvg : undefined}
            lockupAlt="Best. Sheets. Ever."
            textHeadline={headline}
            subtitle={subtitle}
            ctas={ctas}
            showPauseButton
            playLabel={copy.heroSheets.playVideo}
            pauseLabel={copy.heroSheets.pauseVideo}
          />
        );
      }

      case "strip_mystery":
      case "strip_gifts":
      case "strip_fsa":
      case "strip_stores": {
        const heading = (locale === "vi" ? block.titleVi : block.titleEn) || "";
        const body = (locale === "vi" ? block.subtitleVi : block.subtitleEn) || "";
        const ctaLabel =
          (locale === "vi" ? block.ctaLabelVi : block.ctaLabelEn) ||
          (locale === "vi" ? "Xem ngay" : "Shop Now");
        return (
          <PromoStrip
            key={block.id}
            heading={heading}
            body={body}
            ctaLabel={ctaLabel}
            ctaHref={block.ctaHref || "/collections/best-sellers"}
            theme={block.theme || "burgundy-blue-cta"}
          />
        );
      }

      case "carousel_best_of_sale":
      case "carousel_gift_guide":
      case "carousel_collection": {
        const fallbackList: LiveCatalogProduct[] =
          block.id === "carousel_best_of_sale"
            ? bestOfSale
            : block.id === "carousel_gift_guide"
            ? giftGuide
            : collection;
        const resolved =
          block.productSlugs && block.productSlugs.length > 0
            ? resolveProductsBySlugs(block.productSlugs)
            : fallbackList;
        const products = resolved.length > 0 ? resolved : fallbackList;
        const fallbackHeading =
          block.id === "carousel_best_of_sale"
            ? copy.bestOfSaleHeading
            : block.id === "carousel_gift_guide"
            ? copy.giftGuideHeading
            : copy.collectionHeading;
        const heading =
          (locale === "vi" ? block.titleVi : block.titleEn)?.trim() || fallbackHeading;
        return (
          <ProductCarousel key={block.id} heading={heading} products={products} />
        );
      }

      case "mini_hero_tote":
        return (
          <MiniHeroTote
            key={block.id}
            lines={splitLines(
              locale === "vi" ? block.titleVi : block.titleEn,
              copy.miniHeroTote.lines
            )}
            ctaLabel={
              (locale === "vi" ? block.ctaLabelVi : block.ctaLabelEn)?.trim() ||
              copy.miniHeroTote.ctaLabel
            }
            ctaHref={block.ctaHref}
            desktopImage={block.desktopMedia}
            mobileImage={block.mobileMedia}
          />
        );

      case "category_carousel":
        return (
          <CategoryCarousel
            key={block.id}
            headingOverride={
              (locale === "vi" ? block.titleVi : block.titleEn)?.trim() || undefined
            }
          />
        );

      case "trending":
        return <TrendingSection key={block.id} />;

      case "why_brooklinen":
        return <WhyBrooklinenSection key={block.id} />;

      case "reviews":
        return <ReviewsSection key={block.id} />;

      case "press":
        return <PressSection key={block.id} />;

      default:
        return null;
    }
  };

  return <>{visibleSections.map((block) => renderSection(block))}</>;
}
