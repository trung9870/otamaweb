"use client";

import Link from "next/link";
import { BROOKLINEN_DATA } from "./data";
import { toLocalHref } from "./catalog";
import { useLanguage } from "./LanguageContext";
import { UI_COPY } from "./translations";

export function MiniHeroTote() {
  const { locale } = useLanguage();
  const copy = UI_COPY[locale].miniHeroTote;
  const { desktopImage, mobileImage, ctaHref } = BROOKLINEN_DATA.miniHeroTote;

  return (
    <section
      aria-label={copy.lines.join(" ")}
      className="relative h-[168px] w-full overflow-hidden bg-[#740103] lg:h-[288px]"
    >
      <picture>
        <source media="(max-width: 1023px)" srcSet={mobileImage} />
        <img
          src={desktopImage}
          alt={copy.lines.join(" ")}
          width={1440}
          height={288}
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
      </picture>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <p className="text-[17px] leading-[1.3] font-bold drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)] lg:text-[20px]">
          {copy.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <Link
          href={toLocalHref(ctaHref)}
          className="mt-4 inline-flex h-[48px] min-w-[154px] items-center justify-center rounded-[16px] bg-[#283455] px-7 text-[14px] font-bold text-white shadow-sm transition-colors hover:bg-[#1D2742] lg:mt-5 lg:h-[56px] lg:min-w-[172px]"
        >
          {copy.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
