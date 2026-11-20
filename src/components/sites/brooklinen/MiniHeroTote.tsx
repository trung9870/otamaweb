"use client";

import Link from "next/link";
import { BROOKLINEN_DATA } from "./data";
import { toLocalHref } from "./catalog";
import { useLanguage } from "./LanguageContext";
import { UI_COPY } from "./translations";

interface MiniHeroToteProps {
  lines?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  desktopImage?: string;
  mobileImage?: string;
}

export function MiniHeroTote({
  lines,
  ctaLabel,
  ctaHref,
  desktopImage,
  mobileImage,
}: MiniHeroToteProps) {
  const { locale } = useLanguage();
  const copy = UI_COPY[locale].miniHeroTote;
  const fallback = BROOKLINEN_DATA.miniHeroTote;

  const displayLines = lines && lines.length > 0 ? lines : copy.lines;
  const displayCta = ctaLabel || copy.ctaLabel;
  const displayHref = ctaHref || fallback.ctaHref;
  const deskImg = desktopImage || fallback.desktopImage;
  const mobImg = mobileImage || desktopImage || fallback.mobileImage;

  return (
    <section
      aria-label={displayLines.join(" ")}
      className="relative h-[168px] w-full overflow-hidden bg-[#740103] lg:h-[288px]"
    >
      <picture>
        <source media="(max-width: 1023px)" srcSet={mobImg} />
        <img
          src={deskImg}
          alt={displayLines.join(" ")}
          width={1440}
          height={288}
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
      </picture>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <p className="text-[17px] leading-[1.3] font-bold drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)] lg:text-[20px]">
          {displayLines.map((line, i) => (
            <span key={`${line}-${i}`} className="block">
              {line}
            </span>
          ))}
        </p>

        <Link
          href={toLocalHref(displayHref)}
          className="mt-4 inline-flex h-[48px] min-w-[154px] items-center justify-center rounded-[16px] bg-[#283455] px-7 text-[14px] font-bold text-white shadow-sm transition-colors hover:bg-[#1D2742] lg:mt-5 lg:h-[56px] lg:min-w-[172px]"
        >
          {displayCta}
        </Link>
      </div>
    </section>
  );
}
