#!/usr/bin/env node
/**
 * Đẩy toàn bộ dữ liệu cửa hàng local (data/store-db.json) lên Supabase.
 * Cách chạy:
 *   1. Chạy supabase/schema.sql trong Supabase SQL Editor
 *   2. Điền NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY vào .env.local
 *   3. Chạy: npm run seed:supabase
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile(path.join(ROOT, ".env.local"));
loadEnvFile(path.join(ROOT, ".env"));

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local."
  );
  process.exit(1);
}

const DB_PATH = path.join(ROOT, "data", "store-db.json");
if (!fs.existsSync(DB_PATH)) {
  console.error(
    "Chưa tìm thấy data/store-db.json. Hãy chạy 'npm run dev' rồi mở http://localhost:3000/api/store một lần để khởi tạo dữ liệu mẫu trước khi seed lên Supabase."
  );
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));

async function upsertRows(table, conflictCol, rows) {
  if (!rows || rows.length === 0) return;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${conflictCol}`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(rows),
    }
  );
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`Upsert ${table} failed (${res.status}): ${txt}`);
  }
}

async function main() {
  const productRows = (db.products || []).map((p) => ({
    id: p.id,
    slug: p.slug,
    data: p,
    active: p.active !== false,
    sort_order: p.sortOrder || 0,
    updated_at: p.updatedAt || new Date().toISOString(),
  }));

  const categoryRows = (db.categories || []).map((c) => ({
    slug: c.slug,
    data: c,
    active: c.active !== false,
    sort_order: c.sortOrder || 0,
  }));

  const settingsRows = db.settings
    ? [{ id: "default", data: db.settings }]
    : [];

  const orderRows = (db.orders || []).map((o) => ({
    id: o.id,
    status: o.status || "pending",
    data: o,
    created_at: o.createdAt || new Date().toISOString(),
  }));

  await upsertRows("store_products", "id", productRows);
  console.log(`✓ Đã đẩy ${productRows.length} sản phẩm lên store_products`);

  await upsertRows("store_categories", "slug", categoryRows);
  console.log(`✓ Đã đẩy ${categoryRows.length} danh mục lên store_categories`);

  await upsertRows("store_settings", "id", settingsRows);
  console.log("✓ Đã đẩy cài đặt cửa hàng lên store_settings");

  await upsertRows("store_orders", "id", orderRows);
  console.log(`✓ Đã đẩy ${orderRows.length} đơn hàng lên store_orders`);

  console.log("\nHoàn tất! Khởi động lại server Next.js để dùng dữ liệu Supabase.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
