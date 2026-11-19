import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { deleteCategoryBySlug } from "@/lib/store-db";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  }

  try {
    const { slug } = await context.params;
    const ok = await deleteCategoryBySlug(slug);
    if (!ok) {
      return NextResponse.json({ error: "Không tìm thấy danh mục." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể xóa danh mục.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
