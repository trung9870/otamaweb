import { NextResponse } from "next/server";
import { createOrder, readStoreDatabase } from "@/lib/store-db";
import type { PaymentMethod, StoreOrder, StoreOrderItem } from "@/lib/store-types";

export const dynamic = "force-dynamic";

interface CreateOrderBody {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  city?: string;
  paymentMethod?: PaymentMethod;
  promoCode?: string;
  locale?: "en" | "vi";
  note?: string;
  items?: StoreOrderItem[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderBody;

    const customerName = (body.customerName || "").trim();
    const customerEmail = (body.customerEmail || "").trim();
    const customerPhone = (body.customerPhone || "").trim();
    const shippingAddress = (body.shippingAddress || "").trim();
    const city = (body.city || "").trim();
    const items = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !customerEmail || !shippingAddress || !city) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin giao hàng." },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Giỏ hàng trống, không thể tạo đơn hàng." },
        { status: 400 }
      );
    }

    const db = await readStoreDatabase();
    const settings = db.settings;

    const cleanItems: StoreOrderItem[] = items
      .filter((i) => i && typeof i.qty === "number" && i.qty > 0)
      .map((i) => ({
        slug: String(i.slug || "").slice(0, 120),
        title: String(i.title || "").slice(0, 200),
        color: String(i.color || "Default").slice(0, 80),
        size: String(i.size || "One Size").slice(0, 60),
        qty: Math.min(99, Math.max(1, Math.round(Number(i.qty) || 1))),
        priceUsd: Math.max(1, Math.round(Number(i.priceUsd) || 0)),
        image: String(i.image || "").slice(0, 500),
      }));

    const subtotalUsd = cleanItems.reduce(
      (sum, item) => sum + item.priceUsd * item.qty,
      0
    );
    const freeShipping = subtotalUsd >= settings.freeShippingThresholdUsd;
    const freeToteIncluded = subtotalUsd >= settings.freeGiftThresholdUsd;
    const shippingUsd = freeShipping ? 0 : settings.shippingFeeUsd;
    const totalUsd = subtotalUsd + shippingUsd;

    const now = new Date();
    const yymmdd = `${String(now.getFullYear()).slice(-2)}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const rand = Math.floor(1000 + Math.random() * 9000);

    const order: StoreOrder = {
      id: `OTM-${yymmdd}-${rand}`,
      createdAt: now.toISOString(),
      status: "pending",
      customerName: customerName.slice(0, 120),
      customerEmail: customerEmail.slice(0, 160),
      customerPhone: customerPhone.slice(0, 40),
      shippingAddress: shippingAddress.slice(0, 300),
      city: city.slice(0, 100),
      paymentMethod: body.paymentMethod === "bank_transfer" ? "bank_transfer" : "cod",
      promoCode: (body.promoCode || "").trim().slice(0, 40),
      locale: body.locale === "en" ? "en" : "vi",
      vndRateAtOrder: settings.vndRate,
      subtotalUsd,
      shippingUsd,
      totalUsd,
      freeToteIncluded,
      items: cleanItems,
      note: (body.note || "").trim().slice(0, 500),
    };

    const saved = await createOrder(order);
    return NextResponse.json({ order: saved }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
