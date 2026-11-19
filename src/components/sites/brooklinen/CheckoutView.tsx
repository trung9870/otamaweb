"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "./CartContext";
import { useLanguage } from "./LanguageContext";
import { useStoreData } from "./StoreDataContext";
import {
  translateColor,
  translateProductTitle,
  translateSize,
} from "./translations";
import type { PaymentMethod } from "@/lib/store-types";

export function CheckoutView() {
  const { locale } = useLanguage();
  const { catalog, settings, formatMoney } = useStoreData();
  const { items, subtotal, updateQty, removeItem, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [promoCode, setPromoCode] = useState(settings.promoCode || "BFCM26");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paidMethod, setPaidMethod] = useState<PaymentMethod>("cod");
  const [confirmedTotalUsd, setConfirmedTotalUsd] = useState(0);

  const freeShipping = subtotal >= settings.freeShippingThresholdUsd;
  const freeTote = subtotal >= settings.freeGiftThresholdUsd;
  const shippingCost = items.length === 0 || freeShipping ? 0 : settings.shippingFeeUsd;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || items.length === 0) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          city,
          paymentMethod,
          promoCode,
          locale,
          note,
          items: items.map((i) => ({
            slug: i.slug,
            title: i.title,
            color: i.color,
            size: i.size,
            qty: i.qty,
            priceUsd: i.price,
            image: i.image,
          })),
        }),
      });
      const data = (await res.json()) as {
        order?: { id: string; totalUsd: number };
        error?: string;
      };
      if (!res.ok || !data.order) {
        throw new Error(
          data.error ||
            (locale === "vi"
              ? "Không thể gửi đơn hàng, vui lòng thử lại."
              : "Could not place order, please try again.")
        );
      }
      setOrderId(data.order.id);
      setPaidMethod(paymentMethod);
      setConfirmedTotalUsd(data.order.totalUsd);
      clearCart();
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : locale === "vi"
          ? "Đã có lỗi xảy ra."
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <div className="mx-auto max-w-[680px] px-5 py-16 text-center">
        <div className="rounded-2xl border border-[#ECE7E2] bg-white p-8 shadow-xs sm:p-10">
          <p className="inline-block rounded-full bg-[#EAF3E4] px-4 py-1 text-[12.5px] font-bold text-[#417823]">
            {locale === "vi" ? "Đặt Hàng Thành Công" : "Order Confirmed"}
          </p>
          <h1 className="mt-4 font-toledo text-[32px] text-[#283455] sm:text-[36px]">
            {locale === "vi" ? "Cảm ơn bạn đã đặt hàng!" : "Thank you for your order!"}
          </h1>
          <p className="mt-2 text-[15px] text-[#3D4866]">
            {locale === "vi"
              ? `Mã đơn hàng của bạn là ${orderId} — Tổng tiền ${formatMoney(confirmedTotalUsd, locale)}. Đơn hàng đã được lưu trực tiếp vào mục Quản trị (/admin).`
              : `Your order number is ${orderId} — Total ${formatMoney(confirmedTotalUsd, locale)}. Your order has been saved to Store Admin (/admin).`}
          </p>

          {paidMethod === "bank_transfer" && settings.bankAccountNo && (
            <div className="mt-6 rounded-xl border border-[#DDE3EC] bg-[#F9F3ED] p-5 text-left text-[14px] text-[#283455]">
              <p className="font-bold">
                {locale === "vi"
                  ? "Thông tin chuyển khoản ngân hàng:"
                  : "Bank Transfer Details:"}
              </p>
              <ul className="mt-2 space-y-1">
                <li>
                  {locale === "vi" ? "Ngân hàng:" : "Bank:"}{" "}
                  <strong>{settings.bankName}</strong>
                </li>
                <li>
                  {locale === "vi" ? "Số tài khoản:" : "Account No:"}{" "}
                  <strong className="font-mono">{settings.bankAccountNo}</strong>
                </li>
                <li>
                  {locale === "vi" ? "Chủ tài khoản:" : "Account Name:"}{" "}
                  <strong>{settings.bankAccountName}</strong>
                </li>
                <li>
                  {locale === "vi" ? "Nội dung CK:" : "Reference:"}{" "}
                  <strong className="font-mono">{orderId}</strong>
                </li>
              </ul>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-[50px] items-center justify-center rounded-[20px] bg-[#283455] px-7 text-[14px] font-bold text-white"
            >
              {locale === "vi" ? "Tiếp Tục Mua Sắm" : "Continue Shopping"}
            </Link>
            <Link
              href="/admin"
              className="inline-flex h-[50px] items-center justify-center rounded-[20px] border border-[#283455] px-7 text-[14px] font-bold text-[#283455] hover:bg-[#F9F3ED]"
            >
              {locale === "vi" ? "Xem Đơn Trong Admin" : "View Order in Admin"}
            </Link>
          </div>
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
              ? "Hãy chọn vài sản phẩm yêu thích để đặt hàng và kiểm tra đơn trong trang quản trị."
              : "Add a few bedding or bath favorites to place an order."}
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
              {locale === "vi" ? "Thông Tin Giao Hàng" : "Shipping Information"}
            </h2>

            {errorMsg && (
              <div
                role="alert"
                className="rounded-xl border border-[#D93025]/40 bg-[#FCE8E6] px-4 py-3 text-[14px] font-medium text-[#A50E0E]"
              >
                {errorMsg}
              </div>
            )}

            <div>
              <label htmlFor="ck-name" className="block text-[13.5px] font-bold">
                {locale === "vi" ? "Họ và tên" : "Full Name"}{" "}
                <span aria-hidden="true" className="text-[#740103]">
                  *
                </span>
              </label>
              <input
                id="ck-name"
                name="customerName"
                type="text"
                autoComplete="name"
                enterKeyHint="next"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ck-phone" className="block text-[13.5px] font-bold">
                  {locale === "vi" ? "Số điện thoại" : "Phone Number"}{" "}
                  <span aria-hidden="true" className="text-[#740103]">
                    *
                  </span>
                </label>
                <input
                  id="ck-phone"
                  name="customerPhone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  enterKeyHint="next"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
                />
              </div>
              <div>
                <label htmlFor="ck-email" className="block text-[13.5px] font-bold">
                  Email{" "}
                  <span aria-hidden="true" className="text-[#740103]">
                    *
                  </span>
                </label>
                <input
                  id="ck-email"
                  name="customerEmail"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  enterKeyHint="next"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ck-addr" className="block text-[13.5px] font-bold">
                {locale === "vi" ? "Địa chỉ nhận hàng" : "Street Address"}{" "}
                <span aria-hidden="true" className="text-[#740103]">
                  *
                </span>
              </label>
              <textarea
                id="ck-addr"
                name="shippingAddress"
                rows={2}
                autoComplete="street-address"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2.5"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ck-city" className="block text-[13.5px] font-bold">
                  {locale === "vi" ? "Tỉnh / Thành phố" : "City"}{" "}
                  <span aria-hidden="true" className="text-[#740103]">
                    *
                  </span>
                </label>
                <input
                  id="ck-city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
                />
              </div>
              <div>
                <label htmlFor="ck-promo" className="block text-[13.5px] font-bold">
                  {locale === "vi" ? "Mã ưu đãi" : "Promo Code"}
                </label>
                <input
                  id="ck-promo"
                  name="promoCode"
                  type="text"
                  spellCheck={false}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="admin-input mt-1.5 w-full rounded-xl border border-[#417823] bg-[#EAF3E4]/50 px-3.5 font-bold text-[#417823]"
                />
              </div>
            </div>

            {/* Payment Method */}
            <fieldset className="space-y-2.5 pt-1">
              <legend className="text-[13.5px] font-bold text-[#283455]">
                {locale === "vi" ? "Phương thức thanh toán" : "Payment Method"}
              </legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#C9CFD9] p-3.5 has-[:checked]:border-[#283455] has-[:checked]:bg-[#F9F3ED]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 accent-[#283455]"
                  />
                  <span className="text-[14px] font-bold text-[#283455]">
                    {locale === "vi"
                      ? "Thanh toán khi nhận hàng (COD)"
                      : "Cash on Delivery (COD)"}
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#C9CFD9] p-3.5 has-[:checked]:border-[#283455] has-[:checked]:bg-[#F9F3ED]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="h-4 w-4 accent-[#283455]"
                  />
                  <span className="text-[14px] font-bold text-[#283455]">
                    {locale === "vi" ? "Chuyển khoản ngân hàng" : "Bank Transfer"}
                  </span>
                </label>
              </div>
              {paymentMethod === "bank_transfer" && settings.bankAccountNo && (
                <div className="rounded-xl bg-[#F9F3ED] px-4 py-3 text-[13px] text-[#3D4866]">
                  <p className="font-bold text-[#283455]">{settings.bankName}</p>
                  <p>
                    STK: <strong className="font-mono">{settings.bankAccountNo}</strong> &middot;{" "}
                    {settings.bankAccountName}
                  </p>
                </div>
              )}
            </fieldset>

            <div>
              <label htmlFor="ck-note" className="block text-[13.5px] font-bold">
                {locale === "vi" ? "Ghi chú giao hàng (tùy chọn)" : "Delivery Note (optional)"}
              </label>
              <input
                id="ck-note"
                name="note"
                type="text"
                enterKeyHint="done"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="h-[54px] w-full cursor-pointer rounded-[20px] bg-[#283455] text-[15px] font-bold text-white hover:bg-[#1D2742] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? locale === "vi"
                  ? "Đang gửi đơn hàng..."
                  : "Placing order..."
                : locale === "vi"
                ? `Đặt Hàng — ${formatMoney(total, locale)}`
                : `Place Order — ${formatMoney(total, locale)}`}
            </button>
          </form>

          {/* Right Order Summary */}
          <div className="rounded-2xl bg-[#F9F3ED] p-7">
            <h2 className="font-toledo text-[24px] text-[#283455]">
              {locale === "vi" ? "Tóm Tắt Đơn Hàng" : "Order Summary"}
            </h2>

            <ul className="mt-5 space-y-3.5">
              {items.map((item) => {
                const matched = catalog.find((p) => p.slug === item.slug);
                const title = translateProductTitle(item.title, locale, matched?.titleVi);
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
                      {formatMoney(item.price * item.qty, locale)}
                    </p>
                  </li>
                );
              })}

              {freeTote && (
                <li className="flex items-center justify-between rounded-xl border border-[#417823]/30 bg-[#EAF3E4] px-4 py-3 text-[13.5px] font-bold text-[#417823]">
                  <span>
                    {locale === "vi"
                      ? `Quà tặng: Túi Super-Fluff Tote (trị giá ${formatMoney(75, "vi")})`
                      : "Bonus Gift: Super-Fluff Tote ($75 value)"}
                  </span>
                  <span>{locale === "vi" ? "MIỄN PHÍ" : "FREE"}</span>
                </li>
              )}
            </ul>

            <div className="mt-6 space-y-2 border-t border-[#E2DAD1] pt-4 text-[14.5px]">
              <div className="flex justify-between">
                <span>{locale === "vi" ? "Tạm tính" : "Subtotal"}</span>
                <span className="font-bold">{formatMoney(subtotal, locale)}</span>
              </div>
              <div className="flex justify-between">
                <span>{locale === "vi" ? "Vận chuyển" : "Shipping"}</span>
                <span className="font-bold text-[#417823]">
                  {shippingCost === 0
                    ? locale === "vi"
                      ? "Miễn phí"
                      : "FREE"
                    : formatMoney(shippingCost, locale)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#E2DAD1] pt-3 text-[18px] font-bold text-[#283455]">
                <span>{locale === "vi" ? "Tổng cộng" : "Total"}</span>
                <span>{formatMoney(total, locale)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
