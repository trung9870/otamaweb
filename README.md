# otamaweb

Bilingual (English / Vietnamese) e-commerce storefront with an integrated **Vietnamese Admin Panel (`/admin`)** and drop-in **Supabase** support, built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Features

- **Bilingual Localization (`EN` / `VI`)**: Instant language switcher in the header and footer, persisted in `localStorage` and shareable via `?lang=vi` / `?lang=en`.
- **Automatic Currency Switching (`USD $` ↔ `VNĐ ₫`)**: Every product price, variant size, gift card denomination, Quick View, Cart Drawer, threshold, and Checkout total converts automatically using the live exchange rate configurable in `/admin`.
- **Built-in Vietnamese Admin Dashboard (`/admin`)**:
  - **Sản phẩm**: Create, edit, hide/show, or delete products; enter prices directly in VNĐ (auto-synced to USD); upload product & swatch images directly; assign categories and homepage sections.
  - **Danh mục**: Manage bilingual category names, collection banners, and slugs.
  - **Đơn hàng**: Receive real orders placed at `/checkout` (COD or Bank Transfer), inspect line items, and update fulfillment status (`Chờ xác nhận` → `Đã xác nhận` → `Đang giao hàng` → `Hoàn thành`).
  - **Trang chủ & Cài đặt**: Edit exchange rate, free-shipping / free-gift thresholds, top announcement bar slides (EN/VI), hero titles, and bank transfer info.
- **Dual-Mode Storage (Zero-Setup Local Demo ↔ Production Supabase)**:
  - Runs out of the box locally with zero cloud setup (persisting to `data/store-db.json` and `data/uploads/`).
  - Automatically switches to **Supabase (PostgreSQL + Storage)** as soon as `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured.

## Getting Started (Local Mode)

```bash
npm install
npm run dev
```

- Storefront (Vietnamese + VNĐ): [http://localhost:3000/?lang=vi](http://localhost:3000/?lang=vi)
- Storefront (English + USD): [http://localhost:3000/?lang=en](http://localhost:3000/?lang=en)
- Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin) *(local demo default: `admin@otamaweb.local` / `otama123456`)*

## Switching to Supabase (Production)

1. Create a free project at [supabase.com](https://supabase.com) and run [`supabase/schema.sql`](supabase/schema.sql) in **SQL Editor**.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, plus your production `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`.
3. Seed the initial catalog into Supabase:
   ```bash
   npm run seed:supabase
   ```
4. Restart the server or deploy directly to Vercel with the same environment variables.

## Scripts

```bash
npm run dev           # Start development server
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm run typecheck     # Run TypeScript check
npm run check         # Run lint + typecheck + build
npm run seed:supabase # Seed local store data to Supabase
```
