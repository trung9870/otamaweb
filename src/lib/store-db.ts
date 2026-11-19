import fs from "node:fs/promises";
import path from "node:path";
import { buildDefaultStoreDatabase } from "./store-seed";
import type {
  StorageMode,
  StoreCategory,
  StoreDatabase,
  StoreOrder,
  StoreOrderStatus,
  StoreProduct,
  StoreSettings,
} from "./store-types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "store-db.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

export function getStorageMode(): StorageMode {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return "supabase";
  }
  return "local";
}

function getSupabaseConfig() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "store-media";
  return { url, key, bucket };
}

async function supabaseRequest<T>(
  restPath: string,
  init: RequestInit = {}
): Promise<T> {
  const { url, key } = getSupabaseConfig();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("Authorization", `Bearer ${key}`);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof Uint8Array)) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${url}/rest/v1/${restPath}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Supabase error (${res.status}): ${errText}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

/* ============================================================================
 * LOCAL JSON STORAGE (default demo / local production mode)
 * ============================================================================ */

async function readLocalDb(): Promise<StoreDatabase> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreDatabase>;
    const defaults = buildDefaultStoreDatabase();
    return {
      products: Array.isArray(parsed.products) ? parsed.products : defaults.products,
      categories: Array.isArray(parsed.categories)
        ? parsed.categories
        : defaults.categories,
      settings: parsed.settings
        ? { ...defaults.settings, ...parsed.settings }
        : defaults.settings,
      orders: Array.isArray(parsed.orders) ? parsed.orders : defaults.orders,
    };
  } catch {
    const seeded = buildDefaultStoreDatabase();
    await writeLocalDb(seeded);
    return seeded;
  }
}

async function writeLocalDb(db: StoreDatabase): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmpFile = `${DB_FILE}.tmp`;
  await fs.writeFile(tmpFile, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmpFile, DB_FILE);
}

/* ============================================================================
 * SUPABASE ROW MAPPERS
 * ============================================================================ */

interface SupabaseProductRow {
  id: string;
  slug: string;
  data: StoreProduct;
  active: boolean;
  sort_order: number;
  updated_at: string;
}

interface SupabaseCategoryRow {
  slug: string;
  data: StoreCategory;
  active: boolean;
  sort_order: number;
}

interface SupabaseSettingsRow {
  id: string;
  data: StoreSettings;
}

interface SupabaseOrderRow {
  id: string;
  status: StoreOrderStatus;
  data: StoreOrder;
  created_at: string;
}

/* ============================================================================
 * PUBLIC / ADMIN UNIFIED OPERATIONS
 * ============================================================================ */

export async function readStoreDatabase(): Promise<StoreDatabase> {
  if (getStorageMode() === "local") {
    return readLocalDb();
  }

  const defaults = buildDefaultStoreDatabase();
  const [prodRows, catRows, setRows, ordRows] = await Promise.all([
    supabaseRequest<SupabaseProductRow[]>(
      "store_products?select=id,slug,data,active,sort_order,updated_at&order=sort_order.asc"
    ),
    supabaseRequest<SupabaseCategoryRow[]>(
      "store_categories?select=slug,data,active,sort_order&order=sort_order.asc"
    ),
    supabaseRequest<SupabaseSettingsRow[]>(
      "store_settings?select=id,data&id=eq.default&limit=1"
    ),
    supabaseRequest<SupabaseOrderRow[]>(
      "store_orders?select=id,status,data,created_at&order=created_at.desc"
    ),
  ]);

  return {
    products:
      prodRows.length > 0
        ? prodRows.map((r) => ({ ...r.data, id: r.id, slug: r.slug, active: r.active, sortOrder: r.sort_order }))
        : defaults.products,
    categories:
      catRows.length > 0
        ? catRows.map((r) => ({ ...r.data, slug: r.slug, active: r.active, sortOrder: r.sort_order }))
        : defaults.categories,
    settings: setRows[0]?.data
      ? { ...defaults.settings, ...setRows[0].data }
      : defaults.settings,
    orders: ordRows.map((r) => ({ ...r.data, id: r.id, status: r.status })),
  };
}

export async function upsertProduct(product: StoreProduct): Promise<StoreProduct> {
  const stamped: StoreProduct = {
    ...product,
    updatedAt: new Date().toISOString(),
  };

  if (getStorageMode() === "local") {
    const db = await readLocalDb();
    const idx = db.products.findIndex((p) => p.id === stamped.id);
    if (idx >= 0) {
      db.products[idx] = stamped;
    } else {
      db.products.unshift(stamped);
    }
    await writeLocalDb(db);
    return stamped;
  }

  await supabaseRequest("store_products?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      id: stamped.id,
      slug: stamped.slug,
      data: stamped,
      active: stamped.active,
      sort_order: stamped.sortOrder,
      updated_at: stamped.updatedAt,
    }),
  });
  return stamped;
}

export async function deleteProductById(id: string): Promise<boolean> {
  if (getStorageMode() === "local") {
    const db = await readLocalDb();
    const before = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);
    if (db.products.length === before) return false;
    await writeLocalDb(db);
    return true;
  }

  await supabaseRequest(`store_products?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
  return true;
}

export async function upsertCategory(category: StoreCategory): Promise<StoreCategory> {
  if (getStorageMode() === "local") {
    const db = await readLocalDb();
    const idx = db.categories.findIndex((c) => c.slug === category.slug);
    if (idx >= 0) {
      db.categories[idx] = category;
    } else {
      db.categories.push(category);
    }
    await writeLocalDb(db);
    return category;
  }

  await supabaseRequest("store_categories?on_conflict=slug", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      slug: category.slug,
      data: category,
      active: category.active,
      sort_order: category.sortOrder,
    }),
  });
  return category;
}

export async function deleteCategoryBySlug(slug: string): Promise<boolean> {
  if (getStorageMode() === "local") {
    const db = await readLocalDb();
    const before = db.categories.length;
    db.categories = db.categories.filter((c) => c.slug !== slug);
    if (db.categories.length === before) return false;
    await writeLocalDb(db);
    return true;
  }

  await supabaseRequest(`store_categories?slug=eq.${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
  return true;
}

export async function saveSettings(settings: StoreSettings): Promise<StoreSettings> {
  if (getStorageMode() === "local") {
    const db = await readLocalDb();
    db.settings = settings;
    await writeLocalDb(db);
    return settings;
  }

  await supabaseRequest("store_settings?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      id: "default",
      data: settings,
    }),
  });
  return settings;
}

export async function createOrder(order: StoreOrder): Promise<StoreOrder> {
  if (getStorageMode() === "local") {
    const db = await readLocalDb();
    db.orders.unshift(order);
    await writeLocalDb(db);
    return order;
  }

  await supabaseRequest("store_orders", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id: order.id,
      status: order.status,
      data: order,
      created_at: order.createdAt,
    }),
  });
  return order;
}

export async function updateOrder(
  id: string,
  patch: { status?: StoreOrderStatus; note?: string }
): Promise<StoreOrder | null> {
  if (getStorageMode() === "local") {
    const db = await readLocalDb();
    const target = db.orders.find((o) => o.id === id);
    if (!target) return null;
    if (patch.status) target.status = patch.status;
    if (typeof patch.note === "string") target.note = patch.note;
    await writeLocalDb(db);
    return target;
  }

  const rows = await supabaseRequest<SupabaseOrderRow[]>(
    `store_orders?select=id,status,data,created_at&id=eq.${encodeURIComponent(id)}&limit=1`
  );
  const existing = rows[0];
  if (!existing) return null;

  const updated: StoreOrder = {
    ...existing.data,
    id: existing.id,
    status: patch.status ?? existing.status,
    note: typeof patch.note === "string" ? patch.note : existing.data.note,
  };

  await supabaseRequest(`store_orders?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      status: updated.status,
      data: updated,
    }),
  });
  return updated;
}

export async function resetLocalDatabase(): Promise<StoreDatabase> {
  if (getStorageMode() !== "local") {
    throw new Error("Chỉ hỗ trợ khôi phục dữ liệu mẫu ở chế độ Local.");
  }
  const seeded = buildDefaultStoreDatabase();
  await writeLocalDb(seeded);
  return seeded;
}

/* ============================================================================
 * MEDIA UPLOAD (Local data/uploads via /api/media/[filename] ↔ Supabase Storage)
 * ============================================================================ */

const ALLOWED_IMAGE_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export async function saveUploadedImage(file: File): Promise<{ url: string; filename: string }> {
  const ext = ALLOWED_IMAGE_MIME[file.type];
  if (!ext) {
    throw new Error("Chỉ hỗ trợ định dạng ảnh JPG, PNG, WEBP, AVIF hoặc GIF.");
  }
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("Kích thước ảnh tối đa 5MB.");
  }

  const baseName = file.name
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";

  const filename = `${Date.now()}-${baseName}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (getStorageMode() === "local") {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, filename), bytes);
    return {
      url: `/api/media/${filename}`,
      filename,
    };
  }

  const { url, key, bucket } = getSupabaseConfig();
  const res = await fetch(`${url}/storage/v1/object/${bucket}/${filename}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": file.type,
      "x-upsert": "true",
    },
    body: bytes,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Upload ảnh lên Supabase thất bại (${res.status}): ${errText}`);
  }

  return {
    url: `${url}/storage/v1/object/public/${bucket}/${filename}`,
    filename,
  };
}

export function getUploadsDir(): string {
  return UPLOADS_DIR;
}
