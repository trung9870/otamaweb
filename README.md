# otamaweb

Bilingual (English / Vietnamese) e-commerce storefront built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Features

- **Bilingual Localization (`EN` / `VI`)**: Instant language toggle in the header and mobile navigation, persisted in `localStorage` and shareable via `?lang=vi` / `?lang=en`.
- **Automatic Currency Switching (`USD $` ↔ `VNĐ ₫`)**: All product prices, variant sizes, gift card denominations, Quick View, Cart Drawer, free-shipping / free-gift thresholds, and Checkout totals automatically convert between USD (`$`) and VNĐ (`₫` at `1 USD = 25.000₫`) based on the selected language.
- **Self-Hosted Typography & Assets**: Locally bundled Vietnamese-capable fonts (`Be Vietnam Pro`, `Playfair Display`) and full local media assets under `public/sites/brooklinen/`.
- **Complete Local Storefront Routing**:
  - `/` — Storefront homepage with video hero, promo strip, product carousels, swatch switching, category showcase, trending cards, reviews, and mega-menu.
  - `/collections/[slug]` — Category & sale listing pages with sorting and color swatches.
  - `/products/[slug]` — Product detail pages with color swatches, size selector, dynamic pricing, gallery, and related products.
  - `/cart` & `/checkout` — Persistent shopping bag (`localStorage`) with free shipping / bonus tote progress and interactive checkout flow.
  - `/pages/[slug]`, `/blogs/[slug]`, `/account/[action]` — Stores, FAQ, reviews, warranty, gift card balance demo, editorial stories, and account pages.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3000/?lang=vi](http://localhost:3000/?lang=vi) for Vietnamese + VNĐ).

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript check
npm run check      # Run lint + typecheck + build
```
