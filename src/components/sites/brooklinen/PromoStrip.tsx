import Link from "next/link";
import { toLocalHref } from "./catalog";
import {
  buildButtonStyleProps,
  buildTextStyleProps,
} from "@/lib/section-style-helpers";
import type { HomepageSectionStyle, PromoStripTheme } from "@/lib/store-types";

interface PromoStripProps {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  theme: PromoStripTheme;
  sectionStyle?: HomepageSectionStyle;
}

export function PromoStrip({
  heading,
  body,
  ctaLabel,
  ctaHref,
  theme,
  sectionStyle,
}: PromoStripProps) {
  const isSlate = theme === "slate-navy-cta";
  const bgClass =
    theme === "burgundy-blue-cta" || theme === "burgundy-outline-cta"
      ? "bg-[#740103] text-white"
      : theme === "navy-adaptive-cta"
        ? "bg-[#283455] text-white"
        : "bg-[#DDE3EC] text-[#283455]";

  const ctaClass =
    theme === "burgundy-blue-cta"
      ? "bg-[#283C6E] text-white hover:bg-[#1E2E57]"
      : theme === "burgundy-outline-cta"
        ? "border border-white bg-transparent text-white hover:bg-white/10"
        : theme === "navy-adaptive-cta"
          ? "bg-white text-[#283455] hover:bg-[#F3F5F9] lg:bg-[#2A3F73] lg:text-white lg:hover:bg-[#223460]"
          : "bg-[#283455] text-white hover:bg-[#1D2742]";

  const isStacked = sectionStyle?.layout?.stripLayout === "stacked";
  const customBg = sectionStyle?.layout?.bgColor;

  const titleProps = buildTextStyleProps(
    sectionStyle?.title,
    `font-toledo text-[30px] leading-[34.5px] lg:shrink-0 lg:text-[36px] lg:leading-[41.4px] ${
      isSlate ? "text-[#283455]" : "text-white"
    }`
  );

  const subProps = buildTextStyleProps(
    sectionStyle?.subtitle,
    `max-w-[330px] text-[16px] leading-[1.4] lg:text-[18px] ${
      isStacked
        ? "lg:max-w-[760px] lg:text-center"
        : "lg:max-w-none lg:flex-1 lg:text-center"
    } ${isSlate ? "text-[#283455]" : "text-white/95"}`
  );

  const btnProps = buildButtonStyleProps(
    sectionStyle?.button,
    `mt-1 inline-flex h-[56px] min-w-[172px] shrink-0 items-center justify-center rounded-[20px] px-7 text-[14px] font-bold tracking-[-0.01em] transition-colors ${
      isStacked ? "" : "lg:mt-0"
    } ${ctaClass}`
  );

  return (
    <section
      className={`w-full ${bgClass}`}
      style={customBg ? { backgroundColor: customBg } : undefined}
    >
      <div
        className={
          isStacked
            ? "mx-auto flex min-h-[190px] max-w-[1440px] flex-col items-center justify-center gap-3.5 px-6 py-7 text-center lg:px-16"
            : "mx-auto flex min-h-[190px] max-w-[1440px] flex-col items-center justify-center gap-3.5 px-6 py-8 text-center lg:min-h-[104px] lg:flex-row lg:justify-between lg:gap-8 lg:px-16 lg:py-5 lg:text-left"
        }
      >
        <h2 className={titleProps.className} style={titleProps.style}>
          {heading}
        </h2>

        <p className={subProps.className} style={subProps.style}>
          {body}
        </p>

        <Link
          href={toLocalHref(ctaHref)}
          className={btnProps.className}
          style={btnProps.style}
          {...(btnProps.dataAttrs || {})}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
