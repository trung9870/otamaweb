import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { updateOrder } from "@/lib/store-db";
import type { StoreOrderStatus } from "@/lib/store-types";

export const dynamic = "force-dynamic";

const VALID_STATUSES: StoreOrderStatus[] = [
  "pending",
  "confirmed",
  "shipping",
  "completed",
  "cancelled",
];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { status?: StoreOrderStatus; note?: string };
    const status =
      body.status && VALID_STATUSES.includes(body.status) ? body.status : undefined;

    const updated = await updateOrder(id, {
      status,
      note: typeof body.note === "string" ? body.note : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng." }, { status: 404 });
    }

    return NextResponse.json({ order: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể cập nhật đơn hàng.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
