"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { toLocalHref } from "./catalog";
import { PositionedOverlayBox } from "./PositionedOverlayBox";
import {
  alignToJustify,
  buildButtonStyleProps,
  buildTextStyleProps,
} from "@/lib/section-style-helpers";
import type { HomepageSectionStyle } from "@/lib/store-types";

interface VideoHeroProps {
  sectionId?: string;
  sectionLabel?: string;
  sectionStyle?: HomepageSectionStyle;
  variant: "primary" | "sheets";
  mediaType?: "video" | "image";
  desktopVideo: string;
  desktopPoster: string;
  mobileVideo: string;
  mobilePoster: string;
  headingLines?: readonly string[];
  lockupSvg?: string;
  lockupAlt?: string;
  textHeadline?: string;
  subtitleLines?: readonly string[];
  subtitle?: string;
  ctas: readonly { label: string; href: string }[];
  showPauseButton?: boolean;
  playLabel?: string;
  pauseLabel?: string;
}

export function VideoHero({
  sectionId,
  sectionLabel,
  sectionStyle,
  variant,
  mediaType = "video",
  desktopVideo,
  desktopPoster,
  mobileVideo,
  mobilePoster,
  headingLines,
  lockupSvg,
  lockupAlt,
  textHeadline,
  subtitleLines,
  subtitle,
  ctas,
  showPauseButton = false,
  playLabel = "Play video",
  pauseLabel = "Pause video",
}: VideoHeroProps) {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  const isImage = mediaType === "image";
  const resolvedMobileMedia = mobileVideo || desktopVideo;
  const resolvedMobilePoster = mobilePoster || desktopPoster;

  const togglePlayback = () => {
    const nextPaused = !paused;
    setPaused(nextPaused);
    for (const v of [desktopVideoRef.current, mobileVideoRef.current]) {
      if (!v) continue;
      if (nextPaused) {
        v.pause();
      } else {
        void v.play().catch(() => {});
      }
    }
  };

  const hasCustomMaxWidth = sectionStyle?.layout?.maxWidth !== undefined;
  const scrimOpacity = sectionStyle?.layout?.scrimOpacity;

  const primaryTitleProps = buildTextStyleProps(
    sectionStyle?.title,
    "font-toledo text-[34px] leading-[1.15] tracking-[-0.005em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:text-[42px] lg:text-[45px] lg:leading-[52px]"
  );

  const sheetsTitleProps = buildTextStyleProps(
    sectionStyle?.title,
    "text-[32px] font-bold tracking-[0.06em] uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] sm:text-[44px] lg:text-[56px]"
  );

  const primarySubProps = buildTextStyleProps(
    sectionStyle?.subtitle,
    `mt-3.5 text-[17px] leading-[1.38] drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] lg:mt-4 lg:text-[22px] lg:leading-[1.35] ${
      hasCustomMaxWidth
        ? "max-w-full"
        : "max-w-[330px] sm:max-w-[540px] lg:max-w-[700px]"
    }`
  );

  const sheetsSubProps = buildTextStyleProps(
    sectionStyle?.subtitle,
    `mt-3 text-[17px] leading-[1.38] drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] lg:mt-4 lg:text-[22px] lg:leading-[1.35] ${
      hasCustomMaxWidth
        ? "max-w-full"
        : "max-w-[330px] sm:max-w-[520px] lg:max-w-[650px]"
    }`
  );

  const baseCtaClass =
    "inline-flex h-[56px] min-w-[172px] items-center justify-center rounded-[20px] bg-[#283455] px-8 text-[14px] font-bold tracking-[-0.01em] text-white shadow-sm transition-colors hover:bg-[#1D2742] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <section
      aria-label={variant === "primary" ? "Primary Storefront Hero" : "Featured Sheets Campaign"}
      className="relative h-[439px] w-full overflow-hidden bg-[#262321] lg:h-[678px]"
    >
      {isImage ? (
        <picture>
          <source media="(max-width: 1023px)" srcSet={resolvedMobileMedia} />
          <img
            src={desktopVideo}
            alt=""
            aria-hidden="true"
            width={1440}
            height={678}
            className="h-full w-full object-cover"
          />
        </picture>
      ) : (
        <>
          <video
            key={`desk-${desktopVideo}`}
            ref={desktopVideoRef}
            src={desktopVideo}
            poster={desktopPoster || undefined}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            width={1440}
            height={678}
            className="hidden h-full w-full object-cover lg:block"
          />

          <video
            key={`mob-${resolvedMobileMedia}`}
            ref={mobileVideoRef}
            src={resolvedMobileMedia}
            poster={resolvedMobilePoster || undefined}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            width={390}
            height={439}
            className="block h-full w-full object-cover lg:hidden"
          />
        </>
      )}

      {/* Backdrop scrim (adjustable 0-70% in Admin, subtle gradient by default) */}
      {scrimOpacity !== undefined ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${scrimOpacity / 100})` }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/25"
        />
      )}

      <PositionedOverlayBox
        sectionId={sectionId}
        sectionLabel={sectionLabel}
        layout={sectionStyle?.layout}
        defaultMaxWidthPx={760}
      >
        {variant === "primary" && headingLines ? (
          <h1 className={primaryTitleProps.className} style={primaryTitleProps.style}>
            {headingLines.map((line, i) => (
              <span key={`${line}-${i}`} className="block">
                {line}
                {i < headingLines.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
        ) : textHeadline ? (
          <h2 className={sheetsTitleProps.className} style={sheetsTitleProps.style}>
            {textHeadline.split("\n").map((line, i) => (
              <span key={`${line}-${i}`} className="block">
                {line}
              </span>
            ))}
          </h2>
        ) : lockupSvg ? (
          <>
            <h2 className="sr-only">{lockupAlt || "Best. Sheets. Ever."}</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lockupSvg}
              alt={lockupAlt || "Best. Sheets. Ever."}
              width={500}
              height={120}
              className="w-[300px] max-w-[85vw] object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] lg:w-[500px]"
            />
          </>
        ) : null}

        {subtitleLines ? (
          <p className={primarySubProps.className} style={primarySubProps.style}>
            {subtitleLines.map((line, i) => (
              <span key={`${line}-${i}`} className={hasCustomMaxWidth ? "" : "lg:block"}>
                {line}{" "}
              </span>
            ))}
          </p>
        ) : subtitle ? (
          <p className={sheetsSubProps.className} style={sheetsSubProps.style}>
            {subtitle}
          </p>
        ) : null}

        <div
          className={`mt-6 flex flex-wrap items-center gap-3.5 lg:mt-7 ${alignToJustify(
            sectionStyle?.layout?.textAlign
          )} ${ctas.length > 1 ? "flex-col sm:flex-row" : ""}`}
        >
          {ctas.map((cta, idx) => {
            const btnCfg =
              idx === 0
                ? sectionStyle?.button
                : sectionStyle?.secondaryButton || sectionStyle?.button;
            const btnProps = buildButtonStyleProps(btnCfg, baseCtaClass);
            return (
              <Link
                key={`${cta.label}-${idx}`}
                href={toLocalHref(cta.href)}
                className={btnProps.className}
                style={btnProps.style}
                {...(btnProps.dataAttrs || {})}
              >
                {cta.label}
              </Link>
            );
          })}
        </div>
      </PositionedOverlayBox>

      {!isImage &&
        (showPauseButton ? (
          <button
            type="button"
            data-preview-interactive="true"
            onClick={togglePlayback}
            aria-label={paused ? playLabel : pauseLabel}
            className="absolute right-5 bottom-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#283455] shadow-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:right-8 lg:bottom-8"
          >
            {paused ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <path d="M3 1.8L12.2 7L3 12.2V1.8Z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <rect x="2.5" y="2" width="3.2" height="10" rx="0.8" />
                <rect x="8.3" y="2" width="3.2" height="10" rx="0.8" />
              </svg>
            )}
          </button>
        ) : (
          <button
            type="button"
            data-preview-interactive="true"
            onClick={togglePlayback}
            aria-label={paused ? playLabel : pauseLabel}
            className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:bottom-4 focus:rounded-full focus:bg-white focus:px-3 focus:py-1.5 focus:text-xs focus:font-bold focus:text-[#283455]"
          >
            {paused ? playLabel : pauseLabel}
          </button>
        ))}
    </section>
  );
}
