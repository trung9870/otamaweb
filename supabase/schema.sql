-- ============================================================================
-- otamaweb — Supabase Database Schema & Storage Setup
-- Chạy toàn bộ file này trong Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================================

-- 1. Products table
create table if not exists public.store_products (
  id text primary key,
  slug text not null unique,
  data jsonb not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_store_products_active_sort
  on public.store_products (active, sort_order);

-- 2. Categories table
create table if not exists public.store_categories (
  slug text primary key,
  data jsonb not null,
  active boolean not null default true,
  sort_order integer not null default 0
);

create index if not exists idx_store_categories_active_sort
  on public.store_categories (active, sort_order);

-- 3. Store settings (single row id = 'default')
create table if not exists public.store_settings (
  id text primary key default 'default',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- 4. Customer orders
create table if not exists public.store_orders (
  id text primary key,
  status text not null default 'pending',
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_store_orders_created_at
  on public.store_orders (created_at desc);

create index if not exists idx_store_orders_status
  on public.store_orders (status);

-- ============================================================================
-- Row Level Security (RLS)
-- Admin API routes use SUPABASE_SERVICE_ROLE_KEY on the server (bypasses RLS).
-- Public anon key can only read active storefront data and never read orders.
-- ============================================================================

alter table public.store_products enable row level security;
alter table public.store_categories enable row level security;
alter table public.store_settings enable row level security;
alter table public.store_orders enable row level security;

drop policy if exists "Public read active products" on public.store_products;
create policy "Public read active products"
  on public.store_products for select
  using (active = true);

drop policy if exists "Public read active categories" on public.store_categories;
create policy "Public read active categories"
  on public.store_categories for select
  using (active = true);

drop policy if exists "Public read store settings" on public.store_settings;
create policy "Public read store settings"
  on public.store_settings for select
  using (true);

-- ============================================================================
-- Storage bucket for uploaded product/category images
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('store-media', 'store-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read store media" on storage.objects;
create policy "Public read store media"
  on storage.objects for select
  using (bucket_id = 'store-media');
