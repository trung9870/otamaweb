"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { StoreOrder, StoreOrderStatus } from "@/lib/store-types";

interface OrderDetailModalProps {
  order: StoreOrder | null;
  onClose: () => void;
  onUpdated: (order: StoreOrder) => void;
}

export const ORDER_STATUS_META: Record<
  StoreOrderStatus,
  { label: string; badgeClass: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    badgeClass: "bg-[#FEF3C7] text-[#92400E]",
  },
  confirmed: {
    label: "Đã xác nhận",
    badgeClass: "bg-[#DBEAFE] text-[#1E40AF]",
  },
  shipping: {
    label: "Đang giao hàng",
    badgeClass: "bg-[#EDE9FE] text-[#5B21B6]",
  },
  completed: {
    label: "Hoàn thành",
    badgeClass: "bg-[#EAF3E4] text-[#417823]",
  },
  cancelled: {
    label: "Đã hủy",
    badgeClass: "bg-[#FCE8E6] text-[#A50E0E]",
  },
};

export function OrderDetailModal({
  order,
  onClose,
  onUpdated,
}: OrderDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<StoreOrderStatus>("pending");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (order) {
      setStatus(order.status);
      setNote(order.note || "");
      setErrorMsg(null);
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [order]);

  // Light-dismiss fallback when <dialog closedby="any"> isn't natively supported (e.g., Safari)
  useEffect(() => {
    const d = dialogRef.current;
    if (!d || typeof HTMLDialogElement === "undefined") return;
    if ("closedBy" in HTMLDialogElement.prototype) return;

    const outside = (e: PointerEvent) => {
      const r = d.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };

    let pressedOutside = false;
    const onDown = (e: PointerEvent) => {
      pressedOutside = outside(e);
    };
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && outside(e)) d.close();
    };
    d.addEventListener("pointerdown", onDown);
    d.addEventListener("pointerup", onUp);
    return () => {
      d.removeEventListener("pointerdown", onDown);
      d.removeEventListener("pointerup", onUp);
    };
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!order || saving) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(order.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      const data = (await res.json()) as { order?: StoreOrder; error?: string };
      if (!res.ok || !data.order) {
        throw new Error(data.error || "Không thể cập nhật đơn hàng.");
      }
      onUpdated(data.order);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Cập nhật thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const rate = order?.vndRateAtOrder || 25000;
  const toVnd = (usd: number) => `${Math.round(usd * rate).toLocaleString("vi-VN")}₫`;

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as Record<string, string>)}
      aria-labelledby="order-detail-title"
      onClose={() => {
        if (dialogRef.current) dialogRef.current.returnValue = "";
        onClose();
      }}
      className="admin-dialog"
    >
      {order && (
        <div className="flex max-h-[90svh] flex-col overflow-hidden rounded-2xl bg-[#FDFAF8] text-[#283455] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#E5E0DB] bg-white px-6 py-4">
            <div>
              <h2 id="order-detail-title" className="text-[20px] font-bold">
                Đơn hàng {order.id}
              </h2>
              <p className="text-[13px] text-[#5B647A]">
                Đặt lúc{" "}
                {new Date(order.createdAt).toLocaleString("vi-VN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng chi tiết đơn hàng"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-2xl hover:bg-[#F3EDE7]"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {errorMsg && (
              <div
                role="alert"
                className="rounded-xl border border-[#D93025]/40 bg-[#FCE8E6] px-4 py-3 text-[14px] text-[#A50E0E]"
              >
                {errorMsg}
              </div>
            )}

            {/* Customer Info */}
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#E5E0DB] bg-white p-4 sm:grid-cols-2">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#5B647A]">
                  Khách hàng
                </p>
                <p className="mt-1 text-[15px] font-bold">{order.customerName}</p>
                <p className="text-[13.5px] text-[#3D4866]">{order.customerPhone || "—"}</p>
                <p className="text-[13.5px] text-[#3D4866]">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#5B647A]">
                  Giao hàng & Thanh toán
                </p>
                <p className="mt-1 text-[14px] text-[#283455]">
                  {order.shippingAddress}, {order.city}
                </p>
                <p className="mt-1 text-[13.5px] font-bold text-[#417823]">
                  {order.paymentMethod === "bank_transfer"
                    ? "Chuyển khoản ngân hàng"
                    : "Thanh toán khi nhận hàng (COD)"}
                </p>
                {order.promoCode && (
                  <p className="text-[12.5px] text-[#5B647A]">
                    Mã giảm giá: <strong>{order.promoCode}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="rounded-xl border border-[#E5E0DB] bg-white p-4">
              <p className="text-[13px] font-bold uppercase tracking-wider text-[#5B647A]">
                Sản phẩm ({order.items.length})
              </p>
              <ul className="mt-3 divide-y divide-[#F0EBE5]">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 py-2.5">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold">{item.title}</p>
                      <p className="text-[12.5px] text-[#5B647A]">
                        {item.color} &middot; {item.size} &middot; SL: {item.qty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-bold">
                        {toVnd(item.priceUsd * item.qty)}
                      </p>
                      <p className="text-[12px] text-[#6E6E6E]">
                        ${item.priceUsd * item.qty}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {order.freeToteIncluded && (
                <p className="mt-3 rounded-lg bg-[#EAF3E4] px-3 py-2 text-[13px] font-bold text-[#417823]">
                  + Kèm quà tặng miễn phí: Túi Super-Fluff Tote
                </p>
              )}

              <div className="mt-4 space-y-1.5 border-t border-[#E5E0DB] pt-3 text-[14px]">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{toVnd(order.subtotalUsd)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{order.shippingUsd === 0 ? "Miễn phí" : toVnd(order.shippingUsd)}</span>
                </div>
                <div className="flex justify-between text-[17px] font-bold text-[#283455]">
                  <span>Tổng cộng</span>
                  <span>
                    {toVnd(order.totalUsd)}{" "}
                    <span className="text-[13px] font-normal text-[#5B647A]">
                      (${order.totalUsd})
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Update Status & Staff Note */}
            <form
              onSubmit={handleSave}
              className="space-y-4 rounded-xl border border-[#E5E0DB] bg-white p-4"
            >
              <div>
                <label htmlFor="ord-status" className="block text-[13.5px] font-bold">
                  Trạng thái xử lý
                </label>
                <select
                  id="ord-status"
                  name="status"
                  autoFocus
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StoreOrderStatus)}
                  className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 font-bold"
                >
                  {(Object.keys(ORDER_STATUS_META) as StoreOrderStatus[]).map((k) => (
                    <option key={k} value={k}>
                      {ORDER_STATUS_META[k].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ord-note" className="block text-[13.5px] font-bold">
                  Ghi chú đơn hàng / ghi chú nội bộ
                </label>
                <textarea
                  id="ord-note"
                  name="note"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[48px] cursor-pointer rounded-xl border border-[#C9CFD9] px-5 text-[14px] font-bold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-[48px] cursor-pointer rounded-xl bg-[#283455] px-6 text-[14px] font-bold text-white hover:bg-[#1D2742] disabled:opacity-60"
                >
                  {saving ? "Đang cập nhật..." : "Lưu trạng thái"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </dialog>
  );
}
