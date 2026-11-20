import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { saveUploadedMedia } from "@/lib/store-db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập quản trị." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Vui lòng chọn tệp ảnh hoặc video để tải lên." },
        { status: 400 }
      );
    }

    const result = await saveUploadedMedia(file);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tải tệp thất bại.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
