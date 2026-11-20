import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { reorderCategories, reorderProducts } from "@/lib/store-db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      entity?: "products" | "categories";
      orderedIds?: string[];
    };

    if (!Array.isArray(body.orderedIds) || body.orderedIds.length === 0) {
      return NextResponse.json(
        { error: "Danh sách thứ tự không hợp lệ." },
        { status: 400 }
      );
    }

    if (body.entity === "products") {
      await reorderProducts(body.orderedIds);
    } else if (body.entity === "categories") {
      await reorderCategories(body.orderedIds);
    } else {
      return NextResponse.json({ error: "Đối tượng sắp xếp không hỗ trợ." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể lưu thứ tự mới.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
