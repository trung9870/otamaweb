import fs from "node:fs";
import path from "node:path";

const PROJECT_ROOT = "/Users/trung9870/.gemini/antigravity/scratch/brooklinen-clone";
const RESEARCH_DIR = path.join(PROJECT_ROOT, "docs/research/brooklinen");
const OUT_FILE = path.join(PROJECT_ROOT, "src/components/sites/brooklinen/data.ts");

const deep = JSON.parse(fs.readFileSync(path.join(RESEARCH_DIR, "site-data-deep.json"), "utf8"));
const ms = JSON.parse(fs.readFileSync(path.join(RESEARCH_DIR, "menus-and-swatches.json"), "utf8"));
const mobile = JSON.parse(fs.readFileSync(path.join(RESEARCH_DIR, "inspection-mobile.json"), "utf8"));
const assetMap = JSON.parse(fs.readFileSync(path.join(RESEARCH_DIR, "asset-map.json"), "utf8")).assets;

function normUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("/")) return "https://www.brooklinen.com" + url;
  return url;
}

function localAsset(rawUrl) {
  const n = normUrl(rawUrl);
  if (!n) return "";
  return assetMap[n]?.localPath || "";
}

function parseCard(card, swatchInfo, sampleList) {
  const lines = card.lines || [];
  let topBadge = "";
  let promoEyebrow = "";
  let title = "";
  let originalPrice = "";
  let salePrice = "";
  let discountBadge = "";
  let reviewCount = "";

  const knownBadges = ["BEST SELLER", "SOFTEST", "COOLING", "BACK IN STOCK", "NEW", "LIMITED EDITION"];
  for (const line of lines) {
    if (knownBadges.includes(line) && !topBadge) {
      topBadge = line;
    } else if (line === "Quick View") {
      continue;
    } else if (line === "BLACK FRIDAY SALE" || line === "SELLING FAST!") {
      promoEyebrow = line;
    } else if (line.startsWith("From:") || /^\$\d+/.test(line)) {
      const m = line.match(/\$(\d+)\s*\$(\d+)/);
      if (m) {
        originalPrice = `$${m[1]}`;
        salePrice = `$${m[2]}`;
      } else {
        const single = line.match(/\$(\d+)/);
        if (single) salePrice = `$${single[1]}`;
      }
    } else if (/^\d+%\s*off$/i.test(line)) {
      discountBadge = line;
    } else if (/^\([\d,]+\)$/.test(line)) {
      reviewCount = line;
    } else if (!title && line.length > 3) {
      title = line;
    }
  }

  const mainImage = localAsset(card.productImgs?.[0]?.src);
  const hoverImage = localAsset(card.productImgs?.[1]?.src) || mainImage;
  const awardSeal = card.awardImg?.src ? localAsset(card.awardImg.src) : "";

  // Match swatchSamples by title
  const sampleEntry = (sampleList || []).find((s) => s.title === title);
  const variantByLabel = new Map();
  for (const v of sampleEntry?.variants || []) {
    const cleanLabel = (v.label || "").replace(/^Color:\s*/i, "").trim().toLowerCase();
    if (cleanLabel) {
      variantByLabel.set(cleanLabel, {
        mainImage: localAsset(v.mainImg) || mainImage,
        hoverImage: localAsset(v.hoverImg) || hoverImage,
      });
    }
  }

  const rawSwatches = swatchInfo?.swatches || [];
  // Detect default active swatch index by matching filename tokens against swatch label
  const defaultSrcLower = (card.productImgs?.[0]?.src || "")
    .toLowerCase()
    .replace(/midnightnavy/g, "abyss")
    .replace(/[^a-z0-9]/g, "");
  let defaultSwatchIndex = 0;
  let bestScore = -1;
  rawSwatches.forEach((sw, idx) => {
    const lblClean = (sw.label || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (lblClean.length >= 4 && defaultSrcLower.includes(lblClean)) {
      if (lblClean.length > bestScore) {
        bestScore = lblClean.length;
        defaultSwatchIndex = idx;
      }
    }
  });

  const swatches = rawSwatches.map((sw, idx) => {
    const key = (sw.label || "").trim().toLowerCase();
    const matched = variantByLabel.get(key);
    const isDefault = idx === defaultSwatchIndex;
    return {
      label: sw.label || `Option ${idx + 1}`,
      color: sw.bg && sw.bg !== "rgba(0, 0, 0, 0)" ? sw.bg : undefined,
      swatchImage: sw.imgSrc ? localAsset(sw.imgSrc) : undefined,
      mainImage: isDefault ? mainImage : matched?.mainImage || mainImage,
      hoverImage: isDefault ? hoverImage : matched?.hoverImage || hoverImage,
    };
  });

  return {
    id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${card.index}`,
    title,
    href: normUrl(card.href),
    topBadge: topBadge || undefined,
    awardSeal: awardSeal || undefined,
    promoEyebrow: promoEyebrow || undefined,
    promoTone: promoEyebrow === "SELLING FAST!" ? "urgent" : "sale",
    originalPrice,
    salePrice,
    discountBadge,
    reviewCount: reviewCount || undefined,
    rating: 4.8,
    mainImage,
    hoverImage,
    defaultSwatchIndex,
    swatches,
  };
}

const bestOfSale = (deep.carouselBestOfSale?.cards || []).map((c, i) =>
  parseCard(c, ms.swatchesBestOfSale?.[i], deep.swatchSamples?.["Best of Sale"])
);
const giftGuide = (deep.carouselGiftGuide?.cards || []).map((c, i) =>
  parseCard(c, ms.swatchesGiftGuide?.[i], deep.swatchSamples?.["Shop the Gift Guide"])
);
const collection = (deep.carouselCollection?.cards || []).map((c, i) =>
  parseCard(c, ms.swatchesCollection?.[i], deep.swatchSamples?.["Shop the Collection"])
);

// Categories in exact visual order seen on desktop-1440-band-02.png
const catMap = new Map();
for (const c of deep.shopByCategory?.cards || []) {
  if (!catMap.has(c.text)) {
    catMap.set(c.text, {
      title: c.text,
      href: normUrl(c.href),
      image: localAsset(c.img),
      badgeImage: c.text === "Bundle Savings" ? "/sites/brooklinen/brand/badge-40-off.png" : undefined,
    });
  }
}
const categoryOrder = [
  "All Sheets",
  "All Bedding",
  "Bundle Savings",
  "All Bath",
  "Duvet Inserts & Pillows",
  "New Arrivals",
];
const categories = categoryOrder.map((t) => catMap.get(t)).filter(Boolean);

// New & Trending
const trending = (deep.newAndTrending?.cards || []).map((c) => ({
  title: c.title || c.textLines?.[0] || "",
  href: normUrl(c.links?.[0]?.href || ""),
  image: localAsset(c.img),
}));

// Press logos (deduped 7 visible)
const pressSeen = new Set();
const pressLogos = [];
const pressNames = [
  "Wirecutter",
  "Good Housekeeping",
  "Architectural Digest",
  "Apartment Therapy",
  "Good Morning America",
  "TODAY",
  "Vogue",
];
for (const l of deep.press?.logos || []) {
  if (l.w > 0 && !pressSeen.has(l.src)) {
    pressSeen.add(l.src);
    pressLogos.push({
      name: pressNames[pressLogos.length] || "Press",
      image: localAsset(l.src),
      width: l.w,
      height: l.h,
    });
  }
}

// Videos
const heroDesktopVid = deep.heroPrimary?.videos?.[0];
const heroMobileVid = mobile.sections?.[0]?.videos?.[1];
const sheetsDesktopVid = deep.heroSheets?.videos?.[0];
const sheetsMobileVid = mobile.sections?.[7]?.videos?.[1];

const data = {
  announcementSlides: [
    {
      id: "mystery",
      text: "Mystery Madness: 40% off a featured bundle, EVERY 48 HOURS",
      href: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals#bundles",
      hasTerms: false,
    },
    {
      id: "tote",
      text: "FREE Super Fluff Tote (value: $75) with purchase of $250.",
      href: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals",
      hasTerms: false,
    },
    {
      id: "bfcm",
      text: "25% Off sitewide at the Biggest Sale of the Year. Shop Black Friday.",
      href: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals",
      hasTerms: true,
    },
    {
      id: "shipping",
      text: "Fast, free shipping on orders over $100, plus 365-day happiness guarantee.",
      href: "https://www.brooklinen.com/pages/faq?a=Does-Brooklinen-offer-free-US-shipping---id--1b50Cl_wSuiEqf4NUNMMOQ",
      hasTerms: false,
    },
  ],
  offerTerms:
    "25% off sitewide and storewide applied at checkout using code BFCM26. Select bundles qualify for 40% total savings, inclusive of the 25% sitewide and storewide discount. The free Superfluff Tote offer and 40% total savings on the qualifying bundles expire at 7:30 AM EST on 11/21/26. Valid online and in store. While supplies last. Excludes Spaces by Brooklinen brands. Purchases totaling $250 or more in a single transaction qualify for a free Superfluff Tote ($75 retail value). Free ground shipping within the contiguous U.S. on all orders of $100 or more.",
  navItems: [
    {
      label: "Black Friday Deals",
      href: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals",
      featuredImage: categories[0]?.image || "",
      featuredTitle: "25% Off Sitewide + Free Tote on $250+",
      featuredDesc: "Shop our biggest sale of the year across sheets, comforters, bath, and gifts.",
      featuredHref: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals",
      columns: [
        {
          heading: "Featured Deals",
          links: [
            { label: "Shop All Black Friday Deals", href: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals", badge: "25% OFF" },
            { label: "Mystery Bundles (48 Hours Only)", href: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals#bundles", badge: "40% OFF" },
            { label: "Best of Sale", href: "https://www.brooklinen.com/collections/best-sellers" },
            { label: "Gifts on Sale", href: "https://www.brooklinen.com/collections/holiday-gift-guide" },
          ],
        },
        {
          heading: "Shop By Category",
          links: [
            { label: "Sheet Sets", href: "https://www.brooklinen.com/collections/all-sheets" },
            { label: "Duvet Covers & Comforters", href: "https://www.brooklinen.com/pages/all-bed" },
            { label: "Bath Towels & Robes", href: "https://www.brooklinen.com/pages/all-bath" },
            { label: "Throws & Blankets", href: "https://www.brooklinen.com/collections/blankets-throws" },
          ],
        },
      ],
    },
    {
      label: "Gift Guide",
      href: "https://www.brooklinen.com/collections/holiday-gift-guide",
      featuredImage: trending[0]?.image || "",
      featuredTitle: "Shop the Gift Guide",
      featuredDesc: "Cozy robes, throws, silk pillowcases, and bundles ready to wrap.",
      featuredHref: "https://www.brooklinen.com/collections/holiday-gift-guide",
      columns: [
        {
          heading: "Shop Gifts",
          links: [
            { label: "All Holiday Gifts", href: "https://www.brooklinen.com/collections/holiday-gift-guide" },
            { label: "The Cozy Shop", href: "https://www.brooklinen.com/pages/cozy-shop" },
            { label: "Hosting Essentials", href: "https://www.brooklinen.com/collections/hosting-essentials" },
            { label: "E-Gift Cards", href: "https://www.brooklinen.com/products/rise-ai-giftcard" },
          ],
        },
        {
          heading: "By Price",
          links: [
            { label: "Gifts Under $50", href: "https://www.brooklinen.com/collections/holiday-gift-guide" },
            { label: "Gifts Under $100", href: "https://www.brooklinen.com/collections/holiday-gift-guide" },
            { label: "Luxury Gifts", href: "https://www.brooklinen.com/collections/holiday-gift-guide" },
          ],
        },
      ],
    },
    {
      label: "Sheets",
      href: "https://www.brooklinen.com/collections/all-sheets",
      featuredImage: categories[0]?.image || "",
      featuredTitle: "Best. Sheets. Ever.",
      featuredDesc: "Compare cool, crisp Classic Percale and buttery-soft Luxe Sateen.",
      featuredHref: "https://www.brooklinen.com/collections/all-sheets",
      columns: [
        {
          heading: "Sheet Collections",
          links: [
            { label: "All Sheets", href: "https://www.brooklinen.com/collections/all-sheets" },
            { label: "Luxe Sateen", href: "https://www.brooklinen.com/collections/luxe-sateen-sheets", badge: "SOFTEST" },
            { label: "Classic Percale", href: "https://www.brooklinen.com/collections/classic-percale-sheets", badge: "COOLING" },
            { label: "Washed European Linen", href: "https://www.brooklinen.com/collections/linen-sheets" },
            { label: "Heathered Cashmere", href: "https://www.brooklinen.com/collections/heathered-cashmere" },
          ],
        },
        {
          heading: "Shop By Piece",
          links: [
            { label: "Core Sheet Sets", href: "https://www.brooklinen.com/collections/sheet-sets" },
            { label: "Hardcore Sheet Bundles", href: "https://www.brooklinen.com/collections/sheet-bundles", badge: "SAVE 35%" },
            { label: "Pillowcases", href: "https://www.brooklinen.com/collections/pillowcases" },
            { label: "Fitted Sheets", href: "https://www.brooklinen.com/collections/fitted-sheets" },
          ],
        },
      ],
    },
    {
      label: "Bed",
      href: "https://www.brooklinen.com/pages/all-bed",
      featuredImage: categories[1]?.image || "",
      featuredTitle: "Build Your Dream Bed",
      featuredDesc: "Layer comforters, pillows, duvet covers, and blankets.",
      featuredHref: "https://www.brooklinen.com/pages/all-bed",
      columns: [
        {
          heading: "Bedding",
          links: [
            { label: "All Bedding", href: "https://www.brooklinen.com/pages/all-bed" },
            { label: "Duvet Covers", href: "https://www.brooklinen.com/collections/duvet-covers" },
            { label: "Comforters", href: "https://www.brooklinen.com/collections/comforters" },
            { label: "Pillows", href: "https://www.brooklinen.com/collections/pillows" },
            { label: "Quilts & Blankets", href: "https://www.brooklinen.com/collections/blankets-throws" },
          ],
        },
      ],
    },
    {
      label: "Bath & Robes",
      href: "https://www.brooklinen.com/pages/all-bath",
      featuredImage: categories[3]?.image || "",
      featuredTitle: "Super-Plush Bath",
      featuredDesc: "Oprah's Favorite Things 2025 Super-Plush Robes & Turkish Cotton Towels.",
      featuredHref: "https://www.brooklinen.com/pages/all-bath",
      columns: [
        {
          heading: "Bath Essentials",
          links: [
            { label: "All Bath", href: "https://www.brooklinen.com/pages/all-bath" },
            { label: "Super-Plush Towels", href: "https://www.brooklinen.com/collections/bath-towels" },
            { label: "Robes", href: "https://www.brooklinen.com/collections/robes" },
            { label: "Bath Mats & Shower Curtains", href: "https://www.brooklinen.com/collections/bath-mats" },
            { label: "Bath Bundles", href: "https://www.brooklinen.com/collections/bath-bundles", badge: "UP TO 40% OFF" },
          ],
        },
      ],
    },
    {
      label: "Bundle Savings",
      href: "https://www.brooklinen.com/pages/all-bundles",
      featuredImage: categories[2]?.image || "",
      featuredTitle: "Shop 40% Off Today's Bundle",
      featuredDesc: "40% off new Mystery Bundles, every 48 hours. Check back for new bundles.",
      featuredHref: "https://www.brooklinen.com/pages/all-bundles",
      columns: [
        {
          heading: "Save On Bundles",
          links: [
            { label: "Black Friday Deals", href: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals" },
            { label: "All Bundles", href: "https://www.brooklinen.com/pages/all-bundles", badge: "UP TO 40% OFF" },
            { label: "Bedding Bundles", href: "https://www.brooklinen.com/collections/sheet-bundles", badge: "UP TO 35% OFF" },
            { label: "Bath Bundles", href: "https://www.brooklinen.com/collections/bath-bundles", badge: "UP TO 40% OFF" },
          ],
        },
      ],
    },
    {
      label: "Home",
      href: "https://www.brooklinen.com/collections/home-accessories",
      featuredImage: trending[1]?.image || "",
      featuredTitle: "Waffle World",
      featuredDesc: "Textured throws, pillows, and accents made for lounging.",
      featuredHref: "https://www.brooklinen.com/collections/dreamweave-waffle",
      columns: [
        {
          heading: "Home & Accents",
          links: [
            { label: "All Home Accessories", href: "https://www.brooklinen.com/collections/home-accessories" },
            { label: "Throw Blankets", href: "https://www.brooklinen.com/collections/blankets-throws" },
            { label: "Decorative Pillows", href: "https://www.brooklinen.com/collections/decorative-pillows" },
            { label: "Waffle World", href: "https://www.brooklinen.com/collections/dreamweave-waffle" },
          ],
        },
      ],
    },
    {
      label: "New & Trending",
      href: "https://www.brooklinen.com/collections/new-arrivals",
      featuredImage: categories[5]?.image || "",
      featuredTitle: "New Arrivals",
      featuredDesc: "Fresh seasonal stripes, solids, and cozy holiday releases.",
      featuredHref: "https://www.brooklinen.com/collections/new-arrivals",
      columns: [
        {
          heading: "Discover",
          links: [
            { label: "New Arrivals", href: "https://www.brooklinen.com/collections/new-arrivals" },
            { label: "The Cozy Shop", href: "https://www.brooklinen.com/pages/cozy-shop" },
            { label: "Waffle World", href: "https://www.brooklinen.com/collections/dreamweave-waffle" },
            { label: "Hosting Essentials", href: "https://www.brooklinen.com/collections/hosting-essentials" },
          ],
        },
      ],
    },
  ],
  mobileQuickPills: [
    { label: "Black Friday Deals", href: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals" },
    { label: "Gift Guide", href: "https://www.brooklinen.com/collections/holiday-gift-guide" },
    { label: "Bundle Savings", href: "https://www.brooklinen.com/pages/all-bundles" },
  ],
  heroPrimary: {
    desktopVideo: localAsset(heroDesktopVid?.currentSrc),
    desktopPoster: localAsset(heroDesktopVid?.poster),
    mobileVideo: localAsset(heroMobileVid?.currentSrc),
    mobilePoster: localAsset(heroMobileVid?.poster),
    headingLines: ["25% Off Sitewide", "Black Friday Sale"],
    subtitleLines: ["It’s our biggest sale of the year. For a limited time", "get a free Super-Fluff tote on orders $250+."],
    ctaLabel: "Shop Now",
    ctaHref: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals",
  },
  heroSheets: {
    desktopVideo: localAsset(sheetsDesktopVid?.currentSrc),
    desktopPoster: localAsset(sheetsDesktopVid?.poster),
    mobileVideo: localAsset(sheetsMobileVid?.currentSrc),
    mobilePoster: localAsset(sheetsMobileVid?.poster),
    lockupSvg: "/sites/brooklinen/brand/best-sheets-ever-lockup.svg",
    subtitle: "Get our cool, crisp Classic Percale or soft, smooth Luxe Sheets, and sleep like the best.",
    ctas: [
      { label: "Shop Sheets", href: "https://www.brooklinen.com/collections/all-sheets" },
      { label: "Explore the Campaign", href: "https://brooklinen.com/pages/best-sheets-ever" },
    ],
  },
  miniHeroTote: {
    desktopImage: "/sites/brooklinen/banners/mini-hero-desktop.jpg",
    mobileImage: "/sites/brooklinen/banners/mini-hero-mobile.jpg",
    lines: ["48 Hours Only: Free Super Fluff", "Tote with $250+ purchase"],
    ctaLabel: "Shop Now",
    ctaHref: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals",
  },
  bestOfSale,
  categories,
  giftGuide,
  collection,
  trending,
  valueProps: [
    {
      title: "PREMIUM MATERIALS & EXCLUSIVE STYLES",
      body: "Only the best—that’s what you deserve.",
    },
    {
      title: "365-DAY HAPPINESS GUARANTEE",
      body: "It’ll be love at first sleep (or bath).",
    },
    {
      title: "FAST, FREE SHIPPING",
      body: "We’re New Yorkers, we move quick.",
      linkLabel: "Exclusions Apply *",
      linkHref: "https://www.brooklinen.com/pages/faq",
    },
  ],
  reviews: [
    {
      title: "Like Sleeping On A Cloud",
      quote: "“Literally the best sleep I've gotten in ages. I never want to get out of bed...”",
      author: "Sarah T.",
    },
    {
      title: "Can't Stop Talking About Them",
      quote: "“Better than any fine hotel towels I've ever used. I'm so happy with this purchase!”",
      author: "Linda B.",
    },
    {
      title: "Now I Get It",
      quote: "“I didn't understand the value of good sheets until now. I'm obsessed.”",
      author: "James A.",
    },
  ],
  pressLogos,
  footerColumns: [
    {
      heading: "About",
      links: [
        { label: "About Us", href: "https://www.brooklinen.com/pages/about" },
        { label: "Press", href: "https://www.brooklinen.com/pages/press" },
        { label: "Reviews", href: "https://www.brooklinen.com/pages/reviews" },
        { label: "Our Stores", href: "https://www.brooklinen.com/pages/our-stores" },
        { label: "HSA/FSA Eligible", href: "https://www.brooklinen.com/pages/hsa-fsa-eligible" },
        { label: "Education Center", href: "https://www.brooklinen.com/blogs/education-center" },
      ],
    },
    {
      heading: "Community",
      links: [
        { label: "Brooklinen Rewards", href: "https://www.brooklinen.com/pages/rewards" },
        { label: "Brookliving", href: "https://www.brooklinen.com/blogs/brookliving" },
        { label: "Trade & Hospitality", href: "https://www.brooklinen.com/pages/trade" },
        { label: "Corporate Gifting", href: "https://www.brooklinen.com/pages/corporate-gifting" },
      ],
    },
    {
      heading: "Need Help?",
      links: [
        { label: "FAQ & Support", href: "https://www.brooklinen.com/pages/faq" },
        { label: "Returns & Exchanges", href: "https://www.brooklinen.com/pages/returns" },
        { label: "Care Guide", href: "https://www.brooklinen.com/pages/care-guide" },
        { label: "E-Gift Card", href: "https://www.brooklinen.com/products/rise-ai-giftcard" },
        { label: "Gift Card Balance", href: "https://www.brooklinen.com/pages/check-gift-card-balance" },
        { label: "Do Not Sell or Share My Personal Information", href: "https://www.brooklinen.com/pages/do-not-sell-request" },
        { label: "Your Privacy Choices", href: "https://www.brooklinen.com/pages/privacy" },
      ],
    },
    {
      heading: "Get In Touch",
      links: [
        { label: "Contact Us", href: "https://www.brooklinen.com/pages/contact" },
        { label: "Careers", href: "https://www.brooklinen.com/pages/careers" },
        { label: "Sign Up for Texts", href: "https://www.brooklinen.com/pages/sms-signup" },
      ],
    },
  ],
  legalLinks: [
    { label: "Terms of Service", href: "https://www.brooklinen.com/pages/terms-of-service" },
    { label: "Privacy Policy", href: "https://www.brooklinen.com/pages/privacy" },
    { label: "Accessibility", href: "https://www.brooklinen.com/pages/website-accessibility-notice" },
    { label: "SMS Marketing Terms of Service", href: "https://www.brooklinen.com/pages/sms-marketing-terms-of-service" },
    { label: "Product Collections", href: "https://www.brooklinen.com/pages/shop-explore" },
  ],
};

const tsHeader = `export interface SwatchItem {
  label: string;
  color?: string;
  swatchImage?: string;
  mainImage: string;
  hoverImage: string;
}

export interface ProductCardData {
  id: string;
  title: string;
  href: string;
  topBadge?: string;
  awardSeal?: string;
  promoEyebrow?: string;
  promoTone: "sale" | "urgent";
  originalPrice: string;
  salePrice: string;
  discountBadge: string;
  reviewCount?: string;
  rating: number;
  mainImage: string;
  hoverImage: string;
  defaultSwatchIndex: number;
  swatches: SwatchItem[];
}

export interface CategoryCardData {
  title: string;
  href: string;
  image: string;
  badgeImage?: string;
}

export interface TrendingCardData {
  title: string;
  href: string;
  image: string;
}

export interface NavColumnLink {
  label: string;
  href: string;
  badge?: string;
}

export interface NavItemData {
  label: string;
  href: string;
  featuredImage: string;
  featuredTitle: string;
  featuredDesc: string;
  featuredHref: string;
  columns: { heading: string; links: NavColumnLink[] }[];
}

export interface PressLogoData {
  name: string;
  image: string;
  width: number;
  height: number;
}

export const BROOKLINEN_DATA = ${JSON.stringify(data, null, 2)} as const;
`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, tsHeader);
console.log("Generated", OUT_FILE, "| products:", bestOfSale.length + giftGuide.length + collection.length, "| categories:", categories.length, "| press:", pressLogos.length);
