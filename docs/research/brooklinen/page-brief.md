# Brooklinen Homepage Clone Brief

- **Source URL:** `https://www.brooklinen.com/`
- **Local Route:** `/` (`src/app/page.tsx`)
- **Component Scope:** `src/components/sites/brooklinen/`
- **Local Assets:** `public/sites/brooklinen/`
- **Inspection Evidence:** `docs/research/brooklinen/` & `docs/design-references/source/`

## Route & File Ownership Map

| Source Route | Local Route / Destination | Notes |
| --- | --- | --- |
| `/` (`https://www.brooklinen.com/`) | `/` (`src/app/page.tsx`) | Full homepage recreation with real assets, videos, fonts, and in-page interactive states |
| External collection / product / policy links | Point directly to `https://www.brooklinen.com/...` | Out-of-scope subpages preserve real Brooklinen destinations |

## Design System Tokens

- **Fonts (downloaded locally in `public/sites/brooklinen/fonts/`):**
  - Display Serif: `ToledoTS-Bold` (`ToledoSerial-Bold.otf`, weight 400)
  - Body / UI Sans: `BrandonTextWeb-Regular` (400), `BrandonTextWeb-Medium` (500), `BrandonTextWeb-Bold` (700), `BrandonTextWeb-Italic` (400 italic)
- **Palette:**
  - Brand Navy: `#283455` (`rgb(40, 52, 85)`) — announcement bar, primary text, headings, primary pill buttons, FSA strip
  - Deep Burgundy: `#740103` (`rgb(116, 1, 3)`) — Black Friday & Gift promo strips
  - Page Cream: `#FDFAF8` (`rgb(253, 250, 248)`) — body background, product carousel areas
  - Warm Sand: `#F9F3ED` (`rgb(249, 243, 237)`) — Why Brooklinen, Reviews, In the News
  - Soft Slate Blue: `#DDE3EC` (`rgb(221, 227, 236)`) — Come Say Hi IRL strip & Footer
  - Card Surface: `#F4F5F7` (product card media gray), `#FFFFFF` (value prop card, review card, badges)
  - Promo Green: `#417823` (`rgb(65, 120, 35)`) + soft tint `#EAF3E4` (`25% off` pill)
  - Promo Burnt Orange: `#AA3F00` (`rgb(170, 63, 0)`) — `SELLING FAST!`
  - Star Gold: `#E5A970` / `#DF9F66`
  - Account Badge Amber: `#B65B18`

## Section Order (Top to Bottom)

1. **Announcement Bar** (`#283455`, 40px desktop / ~80px mobile): Rotating 4 promo messages with `<` `>` controls + "Terms apply" modal dialog.
2. **Sticky Header** (`#FDFAF8`, 90px desktop / 65px mobile + mobile quick-pill strip):
   - Desktop: Brooklinen "Best In Bed." SVG logo, 8 nav links (`Black Friday Deals`, `Gift Guide`, `Sheets`, `Bed`, `Bath & Robes`, `Bundle Savings`, `Home`, `New & Trending`) with hover mega-menus, Search modal trigger, Account dropdown trigger (with `1` badge), Cart drawer trigger.
   - Mobile: Logo left, Search + Account + Bag + Hamburger (`=`) drawer right, followed by pill bar (`Black Friday Deals`, `Gift Guide`, `Bundle Savings`).
3. **#0 Primary Hero** (678px desktop / 439px mobile): Autoplay looping desktop/mobile MP4 video with centered white overlay — `ToledoTS-Bold` 45px H1 `25% Off Sitewide / Black Friday Sale`, `BrandonTextWeb-Regular` 24px subtitle, `#283455` 20px-radius pill CTA `Shop Now`.
4. **#1 Promo Strip — Mystery Bundles** (`#740103`, 104px desktop / 213px mobile): `40% Off, 48 Hours Only`, copy, navy pill button `Shop the Bundles`.
5. **#2 Product Carousel — Best of Sale** (12 products): Scroll-snap horizontal carousel with prev/next arrows, `BEST SELLER`/`BACK IN STOCK`/`COOLING` pills, Award seals, hover lifestyle image swap + desktop `Quick View` / mobile `+` quick-add modal trigger, promo eyebrow with sparkle icon, title, strikethrough original + sale price + green discount pill, 5-star rating + review count, interactive color swatch strip (clicking swaps product image & selected ring).
6. **#3 Mini Hero — Free Super Fluff Tote** (288px desktop / 150px mobile): Swapped desktop/mobile photography with centered text `48 Hours Only: Free Super Fluff Tote with $250+ purchase` and `Shop Now` button.
7. **#4 Shop by Category Carousel** (6 categories): Rounded portrait cards (`All Sheets`, `All Bedding`, `Bundle Savings` with circular `Up to 40% off` badge, `All Bath`, `Duvet Inserts & Pillows`, `New Arrivals`) with bottom gradient and underlined white title + `<` `>` arrows.
8. **#5 Promo Strip — Shop Gifts on Sale** (`#740103`, 104px desktop / 213px mobile): `Shop Gifts on Sale`, copy, white-outlined pill button `Shop Now`.
9. **#6 Product Carousel — Shop the Gift Guide** (11 products): Same interactive product card carousel system.
10. **#7 Secondary Video Hero — BEST. SHEETS. EVER.** (678px desktop / 439px mobile): Autoplay looping desktop/mobile video with bottom-right play/pause button, `BEST._SHEETS._EVER._Lockup.svg`, subtitle, dual navy pill CTAs (`Shop Sheets`, `Explore the Campaign`).
11. **#8 Product Carousel — Shop the Collection** (12 products): Same interactive product card carousel system.
12. **#9 New & Trending** (4 editorial cards): Desktop centered heading + 4-column grid; mobile left heading with `<` `>` arrows + horizontal carousel (`The Cozy Shop`, `Waffle World`, `Hosting Essentials`, `Bedding Bundles`), each with 8:9 photo, bold title, outlined pill `Shop Now` button.
13. **#10 Promo Strip — FSA/HSA Eligible** (`#283455`, 104px desktop / 191px mobile): `We're FSA/HSA Eligible`, copy, blue pill `Shop Now` on desktop / white pill `Shop Now` on mobile.
14. **#11 Value Props — Why Brooklinen?** (`#F9F3ED` section, white rounded card): Mobile shows `Why Brooklinen?` H2 above card; 3 columns (`PREMIUM MATERIALS & EXCLUSIVE STYLES`, `365-DAY HAPPINESS GUARANTEE`, `FAST, FREE SHIPPING` with `Exclusions Apply *`).
15. **#12 Reviews Carousel — 175k+ 5-Star Reviews Don't Lie** (`#F9F3ED`): Desktop 2-column (serif H2 + CTA left, white rounded review card right, circular `<` `>` arrows on outer edges); Mobile stacked centered with uppercase eyebrow, serif quote title, quote, stars, author, CTA, and pagination dots. 3 real reviews (`Sarah T.`, `Linda B.`, `James A.`).
16. **#13 Press Bar — In the News** (`#F9F3ED`): `In the News` + outlined `Shop Award-Winners` pill + 7 press logos (`Wirecutter`, `Good Housekeeping`, `AD`, `Apartment Therapy`, `Good Morning America`, `TODAY`, `VOGUE`), horizontal scroll on mobile.
17. **#14 Store Strip — Come Say Hi, IRL** (`#DDE3EC`, 104px desktop / 213px mobile): `Come Say Hi, IRL`, copy, `#283455` pill `Find Your Store`.
18. **Footer** (`#DDE3EC`): 4 nav columns (`About`, `Community`, `Need Help?`, `Get In Touch`), `Get on the List` newsletter signup pill input with validation & feedback, 4 social icons (`Facebook`, `X`, `Pinterest`, `Instagram`), legal links + `©Brooklinen 2026`.
