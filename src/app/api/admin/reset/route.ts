import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { resetLocalDatabase } from "@/lib/store-db";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  }

  try {
    await resetLocalDatabase();
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể khôi phục dữ liệu mẫu.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
