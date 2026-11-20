import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { readStoreDatabase, saveSettings } from "@/lib/store-db";
import { sanitizeHomepageSections } from "@/lib/style-validation";
import type { StoreSettings } from "@/lib/store-types";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<StoreSettings>;
    const db = await readStoreDatabase();

    const nextSettings: StoreSettings = {
      ...db.settings,
      ...body,
      storeName: (body.storeName ?? db.settings.storeName).trim() || "Brooklinen",
      vndRate: Math.max(
        1000,
        Math.round(Number(body.vndRate ?? db.settings.vndRate) || 25000)
      ),
      freeShippingThresholdUsd: Math.max(
        0,
        Math.round(
          Number(body.freeShippingThresholdUsd ?? db.settings.freeShippingThresholdUsd) || 0
        )
      ),
      freeGiftThresholdUsd: Math.max(
        0,
        Math.round(
          Number(body.freeGiftThresholdUsd ?? db.settings.freeGiftThresholdUsd) || 0
        )
      ),
      shippingFeeUsd: Math.max(
        0,
        Math.round(Number(body.shippingFeeUsd ?? db.settings.shippingFeeUsd) || 0)
      ),
      promoCode: (body.promoCode ?? db.settings.promoCode).trim(),
      announcementEn: Array.isArray(body.announcementEn)
        ? body.announcementEn.map((s) => s.trim()).filter(Boolean)
        : db.settings.announcementEn,
      announcementVi: Array.isArray(body.announcementVi)
        ? body.announcementVi.map((s) => s.trim()).filter(Boolean)
        : db.settings.announcementVi,
      heroHeadingEn: Array.isArray(body.heroHeadingEn)
        ? body.heroHeadingEn.map((s) => s.trim()).filter(Boolean)
        : db.settings.heroHeadingEn,
      heroHeadingVi: Array.isArray(body.heroHeadingVi)
        ? body.heroHeadingVi.map((s) => s.trim()).filter(Boolean)
        : db.settings.heroHeadingVi,
      heroSubtitleEn: Array.isArray(body.heroSubtitleEn)
        ? body.heroSubtitleEn.map((s) => s.trim()).filter(Boolean)
        : db.settings.heroSubtitleEn,
      heroSubtitleVi: Array.isArray(body.heroSubtitleVi)
        ? body.heroSubtitleVi.map((s) => s.trim()).filter(Boolean)
        : db.settings.heroSubtitleVi,
      homepageSections:
        Array.isArray(body.homepageSections) && body.homepageSections.length > 0
          ? sanitizeHomepageSections(body.homepageSections)
          : db.settings.homepageSections,
      headerNav:
        Array.isArray(body.headerNav) && body.headerNav.length > 0
          ? body.headerNav
          : db.settings.headerNav,
    };

    const saved = await saveSettings(nextSettings);
    return NextResponse.json({ settings: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể lưu cài đặt.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
