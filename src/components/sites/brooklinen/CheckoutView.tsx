"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "./CartContext";
import { useLanguage } from "./LanguageContext";
import {
  formatPrice,
  translateColor,
  translateProductTitle,
  translateSize,
} from "./translations";

export function CheckoutView() {
  const { locale } = useLanguage();
  const { items, subtotal, updateQty, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("BFCM26");
  const [orderId, setOrderId] = useState<string | null>(null);

  const freeShipping = subtotal >= 100;
  const freeTote = subtotal >= 250;
  const shippingCost = items.length === 0 || freeShipping ? 0 : 10;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    const id = `BKL-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(id);
    clearCart();
  };

  if (orderId) {
    return (
      <div className="mx-auto max-w-[640px] px-5 py-20 text-center">
        <div className="rounded-2xl border border-[#ECE7E2] bg-white p-10 shadow-xs">
          <p className="inline-block rounded-full bg-[#EAF3E4] px-4 py-1 text-[12.5px] font-bold text-[#417823]">
            {locale === "vi" ? "Đặt Hàng Demo Thành Công" : "Demo Order Confirmed"}
          </p>
          <h1 className="mt-4 font-toledo text-[34px] text-[#283455]">
            {locale === "vi" ? "Cảm ơn bạn đã đặt hàng!" : "Thank you for your order!"}
          </h1>
          <p className="mt-2 text-[15px] text-[#3D4866]">
            {locale === "vi"
              ? `Mã đơn hàng demo của bạn là ${orderId}. Đây là luồng thanh toán mô phỏng trên local, không phát sinh giao dịch thật.`
              : `Your local demo order number is ${orderId}. No real charge was made.`}
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex h-[52px] items-center justify-center rounded-[20px] bg-[#283455] px-8 text-[14px] font-bold text-white"
          >
            {locale === "vi" ? "Tiếp Tục Mua Sắm" : "Continue Shopping"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-10 lg:px-16 lg:py-14">
      <h1 className="font-toledo text-[34px] text-[#283455] lg:text-[42px]">
        {locale === "vi" ? "Thanh Toán" : "Checkout"}
      </h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-[#F9F3ED] p-12 text-center">
          <p className="font-toledo text-[26px] text-[#283455]">
            {locale === "vi" ? "Giỏ hàng của bạn đang trống" : "Your bag is empty"}
          </p>
          <p className="mt-2 text-[15px] text-[#5B647A]">
            {locale === "vi"
              ? "Hãy chọn vài sản phẩm yêu thích để trải nghiệm luồng thanh toán & quà tặng miễn phí."
              : "Add a few bedding or bath favorites to try the checkout flow."}
          </p>
          <Link
            href="/collections/best-sellers"
            className="mt-6 inline-flex h-[52px] items-center justify-center rounded-[20px] bg-[#283455] px-8 text-[14px] font-bold text-white"
          >
            {locale === "vi" ? "Khám Phá Sản Phẩm" : "Shop Best Sellers"}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Shipping Form */}
          <form
            onSubmit={handlePlaceOrder}
            className="space-y-5 rounded-2xl border border-[#ECE7E2] bg-white p-7"
          >
            <h2 className="font-toledo text-[24px] text-[#283455]">
              {locale === "vi" ? "Thông Tin Giao Hàng (Demo)" : "Shipping Information (Demo)"}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ck-first" className="block text-[13px] font-bold">
                  {locale === "vi" ? "Tên" : "First Name"}
                </label>
                <input
                  id="ck-first"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#C9CFD9] px-3.5 text-[14.5px]"
                />
              </div>
              <div>
                <label htmlFor="ck-last" className="block text-[13px] font-bold">
                  {locale === "vi" ? "Họ" : "Last Name"}
                </label>
                <input
                  id="ck-last"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#C9CFD9] px-3.5 text-[14.5px]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ck-email" className="block text-[13px] font-bold">
                Email
              </label>
              <input
                id="ck-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-[#C9CFD9] px-3.5 text-[14.5px]"
              />
            </div>

            <div>
              <label htmlFor="ck-addr" className="block text-[13px] font-bold">
                {locale === "vi" ? "Địa chỉ nhận hàng" : "Street Address"}
              </label>
              <input
                id="ck-addr"
                type="text"
                autoComplete="street-address"
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-[#C9CFD9] px-3.5 text-[14.5px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ck-city" className="block text-[13px] font-bold">
                  {locale === "vi" ? "Thành phố" : "City"}
                </label>
                <input
                  id="ck-city"
                  type="text"
                  autoComplete="address-level2"
                  required
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#C9CFD9] px-3.5 text-[14.5px]"
                />
              </div>
              <div>
                <label htmlFor="ck-promo" className="block text-[13px] font-bold">
                  {locale === "vi" ? "Mã ưu đãi" : "Promo Code"}
                </label>
                <input
                  id="ck-promo"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#417823] bg-[#EAF3E4]/50 px-3.5 text-[14.5px] font-bold text-[#417823]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="h-[54px] w-full cursor-pointer rounded-[20px] bg-[#283455] text-[15px] font-bold text-white hover:bg-[#1D2742]"
            >
              {locale === "vi"
                ? `Hoàn Tất Đơn Hàng Demo — ${formatPrice(total, locale)}`
                : `Place Demo Order — ${formatPrice(total, locale)}`}
            </button>
          </form>

          {/* Right Order Summary */}
          <div className="rounded-2xl bg-[#F9F3ED] p-7">
            <h2 className="font-toledo text-[24px] text-[#283455]">
              {locale === "vi" ? "Tóm Tắt Đơn Hàng" : "Order Summary"}
            </h2>

            <ul className="mt-5 space-y-3.5">
              {items.map((item) => {
                const title = translateProductTitle(item.title, locale);
                return (
                  <li
                    key={item.key}
                    className="flex items-center gap-3.5 rounded-xl bg-white p-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={title}
                      width={68}
                      height={68}
                      className="h-[68px] w-[68px] shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={item.href}
                        className="block truncate text-[14px] font-bold text-[#283455] hover:underline"
                      >
                        {title}
                      </Link>
                      <p className="text-[12px] text-[#5B647A]">
                        {translateColor(item.color, locale)} &middot;{" "}
                        {translateSize(item.size, locale)}
                      </p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <div className="inline-flex items-center rounded-full border border-[#D4D8E0]">
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, -1)}
                            className="h-6 w-6 cursor-pointer text-xs font-bold"
                          >
                            &minus;
                          </button>
                          <span className="w-5 text-center text-xs font-bold">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, 1)}
                            className="h-6 w-6 cursor-pointer text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="text-[12px] text-[#6E6E6E] underline"
                        >
                          {locale === "vi" ? "Xóa" : "Remove"}
                        </button>
                      </div>
                    </div>
                    <p className="text-[14.5px] font-bold text-[#283455]">
                      {formatPrice(item.price * item.qty, locale)}
                    </p>
                  </li>
                );
              })}

              {freeTote && (
                <li className="flex items-center justify-between rounded-xl border border-[#417823]/30 bg-[#EAF3E4] px-4 py-3 text-[13.5px] font-bold text-[#417823]">
                  <span>
                    {locale === "vi"
                      ? "Quà tặng: Túi Super-Fluff Tote (trị giá 1.875.000₫)"
                      : "Bonus Gift: Super-Fluff Tote ($75 value)"}
                  </span>
                  <span>{locale === "vi" ? "MIỄN PHÍ" : "FREE"}</span>
                </li>
              )}
            </ul>

            <div className="mt-6 space-y-2 border-t border-[#E2DAD1] pt-4 text-[14.5px]">
              <div className="flex justify-between">
                <span>{locale === "vi" ? "Tạm tính" : "Subtotal"}</span>
                <span className="font-bold">{formatPrice(subtotal, locale)}</span>
              </div>
              <div className="flex justify-between">
                <span>{locale === "vi" ? "Vận chuyển" : "Shipping"}</span>
                <span className="font-bold text-[#417823]">
                  {shippingCost === 0
                    ? locale === "vi"
                      ? "Miễn phí"
                      : "FREE"
                    : formatPrice(shippingCost, locale)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#E2DAD1] pt-3 text-[18px] font-bold text-[#283455]">
                <span>{locale === "vi" ? "Tổng cộng" : "Total"}</span>
                <span>{formatPrice(total, locale)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
