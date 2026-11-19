"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BROOKLINEN_DATA } from "./data";
import { extractProductSlug, toLocalHref } from "./catalog";
import { useCart } from "./CartContext";
import { LanguageSwitcher, useLanguage } from "./LanguageContext";
import { useStoreData } from "./StoreDataContext";
import {
  translateBadge,
  translateProductTitle,
  UI_COPY,
} from "./translations";
import {
  AccountIcon,
  BagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HamburgerTwoBarIcon,
  SearchIcon,
} from "./icons";
import { SwipeDrawer } from "./SwipeDrawer";

export function Header() {
  const { locale } = useLanguage();
  const { catalog, settings, formatMoneyString } = useStoreData();
  const copy = UI_COPY[locale];
  const { totalCount, openCart } = useCart();

  const [slideIdx, setSlideIdx] = useState(0);
  const [activeMegaIdx, setActiveMegaIdx] = useState<number | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchDialogRef = useRef<HTMLDialogElement>(null);
  const termsDialogRef = useRef<HTMLDialogElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const slides = BROOKLINEN_DATA.announcementSlides;
  const currentSlide = slides[slideIdx % slides.length];
  const liveAnnouncements =
    locale === "vi" && settings.announcementVi.length > 0
      ? settings.announcementVi
      : locale === "en" && settings.announcementEn.length > 0
      ? settings.announcementEn
      : copy.announcements;
  const currentAnnouncementText =
    liveAnnouncements[slideIdx % liveAnnouncements.length] || currentSlide.text;

  // Live searchable catalog from StoreDataContext (searchable in both EN and VI)
  const allProducts = catalog;

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allProducts.slice(0, 6);
    return allProducts
      .filter((p) => {
        const enTitle = p.title.toLowerCase();
        const viTitle = translateProductTitle(p.title, "vi", p.titleVi).toLowerCase();
        return enTitle.includes(q) || viTitle.includes(q);
      })
      .slice(0, 8);
  }, [allProducts, searchQuery]);

  useEffect(() => {
    const d = searchDialogRef.current;
    if (!d) return;
    if (searchOpen && !d.open) d.showModal();
    if (!searchOpen && d.open) d.close();
  }, [searchOpen]);

  useEffect(() => {
    const d = termsDialogRef.current;
    if (!d) return;
    if (termsOpen && !d.open) d.showModal();
    if (!termsOpen && d.open) d.close();
  }, [termsOpen]);

  useEffect(() => {
    if (!accountOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  const activeNavRaw =
    activeMegaIdx !== null ? BROOKLINEN_DATA.navItems[activeMegaIdx] : null;
  const activeNavText =
    activeMegaIdx !== null ? copy.navItems[activeMegaIdx] : null;

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#283455] text-white">
        <div className="mx-auto flex min-h-[40px] max-w-[1440px] items-center justify-between px-4 py-2.5 lg:justify-center lg:gap-16 lg:py-0">
          <button
            type="button"
            aria-label={copy.prevAnnouncement}
            onClick={() => setSlideIdx((prev) => (prev - 1 + slides.length) % slides.length)}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </button>

          <p className="text-center text-[13px] leading-[1.35] font-bold tracking-[0.01em] lg:text-[13.5px]">
            <Link
              href={toLocalHref(currentSlide.href)}
              className="underline decoration-white/80 underline-offset-[3px] hover:decoration-white"
            >
              {currentAnnouncementText}
            </Link>
            {currentSlide.hasTerms && (
              <>
                {" "}
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className="cursor-pointer font-normal underline decoration-white/80 underline-offset-[3px] hover:text-white/90"
                >
                  {copy.termsApply}
                </button>
              </>
            )}
          </p>

          <button
            type="button"
            aria-label={copy.nextAnnouncement}
            onClick={() => setSlideIdx((prev) => (prev + 1) % slides.length)}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className="sticky top-0 z-40 border-b border-[#ECE7E2] bg-[#FDFAF8]"
        onMouseLeave={() => setActiveMegaIdx(null)}
      >
        <div className="mx-auto flex h-[65px] max-w-[1440px] items-center justify-between px-5 lg:h-[90px] lg:px-10 xl:px-14">
          {/* Brand Logo */}
          <Link
            href="/"
            aria-label="Brooklinen"
            onClick={() => setActiveMegaIdx(null)}
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#283455]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sites/brooklinen/brand/brooklinen-logo.svg"
              alt="Brooklinen — Best In Bed."
              width={100}
              height={33}
              className="h-[33px] w-[100px] object-contain"
            />
          </Link>

          {/* Desktop Primary Nav */}
          <nav
            aria-label={locale === "vi" ? "Điều hướng chính" : "Primary navigation"}
            className="hidden items-center gap-5 xl:gap-7 lg:flex"
          >
            {BROOKLINEN_DATA.navItems.map((item, idx) => {
              const navLabel = copy.navItems[idx]?.label || item.label;
              const isActive = activeMegaIdx === idx;
              return (
                <Link
                  key={item.label}
                  href={toLocalHref(item.href)}
                  onMouseEnter={() => setActiveMegaIdx(idx)}
                  onFocus={() => setActiveMegaIdx(idx)}
                  onClick={() => setActiveMegaIdx(null)}
                  className={`relative whitespace-nowrap py-2 leading-none text-[#283455] transition-colors ${
                    locale === "vi"
                      ? "text-[14.5px] xl:text-[15.5px]"
                      : "text-[16px] xl:text-[17.5px]"
                  } ${
                    isActive
                      ? "font-bold underline decoration-[#283455] decoration-2 underline-offset-[8px]"
                      : "font-normal hover:underline hover:decoration-[#283455]/70 hover:underline-offset-[8px]"
                  }`}
                >
                  {navLabel}
                </Link>
              );
            })}
          </nav>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-3 lg:gap-3.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={copy.searchModalTitle}
              className="flex w-[80px] items-center gap-1.5 border-b border-[#283455] pb-1 pr-2 text-left text-[13px] text-[#6E7485] transition-colors hover:text-[#283455] sm:w-[104px] xl:w-[120px]"
            >
              <SearchIcon className="h-4 w-4 shrink-0 text-[#283455]" />
              <span className="truncate">{copy.searchPlaceholder}</span>
            </button>

            <div className="hidden lg:block">
              <LanguageSwitcher variant="compact" />
            </div>

            {/* Account Button + Dropdown */}
            <div ref={accountRef} className="relative">
              <button
                type="button"
                aria-label={locale === "vi" ? "Tài khoản (1 ưu đãi)" : "Account menu (1 offer available)"}
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((prev) => !prev)}
                className="relative inline-flex h-8 w-8 items-center justify-center text-[#283455] transition-opacity hover:opacity-75"
              >
                <AccountIcon className="h-[19px] w-[17px]" />
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#B65B18] text-[10px] font-bold leading-none text-white"
                >
                  1
                </span>
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#E5E0DB] bg-[#FDFAF8] p-2 shadow-lg"
                >
                  {copy.accountLinks.map((lnk) => (
                    <Link
                      key={lnk.label}
                      href={toLocalHref(lnk.href)}
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-[14px] text-[#283455] hover:bg-[#F3EDE7]"
                    >
                      {lnk.label}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-[#E5E0DB]" />
                  <Link
                    href="/admin"
                    role="menuitem"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded-lg px-3 py-2 text-[14px] font-bold text-[#283455] hover:bg-[#F3EDE7]"
                  >
                    {locale === "vi" ? "Quản trị cửa hàng (Admin)" : "Store Admin"}
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={openCart}
              aria-label={
                locale === "vi"
                  ? `Mở giỏ hàng (${totalCount} sản phẩm)`
                  : `Open shopping bag (${totalCount} items)`
              }
              className="relative inline-flex h-8 w-8 items-center justify-center text-[#283455] transition-opacity hover:opacity-75"
            >
              <BagIcon className="h-[19px] w-[15px]" />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#283455] px-1 text-[10px] font-bold leading-none text-white">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label={locale === "vi" ? "Mở menu điều hướng" : "Open mobile navigation menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center text-[#283455] lg:hidden"
            >
              <HamburgerTwoBarIcon className="h-4 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop Hover Mega-Menu */}
        {activeNavRaw && activeNavText && (
          <div className="hidden lg:block absolute inset-x-0 top-full z-50 border-t border-[#ECE7E2] bg-[#FDFAF8] shadow-xl">
            <div className="bg-[#F6F1EB] py-2.5 text-center text-[13px] font-bold text-[#283455]">
              {copy.freeShippingBanner}
            </div>
            <div className="mx-auto grid max-w-[1160px] grid-cols-[1fr_280px] gap-12 px-14 py-9">
              <div className="grid grid-cols-2 gap-10">
                {activeNavRaw.columns.map((col, colIdx) => {
                  const colText = activeNavText.columns[colIdx];
                  return (
                    <div key={col.heading}>
                      <p className="mb-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#6E7485]">
                        {colText?.heading || col.heading}
                      </p>
                      <ul className="space-y-3">
                        {col.links.map((lnk, lnkIdx) => (
                          <li key={lnk.label}>
                            <Link
                              href={toLocalHref(lnk.href)}
                              onClick={() => setActiveMegaIdx(null)}
                              className="inline-flex items-center gap-2 text-[15px] text-[#283455] hover:underline"
                            >
                              <span>{colText?.links[lnkIdx] || lnk.label}</span>
                              {"badge" in lnk && lnk.badge && (
                                <span className="rounded-full bg-[#C6CBC2] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
                                  {translateBadge(lnk.badge, locale)}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <Link
                href={toLocalHref(activeNavRaw.featuredHref)}
                onClick={() => setActiveMegaIdx(null)}
                className="group block"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-[#F3F4F6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeNavRaw.featuredImage}
                    alt={activeNavText.featuredTitle}
                    width={280}
                    height={280}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-3 text-[15px] font-bold text-[#283455] group-hover:underline">
                  {activeNavText.featuredTitle} &rarr;
                </p>
                <p className="mt-1 text-[13px] leading-snug text-[#5B647A]">
                  {activeNavText.featuredDesc}
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Quick-Pill Strip + 1-tap EN/VI Switcher */}
        <div className="border-t border-[#ECE7E2] bg-[#FDFAF8] px-3 py-2.5 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="shrink-0">
              <LanguageSwitcher variant="compact" />
            </div>
            <div className="bkl-carousel-track flex-1 gap-2">
              {BROOKLINEN_DATA.mobileQuickPills.map((pill, idx) => (
                <Link
                  key={pill.label}
                  href={toLocalHref(pill.href)}
                  className="shrink-0 rounded-full bg-[#E5EAF1] px-3.5 py-1.5 text-[12.5px] font-bold text-[#283455] transition-colors active:bg-[#D5DDE8]"
                >
                  {copy.mobileQuickPills[idx] || pill.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <SwipeDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        side="left"
        ariaLabel={locale === "vi" ? "Điều hướng di động" : "Mobile Navigation"}
      >
        <div className="flex items-center justify-between border-b border-[#E5E0DB] px-5 py-4">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sites/brooklinen/brand/brooklinen-logo.svg"
              alt="Brooklinen"
              width={92}
              height={30}
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label={locale === "vi" ? "Đóng menu" : "Close navigation menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#283455] hover:bg-[#EFEAE4]"
          >
            &times;
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-[#ECE7E2] bg-[#F9F3ED] px-5 py-3">
          <span className="text-[13px] font-bold text-[#283455]">{copy.languageLabel}</span>
          <LanguageSwitcher variant="light" />
        </div>

        <nav
          aria-label={locale === "vi" ? "Danh mục di động" : "Mobile sections"}
          className="flex-1 px-5 py-4"
        >
          <ul className="divide-y divide-[#ECE7E2]">
            {BROOKLINEN_DATA.navItems.map((item, idx) => {
              const navText = copy.navItems[idx];
              const label = navText?.label || item.label;
              return (
                <li key={item.label} className="py-3">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-[16px] font-bold text-[#283455]">
                      <span>{label}</span>
                      <ChevronRightIcon className="h-4 w-4 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="mt-3 space-y-2 pl-2">
                      <Link
                        href={toLocalHref(item.href)}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1 text-[14px] font-bold text-[#283455] underline"
                      >
                        {copy.shopAllPrefix} {label}
                      </Link>
                      {item.columns.map((col, colIdx) =>
                        col.links.map((lnk, lnkIdx) => (
                          <Link
                            key={lnk.label}
                            href={toLocalHref(lnk.href)}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1 text-[14px] text-[#44506E]"
                          >
                            {navText?.columns[colIdx]?.links[lnkIdx] || lnk.label}
                          </Link>
                        ))
                      )}
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 space-y-2.5 border-t border-[#ECE7E2] pt-5">
            {copy.accountLinks.map((lnk) => (
              <Link
                key={lnk.label}
                href={toLocalHref(lnk.href)}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[14px] text-[#283455] hover:underline"
              >
                {lnk.label}
              </Link>
            ))}
          </div>
        </nav>
      </SwipeDrawer>

      {/* Search Modal */}
      <dialog
        ref={searchDialogRef}
        aria-label={copy.searchModalTitle}
        onClose={() => setSearchOpen(false)}
        onClick={(e) => {
          if (e.target === searchDialogRef.current) setSearchOpen(false);
        }}
        className="bkl-modal w-full"
      >
        <div className="overflow-hidden rounded-2xl bg-[#FDFAF8] text-[#283455] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#ECE7E2] px-6 py-4">
            <h2 className="font-toledo text-[24px]">{copy.searchModalTitle}</h2>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label={locale === "vi" ? "Đóng tìm kiếm" : "Close search"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-2xl text-[#283455] hover:bg-[#EFEAE4]"
            >
              &times;
            </button>
          </div>
          <div className="p-6">
            <search>
              <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
                <label htmlFor="bkl-search-input" className="sr-only">
                  {copy.searchModalTitle}
                </label>
                <SearchIcon className="pointer-events-none absolute left-4 h-4 w-4 text-[#283455]" />
                <input
                  id="bkl-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={copy.searchInputPlaceholder}
                  className="w-full rounded-full border border-[#283455]/40 bg-white py-3 pl-11 pr-5 text-[15px] text-[#283455] placeholder:text-[#7E8596] focus:border-[#283455] focus:outline-none"
                />
              </form>
            </search>

            <div className="mt-5 grid max-h-[54vh] grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-3">
              {searchResults.map((p) => {
                const displayTitle = translateProductTitle(p.title, locale, p.titleVi);
                const slug = extractProductSlug(p.href);
                return (
                  <Link
                    key={p.id}
                    href={`/products/${slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="group block rounded-xl border border-[#ECE7E2] bg-white p-2.5 text-left transition-shadow hover:shadow-md"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-[#F3F4F6]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.mainImage}
                        alt={displayTitle}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-[13px] font-bold text-[#283455] group-hover:underline">
                      {displayTitle}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#417823]">
                      {formatMoneyString(p.salePrice, locale)}{" "}
                      {p.originalPrice && (
                        <span className="text-[#7E8596] line-through">
                          {formatMoneyString(p.originalPrice, locale)}
                        </span>
                      )}
                    </p>
                  </Link>
                );
              })}
              {searchResults.length === 0 && (
                <p className="col-span-full py-8 text-center text-[15px] text-[#6E7485]">
                  {copy.searchEmpty(searchQuery)}
                </p>
              )}
            </div>
          </div>
        </div>
      </dialog>

      {/* Offer Terms Modal */}
      <dialog
        ref={termsDialogRef}
        aria-label={copy.offerTermsTitle}
        onClose={() => setTermsOpen(false)}
        onClick={(e) => {
          if (e.target === termsDialogRef.current) setTermsOpen(false);
        }}
        className="bkl-modal w-full max-w-[560px]"
      >
        <div className="rounded-2xl bg-[#FDFAF8] p-6 text-[#283455] shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-toledo text-[24px]">{copy.offerTermsTitle}</h2>
            <button
              type="button"
              onClick={() => setTermsOpen(false)}
              aria-label={locale === "vi" ? "Đóng điều khoản" : "Close offer terms"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-2xl hover:bg-[#EFEAE4]"
            >
              &times;
            </button>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-[#3D4866]">
            {copy.offerTermsBody}
          </p>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setTermsOpen(false)}
              className="rounded-[20px] bg-[#283455] px-6 py-2.5 text-[14px] font-bold text-white hover:bg-[#1E2842]"
            >
              {copy.gotIt}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
