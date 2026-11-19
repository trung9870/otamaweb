import { NextResponse } from "next/server";
import { getAdminConfig, getAdminSession } from "@/lib/admin-auth";
import { getStorageMode, readStoreDatabase } from "@/lib/store-db";
import type { AdminDashboardPayload } from "@/lib/store-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  }

  try {
    const db = await readStoreDatabase();
    const cfg = getAdminConfig();
    const sortedProducts = [...db.products].sort((a, b) => a.sortOrder - b.sortOrder);
    const sortedCategories = [...db.categories].sort((a, b) => a.sortOrder - b.sortOrder);
    const sortedOrders = [...db.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const nonCancelledOrders = sortedOrders.filter((o) => o.status !== "cancelled");
    const revenueUsd = nonCancelledOrders.reduce((s, o) => s + o.totalUsd, 0);
    const revenueVnd = nonCancelledOrders.reduce(
      (s, o) => s + Math.round(o.totalUsd * (o.vndRateAtOrder || db.settings.vndRate)),
      0
    );

    const payload: AdminDashboardPayload = {
      mode: getStorageMode(),
      products: sortedProducts,
      categories: sortedCategories,
      settings: db.settings,
      orders: sortedOrders,
      usingDefaultCredentials: cfg.usingDefaultCredentials,
      adminEmail: session.email,
      stats: {
        totalProducts: sortedProducts.length,
        activeProducts: sortedProducts.filter((p) => p.active).length,
        totalCategories: sortedCategories.length,
        totalOrders: sortedOrders.length,
        pendingOrders: sortedOrders.filter((o) => o.status === "pending").length,
        revenueUsd,
        revenueVnd,
      },
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không tải được dữ liệu quản trị.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
