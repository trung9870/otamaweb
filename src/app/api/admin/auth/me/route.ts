import { NextResponse } from "next/server";
import { getAdminConfig, getAdminSession } from "@/lib/admin-auth";
import { getStorageMode } from "@/lib/store-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  const cfg = getAdminConfig();
  return NextResponse.json({
    authenticated: Boolean(session),
    email: session?.email || null,
    mode: getStorageMode(),
    usingDefaultCredentials: cfg.usingDefaultCredentials,
    defaultEmailHint: cfg.usingDefaultCredentials ? cfg.email : undefined,
  });
}
