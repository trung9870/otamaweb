"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { extractProductSlug } from "./catalog";
import { parseDollar, useCart } from "./CartContext";
import { useLanguage } from "./LanguageContext";
import { useStoreData } from "./StoreDataContext";
import {
  translateBadge,
  translateColor,
  translateDiscount,
  translateProductTitle,
  translateSize,
  UI_COPY,
} from "./translations";
import { SparkleIcon, StarRating } from "./icons";
import { SwipeDrawer } from "./SwipeDrawer";

const BED_SIZES = ["Twin", "Twin XL", "Full", "Queen", "King", "Cal King"];
const APPAREL_SIZES = ["XS/S", "M/L", "XL"];
const ONE_SIZE = ["One Size"];

function sizesForProduct(title: string): string[] {
  const lower = title.toLowerCase();
  if (lower.includes("robe") || lower.includes("slipper")) return APPAREL_SIZES;
  if (lower.includes("pouch") || lower.includes("eyemask") || lower.includes("throw")) return ONE_SIZE;
  return BED_SIZES;
}

export function QuickViewAndCart() {
  const { locale } = useLanguage();
  const { catalog, settings, formatMoney, formatMoneyString } = useStoreData();
  const qvCopy = UI_COPY[locale].quickViewModal;
  const cartCopy = UI_COPY[locale].cartDrawer;

  const {
    items,
    subtotal,
    isCartOpen,
    closeCart,
    openCart,
    quickViewProduct,
    quickViewSwatchIndex,
    closeQuickView,
    addItem,
    updateQty,
    removeItem,
  } = useCart();

  const qvDialogRef = useRef<HTMLDialogElement>(null);
  const [swatchSelection, setSwatchSelection] = useState<{
    productKey: string;
    index: number;
  } | null>(null);
  const [sizeSelection, setSizeSelection] = useState<{
    productKey: string;
    size: string;
  } | null>(null);

  const productKey = quickViewProduct
    ? `${quickViewProduct.id}::${quickViewSwatchIndex}`
    : "";

  const availableSizes = quickViewProduct
    ? sizesForProduct(quickViewProduct.title)
    : BED_SIZES;

  const selectedSwatch =
    swatchSelection?.productKey === productKey
      ? swatchSelection.index
      : quickViewSwatchIndex;

  const selectedSize =
    sizeSelection?.productKey === productKey
      ? sizeSelection.size
      : availableSizes.includes("Queen")
        ? "Queen"
        : availableSizes[0];

  useEffect(() => {
    const dialog = qvDialogRef.current;
    if (!dialog) return;

    if (quickViewProduct) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [quickViewProduct]);

  const activeSwatch = quickViewProduct?.swatches[selectedSwatch];
  const displayImage = activeSwatch?.mainImage || quickViewProduct?.mainImage || "";
  const activeColorRaw = activeSwatch?.label || "Default";
  const liveMatch = quickViewProduct
    ? catalog.find((p) => p.slug === extractProductSlug(quickViewProduct.href))
    : undefined;
  const displayTitle = quickViewProduct
    ? translateProductTitle(quickViewProduct.title, locale, liveMatch?.titleVi)
    : "";

  const handleAddToBag = () => {
    if (!quickViewProduct) return;
    const salePrice = parseDollar(quickViewProduct.salePrice);
    const originalPrice = parseDollar(quickViewProduct.originalPrice) || salePrice;
    const slug = extractProductSlug(quickViewProduct.href);
    addItem({
      key: `${slug}::${activeColorRaw}::${selectedSize}`,
      slug,
      title: quickViewProduct.title,
      color: activeColorRaw,
      size: selectedSize,
      price: salePrice,
      originalPrice,
      image: displayImage,
      href: `/products/${slug}`,
    });
    closeQuickView();
    openCart();
  };

  const freeShippingThreshold = settings.freeShippingThresholdUsd || 100;
  const freeGiftThreshold = settings.freeGiftThresholdUsd || 250;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeToteRemaining = Math.max(0, freeGiftThreshold - subtotal);
  const toteProgress =
    freeGiftThreshold > 0
      ? Math.min(100, Math.round((subtotal / freeGiftThreshold) * 100))
      : 100;

  return (
    <>
      {/* Quick View Modal (<dialog>) */}
      <dialog
        ref={qvDialogRef}
        aria-label={quickViewProduct ? `${UI_COPY[locale].quickView} ${displayTitle}` : UI_COPY[locale].quickView}
        onClose={closeQuickView}
        onClick={(e) => {
          if (e.target === qvDialogRef.current) closeQuickView();
        }}
        className="bkl-modal w-full"
      >
        {quickViewProduct && (
          <div className="relative grid grid-cols-1 overflow-hidden rounded-2xl bg-[#FDFAF8] text-[#283455] shadow-2xl md:grid-cols-2">
            <button
              type="button"
              onClick={closeQuickView}
              aria-label={locale === "vi" ? "Đóng xem nhanh" : "Close Quick View"}
              className="absolute top-3.5 right-3.5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-[#283455] shadow hover:bg-white"
            >
              &times;
            </button>

            <div className="aspect-square bg-[#F4F4F6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt={displayTitle}
                width={420}
                height={420}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between p-6">
              <div>
                {quickViewProduct.promoEyebrow && (
                  <p
                    className={`flex items-center gap-1.5 text-[12px] font-bold tracking-[0.08em] uppercase ${
                      quickViewProduct.promoTone === "urgent"
                        ? "text-[#AA3F00]"
                        : "text-[#417823]"
                    }`}
                  >
                    <SparkleIcon className="h-3.5 w-3.5" />
                    <span>{translateBadge(quickViewProduct.promoEyebrow, locale)}</span>
                  </p>
                )}

                <h2 className="mt-1.5 font-toledo text-[25px] leading-[1.18] text-[#283455]">
                  {displayTitle}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-[16px]">
                  {quickViewProduct.originalPrice && (
                    <span className="text-[#6E6E6E] line-through">
                      {formatMoneyString(quickViewProduct.originalPrice, locale)}
                    </span>
                  )}
                  <span className="font-bold text-[#283455]">
                    {formatMoneyString(quickViewProduct.salePrice, locale)}
                  </span>
                  {quickViewProduct.discountBadge && (
                    <span className="rounded bg-[#EAF3E4] px-2 py-0.5 text-[12px] font-bold text-[#417823]">
                      {translateDiscount(quickViewProduct.discountBadge, locale)}
                    </span>
                  )}
                </div>

                {quickViewProduct.reviewCount && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <StarRating rating={quickViewProduct.rating} size={13} />
                    <span className="text-[13px] text-[#6E6E6E]">
                      {quickViewProduct.reviewCount} {qvCopy.reviewsSuffix}
                    </span>
                  </div>
                )}

                {quickViewProduct.swatches.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[13px] font-bold text-[#283455]">
                      {qvCopy.colorLabel}{" "}
                      <span className="font-normal">
                        {translateColor(activeColorRaw, locale)}
                      </span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {quickViewProduct.swatches.slice(0, 12).map((sw, idx) => {
                        const colorLabel = translateColor(sw.label, locale);
                        return (
                          <button
                            key={`${sw.label}-${idx}`}
                            type="button"
                            aria-label={colorLabel}
                            title={colorLabel}
                            onClick={() =>
                              setSwatchSelection({ productKey, index: idx })
                            }
                            className={`h-7 w-7 cursor-pointer overflow-hidden rounded-[4px] border ${
                              idx === selectedSwatch
                                ? "border-[#283455] ring-2 ring-[#283455] ring-offset-1"
                                : "border-[#D6D2CC]"
                            }`}
                            style={
                              !sw.swatchImage && sw.color
                                ? { backgroundColor: sw.color }
                                : undefined
                            }
                          >
                            {sw.swatchImage && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={sw.swatchImage}
                                alt=""
                                width={28}
                                height={28}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-[13px] font-bold text-[#283455]">{qvCopy.sizeLabel}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableSizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSizeSelection({ productKey, size: sz })}
                        className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition-colors ${
                          selectedSize === sz
                            ? "border-[#283455] bg-[#283455] text-white"
                            : "border-[#C9CFD9] bg-white text-[#283455] hover:border-[#283455]"
                        }`}
                      >
                        {translateSize(sz, locale)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="h-[52px] w-full cursor-pointer rounded-[20px] bg-[#283455] text-[14px] font-bold text-white transition-colors hover:bg-[#1D2742]"
                >
                  {qvCopy.addToBag} &mdash;{" "}
                  {formatMoneyString(quickViewProduct.salePrice, locale)}
                </button>
                <Link
                  href={`/products/${extractProductSlug(quickViewProduct.href)}`}
                  onClick={closeQuickView}
                  className="text-center text-[13px] font-bold text-[#283455] underline underline-offset-2"
                >
                  {qvCopy.viewFullDetails}
                </Link>
              </div>
            </div>
          </div>
        )}
      </dialog>

      {/* Slide-Over Shopping Bag Drawer */}
      <SwipeDrawer
        open={isCartOpen}
        onClose={closeCart}
        side="right"
        ariaLabel={cartCopy.title}
      >
        <div className="flex items-center justify-between border-b border-[#E5E0DB] px-5 py-4">
          <h2 className="font-toledo text-[22px] text-[#283455]">{cartCopy.title}</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label={locale === "vi" ? "Đóng giỏ hàng" : "Close shopping bag"}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-2xl text-[#283455] hover:bg-[#EFEAE4]"
          >
            &times;
          </button>
        </div>

        {/* Free Shipping + Free Super-Fluff Tote Progress Bar */}
        <div className="border-b border-[#E5E0DB] bg-[#F9F3ED] px-5 py-3.5 text-[13px] text-[#283455]">
          {freeShippingRemaining > 0 ? (
            <p>
              {cartCopy.addMorePrefix}{" "}
              <span className="font-bold">
                {formatMoney(freeShippingRemaining, locale)}
              </span>{" "}
              {cartCopy.forFreeShipping} ({cartCopy.andMore}{" "}
              <span className="font-bold">
                {formatMoney(freeToteRemaining, locale)}
              </span>{" "}
              {cartCopy.forFreeTote})
            </p>
          ) : freeToteRemaining > 0 ? (
            <p>
              <span className="font-bold text-[#417823]">{cartCopy.freeShippingUnlocked}</span>{" "}
              {cartCopy.addMorePrefix}{" "}
              <span className="font-bold">
                {formatMoney(freeToteRemaining, locale)}
              </span>{" "}
              {cartCopy.freeToteSuffix}
            </p>
          ) : (
            <p className="font-bold text-[#417823]">{cartCopy.allUnlocked}</p>
          )}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E5DDD5]">
            <div
              className="h-full rounded-full bg-[#283455] transition-all duration-300"
              style={{ width: `${toteProgress}%` }}
            />
          </div>
        </div>

        {/* Bag Items */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-toledo text-[22px] text-[#283455]">{cartCopy.emptyTitle}</p>
              <p className="mt-2 text-[14px] text-[#5B647A]">{cartCopy.emptyBody}</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-5 inline-flex h-[48px] cursor-pointer items-center justify-center rounded-[20px] bg-[#283455] px-7 text-[14px] font-bold text-white"
              >
                {cartCopy.continueShopping}
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const matched = catalog.find((p) => p.slug === item.slug);
                const title = translateProductTitle(item.title, locale, matched?.titleVi);
                return (
                  <li
                    key={item.key}
                    className="flex gap-3.5 rounded-xl border border-[#ECE7E2] bg-white p-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={title}
                      width={76}
                      height={76}
                      className="h-[76px] w-[76px] shrink-0 rounded-lg bg-[#F4F4F6] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={item.href}
                          onClick={closeCart}
                          className="truncate text-[14px] font-bold text-[#283455] hover:underline"
                        >
                          {title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`${cartCopy.remove} ${title}`}
                          className="text-[12px] text-[#6E6E6E] underline hover:text-[#740103]"
                        >
                          {cartCopy.remove}
                        </button>
                      </div>
                      <p className="mt-0.5 text-[12px] text-[#5B647A]">
                        {translateColor(item.color, locale)} &middot;{" "}
                        {translateSize(item.size, locale)}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-[#D4D8E0]">
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, -1)}
                            aria-label={`- ${title}`}
                            className="h-7 w-7 cursor-pointer text-sm font-bold text-[#283455]"
                          >
                            &minus;
                          </button>
                          <span className="w-6 text-center text-[13px] font-bold">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, 1)}
                            aria-label={`+ ${title}`}
                            className="h-7 w-7 cursor-pointer text-sm font-bold text-[#283455]"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-[14px] font-bold text-[#283455]">
                          {formatMoney(item.price * item.qty, locale)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer Totals */}
        {items.length > 0 && (
          <div className="border-t border-[#E5E0DB] bg-white px-5 py-4">
            <div className="flex items-center justify-between text-[16px] font-bold text-[#283455]">
              <span>{cartCopy.subtotal}</span>
              <span>{formatMoney(subtotal, locale)}</span>
            </div>
            <p className="mt-1 text-[12px] text-[#6E6E6E]">{cartCopy.taxNote}</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-3.5 flex h-[50px] w-full items-center justify-center rounded-[20px] bg-[#283455] text-[14px] font-bold text-white transition-colors hover:bg-[#1D2742]"
            >
              {cartCopy.checkout}
            </Link>
          </div>
        )}
      </SwipeDrawer>
    </>
  );
}
