import { NextResponse } from "next/server";
import {
  createSessionToken,
  getSessionCookieOptions,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = (body.email || "").trim();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ email và mật khẩu." },
        { status: 400 }
      );
    }

    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu quản trị chưa đúng." },
        { status: 401 }
      );
    }

    const token = createSessionToken(email.toLowerCase());
    const res = NextResponse.json({ ok: true, email: email.toLowerCase() });
    const opts = getSessionCookieOptions();
    res.cookies.set(opts.name, token, {
      httpOnly: opts.httpOnly,
      sameSite: opts.sameSite,
      secure: opts.secure,
      path: opts.path,
      maxAge: opts.maxAge,
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Yêu cầu đăng nhập không hợp lệ." },
      { status: 400 }
    );
  }
}
