"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { BROOKLINEN_DATA } from "./data";
import { toLocalHref } from "./catalog";
import { LanguageSwitcher, useLanguage } from "./LanguageContext";
import { UI_COPY } from "./translations";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  StarRating,
  XSocialIcon,
} from "./icons";

export function WhyBrooklinenSection() {
  const { locale } = useLanguage();
  const copy = UI_COPY[locale];

  return (
    <section
      aria-labelledby="why-brooklinen-heading"
      className="w-full bg-[#F9F3ED] pt-10 pb-8 lg:pt-14 lg:pb-10"
    >
      <div className="mx-auto max-w-[1440px] px-5 lg:px-16">
        <h2
          id="why-brooklinen-heading"
          className="mb-6 text-center font-toledo text-[30px] leading-[34.5px] text-[#283455] lg:mb-8 lg:text-[45px] lg:leading-[51.75px]"
        >
          {copy.whyHeading}
        </h2>

        <div className="rounded-[20px] bg-white px-7 py-10 shadow-[0_1px_2px_rgba(40,52,85,0.03)] lg:px-14 lg:py-12">
          <div className="grid grid-cols-1 gap-9 text-center lg:grid-cols-3 lg:gap-12">
            {copy.valueProps.map((prop, idx) => {
              const rawProp = BROOKLINEN_DATA.valueProps[idx];
              return (
                <div key={prop.title} className="flex flex-col items-center">
                  <h3 className="max-w-[290px] text-[14.5px] font-bold tracking-[0.1em] uppercase text-[#283455] lg:text-[15.5px]">
                    {prop.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.45] text-[#283455] lg:text-[17.5px]">
                    {prop.body}
                    {"linkLabel" in prop && prop.linkLabel && (
                      <>
                        <br />
                        <Link
                          href={toLocalHref(
                            "linkHref" in rawProp ? rawProp.linkHref : "/pages/faq"
                          )}
                          className="underline decoration-[#283455]/80 underline-offset-[3px] hover:decoration-[#283455]"
                        >
                          {prop.linkLabel}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const { locale } = useLanguage();
  const copy = UI_COPY[locale];
  const reviews = copy.reviews;
  const [index, setIndex] = useState(0);
  const current = reviews[index];

  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  const next = () => setIndex((i) => (i + 1) % reviews.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={locale === "vi" ? "Đánh giá 5 sao từ khách hàng" : "Customer 5-Star Reviews"}
      className="w-full bg-[#F9F3ED] py-10 lg:py-14"
    >
      <div className="mx-auto max-w-[1440px] px-5 lg:px-16">
        {/* Desktop Layout */}
        <div className="hidden items-center justify-between gap-10 lg:flex">
          <button
            type="button"
            onClick={prev}
            aria-label={locale === "vi" ? "Đánh giá trước" : "Previous customer review"}
            className="flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#283455] bg-transparent text-[#283455] transition-colors hover:bg-[#283455] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#283455]"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          <div className="grid flex-1 grid-cols-[minmax(260px,380px)_minmax(420px,540px)] items-center justify-center gap-16">
            <div>
              <h2 className="font-toledo text-[42px] leading-[1.16] text-[#283455] xl:text-[45px]">
                {copy.reviewsDesktopHeading.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <Link
                href="/pages/reviews"
                className="mt-7 inline-flex h-[54px] min-w-[172px] items-center justify-center rounded-[20px] bg-[#283455] px-7 text-[14px] font-bold text-white transition-colors hover:bg-[#1D2742]"
              >
                {copy.readOurReviews}
              </Link>
            </div>

            <article
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${reviews.length}`}
              className="flex min-h-[258px] flex-col justify-center rounded-[20px] bg-white px-10 py-9 shadow-[0_1px_2px_rgba(40,52,85,0.03)]"
            >
              <h3 className="font-toledo text-[28px] leading-[1.2] text-[#283455] lg:text-[30px]">
                {current.title}
              </h3>
              <p className="mt-4 text-[19px] leading-[1.45] text-[#283455] lg:text-[20px]">
                {current.quote}
              </p>
              <div className="mt-5">
                <StarRating rating={5} size={18} />
              </div>
              <p className="mt-3 text-[16px] font-bold text-[#283455]">
                {current.author}
              </p>
            </article>
          </div>

          <button
            type="button"
            onClick={next}
            aria-label={locale === "vi" ? "Đánh giá tiếp theo" : "Next customer review"}
            className="flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#283455] bg-transparent text-[#283455] transition-colors hover:bg-[#283455] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#283455]"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col items-center text-center lg:hidden">
          <h2 className="max-w-[280px] text-[14.5px] font-bold tracking-[0.11em] uppercase text-[#283455]">
            {copy.reviewsMobileEyebrow}
          </h2>

          <h3 className="mt-5 font-toledo text-[28px] leading-[1.2] text-[#283455]">
            {current.title}
          </h3>

          <p className="mt-4 max-w-[330px] text-[17px] leading-[1.45] text-[#283455]">
            {current.quote}
          </p>

          <div className="mt-5">
            <StarRating rating={5} size={20} />
          </div>

          <p className="mt-4 text-[16px] font-bold text-[#283455]">
            {current.author}
          </p>

          <Link
            href="/pages/reviews"
            className="mt-6 inline-flex h-[54px] min-w-[172px] items-center justify-center rounded-[20px] bg-[#283455] px-7 text-[14px] font-bold text-white"
          >
            {copy.readOurReviews}
          </Link>

          <div
            role="tablist"
            aria-label={locale === "vi" ? "Chọn đánh giá" : "Select customer review"}
            className="mt-6 flex items-center gap-3"
          >
            {reviews.map((rev, i) => {
              const active = i === index;
              return (
                <button
                  key={rev.author}
                  type="button"
                  aria-label={`${i + 1} / ${reviews.length}`}
                  aria-current={active ? "true" : undefined}
                  onClick={() => setIndex(i)}
                  className="inline-flex h-6 w-6 items-center justify-center"
                >
                  <span
                    className={`block rounded-full transition-all ${
                      active
                        ? "h-2.5 w-2.5 bg-[#283455] ring-2 ring-[#283455]/25"
                        : "h-2 w-2 bg-[#D6D0C8]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {index + 1} / {reviews.length}: {current.title} — {current.author}
        </p>
      </div>
    </section>
  );
}

export function PressSection() {
  const { locale } = useLanguage();
  const copy = UI_COPY[locale];

  return (
    <section
      aria-label={copy.pressHeading}
      className="w-full bg-[#F9F3ED] pt-6 pb-12 lg:pt-8 lg:pb-16"
    >
      <div className="mx-auto max-w-[1440px] px-5 lg:px-16">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#283455] lg:text-[24px]">
            {copy.pressHeading}
          </h2>
          <Link
            href="/collections/award-winners"
            className="inline-flex h-[42px] items-center justify-center rounded-full border border-[#283455] px-6 text-[13.5px] font-bold text-[#283455] transition-colors hover:bg-[#283455] hover:text-white"
          >
            {copy.shopAwardWinners}
          </Link>
        </div>

        <div className="bkl-carousel-track mt-7 items-center gap-9 lg:mt-9 lg:justify-start lg:gap-12 lg:overflow-visible">
          {BROOKLINEN_DATA.pressLogos.map((logo) => (
            <div key={logo.name} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.image}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                loading="lazy"
                className="h-[26px] w-auto object-contain opacity-50 lg:h-[28px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrooklinenFooter() {
  const { locale } = useLanguage();
  const copy = UI_COPY[locale];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#DDE3EC] text-[#283455]">
      <div className="mx-auto max-w-[1440px] px-6 pt-8 pb-12 lg:px-16 lg:pt-12 lg:pb-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          {/* Newsletter Block */}
          <div className="order-1 w-full lg:order-2 lg:max-w-[330px]">
            <h2 className="font-toledo text-[28px] leading-[1.15] text-[#283455] lg:text-[32px]">
              {copy.footerNewsletter.heading}
            </h2>
            <p className="mt-2.5 text-[14.5px] leading-[1.4] text-[#283455]">
              {copy.footerNewsletter.sub}
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-4">
              <label htmlFor="bkl-newsletter-email" className="sr-only">
                {copy.footerNewsletter.placeholder}
              </label>
              <div className="relative flex items-center">
                <input
                  id="bkl-newsletter-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder={copy.footerNewsletter.placeholder}
                  aria-invalid={status === "error"}
                  className="h-[56px] w-full rounded-[20px] border border-[#283455] bg-[#FDFAF8] pl-5 pr-12 text-[15px] text-[#283455] placeholder:text-[#7E8596] focus:outline-2 focus:outline-offset-2 focus:outline-[#283455]"
                />
                <button
                  type="submit"
                  aria-label={locale === "vi" ? "Gửi email" : "Submit email"}
                  className="absolute right-2 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[18px] text-[#283455] transition-colors hover:bg-[#ECE7E2]"
                >
                  &rarr;
                </button>
              </div>
              <div role="status" aria-live="polite" className="mt-1.5 min-h-[18px] text-[12.5px]">
                {status === "error" && (
                  <p className="font-medium text-[#740103]">
                    {copy.footerNewsletter.invalidEmail}
                  </p>
                )}
                {status === "success" && (
                  <p className="font-medium text-[#417823]">
                    {copy.footerNewsletter.successEmail}
                  </p>
                )}
              </div>
            </form>

            <p className="mt-2 text-[12px] leading-[1.45] text-[#283455]/90">
              {copy.footerNewsletter.consentBefore}
              <Link
                href="/pages/privacy"
                className="underline underline-offset-2"
              >
                {copy.footerNewsletter.privacyPolicy}
              </Link>
              .
            </p>
          </div>

          {/* 4 Footer Navigation Columns */}
          <div className="order-2 grid flex-1 grid-cols-2 gap-x-8 gap-y-8 lg:order-1 lg:max-w-[780px] lg:grid-cols-4 lg:gap-8">
            {BROOKLINEN_DATA.footerColumns.map((col, colIdx) => {
              const colCopy = copy.footerColumns[colIdx];
              return (
                <div key={col.heading}>
                  <h3 className="text-[14.5px] font-bold text-[#283455]">
                    {colCopy?.heading || col.heading}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {col.links.map((lnk, lnkIdx) => (
                      <li key={lnk.label}>
                        <Link
                          href={toLocalHref(lnk.href)}
                          className="text-[14px] leading-[1.35] text-[#283455] hover:underline"
                        >
                          {colCopy?.links[lnkIdx] || lnk.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Desktop Vertical Social Icons */}
          <div className="order-3 hidden flex-col items-center gap-3.5 pt-1 lg:flex">
            <a
              href="https://www.facebook.com/Brooklinen/"
              target="_blank"
              rel="noreferrer"
              aria-label="Brooklinen on Facebook"
              className="inline-flex h-9 w-9 items-center justify-center text-[#283455] transition-opacity hover:opacity-70"
            >
              <FacebookIcon className="h-6 w-6" />
            </a>
            <a
              href="https://x.com/brooklinen"
              target="_blank"
              rel="noreferrer"
              aria-label="Brooklinen on X"
              className="inline-flex h-9 w-9 items-center justify-center text-[#283455] transition-opacity hover:opacity-70"
            >
              <XSocialIcon className="h-6 w-6" />
            </a>
            <a
              href="https://www.pinterest.com/brooklinen/"
              target="_blank"
              rel="noreferrer"
              aria-label="Brooklinen on Pinterest"
              className="inline-flex h-9 w-9 items-center justify-center text-[#283455] transition-opacity hover:opacity-70"
            >
              <PinterestIcon className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/brooklinen/"
              target="_blank"
              rel="noreferrer"
              aria-label="Brooklinen on Instagram"
              className="inline-flex h-9 w-9 items-center justify-center text-[#283455] transition-opacity hover:opacity-70"
            >
              <InstagramIcon className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Bottom Legal Row + Language Switcher + Mobile Social Row */}
        <div className="mt-10 flex flex-col gap-5 border-t border-[#283455]/10 pt-6 lg:mt-12 lg:flex-row lg:items-center lg:justify-between lg:gap-7 lg:border-t-0 lg:pt-0">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-[#283455]">
            {BROOKLINEN_DATA.legalLinks.map((lnk, idx) => (
              <Link
                key={lnk.label}
                href={toLocalHref(lnk.href)}
                className="underline decoration-[#283455]/70 underline-offset-2 hover:decoration-[#283455]"
              >
                {copy.legalLinks[idx] || lnk.label}
              </Link>
            ))}
            <span className="lg:ml-3">&copy;Brooklinen 2026</span>
          </div>

          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <Link
              href="/admin"
              className="text-[12.5px] font-bold text-[#283455]/75 underline-offset-2 hover:text-[#283455] hover:underline"
            >
              {locale === "vi" ? "Quản trị (Admin)" : "Store Admin"}
            </Link>
            <LanguageSwitcher variant="light" />

            <div className="flex items-center gap-3 lg:hidden">
              <a
                href="https://www.facebook.com/Brooklinen/"
                target="_blank"
                rel="noreferrer"
                aria-label="Brooklinen on Facebook"
                className="inline-flex h-8 w-8 items-center justify-center text-[#283455]"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/brooklinen"
                target="_blank"
                rel="noreferrer"
                aria-label="Brooklinen on X"
                className="inline-flex h-8 w-8 items-center justify-center text-[#283455]"
              >
                <XSocialIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.pinterest.com/brooklinen/"
                target="_blank"
                rel="noreferrer"
                aria-label="Brooklinen on Pinterest"
                className="inline-flex h-8 w-8 items-center justify-center text-[#283455]"
              >
                <PinterestIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/brooklinen/"
                target="_blank"
                rel="noreferrer"
                aria-label="Brooklinen on Instagram"
                className="inline-flex h-8 w-8 items-center justify-center text-[#283455]"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
