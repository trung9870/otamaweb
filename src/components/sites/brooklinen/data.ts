export interface SwatchItem {
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

export const BROOKLINEN_DATA = {
  "announcementSlides": [
    {
      "id": "mystery",
      "text": "Mystery Madness: 40% off a featured bundle, EVERY 48 HOURS",
      "href": "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals#bundles",
      "hasTerms": false
    },
    {
      "id": "tote",
      "text": "FREE Super Fluff Tote (value: $75) with purchase of $250.",
      "href": "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals",
      "hasTerms": false
    },
    {
      "id": "bfcm",
      "text": "25% Off sitewide at the Biggest Sale of the Year. Shop Black Friday.",
      "href": "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals",
      "hasTerms": true
    },
    {
      "id": "shipping",
      "text": "Fast, free shipping on orders over $100, plus 365-day happiness guarantee.",
      "href": "https://www.brooklinen.com/pages/faq?a=Does-Brooklinen-offer-free-US-shipping---id--1b50Cl_wSuiEqf4NUNMMOQ",
      "hasTerms": false
    }
  ],
  "offerTerms": "25% off sitewide and storewide applied at checkout using code BFCM26. Select bundles qualify for 40% total savings, inclusive of the 25% sitewide and storewide discount. The free Superfluff Tote offer and 40% total savings on the qualifying bundles expire at 7:30 AM EST on 11/21/26. Valid online and in store. While supplies last. Excludes Spaces by Brooklinen brands. Purchases totaling $250 or more in a single transaction qualify for a free Superfluff Tote ($75 retail value). Free ground shipping within the contiguous U.S. on all orders of $100 or more.",
  "navItems": [
    {
      "label": "Black Friday Deals",
      "href": "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals",
      "featuredImage": "/sites/brooklinen/categories/BKL_26-08_HolidayCapsule_Look1_1x_8x9_WO-97bc62f7.jpg",
      "featuredTitle": "25% Off Sitewide + Free Tote on $250+",
      "featuredDesc": "Shop our biggest sale of the year across sheets, comforters, bath, and gifts.",
      "featuredHref": "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals",
      "columns": [
        {
          "heading": "Featured Deals",
          "links": [
            {
              "label": "Shop All Black Friday Deals",
              "href": "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals",
              "badge": "25% OFF"
            },
            {
              "label": "Mystery Bundles (48 Hours Only)",
              "href": "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals#bundles",
              "badge": "40% OFF"
            },
            {
              "label": "Best of Sale",
              "href": "https://www.brooklinen.com/collections/best-sellers"
            },
            {
              "label": "Gifts on Sale",
              "href": "https://www.brooklinen.com/collections/holiday-gift-guide"
            }
          ]
        },
        {
          "heading": "Shop By Category",
          "links": [
            {
              "label": "Sheet Sets",
              "href": "https://www.brooklinen.com/collections/all-sheets"
            },
            {
              "label": "Duvet Covers & Comforters",
              "href": "https://www.brooklinen.com/pages/all-bed"
            },
            {
              "label": "Bath Towels & Robes",
              "href": "https://www.brooklinen.com/pages/all-bath"
            },
            {
              "label": "Throws & Blankets",
              "href": "https://www.brooklinen.com/collections/blankets-throws"
            }
          ]
        }
      ]
    },
    {
      "label": "Gift Guide",
      "href": "https://www.brooklinen.com/collections/holiday-gift-guide",
      "featuredImage": "/sites/brooklinen/trending/BKL_26-09_HolidayOverheads_Look4_165x_WO_8x9_f38-24440483.jpg",
      "featuredTitle": "Shop the Gift Guide",
      "featuredDesc": "Cozy robes, throws, silk pillowcases, and bundles ready to wrap.",
      "featuredHref": "https://www.brooklinen.com/collections/holiday-gift-guide",
      "columns": [
        {
          "heading": "Shop Gifts",
          "links": [
            {
              "label": "All Holiday Gifts",
              "href": "https://www.brooklinen.com/collections/holiday-gift-guide"
            },
            {
              "label": "The Cozy Shop",
              "href": "https://www.brooklinen.com/pages/cozy-shop"
            },
            {
              "label": "Hosting Essentials",
              "href": "https://www.brooklinen.com/collections/hosting-essentials"
            },
            {
              "label": "E-Gift Cards",
              "href": "https://www.brooklinen.com/products/rise-ai-giftcard"
            }
          ]
        },
        {
          "heading": "By Price",
          "links": [
            {
              "label": "Gifts Under $50",
              "href": "https://www.brooklinen.com/collections/holiday-gift-guide"
            },
            {
              "label": "Gifts Under $100",
              "href": "https://www.brooklinen.com/collections/holiday-gift-guide"
            },
            {
              "label": "Luxury Gifts",
              "href": "https://www.brooklinen.com/collections/holiday-gift-guide"
            }
          ]
        }
      ]
    },
    {
      "label": "Sheets",
      "href": "https://www.brooklinen.com/collections/all-sheets",
      "featuredImage": "/sites/brooklinen/categories/BKL_26-08_HolidayCapsule_Look1_1x_8x9_WO-97bc62f7.jpg",
      "featuredTitle": "Best. Sheets. Ever.",
      "featuredDesc": "Compare cool, crisp Classic Percale and buttery-soft Luxe Sateen.",
      "featuredHref": "https://www.brooklinen.com/collections/all-sheets",
      "columns": [
        {
          "heading": "Sheet Collections",
          "links": [
            {
              "label": "All Sheets",
              "href": "https://www.brooklinen.com/collections/all-sheets"
            },
            {
              "label": "Luxe Sateen",
              "href": "https://www.brooklinen.com/collections/luxe-sateen-sheets",
              "badge": "SOFTEST"
            },
            {
              "label": "Classic Percale",
              "href": "https://www.brooklinen.com/collections/classic-percale-sheets",
              "badge": "COOLING"
            },
            {
              "label": "Washed European Linen",
              "href": "https://www.brooklinen.com/collections/linen-sheets"
            },
            {
              "label": "Heathered Cashmere",
              "href": "https://www.brooklinen.com/collections/heathered-cashmere"
            }
          ]
        },
        {
          "heading": "Shop By Piece",
          "links": [
            {
              "label": "Core Sheet Sets",
              "href": "https://www.brooklinen.com/collections/sheet-sets"
            },
            {
              "label": "Hardcore Sheet Bundles",
              "href": "https://www.brooklinen.com/collections/sheet-bundles",
              "badge": "SAVE 35%"
            },
            {
              "label": "Pillowcases",
              "href": "https://www.brooklinen.com/collections/pillowcases"
            },
            {
              "label": "Fitted Sheets",
              "href": "https://www.brooklinen.com/collections/fitted-sheets"
            }
          ]
        }
      ]
    },
    {
      "label": "Bed",
      "href": "https://www.brooklinen.com/pages/all-bed",
      "featuredImage": "/sites/brooklinen/categories/BKL_26-04_WaffleWorld_Look3_0268x_WO_8x9_ec20b38-cb861ff0.jpg",
      "featuredTitle": "Build Your Dream Bed",
      "featuredDesc": "Layer comforters, pillows, duvet covers, and blankets.",
      "featuredHref": "https://www.brooklinen.com/pages/all-bed",
      "columns": [
        {
          "heading": "Bedding",
          "links": [
            {
              "label": "All Bedding",
              "href": "https://www.brooklinen.com/pages/all-bed"
            },
            {
              "label": "Duvet Covers",
              "href": "https://www.brooklinen.com/collections/duvet-covers"
            },
            {
              "label": "Comforters",
              "href": "https://www.brooklinen.com/collections/comforters"
            },
            {
              "label": "Pillows",
              "href": "https://www.brooklinen.com/collections/pillows"
            },
            {
              "label": "Quilts & Blankets",
              "href": "https://www.brooklinen.com/collections/blankets-throws"
            }
          ]
        }
      ]
    },
    {
      "label": "Bath & Robes",
      "href": "https://www.brooklinen.com/pages/all-bath",
      "featuredImage": "/sites/brooklinen/categories/BKL_25-11_FebNewnessSP2_Shot8_1280x_8x9_Darkened-4f11108b.jpg",
      "featuredTitle": "Super-Plush Bath",
      "featuredDesc": "Oprah's Favorite Things 2025 Super-Plush Robes & Turkish Cotton Towels.",
      "featuredHref": "https://www.brooklinen.com/pages/all-bath",
      "columns": [
        {
          "heading": "Bath Essentials",
          "links": [
            {
              "label": "All Bath",
              "href": "https://www.brooklinen.com/pages/all-bath"
            },
            {
              "label": "Super-Plush Towels",
              "href": "https://www.brooklinen.com/collections/bath-towels"
            },
            {
              "label": "Robes",
              "href": "https://www.brooklinen.com/collections/robes"
            },
            {
              "label": "Bath Mats & Shower Curtains",
              "href": "https://www.brooklinen.com/collections/bath-mats"
            },
            {
              "label": "Bath Bundles",
              "href": "https://www.brooklinen.com/collections/bath-bundles",
              "badge": "UP TO 40% OFF"
            }
          ]
        }
      ]
    },
    {
      "label": "Bundle Savings",
      "href": "https://www.brooklinen.com/pages/all-bundles",
      "featuredImage": "/sites/brooklinen/categories/2-1-Visual-Category-Module-a0778b82.jpg",
      "featuredTitle": "Shop 40% Off Today's Bundle",
      "featuredDesc": "40% off new Mystery Bundles, every 48 hours. Check back for new bundles.",
      "featuredHref": "https://www.brooklinen.com/pages/all-bundles",
      "columns": [
        {
          "heading": "Save On Bundles",
          "links": [
            {
              "label": "Black Friday Deals",
              "href": "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals"
            },
            {
              "label": "All Bundles",
              "href": "https://www.brooklinen.com/pages/all-bundles",
              "badge": "UP TO 40% OFF"
            },
            {
              "label": "Bedding Bundles",
              "href": "https://www.brooklinen.com/collections/sheet-bundles",
              "badge": "UP TO 35% OFF"
            },
            {
              "label": "Bath Bundles",
              "href": "https://www.brooklinen.com/collections/bath-bundles",
              "badge": "UP TO 40% OFF"
            }
          ]
        }
      ]
    },
    {
      "label": "Home",
      "href": "https://www.brooklinen.com/collections/home-accessories",
      "featuredImage": "/sites/brooklinen/trending/BKL_26-04_WaffleWorld_Look18_2860x_800x900_WO_46-767127bb.jpg",
      "featuredTitle": "Waffle World",
      "featuredDesc": "Textured throws, pillows, and accents made for lounging.",
      "featuredHref": "https://www.brooklinen.com/collections/dreamweave-waffle",
      "columns": [
        {
          "heading": "Home & Accents",
          "links": [
            {
              "label": "All Home Accessories",
              "href": "https://www.brooklinen.com/collections/home-accessories"
            },
            {
              "label": "Throw Blankets",
              "href": "https://www.brooklinen.com/collections/blankets-throws"
            },
            {
              "label": "Decorative Pillows",
              "href": "https://www.brooklinen.com/collections/decorative-pillows"
            },
            {
              "label": "Waffle World",
              "href": "https://www.brooklinen.com/collections/dreamweave-waffle"
            }
          ]
        }
      ]
    },
    {
      "label": "New & Trending",
      "href": "https://www.brooklinen.com/collections/new-arrivals",
      "featuredImage": "/sites/brooklinen/categories/BKL_26-08_HolidayCapsule_Look2__510x_WO_8x9_3bd9-e3ecb8fe.jpg",
      "featuredTitle": "New Arrivals",
      "featuredDesc": "Fresh seasonal stripes, solids, and cozy holiday releases.",
      "featuredHref": "https://www.brooklinen.com/collections/new-arrivals",
      "columns": [
        {
          "heading": "Discover",
          "links": [
            {
              "label": "New Arrivals",
              "href": "https://www.brooklinen.com/collections/new-arrivals"
            },
            {
              "label": "The Cozy Shop",
              "href": "https://www.brooklinen.com/pages/cozy-shop"
            },
            {
              "label": "Waffle World",
              "href": "https://www.brooklinen.com/collections/dreamweave-waffle"
            },
            {
              "label": "Hosting Essentials",
              "href": "https://www.brooklinen.com/collections/hosting-essentials"
            }
          ]
        }
      ]
    }
  ],
  "mobileQuickPills": [
    {
      "label": "Black Friday Deals",
      "href": "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals"
    },
    {
      "label": "Gift Guide",
      "href": "https://www.brooklinen.com/collections/holiday-gift-guide"
    },
    {
      "label": "Bundle Savings",
      "href": "https://www.brooklinen.com/pages/all-bundles"
    }
  ],
  "heroPrimary": {
    "desktopVideo": "/sites/brooklinen/videos/1af43db2aaf04b8b851a6562017cbfb3-SD-480p-1-5Mbps-04ba8ff2.mp4",
    "desktopPoster": "/sites/brooklinen/videos/1af43db2aaf04b8b851a6562017cbfb3-thumbnail-00000-36df7976.jpg",
    "mobileVideo": "/sites/brooklinen/videos/48c06bf1f50d4ff3bbfd849190395607-HD-720p-3-0Mbps-fb19886d.mp4",
    "mobilePoster": "/sites/brooklinen/videos/48c06bf1f50d4ff3bbfd849190395607-thumbnail-00000-ac95267b.jpg",
    "headingLines": [
      "25% Off Sitewide",
      "Black Friday Sale"
    ],
    "subtitleLines": [
      "It’s our biggest sale of the year. For a limited time",
      "get a free Super-Fluff tote on orders $250+."
    ],
    "ctaLabel": "Shop Now",
    "ctaHref": "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals"
  },
  "heroSheets": {
    "desktopVideo": "/sites/brooklinen/videos/c0196c2c562144fc9f9242d10f7aadcc-HD-1080p-4-8Mbp-91e68040.mp4",
    "desktopPoster": "/sites/brooklinen/videos/c0196c2c562144fc9f9242d10f7aadcc-thumbnail-00000-00400761.jpg",
    "mobileVideo": "/sites/brooklinen/videos/54dab6bfb60842fcbb2cb7dd83a150df-HD-720p-3-0Mbps-6364e4f0.mp4",
    "mobilePoster": "/sites/brooklinen/videos/54dab6bfb60842fcbb2cb7dd83a150df-thumbnail-00000-4f4b42da.jpg",
    "lockupSvg": "/sites/brooklinen/brand/best-sheets-ever-lockup.svg",
    "subtitle": "Get our cool, crisp Classic Percale or soft, smooth Luxe Sheets, and sleep like the best.",
    "ctas": [
      {
        "label": "Shop Sheets",
        "href": "https://www.brooklinen.com/collections/all-sheets"
      },
      {
        "label": "Explore the Campaign",
        "href": "https://brooklinen.com/pages/best-sheets-ever"
      }
    ]
  },
  "miniHeroTote": {
    "desktopImage": "/sites/brooklinen/banners/mini-hero-desktop.jpg",
    "mobileImage": "/sites/brooklinen/banners/mini-hero-mobile.jpg",
    "lines": [
      "48 Hours Only: Free Super Fluff",
      "Tote with $250+ purchase"
    ],
    "ctaLabel": "Shop Now",
    "ctaHref": "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals"
  },
  "bestOfSale": [
    {
      "id": "classic-percale-core-sheet-set-0",
      "title": "Classic Percale Core Sheet Set",
      "href": "https://www.brooklinen.com/products/classic-core-sheet-set?variant=41794111832154",
      "topBadge": "BEST SELLER",
      "awardSeal": "/sites/brooklinen/awards/NYT-Wirecutter-6c6d9016.png",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$159",
      "salePrice": "$119",
      "discountBadge": "25% off",
      "reviewCount": "(18,752)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg",
      "defaultSwatchIndex": 8,
      "swatches": [
        {
          "label": "Solid White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_White_CSS_1_x_PDP_WO_6-1f4b2f4c.jpg",
          "hoverImage": "/sites/brooklinen/products/feed-test_600x-df9613c4.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_Cream_CSS_1_x_PDP_WO_6-c3b1e52b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Luxe_Cream_Straight_2x_PDP_WO_-93a35cc9.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_Pebble_CSS_1_x_PDP_WO_-ae7170a6.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-cedab600.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInPebble_C-630d5ae5.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinPebble_O-c0e3586a.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_CSS_1_x_PDP_-bd5f0e21.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-298b7193.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInFreshMos-179da78e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-d22626aa.jpg"
        },
        {
          "label": "Calm Waters in Tonal Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Tonal_Fresh_Moss-20413359.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Coral",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Coral-62463c2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Bitter Chocolate",
          "color": "rgb(85, 63, 58)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Coral",
          "color": "rgb(219, 145, 120)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Etched Dot in Bitter Chocolate",
          "swatchImage": "/sites/brooklinen/swatches/Etched_Dot_in_Bitter_Chocolate-02bc529c.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Maple-b3360dcd.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Skyline Stripe in Flax",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Flax-3dd1ec94.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Skyline Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Frost-f6138230.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Skyline Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Mahogany-1011d2e3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Spice",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Spice-5b75f02c.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Tree Top",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Tree_Top-fc34d8b4.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        }
      ]
    },
    {
      "id": "luxe-sateen-core-sheet-set-1",
      "title": "Luxe Sateen Core Sheet Set",
      "href": "https://www.brooklinen.com/products/luxe-core-sheet-set?variant=43350203891802",
      "topBadge": "BEST SELLER",
      "awardSeal": "/sites/brooklinen/awards/2026_CONDE-NAST_ARCHITECTURAL-DIGEST_PENDING_LOG-85469419.png",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$169",
      "salePrice": "$127",
      "discountBadge": "25% off",
      "reviewCount": "(24,707)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg",
      "defaultSwatchIndex": 9,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Luxe_White_CSS_1_x_PDP_WO_9a37-b511e62e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_73041cde-56e4--5436cc65.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Cloud_COR_1x_WOgrey_76b05-2b0be5ea.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Cloud_1x_PDP_WO_b6d1c-d0f8879f.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Luxe_Cream_CSS_1_x_PDP_WO_46c7-1e2a743f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot6_1161xAlt_PDP_WO_bf9ae09d-57-7bd07803.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Luxe_Pebble_CSS_1_x_PDP_WO_379-03994e10.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Pebble_1x_PDP_WO_8463-ffc119b5.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Luxe_Pebble_CSS_1_x_PDP_WO_379-03994e10.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Pebble_1x_PDP_WO_8463-ffc119b5.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Luxe_TandemStripeInPebble_CSS_-f51721b3.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_BKL_LuxeOverheads_Look3_0413x_PDP_WO_3-8d04656b.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Blooming Fields in Aegean",
          "swatchImage": "/sites/brooklinen/swatches/Blooming_Fields_in_Aegean-2abb72a3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Blooming Fields in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Blooming_Fields_in_Mahogany-8782ca52.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Maple-b3360dcd.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Warm Terracotta",
          "color": "rgb(206, 115, 87)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        },
        {
          "label": "Tandem Stripe in Night Sky",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Night_Sky-784b13a1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_COR_1x_WOgrey_dd0e2-81d25de4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_a7ac9a6f-f588-4-b216db4d.jpg"
        }
      ]
    },
    {
      "id": "super-plush-robe-2",
      "title": "Super-Plush Robe",
      "href": "https://www.brooklinen.com/products/super-plush-robe?variant=42940058828890",
      "topBadge": "BEST SELLER",
      "awardSeal": "/sites/brooklinen/awards/Oprahs-Favorite-Things_2025-1-dc8bf34c.png",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$139",
      "salePrice": "$104",
      "discountBadge": "25% off",
      "reviewCount": "(2,417)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_23-10_Bath_SP_Robe_StripedBotanicalGreen_Fla-f2c678a0.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot4_028x_WO_PDP_22ac26-24ae12d5.jpg",
      "defaultSwatchIndex": 6,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_23-09_Bath_Robe_White_Flat_1x_c16809ff-2055--e6471b05.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot2_167x_WO_PDP_a14fc8-0492118a.jpg"
        },
        {
          "label": "Pewter",
          "color": "rgb(191, 191, 191)",
          "mainImage": "/sites/brooklinen/products/BKL_23-09_Bath_Robe_Smoke_Flat_1x_ec9384cd-1640--77214455.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-07_RobeOnFigureFitGuide_SuperPlush_Solo_1-c4f7dbee.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_23-09_Bath_Robe_Graphite_Flat_1x_727f31e1-92-03219921.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_18-05_Bath_Robe_SP_Graohite_Folded_1x_WOgrey-0214341b.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_23-09_Bath_Robe_Graphite_Flat_1x_727f31e1-92-03219921.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_18-05_Bath_Robe_SP_Graohite_Folded_1x_WOgrey-0214341b.jpg"
        },
        {
          "label": "Striped Frost",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Frost-96eb75c8.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bath_SP_Robe_StripedFrost_Flat_1_x_PDP-72aa1a3b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot4_028x_WO_PDP_22ac26-24ae12d5.jpg"
        },
        {
          "label": "Striped Abyss",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Abyss_c372e6b7-08b6-419e-8e44-b5254e54dd-570549b1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-07_Bath_Robe_StripedMidnightNavy_Flat_1x_-6c74513b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot8_1402x_8x9_Darkened-c156c57a.jpg"
        },
        {
          "label": "Striped Botanical Green",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Botanical_Green-c3d532c9.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bath_SP_Robe_StripedBotanicalGreen_Fla-f2c678a0.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot4_028x_WO_PDP_22ac26-24ae12d5.jpg"
        },
        {
          "label": "Striped Oak",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Oak-a147f902.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bath_SP_Robe_StripedBotanicalGreen_Fla-f2c678a0.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot4_028x_WO_PDP_22ac26-24ae12d5.jpg"
        },
        {
          "label": "Striped Maple",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Maple-7cdbb256.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bath_SP_Robe_StripedBotanicalGreen_Fla-f2c678a0.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot4_028x_WO_PDP_22ac26-24ae12d5.jpg"
        },
        {
          "label": "Striped Poppy",
          "swatchImage": "/sites/brooklinen/swatches/Poppy-00800e97.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bath_SP_Robe_StripedBotanicalGreen_Fla-f2c678a0.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot4_028x_WO_PDP_22ac26-24ae12d5.jpg"
        },
        {
          "label": "Striped Menthe",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Menthe-9c92690e.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bath_SP_Robe_StripedBotanicalGreen_Fla-f2c678a0.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot4_028x_WO_PDP_22ac26-24ae12d5.jpg"
        }
      ]
    },
    {
      "id": "down-comforter-3",
      "title": "Down Comforter",
      "href": "https://www.brooklinen.com/products/down-comforter?variant=42723522642010",
      "topBadge": "BEST SELLER",
      "awardSeal": "/sites/brooklinen/awards/NYT-Wirecutter-d7f03e7a.png",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$199",
      "salePrice": "$149",
      "discountBadge": "25% off",
      "reviewCount": "(2,995)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Utility_Comforter_AllSeason_1x-0194cfb1.jpg",
      "hoverImage": "/sites/brooklinen/products/1_BKL_25111_UtilityEducation_Scene2Shot5_102x_PD-85415088.jpg",
      "defaultSwatchIndex": 0,
      "swatches": []
    },
    {
      "id": "down-pillow-4",
      "title": "Down Pillow",
      "href": "https://www.brooklinen.com/products/down-pillow?variant=42723524509786",
      "topBadge": "BEST SELLER",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$139",
      "salePrice": "$104",
      "discountBadge": "25% off",
      "reviewCount": "(4,560)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Utility_Pillow_Medium_1x_PDP_W-58728c76.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look4_MEDx_PDP_WO_eee46-1767282b.jpg",
      "defaultSwatchIndex": 0,
      "swatches": []
    },
    {
      "id": "classic-percale-duvet-cover-5",
      "title": "Classic Percale Duvet Cover",
      "href": "https://www.brooklinen.com/products/classic-duvet-cover?variant=42851768991834",
      "topBadge": "BEST SELLER",
      "awardSeal": "/sites/brooklinen/awards/NYT-Wirecutter-3a46ef81.png",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$169",
      "salePrice": "$127",
      "discountBadge": "25% off",
      "reviewCount": "(7,254)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg",
      "defaultSwatchIndex": 13,
      "swatches": [
        {
          "label": "Solid White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_23-05_Bedding_ClassicLuxe_White_DUV_1x_WOgre-66663b17.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-7ee04686.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/classic_cream_duvet-cover_silo_600x-4d8d72e1.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look4_Shot1_1_01-a548a24d.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinPebble_D-7296ca15.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinPebble_O-7f6ac10a.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_23-05_Bedding_Classic_FreshMoss_DUV_1x_WOgre-23c8c685.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-6de4f8d8.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-63977b52.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-8f5aa62f.jpg"
        },
        {
          "label": "Calm Waters in Tonal Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Tonal_Fresh_Moss-20413359.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Tandem Stripe in Coral",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Coral-62463c2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Bitter Chocolate",
          "color": "rgb(85, 63, 58)",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Coral",
          "color": "rgb(219, 145, 120)",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Dandelions in Bitter Chocolate",
          "swatchImage": "/sites/brooklinen/swatches/Dandelions_in_Bitter_Chocolate-13951a6b.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Maple-b3360dcd.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Skyline Stripe in Flax",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Flax-3dd1ec94.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Skyline Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Frost-f6138230.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Skyline Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Mahogany-1011d2e3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Tandem Stripe in Spice",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Spice-5b75f02c.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        },
        {
          "label": "Tandem Stripe in Tree Top",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Tree_Top-fc34d8b4.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-ba447365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_DU-42815528.jpg"
        }
      ]
    },
    {
      "id": "dreamweave-waffle-robe-6",
      "title": "Dreamweave Waffle Robe",
      "href": "https://www.brooklinen.com/products/waffle-robe?variant=42141496803418",
      "topBadge": "BACK IN STOCK",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$139",
      "salePrice": "$104",
      "discountBadge": "25% off",
      "reviewCount": "(496)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Waffle_Robe_Plum_Flat_1x_WOgrey_6-0e51a9ab.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_25-06_AugustLifestyle_Day2_Look6__1806_x_cc_-07301456.jpg",
      "defaultSwatchIndex": 6,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Waffle_Robe_Plum_Flat_1x_WOgrey_6-0e51a9ab.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-06_AugustLifestyle_Day2_Look6__1806_x_cc_-07301456.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Waffle_Robe_Plum_Flat_1x_WOgrey_6-0e51a9ab.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-06_AugustLifestyle_Day2_Look6__1806_x_cc_-07301456.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Waffle_Robe_Plum_Flat_1x_WOgrey_6-0e51a9ab.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-06_AugustLifestyle_Day2_Look6__1806_x_cc_-07301456.jpg"
        },
        {
          "label": "Botanical Green",
          "color": "rgb(115, 129, 120)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Waffle_Robe_Plum_Flat_1x_WOgrey_6-0e51a9ab.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-06_AugustLifestyle_Day2_Look6__1806_x_cc_-07301456.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Waffle_Robe_Plum_Flat_1x_WOgrey_6-0e51a9ab.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-06_AugustLifestyle_Day2_Look6__1806_x_cc_-07301456.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Waffle_Robe_Plum_Flat_1x_WOgrey_6-0e51a9ab.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-06_AugustLifestyle_Day2_Look6__1806_x_cc_-07301456.jpg"
        },
        {
          "label": "Plum",
          "color": "rgb(114, 63, 68)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Waffle_Robe_Plum_Flat_1x_WOgrey_6-0e51a9ab.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-06_AugustLifestyle_Day2_Look6__1806_x_cc_-07301456.jpg"
        },
        {
          "label": "Bronze Check",
          "swatchImage": "/sites/brooklinen/swatches/Bronze_Check-c36a1b6e.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Waffle_Robe_Plum_Flat_1x_WOgrey_6-0e51a9ab.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-06_AugustLifestyle_Day2_Look6__1806_x_cc_-07301456.jpg"
        },
        {
          "label": "Raspberry Check",
          "swatchImage": "/sites/brooklinen/swatches/Rasberyy_Check-7c54a7a1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Waffle_Robe_Plum_Flat_1x_WOgrey_6-0e51a9ab.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-06_AugustLifestyle_Day2_Look6__1806_x_cc_-07301456.jpg"
        },
        {
          "label": "Azul Check",
          "swatchImage": "/sites/brooklinen/swatches/Azul_Check-48805f65.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Waffle_Robe_Plum_Flat_1x_WOgrey_6-0e51a9ab.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-06_AugustLifestyle_Day2_Look6__1806_x_cc_-07301456.jpg"
        }
      ]
    },
    {
      "id": "dreamweave-waffle-bed-blanket-7",
      "title": "Dreamweave Waffle Bed Blanket",
      "href": "https://www.brooklinen.com/products/dreamweave-waffle-bed-blanket?variant=67631796519002",
      "topBadge": "BEST SELLER",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$199",
      "salePrice": "$149",
      "discountBadge": "25% off",
      "reviewCount": "(341)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg",
      "defaultSwatchIndex": 10,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Avocado Plaid",
          "swatchImage": "/sites/brooklinen/swatches/Avocado_Plaid-629f30e6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Algae Two Tone",
          "swatchImage": "/sites/brooklinen/swatches/Algae_Two_Tone-ef2d0544.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Maple Two Tone",
          "swatchImage": "/sites/brooklinen/swatches/Maple_Two_Tone-6c5795fc.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Spice Two Tone",
          "swatchImage": "/sites/brooklinen/swatches/Spice_Two_Tone-c5e03603.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Night Sky Plaid",
          "swatchImage": "/sites/brooklinen/swatches/Night_Sky_Plaid-cd4cd716.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Saffron Plaid",
          "swatchImage": "/sites/brooklinen/swatches/Saffron_Plaid-ae223cc5.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Mahogany Horizon Stripe",
          "swatchImage": "/sites/brooklinen/swatches/Mahogany_Horizon_Stripe-a25c846a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Aegean Horizon Stripe",
          "swatchImage": "/sites/brooklinen/swatches/Aegean_Horizon_Stripe-efbe41c6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        },
        {
          "label": "Flax Horizon Stripe",
          "swatchImage": "/sites/brooklinen/swatches/Flax_Horizon_Stripe-8ffeca50.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_Waffle_NightSkyPlaid_1-420a2f47.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look10_2018x_PDP_WO_600x-6207a6bd.jpg"
        }
      ]
    },
    {
      "id": "super-fluff-throw-blanket-8",
      "title": "Super Fluff Throw Blanket",
      "href": "https://www.brooklinen.com/products/super-fluff-throw-blanket?variant=44105230221402",
      "topBadge": "BEST SELLER",
      "promoEyebrow": "SELLING FAST!",
      "promoTone": "urgent",
      "originalPrice": "$129",
      "salePrice": "$97",
      "discountBadge": "25% off",
      "reviewCount": "(1)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cream_1x_PD-9702a301.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cream_1x_P-f0573ce8.jpg",
      "defaultSwatchIndex": 0,
      "swatches": [
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cream_1x_PD-9702a301.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cream_1x_P-f0573ce8.jpg"
        },
        {
          "label": "Night Sky",
          "color": "rgb(65, 72, 84)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cream_1x_PD-9702a301.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cream_1x_P-f0573ce8.jpg"
        },
        {
          "label": "Cappuccino",
          "color": "rgb(155, 101, 56)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cream_1x_PD-9702a301.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cream_1x_P-f0573ce8.jpg"
        },
        {
          "label": "Flax",
          "color": "rgb(225, 191, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cream_1x_PD-9702a301.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cream_1x_P-f0573ce8.jpg"
        },
        {
          "label": "Wild Moss",
          "color": "rgb(98, 88, 39)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cream_1x_PD-9702a301.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cream_1x_P-f0573ce8.jpg"
        },
        {
          "label": "Soft Fog",
          "color": "rgb(207, 203, 197)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cream_1x_PD-9702a301.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cream_1x_P-f0573ce8.jpg"
        },
        {
          "label": "Tomato",
          "color": "rgb(235, 58, 43)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cream_1x_PD-9702a301.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cream_1x_P-f0573ce8.jpg"
        }
      ]
    },
    {
      "id": "washed-european-linen-core-sheet-set-9",
      "title": "Washed European Linen Core Sheet Set",
      "href": "https://www.brooklinen.com/products/washed-linen-core-sheet-set?variant=43188817526874",
      "topBadge": "COOLING",
      "awardSeal": "/sites/brooklinen/awards/2026_CONDE-NAST_ARCHITECTURAL-DIGEST_PENDING_LOG-648502e1.png",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$369",
      "salePrice": "$277",
      "discountBadge": "25% off",
      "reviewCount": "(4,269)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg",
      "defaultSwatchIndex": 10,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Oat Chambray",
          "color": "rgb(221, 213, 204)",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Oxford Stripe in Oat Chambray",
          "swatchImage": "/sites/brooklinen/swatches/OatChambrayStripe-1-5b78b2ef.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Fog Chambray",
          "color": "rgb(215, 215, 215)",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Storm Chambray",
          "color": "rgb(135, 158, 172)",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Oxford Stripe in Storm Chambray",
          "swatchImage": "/sites/brooklinen/swatches/StormChambrayStripe-a2356057.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Oxford Stripe in Fresh Moss Chambray",
          "swatchImage": "/sites/brooklinen/swatches/Oxford_Stripe_in_Fresh_Moss_Chambray-e7c5c9ac.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Oxford Stripe in Abyss",
          "swatchImage": "/sites/brooklinen/swatches/Oxford_Stripe_in_Abyss_Chambray-1_281f8c88-598d--36b62c1b.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Sunset Check in Vista",
          "swatchImage": "/sites/brooklinen/swatches/Sunset_Check_in_Vista-276a1e09.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Carmine Stripe in Dragonfly",
          "swatchImage": "/sites/brooklinen/swatches/Carmine_Stripe_in_Dragonfly-8c985f66.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        },
        {
          "label": "Carmine Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Carmine_Stripe_in_Mahogany-73fa65a0.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-02_Bedding_Linen_OxfordStripeinAbyssChamb-b3c31ee9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-01_AprNewArrivals_Look1_115x_POP_WO_60aa0-9bce7aa3.jpg"
        }
      ]
    },
    {
      "id": "classic-percale-pillowcase-set-10",
      "title": "Classic Percale Pillowcase Set",
      "href": "https://www.brooklinen.com/products/classic-pillowcases?variant=41797068423258",
      "topBadge": "COOLING",
      "awardSeal": "/sites/brooklinen/awards/NYT-Wirecutter-ce571ee9.png",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$69",
      "salePrice": "$52",
      "discountBadge": "25% off",
      "reviewCount": "(5,889)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg",
      "defaultSwatchIndex": 5,
      "swatches": [
        {
          "label": "Solid White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Calm Waters in Tonal Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Tonal_Fresh_Moss-20413359.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Tandem Stripe in Coral",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Coral-62463c2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Coral",
          "color": "rgb(219, 145, 120)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Dandelions in Bitter Chocolate",
          "swatchImage": "/sites/brooklinen/swatches/Dandelions_in_Bitter_Chocolate-13951a6b.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Maple-b3360dcd.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Skyline Stripe in Flax",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Flax-3dd1ec94.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Skyline Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Frost-f6138230.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Skyline Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Mahogany-1011d2e3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Tandem Stripe in Spice",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Spice-5b75f02c.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        },
        {
          "label": "Tandem Stripe in Tree Top",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Tree_Top-fc34d8b4.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-feca8715.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-ee3fb3a1.jpg"
        }
      ]
    },
    {
      "id": "luxe-sateen-duvet-cover-11",
      "title": "Luxe Sateen Duvet Cover",
      "href": "https://www.brooklinen.com/products/luxe-duvet-cover?variant=43350465511514",
      "topBadge": "BEST SELLER",
      "awardSeal": "/sites/brooklinen/awards/2026_CONDE-NAST_ARCHITECTURAL-DIGEST_PENDING_LOG-59016ac9.png",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$179",
      "salePrice": "$134",
      "discountBadge": "25% off",
      "reviewCount": "(9,211)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg",
      "defaultSwatchIndex": 12,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Warm Terracotta",
          "color": "rgb(206, 115, 87)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Reversible Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Reversible_Maple-053e210b.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Pressed Poppies in Saffron",
          "swatchImage": "/sites/brooklinen/swatches/Pressed_Poppies_in_Saffron-ff86f9bc.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        },
        {
          "label": "Tandem Stripe in Night Sky",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Night_Sky-784b13a1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Abyss_DUV_1x_WOgrey_d93fa-20d9dc4f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_16b9a-b05d4237.jpg"
        }
      ]
    }
  ],
  "categories": [
    {
      "title": "All Sheets",
      "href": "https://www.brooklinen.com/collections/all-sheets",
      "image": "/sites/brooklinen/categories/BKL_26-08_HolidayCapsule_Look1_1x_8x9_WO-97bc62f7.jpg"
    },
    {
      "title": "All Bedding",
      "href": "https://www.brooklinen.com/pages/all-bed",
      "image": "/sites/brooklinen/categories/BKL_26-04_WaffleWorld_Look3_0268x_WO_8x9_ec20b38-cb861ff0.jpg"
    },
    {
      "title": "Bundle Savings",
      "href": "https://www.brooklinen.com/pages/all-bundles",
      "image": "/sites/brooklinen/categories/2-1-Visual-Category-Module-a0778b82.jpg",
      "badgeImage": "/sites/brooklinen/brand/badge-40-off.png"
    },
    {
      "title": "All Bath",
      "href": "https://www.brooklinen.com/pages/all-bath",
      "image": "/sites/brooklinen/categories/BKL_25-11_FebNewnessSP2_Shot8_1280x_8x9_Darkened-4f11108b.jpg"
    },
    {
      "title": "Duvet Inserts & Pillows",
      "href": "https://www.brooklinen.com/collections/duvet-inserts-pillows",
      "image": "/sites/brooklinen/categories/BKL_25111_UtilityEducation_Scene2Shot2_071x_8x9_-83ce0562.jpg"
    },
    {
      "title": "New Arrivals",
      "href": "https://www.brooklinen.com/collections/new-arrivals",
      "image": "/sites/brooklinen/categories/BKL_26-08_HolidayCapsule_Look2__510x_WO_8x9_3bd9-e3ecb8fe.jpg"
    }
  ],
  "giftGuide": [
    {
      "id": "super-plush-robe-0",
      "title": "Super-Plush Robe",
      "href": "https://www.brooklinen.com/products/super-plush-robe?variant=42833981931610",
      "topBadge": "BEST SELLER",
      "awardSeal": "/sites/brooklinen/awards/Oprahs-Favorite-Things_2025-1-84501373.png",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$139",
      "salePrice": "$104",
      "discountBadge": "25% off",
      "reviewCount": "(2,417)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_23-07_Bath_Robe_StripedMidnightNavy_Flat_1x_-6c74513b.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot8_1402x_8x9_Darkened-c156c57a.jpg",
      "defaultSwatchIndex": 5,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_23-09_Bath_Robe_White_Flat_1x_c16809ff-2055--e6471b05.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot2_167x_WO_PDP_a14fc8-0492118a.jpg"
        },
        {
          "label": "Pewter",
          "color": "rgb(191, 191, 191)",
          "mainImage": "/sites/brooklinen/products/BKL_23-09_Bath_Robe_Smoke_Flat_1x_ec9384cd-1640--77214455.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-07_RobeOnFigureFitGuide_SuperPlush_Solo_1-c4f7dbee.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_23-09_Bath_Robe_Graphite_Flat_1x_727f31e1-92-03219921.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_18-05_Bath_Robe_SP_Graohite_Folded_1x_WOgrey-0214341b.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bath_Robe_Storm_Flat_1x_WOgrey_355e570-8bd5e0ef.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-07_RobeOnFigureFitGuide_SuperPlush_Solo_1-58f995e8.jpg"
        },
        {
          "label": "Striped Frost",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Frost-96eb75c8.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bath_SP_Robe_StripedFrost_Flat_1_x_PDP-72aa1a3b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot8_1402x_8x9_Darkened-c156c57a.jpg"
        },
        {
          "label": "Striped Abyss",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Abyss_c372e6b7-08b6-419e-8e44-b5254e54dd-570549b1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-07_Bath_Robe_StripedMidnightNavy_Flat_1x_-6c74513b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot8_1402x_8x9_Darkened-c156c57a.jpg"
        },
        {
          "label": "Striped Botanical Green",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Botanical_Green-c3d532c9.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-07_Bath_Robe_StripedMidnightNavy_Flat_1x_-6c74513b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot8_1402x_8x9_Darkened-c156c57a.jpg"
        },
        {
          "label": "Striped Oak",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Oak-a147f902.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-07_Bath_Robe_StripedMidnightNavy_Flat_1x_-6c74513b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot8_1402x_8x9_Darkened-c156c57a.jpg"
        },
        {
          "label": "Striped Maple",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Maple-7cdbb256.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-07_Bath_Robe_StripedMidnightNavy_Flat_1x_-6c74513b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot8_1402x_8x9_Darkened-c156c57a.jpg"
        },
        {
          "label": "Striped Poppy",
          "swatchImage": "/sites/brooklinen/swatches/Poppy-00800e97.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-07_Bath_Robe_StripedMidnightNavy_Flat_1x_-6c74513b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot8_1402x_8x9_Darkened-c156c57a.jpg"
        },
        {
          "label": "Striped Menthe",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Menthe-9c92690e.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-07_Bath_Robe_StripedMidnightNavy_Flat_1x_-6c74513b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-11_FebNewnessSP2_Shot8_1402x_8x9_Darkened-c156c57a.jpg"
        }
      ]
    },
    {
      "id": "super-fluff-throw-blanket-1",
      "title": "Super Fluff Throw Blanket",
      "href": "https://www.brooklinen.com/products/super-fluff-throw-blanket?variant=44105230221402",
      "topBadge": "BEST SELLER",
      "promoEyebrow": "SELLING FAST!",
      "promoTone": "urgent",
      "originalPrice": "$129",
      "salePrice": "$97",
      "discountBadge": "25% off",
      "reviewCount": "(1)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cream_1x_PD-9702a301.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cream_1x_P-f0573ce8.jpg",
      "defaultSwatchIndex": 0,
      "swatches": [
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cream_1x_PD-9702a301.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cream_1x_P-f0573ce8.jpg"
        },
        {
          "label": "Night Sky",
          "color": "rgb(65, 72, 84)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Night-Sky_1-625f056d.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_NightSky_1-7bf77c9d.jpg"
        },
        {
          "label": "Cappuccino",
          "color": "rgb(155, 101, 56)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cappuccino_-01348b35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cappuccino-2d6a8a5c.jpg"
        },
        {
          "label": "Flax",
          "color": "rgb(225, 191, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Flax_1x_PDP-38f869b7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Flax_1x_PD-87035fb5.jpg"
        },
        {
          "label": "Wild Moss",
          "color": "rgb(98, 88, 39)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_WildMoss_1x-ff801647.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_WildMoss_1-c8f96311.jpg"
        },
        {
          "label": "Soft Fog",
          "color": "rgb(207, 203, 197)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_WildMoss_1x-ff801647.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_WildMoss_1-c8f96311.jpg"
        },
        {
          "label": "Tomato",
          "color": "rgb(235, 58, 43)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Throws_Super-Fluff_Cream_1x_PD-9702a301.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_TOB_ThrowBlanket_SuperFluff_Cream_1x_P-f0573ce8.jpg"
        }
      ]
    },
    {
      "id": "dreamweave-waffle-throw-blanket-2",
      "title": "Dreamweave Waffle Throw Blanket",
      "href": "https://www.brooklinen.com/products/dreamweave-waffle-throw-blanket?variant=67639447748698",
      "topBadge": "BEST SELLER",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$129",
      "salePrice": "$97",
      "discountBadge": "25% off",
      "reviewCount": "(58)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Throws_Waffle_RaspberryCheck_1-db354ccf.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look18_2860x_PDP_WO_14dfbd-0ba6b713.jpg",
      "defaultSwatchIndex": 8,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_24-04_Bedding_Waffle_White_Throws_1x_WOgrey_-99ec2a24.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_JulyMidAugCampaign_July_Look7_Shot1_94-77328d9b.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_24-04_Bedding_Waffle_FreshMoss_Throws_1x_WOg-b8d2f01f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_JulyMidAugCampaign_July_Look3_Shot1_17-d8af1eab.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_24-07_Bedding_Throws_Waffle_Abyss_1x_WOgrey_-c14405e6.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-08_Bedding_Blanket_Waffle_Abyss_1_0598x_P-86b1dea3.jpg"
        },
        {
          "label": "French Blue Multi",
          "swatchImage": "/sites/brooklinen/swatches/French_Blue_Multi-a3409c86.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_24-07_Bedding_Throws_Waffle_FrenchBlueMulti_-13c1b1e4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Throws_Waffle_FrenchBlueMulti_-9caea608.jpg"
        },
        {
          "label": "Forestwood Check",
          "swatchImage": "/sites/brooklinen/swatches/Forestwood_Check-ea120264.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-07_Bedding_Throws_Waffle_ForestwoodCheck_-ab991690.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-05_TOB_ThrowBlanket_DreamweaveWaffle_Fore-6cb47bfd.jpg"
        },
        {
          "label": "Sunflower Check",
          "swatchImage": "/sites/brooklinen/swatches/Sunflower_Check-db471bc3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-07_Bedding_Throws_Waffle_SunflowerCheck_1-363d818d.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-05_TOB_ThrowBlanket_DreamweaveWaffle_Sunf-ad7b167c.jpg"
        },
        {
          "label": "Bronze Check",
          "swatchImage": "/sites/brooklinen/swatches/Bronze_Check-c36a1b6e.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Throws_Waffle_RaspberryCheck_1-db354ccf.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look18_2860x_PDP_WO_14dfbd-0ba6b713.jpg"
        },
        {
          "label": "Night Sky Check",
          "swatchImage": "/sites/brooklinen/swatches/Night_Sky_Check-ea154ba8.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Throws_Waffle_RaspberryCheck_1-db354ccf.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look18_2860x_PDP_WO_14dfbd-0ba6b713.jpg"
        },
        {
          "label": "Raspberry Check",
          "swatchImage": "/sites/brooklinen/swatches/Rasberyy_Check-7c54a7a1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Throws_Waffle_RaspberryCheck_1-db354ccf.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look18_2860x_PDP_WO_14dfbd-0ba6b713.jpg"
        }
      ]
    },
    {
      "id": "dreamweave-waffle-robe-3",
      "title": "Dreamweave Waffle Robe",
      "href": "https://www.brooklinen.com/products/waffle-robe?variant=67631800516698",
      "topBadge": "BEST SELLER",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$139",
      "salePrice": "$104",
      "discountBadge": "25% off",
      "reviewCount": "(496)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_Robe_RaspberryCheck_Flat_1x_PDP_W-27a78b84.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look8_1636x_PDP_WO_6b6c2ce-6b9144bc.jpg",
      "defaultSwatchIndex": 8,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_24-01_Bath_Waffle_Robe_White_Flat_1x_WOgrey_-5986a3d4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-02_Spring2NewArrivals_Bed_Shot31_2155x_PD-f032daa5.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_24-04_Bath_Waffle_Pebble_Flatlay_1x_WOgrey_6-f92a4bca.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_JulyMidAugCampaign_July_LookCSS_Shot4_-ebfb2dc4.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_24-04_Bath_Waffle_Pebble_Flatlay_1x_WOgrey_6-f92a4bca.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_JulyMidAugCampaign_July_LookCSS_Shot4_-ebfb2dc4.jpg"
        },
        {
          "label": "Botanical Green",
          "color": "rgb(115, 129, 120)",
          "mainImage": "/sites/brooklinen/products/BKL_24-01_Bath_Waffle_Robe_Onyx_Flat_1x_WOgrey_6-fe4a54ef.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-02_Spring2NewArrivals_Bed_Shot31_2155x_PD-f0aacd22.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_24-01_Bath_Waffle_Robe_Onyx_Flat_1x_WOgrey_6-fe4a54ef.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-02_Spring2NewArrivals_Bed_Shot31_2155x_PD-f0aacd22.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-03_Bath_Waffle_Robe_Abyss_Flat_1x_WOgrey_-85352963.jpg",
          "hoverImage": "/sites/brooklinen/products/250724_BKL_ModelFitGuide_0335x_1x1_PDP_WO_600x-34442e5d.jpg"
        },
        {
          "label": "Plum",
          "color": "rgb(114, 63, 68)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_Robe_RaspberryCheck_Flat_1x_PDP_W-27a78b84.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look8_1636x_PDP_WO_6b6c2ce-6b9144bc.jpg"
        },
        {
          "label": "Bronze Check",
          "swatchImage": "/sites/brooklinen/swatches/Bronze_Check-c36a1b6e.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_Robe_RaspberryCheck_Flat_1x_PDP_W-27a78b84.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look8_1636x_PDP_WO_6b6c2ce-6b9144bc.jpg"
        },
        {
          "label": "Raspberry Check",
          "swatchImage": "/sites/brooklinen/swatches/Rasberyy_Check-7c54a7a1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_Robe_RaspberryCheck_Flat_1x_PDP_W-27a78b84.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look8_1636x_PDP_WO_6b6c2ce-6b9144bc.jpg"
        },
        {
          "label": "Azul Check",
          "swatchImage": "/sites/brooklinen/swatches/Azul_Check-48805f65.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_Robe_RaspberryCheck_Flat_1x_PDP_W-27a78b84.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_WaffleWorld_Look8_1636x_PDP_WO_6b6c2ce-6b9144bc.jpg"
        }
      ]
    },
    {
      "id": "mulberry-silk-bundle-4",
      "title": "Mulberry Silk Bundle",
      "href": "https://www.brooklinen.com/products/mulberry-silk-bundle?component0=41452541476954",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$104",
      "salePrice": "$73",
      "discountBadge": "30% off",
      "reviewCount": "(2,090)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_24-07_Silk_PCEyemaskBundle_2x_WOgrey_600x-2a822d34.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_24-07_Silk_Abyss_Detail_1x_WOgrey_600x-c8f47e45.jpg",
      "defaultSwatchIndex": 0,
      "swatches": [
        {
          "label": "Ivory",
          "color": "rgb(249, 249, 246)",
          "mainImage": "/sites/brooklinen/products/BKL_24-07_Silk_PCEyemaskBundle_2x_WOgrey_600x-2a822d34.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-07_Silk_Abyss_Detail_1x_WOgrey_600x-c8f47e45.jpg"
        },
        {
          "label": "Carbon",
          "color": "rgb(74, 73, 75)",
          "mainImage": "/sites/brooklinen/products/26-11_BFCM_Mulberry-Silk-Bundle_Carbon_PDP_WO_60-6d956d16.jpg",
          "hoverImage": "/sites/brooklinen/products/carbon-silk-pillowcase_lifestyle1_80e726a3-1ae2--be54ad0c.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_24-07_Silk_PCEyemaskBundle_2x_WOgrey_600x-2a822d34.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-07_Silk_Abyss_Detail_1x_WOgrey_600x-c8f47e45.jpg"
        },
        {
          "label": "Driftwood",
          "color": "rgb(192, 174, 162)",
          "mainImage": "/sites/brooklinen/products/BKL_24-07_Silk_PCEyemaskBundle_2Ax_WOgrey_600x-8780a11a.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-07_Silk_Driftwood_Detail_1x_WOgrey_600x-f88c9c43.jpg"
        },
        {
          "label": "Celestial",
          "swatchImage": "/sites/brooklinen/swatches/swatch-v3-celestial_dcedc0bd-3936-4570-83ff-fb47-970cecbd.png",
          "mainImage": "/sites/brooklinen/products/26-11_BFCM_Mulberry-Silk-Bundle_Celestial_PDP_WO-8ad7cffa.jpg",
          "hoverImage": "/sites/brooklinen/products/5_BKL_20_Silk_Detail_187fc0c9-2c0c-4035-a511-3e4-17b27e58.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Silk_TandemStripeinStorm_Abyss_PCEyema-87a14f9a.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Silk_TandemStripeinStorm_Detail_1x_WOg-506bbf30.jpg"
        },
        {
          "label": "Skyline Stripe in Flax",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Flax-3dd1ec94.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_24-07_Silk_PCEyemaskBundle_2x_WOgrey_600x-2a822d34.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-07_Silk_Abyss_Detail_1x_WOgrey_600x-c8f47e45.jpg"
        },
        {
          "label": "Skyline Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Frost-f6138230.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_24-07_Silk_PCEyemaskBundle_2x_WOgrey_600x-2a822d34.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-07_Silk_Abyss_Detail_1x_WOgrey_600x-c8f47e45.jpg"
        },
        {
          "label": "Skyline Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Mahogany-1011d2e3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_24-07_Silk_PCEyemaskBundle_2x_WOgrey_600x-2a822d34.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-07_Silk_Abyss_Detail_1x_WOgrey_600x-c8f47e45.jpg"
        },
        {
          "label": "Tandem Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Mahogany-8bb8b835.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_24-07_Silk_PCEyemaskBundle_2x_WOgrey_600x-2a822d34.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-07_Silk_Abyss_Detail_1x_WOgrey_600x-c8f47e45.jpg"
        }
      ]
    },
    {
      "id": "super-plush-complete-get-ready-bundle-5",
      "title": "Super-Plush Complete Get Ready Bundle",
      "href": "https://www.brooklinen.com/products/super-plush-complete-get-ready-bundle?component0=45575650115674",
      "topBadge": "NEW",
      "promoEyebrow": "SELLING FAST!",
      "promoTone": "urgent",
      "originalPrice": "$257",
      "salePrice": "$179",
      "discountBadge": "30% off",
      "reviewCount": "(2,417)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-08_Super-Plush-Complete-Get-Ready-Bundle_-ed851b24.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot6_0859x_PDP_WO_834e57-23373a44.jpg",
      "defaultSwatchIndex": 0,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Super-Plush-Complete-Get-Ready-Bundle_-ed851b24.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot6_0859x_PDP_WO_834e57-23373a44.jpg"
        },
        {
          "label": "Pewter",
          "color": "rgb(191, 191, 191)",
          "mainImage": "/sites/brooklinen/products/26-11_BFCM_Super-Plush-Complete-Get-Ready-With-M-ea51f5a9.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-09_Bath_Robe_Smoke_Flat_1x_e02bd02e-d66c--6afa345f.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/26-11_BFCM_Super-Plush-Complete-Get-Ready-With-M-96b9e9cc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-09_Bath_Robe_Graphite_Flat_1x_200e95e9-09-7da16bf4.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/26-11_BFCM_Super-Plush-Complete-Get-Ready-With-M-215a4288.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-06_Bath_Robe_Storm_Flat_1x_WOgrey_a7bc3c9-9853526f.jpg"
        },
        {
          "label": "Striped Abyss",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Abyss_c372e6b7-08b6-419e-8e44-b5254e54dd-570549b1.jpg",
          "mainImage": "/sites/brooklinen/products/26-11_BFCM_Super-Plush-Complete-Get-Ready-With-M-770afba4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot15_2205x_PDP_WO_4a555-3c958000.jpg"
        },
        {
          "label": "Striped Botanical Green",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Botanical_Green-c3d532c9.jpg",
          "mainImage": "/sites/brooklinen/products/26-11_BFCM_Super-Plush-Complete-Get-Ready-With-M-770afba4.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot15_2205x_PDP_WO_4a555-3c958000.jpg"
        },
        {
          "label": "Striped Frost",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Frost-96eb75c8.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Super-Plush-Complete-Get-Ready-Bundle_-ed851b24.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot6_0859x_PDP_WO_834e57-23373a44.jpg"
        },
        {
          "label": "Striped Lotus",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Lotus-fa7db741.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Super-Plush-Complete-Get-Ready-Bundle_-ed851b24.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot6_0859x_PDP_WO_834e57-23373a44.jpg"
        },
        {
          "label": "Striped Maple",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Maple-7cdbb256.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Super-Plush-Complete-Get-Ready-Bundle_-ed851b24.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot6_0859x_PDP_WO_834e57-23373a44.jpg"
        },
        {
          "label": "Striped Oak",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Oak-a147f902.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Super-Plush-Complete-Get-Ready-Bundle_-ed851b24.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot6_0859x_PDP_WO_834e57-23373a44.jpg"
        },
        {
          "label": "Striped Menthe",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Menthe-9c92690e.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Super-Plush-Complete-Get-Ready-Bundle_-ed851b24.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot6_0859x_PDP_WO_834e57-23373a44.jpg"
        },
        {
          "label": "Striped Poppy",
          "swatchImage": "/sites/brooklinen/swatches/Poppy-00800e97.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Super-Plush-Complete-Get-Ready-Bundle_-ed851b24.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot6_0859x_PDP_WO_834e57-23373a44.jpg"
        }
      ]
    },
    {
      "id": "classic-percale-hardcore-sheet-bundle-6",
      "title": "Classic Percale Hardcore Sheet Bundle",
      "href": "https://www.brooklinen.com/products/classic-hardcore-sheet-bundle?variant=41405021880410",
      "topBadge": "COOLING",
      "awardSeal": "/sites/brooklinen/awards/NYT-Wirecutter-ad235a05.png",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$387",
      "salePrice": "$250",
      "discountBadge": "35% off",
      "reviewCount": "(18,752)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg",
      "defaultSwatchIndex": 0,
      "swatches": [
        {
          "label": "Solid White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Tandem Stripe Bundle in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_Bundle_in_Pebble_Tandem_Stripe_in_-76aa4b77.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Calm Waters in Tonal Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Tonal_Fresh_Moss-20413359.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Tandem Stripe Bundle in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_Bundle_in_Fresh_Moss_Tandem_Stripe-c4328c77.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Tandem Stripe Bundle in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_Bundle_in_Storm-dc41d5f8.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Coral",
          "color": "rgb(219, 145, 120)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Tandem Stripe in Coral",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Coral-62463c2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Maple-b3360dcd.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Bitter Chocolate",
          "color": "rgb(85, 63, 58)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Dandelions Bundle in Bitter Chocolate",
          "swatchImage": "/sites/brooklinen/swatches/Classic_-_Dandelions_Bundle_in_Bitter_Chocolate-881044ab.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Skyline Stripe Bundle in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Classic_-_Skyline_Stripe_Bundle_in_Mahogany-0828c002.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Skyline Stripe in Flax",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Flax-3dd1ec94.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Skyline Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Frost-f6138230.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Skyline Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Mahogany-1011d2e3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Tandem Stripe in Spice",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Spice-5b75f02c.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Tandem Stripe in Tree Top",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Tree_Top-fc34d8b4.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        }
      ]
    },
    {
      "id": "super-plush-slippers-7",
      "title": "Super-Plush Slippers",
      "href": "https://www.brooklinen.com/products/super-plush-slippers?variant=44105922150490",
      "topBadge": "NEW",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$69",
      "salePrice": "$52",
      "discountBadge": "25% off",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-8eb1d11a.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-016c34ee.jpg",
      "defaultSwatchIndex": 0,
      "swatches": [
        {
          "label": "Striped Botanical Green",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Botanical_Green-c3d532c9.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-8eb1d11a.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-016c34ee.jpg"
        },
        {
          "label": "Striped Frost",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Frost-96eb75c8.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-8eb1d11a.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-016c34ee.jpg"
        },
        {
          "label": "Striped Abyss",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Abyss_c372e6b7-08b6-419e-8e44-b5254e54dd-570549b1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-8eb1d11a.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-016c34ee.jpg"
        },
        {
          "label": "Striped Menthe",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Menthe-9c92690e.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-8eb1d11a.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-016c34ee.jpg"
        },
        {
          "label": "Striped Poppy",
          "swatchImage": "/sites/brooklinen/swatches/Poppy-00800e97.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-8eb1d11a.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_Bath_Waffle_Slippers_StripedBotanicalG-016c34ee.jpg"
        }
      ]
    },
    {
      "id": "super-plush-pouch-8",
      "title": "Super-Plush Pouch",
      "href": "https://www.brooklinen.com/products/super-plush-pouch?variant=44106265788506",
      "topBadge": "NEW",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$49",
      "salePrice": "$37",
      "discountBadge": "25% off",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_SP_Pouch_StripedPoppy_StraightOn_-bf275d87.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-08_Bath_SP_Pouch_StripedPoppy_Overhead_1x-c9d21a61.jpg",
      "defaultSwatchIndex": 3,
      "swatches": [
        {
          "label": "Striped Abyss",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Abyss_c372e6b7-08b6-419e-8e44-b5254e54dd-570549b1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_SP_Pouch_StripedPoppy_StraightOn_-bf275d87.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_Bath_SP_Pouch_StripedPoppy_Overhead_1x-c9d21a61.jpg"
        },
        {
          "label": "Striped Botanical Green",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Botanical_Green-c3d532c9.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_SP_Pouch_StripedPoppy_StraightOn_-bf275d87.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_Bath_SP_Pouch_StripedPoppy_Overhead_1x-c9d21a61.jpg"
        },
        {
          "label": "Striped Menthe",
          "swatchImage": "/sites/brooklinen/swatches/Striped_Menthe-9c92690e.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_SP_Pouch_StripedPoppy_StraightOn_-bf275d87.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_Bath_SP_Pouch_StripedPoppy_Overhead_1x-c9d21a61.jpg"
        },
        {
          "label": "Striped Poppy",
          "swatchImage": "/sites/brooklinen/swatches/Poppy-00800e97.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bath_SP_Pouch_StripedPoppy_StraightOn_-bf275d87.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-08_Bath_SP_Pouch_StripedPoppy_Overhead_1x-c9d21a61.jpg"
        }
      ]
    },
    {
      "id": "heritage-wool-bed-blanket-9",
      "title": "Heritage Wool Bed Blanket",
      "href": "https://www.brooklinen.com/products/heritage-wool-bed-blanket?variant=67631794782298",
      "topBadge": "NEW",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$299",
      "salePrice": "$224",
      "discountBadge": "25% off",
      "reviewCount": "(1)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_HeritageWool_NightSky_-0a28baec.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayOverheads_Look1_V1x_PDP_WO_6fab-8195721f.jpg",
      "defaultSwatchIndex": 0,
      "swatches": [
        {
          "label": "Algae",
          "color": "rgb(142, 157, 37)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_HeritageWool_NightSky_-0a28baec.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayOverheads_Look1_V1x_PDP_WO_6fab-8195721f.jpg"
        },
        {
          "label": "Warm Terracotta",
          "color": "rgb(206, 115, 87)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_HeritageWool_NightSky_-0a28baec.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayOverheads_Look1_V1x_PDP_WO_6fab-8195721f.jpg"
        },
        {
          "label": "Night Sky Plaid",
          "swatchImage": "/sites/brooklinen/swatches/Night_Sky_Plaid-cd4cd716.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Bedding_Blanket_HeritageWool_NightSky_-0a28baec.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayOverheads_Look1_V1x_PDP_WO_6fab-8195721f.jpg"
        }
      ]
    },
    {
      "id": "mulberry-silk-eyemask-10",
      "title": "Mulberry Silk Eyemask",
      "href": "https://www.brooklinen.com/products/mulberry-silk-eyemask?variant=67631795961946",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$35",
      "salePrice": "$26",
      "discountBadge": "25% off",
      "reviewCount": "(876)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg",
      "defaultSwatchIndex": 6,
      "swatches": [
        {
          "label": "Ivory",
          "color": "rgb(249, 249, 246)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg"
        },
        {
          "label": "Carbon",
          "color": "rgb(74, 73, 75)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg"
        },
        {
          "label": "Driftwood",
          "color": "rgb(192, 174, 162)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg"
        },
        {
          "label": "Celestial",
          "swatchImage": "/sites/brooklinen/swatches/swatch-v3-celestial_dcedc0bd-3936-4570-83ff-fb47-970cecbd.png",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg"
        },
        {
          "label": "Skyline Stripe in Flax",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Flax-3dd1ec94.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg"
        },
        {
          "label": "Skyline Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Frost-f6138230.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg"
        },
        {
          "label": "Skyline Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Mahogany-1011d2e3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg"
        },
        {
          "label": "Tandem Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Mahogany-8bb8b835.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg"
        },
        {
          "label": "Blush",
          "color": "rgb(241, 221, 217)",
          "mainImage": "/sites/brooklinen/products/BKL_26-08_Silk_SkylineStripeInFlax_Eyemask_1x_PD-e4e579f7.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-09_HolidayIcons_Shot14_2161x_PDP_WO_600x-f23f2276.jpg"
        }
      ]
    }
  ],
  "collection": [
    {
      "id": "luxe-sateen-core-sheet-set-0",
      "title": "Luxe Sateen Core Sheet Set",
      "href": "https://www.brooklinen.com/products/luxe-core-sheet-set?variant=43857956601946",
      "topBadge": "BEST SELLER",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$169",
      "salePrice": "$127",
      "discountBadge": "25% off",
      "reviewCount": "(24,707)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg",
      "defaultSwatchIndex": 19,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Luxe_White_CSS_1_x_PDP_WO_9a37-b511e62e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_73041cde-56e4--5436cc65.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Cloud_COR_1x_WOgrey_76b05-2b0be5ea.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Cloud_1x_PDP_WO_b6d1c-d0f8879f.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Luxe_Cream_CSS_1_x_PDP_WO_46c7-1e2a743f.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot6_1161xAlt_PDP_WO_bf9ae09d-57-7bd07803.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Luxe_Pebble_CSS_1_x_PDP_WO_379-03994e10.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Pebble_1x_PDP_WO_8463-ffc119b5.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Luxe_Pebble_CSS_1_x_PDP_WO_379-03994e10.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Pebble_1x_PDP_WO_8463-ffc119b5.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Oak_COR_1x_WOgrey_0443c5f-01198db8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Oak_1x_PDP_WO_344acb1-e3cbf424.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Blooming Fields in Aegean",
          "swatchImage": "/sites/brooklinen/swatches/Blooming_Fields_in_Aegean-2abb72a3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Blooming Fields in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Blooming_Fields_in_Mahogany-8782ca52.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Maple-b3360dcd.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Warm Terracotta",
          "color": "rgb(206, 115, 87)",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        },
        {
          "label": "Tandem Stripe in Night Sky",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Night_Sky-784b13a1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-06_Bedding_Luxe_WarmTerracotta_COR_1x_PDP-fbd098fb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_WarmTerracotta_1x_PDP_WO_-ac494762.jpg"
        }
      ]
    },
    {
      "id": "classic-percale-core-sheet-set-1",
      "title": "Classic Percale Core Sheet Set",
      "href": "https://www.brooklinen.com/products/classic-core-sheet-set?variant=41794111832154",
      "topBadge": "BEST SELLER",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$159",
      "salePrice": "$119",
      "discountBadge": "25% off",
      "reviewCount": "(18,752)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg",
      "defaultSwatchIndex": 8,
      "swatches": [
        {
          "label": "Solid White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_White_CSS_1_x_PDP_WO_6-1f4b2f4c.jpg",
          "hoverImage": "/sites/brooklinen/products/feed-test_600x-df9613c4.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_Cream_CSS_1_x_PDP_WO_6-c3b1e52b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Luxe_Cream_Straight_2x_PDP_WO_-93a35cc9.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_Pebble_CSS_1_x_PDP_WO_-ae7170a6.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-cedab600.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInPebble_C-630d5ae5.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinPebble_O-c0e3586a.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_CSS_1_x_PDP_-bd5f0e21.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-298b7193.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInFreshMos-179da78e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinFreshMos-d22626aa.jpg"
        },
        {
          "label": "Calm Waters in Tonal Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Tonal_Fresh_Moss-20413359.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Coral",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Coral-62463c2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Bitter Chocolate",
          "color": "rgb(85, 63, 58)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Coral",
          "color": "rgb(219, 145, 120)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Etched Dot in Bitter Chocolate",
          "swatchImage": "/sites/brooklinen/swatches/Etched_Dot_in_Bitter_Chocolate-02bc529c.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Maple-b3360dcd.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Skyline Stripe in Flax",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Flax-3dd1ec94.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Skyline Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Frost-f6138230.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Skyline Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Mahogany-1011d2e3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Spice",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Spice-5b75f02c.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        },
        {
          "label": "Tandem Stripe in Tree Top",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Tree_Top-fc34d8b4.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinStorm_Ov-41d2a95e.jpg"
        }
      ]
    },
    {
      "id": "luxe-sateen-hardcore-sheet-bundle-2",
      "title": "Luxe Sateen Hardcore Sheet Bundle",
      "href": "https://www.brooklinen.com/products/luxe-hardcore-sheet-bundle?variant=43380356350042",
      "topBadge": "SOFTEST",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$407",
      "salePrice": "$263",
      "discountBadge": "35% off",
      "reviewCount": "(24,707)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg",
      "defaultSwatchIndex": 13,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Luxe_White_HCB_1x_WOgrey_cd4e3-2b4879fa.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_5a44f3b8-ff93--632efb04.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/classic_cream_hardcore-bundle_silo_3be12729-7c61-2b8268bb.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot6_1161xAlt_PDP_WO_600x-35a7a169.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_HCB_1x_Lu-bc6ad822.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Pebble_1x_PDP_WO_d573-3e2d47f8.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Luxe_TandemStripeInPebble_HCB_-0c0acbaa.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_TandemStripeInPebble_-4f78d55d.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Oak_HCB_1x_WOgrey_a9feaa6-b385a152.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Oak_1x_PDP_WO_b356cd4-3b5b222f.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Cloud_HCB_1x_WOgrey_9f50c-bb9bbe24.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Cloud_1x_PDP_WO_d99ba-f8f35691.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Warm Terracotta",
          "color": "rgb(206, 115, 87)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Tandem Stripe Bundle in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Luxe_-_Tandem_Stripe_Bundle_in_Maple-a382fa99.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Reversible Tandem Stripe Bundle in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Reversible_Maple-053e210b.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        },
        {
          "label": "Tandem Stripe in Night Sky",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Night_Sky-784b13a1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Luxe_Aegean_HCB_1x_PDP_WOgrey_-9b99ed35.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Aegean_1x_PDP_WO_73fc-6b6a68a6.jpg"
        }
      ]
    },
    {
      "id": "classic-percale-hardcore-sheet-bundle-3",
      "title": "Classic Percale Hardcore Sheet Bundle",
      "href": "https://www.brooklinen.com/products/classic-hardcore-sheet-bundle?variant=43658548019290",
      "topBadge": "COOLING",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$387",
      "salePrice": "$250",
      "discountBadge": "35% off",
      "reviewCount": "(18,752)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
      "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg",
      "defaultSwatchIndex": 18,
      "swatches": [
        {
          "label": "Solid White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-05_Bedding_Classic_White_HCB_1x_WOgrey_60-9ad61441.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look1_Shot1_1_00-596b4e0d.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/classic_cream_hardcore-bundle_silo_600x-4866cc12.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look4_Shot1_1_01-63b1a336.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_24-07_Bedding_Classic_Cloud_HCB_1x_WOgrey_60-8ba6355b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-08_Bedding_Classic_Cloud_Overhead_1_0692x-55dbdde8.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Classic_Frost_HCB_1x_WOgrey_35-a04926d3.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Classic_Frost_DUV_Detail_1x_WO-5b05a406.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-12_Bedding_Classic_TandemStripeInFrost_HC-0ec01ca6.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-10_JanBBHCFlannel_Shot5_1194x_PDP_WO_2832-441f95fc.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_HCB_1x_WO-fe20642c.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Straight_2x_P-2b668203.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Tandem Stripe Bundle in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_Bundle_in_Pebble_Tandem_Stripe_in_-76aa4b77.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Calm Waters in Tonal Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Tonal_Fresh_Moss-20413359.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Tandem Stripe Bundle in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_Bundle_in_Fresh_Moss_Tandem_Stripe-c4328c77.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Tandem Stripe Bundle in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_Bundle_in_Storm-dc41d5f8.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Coral",
          "color": "rgb(219, 145, 120)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Tandem Stripe in Coral",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Coral-62463c2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Maple-b3360dcd.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Bitter Chocolate",
          "color": "rgb(85, 63, 58)",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Dandelions Bundle in Bitter Chocolate",
          "swatchImage": "/sites/brooklinen/swatches/Classic_-_Dandelions_Bundle_in_Bitter_Chocolate-881044ab.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Skyline Stripe Bundle in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Classic_-_Skyline_Stripe_Bundle_in_Mahogany-0828c002.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Skyline Stripe in Flax",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Flax-3dd1ec94.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Skyline Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Frost-f6138230.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Skyline Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Mahogany-1011d2e3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Tandem Stripe in Spice",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Spice-5b75f02c.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        },
        {
          "label": "Tandem Stripe in Tree Top",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Tree_Top-fc34d8b4.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_26-05_Bedding_Classic_TandemStripeInMaple_HC-b40a4c31.jpg",
          "hoverImage": "/sites/brooklinen/products/260623_BKL_Q3_08_-_August_Newness7012x_PDP_WO_60-9d17c54e.jpg"
        }
      ]
    },
    {
      "id": "classic-percale-duvet-cover-4",
      "title": "Classic Percale Duvet Cover",
      "href": "https://www.brooklinen.com/products/classic-duvet-cover?variant=40809684172890",
      "topBadge": "BEST SELLER",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$169",
      "salePrice": "$127",
      "discountBadge": "25% off",
      "reviewCount": "(7,254)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg",
      "defaultSwatchIndex": 0,
      "swatches": [
        {
          "label": "Solid White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/classic_cream_duvet-cover_silo_600x-4d8d72e1.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_21-02_Q1Evergreen_Lifestyle_Look4_Shot1_1_01-a548a24d.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinPebble_D-7296ca15.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Classic_TandemStripeinPebble_O-7f6ac10a.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_23-05_Bedding_Classic_FreshMoss_DUV_1x_WOgre-23c8c685.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-6de4f8d8.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-05_Bedding_Classic_FreshMoss_DUV_1x_WOgre-23c8c685.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-6de4f8d8.jpg"
        },
        {
          "label": "Calm Waters in Tonal Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Tonal_Fresh_Moss-20413359.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Tandem Stripe in Coral",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Coral-62463c2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Bitter Chocolate",
          "color": "rgb(85, 63, 58)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Coral",
          "color": "rgb(219, 145, 120)",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Dandelions in Bitter Chocolate",
          "swatchImage": "/sites/brooklinen/swatches/Dandelions_in_Bitter_Chocolate-13951a6b.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Maple-b3360dcd.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Skyline Stripe in Flax",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Flax-3dd1ec94.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Skyline Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Frost-f6138230.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Skyline Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Mahogany-1011d2e3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Tandem Stripe in Spice",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Spice-5b75f02c.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        },
        {
          "label": "Tandem Stripe in Tree Top",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Tree_Top-fc34d8b4.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_21-11_Bedding_ClassicLuxe_SoftGrey_DUV_1x_WO-ea1f0cf8.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_WarmGrey_Overhead_2x_P-dba5ebf5.jpg"
        }
      ]
    },
    {
      "id": "luxe-sateen-duvet-set-5",
      "title": "Luxe Sateen Duvet Set",
      "href": "https://www.brooklinen.com/products/luxe-duvet-set?variant=43380382564442",
      "topBadge": "SOFTEST",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$238",
      "salePrice": "$166",
      "discountBadge": "30% off",
      "reviewCount": "(9,211)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg",
      "defaultSwatchIndex": 9,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_23-06_Bedding_ClassicLuxe_White_PCDUVSet_1x_-88b06a34.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_634e21d2-8e86--a4a8e179.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_23-06_Bedding_ClassicLuxe_Cream_PCDUVSet_1x_-fbb2e976.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot6_1161xAlt_PDP_WO_062425be-17-3197a4a9.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_24-05_Bedding_Luxe_Pebble_PCDUVSet_1x_WOgrey-c569786a.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Pebble_1x_PDP_WO_1910-828dbaa3.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Luxe_TandemStripeInPebble_PCDU-d8116e64.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-05_Bedding_CuratedBundle_ClassicDreamweav-1d93fcae.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-01_Bedding_Luxe_TandemStripeInPebble_PCDU-d8116e64.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-05_Bedding_CuratedBundle_ClassicDreamweav-1d93fcae.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Cloud_PCDUVSet_1x_WOgrey_-95d51c3b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Cloud_1x_PDP_WO_8870b-d335cb52.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Warm Terracotta",
          "color": "rgb(206, 115, 87)",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Reversible Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Reversible_Maple-053e210b.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Tandem Stripe in Night Sky",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Night_Sky-784b13a1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        },
        {
          "label": "Pressed Poppies in Saffron",
          "swatchImage": "/sites/brooklinen/swatches/Pressed_Poppies_in_Saffron-ff86f9bc.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWatersinFrost_PCDUVSe-a8d49b7b.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_25-08_Bedding_Luxe_CalmWateresFrost_1669x_PD-90a5c9b4.jpg"
        }
      ]
    },
    {
      "id": "luxe-sateen-no-flat-sheet-set-bundle-6",
      "title": "Luxe Sateen No Flat Sheet Set Bundle",
      "href": "https://www.brooklinen.com/products/luxe-no-flat-sheet-set-bundle?variant=43380368408666",
      "topBadge": "SOFTEST",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$138",
      "salePrice": "$93",
      "discountBadge": "32% off",
      "reviewCount": "(2,567)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg",
      "defaultSwatchIndex": 6,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-07_Bedding_Luxe_Storm_NFSS_2_x_PDP_WO_f4a-40964548.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot2_163x_PDP_WO_4e24068f-2278-4-acd6886e.jpg"
        }
      ]
    },
    {
      "id": "classic-percale-no-flat-sheet-set-bundle-7",
      "title": "Classic Percale No Flat Sheet Set Bundle",
      "href": "https://www.brooklinen.com/products/classic-no-flat-sheet-set-bundle?variant=42806594142298",
      "topBadge": "COOLING",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$128",
      "salePrice": "$89",
      "discountBadge": "30% off",
      "reviewCount": "(2,614)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg",
      "defaultSwatchIndex": 4,
      "swatches": [
        {
          "label": "Solid White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_FreshMoss_NFSS_2_x_PDP-cda9b7ff.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_23-11_Bedding_Classic_FreshMoss_Overhead_2x_-bb5e61d4.jpg"
        }
      ]
    },
    {
      "id": "classic-percale-dreamweave-starter-bundle-8",
      "title": "Classic Percale Dreamweave Starter Bundle",
      "href": "https://www.brooklinen.com/products/classic-dreamweave-starter-bundle?component0=44898411577434",
      "topBadge": "COOLING",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$358",
      "salePrice": "$250",
      "discountBadge": "30% off",
      "reviewCount": "(18,752)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg",
      "defaultSwatchIndex": 0,
      "swatches": [
        {
          "label": "Solid White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Window Pane",
          "swatchImage": "/sites/brooklinen/swatches/swatch-v3-window-pane_711478ec-90eb-4d78-bb73-48-bfcddbaa.png",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Calm Waters in Tonal Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Tonal_Fresh_Moss-20413359.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Bitter Chocolate",
          "color": "rgb(85, 63, 58)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Coral",
          "color": "rgb(219, 145, 120)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Etched Dot in Bitter Chocolate",
          "swatchImage": "/sites/brooklinen/swatches/Etched_Dot_in_Bitter_Chocolate-02bc529c.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Maple-b3360dcd.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Skyline Stripe in Flax",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Flax-3dd1ec94.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Skyline Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Frost-f6138230.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Skyline Stripe Bundle in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Classic_-_Horizon_Stripe_Bundle_in_Flax-c86b7a7b.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Skyline Stripe in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Skyline_Stripe_in_Mahogany-1011d2e3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Tandem Stripe in Spice",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Spice-5b75f02c.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        },
        {
          "label": "Tandem Stripe in Tree Top",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Tree_Top-fc34d8b4.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_ClassicDreamweav-c4416365.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-12_Bedding_Classic_White_Overhead_1_0515x-097e2943.jpg"
        }
      ]
    },
    {
      "id": "luxe-sateen-dreamweave-starter-bundle-9",
      "title": "Luxe Sateen Dreamweave Starter Bundle",
      "href": "https://www.brooklinen.com/products/luxe-dreamweave-starter-bundle?component0=43393706229850",
      "topBadge": "SOFTEST",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$368",
      "salePrice": "$257",
      "discountBadge": "30% off",
      "reviewCount": "(24,707)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg",
      "defaultSwatchIndex": 0,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Oyster in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/OysterInPebble_8e2b36ae-5efa-4a39-ae2c-2d8e777dd-0e83a4e3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Blooming Fields in Aegean",
          "swatchImage": "/sites/brooklinen/swatches/Blooming_Fields_in_Aegean-2abb72a3.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Blooming Fields in Mahogany",
          "swatchImage": "/sites/brooklinen/swatches/Blooming_Fields_in_Mahogany-8782ca52.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Tandem Stripe in Maple",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Maple-b3360dcd.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Warm Terracotta",
          "color": "rgb(206, 115, 87)",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        },
        {
          "label": "Tandem Stripe in Night Sky",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Night_Sky-784b13a1.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_25-04_Bedding_CuratedBundle_LuxeDreamweave_S-1ec6027e.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-04_Luxe_Shot9_1519x_PDP_WO_e1e0a872-c498--44dda763.jpg"
        }
      ]
    },
    {
      "id": "luxe-sateen-bedding-move-in-bundle-10",
      "title": "Luxe Sateen Bedding Move-In Bundle",
      "href": "https://www.brooklinen.com/products/luxe-move-in-bundle?component0=43380364738650",
      "topBadge": "SOFTEST",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$694",
      "salePrice": "$484",
      "discountBadge": "30% off",
      "reviewCount": "(24,707)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg",
      "defaultSwatchIndex": 11,
      "swatches": [
        {
          "label": "White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Calm Waters in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Calm_Waters_in_Frost-1ead851f.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Abyss",
          "color": "rgb(56, 68, 90)",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        },
        {
          "label": "Tandem Stripe in Frost",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Frost_2d740528-357d-49b6-9b86-8-834c07ff.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_23-10_Bedding_Luxe_Abyss_MIB_1x_WOgrey_9dfd7-87aa39dc.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_26-03_Bedding_Luxe_2-0_Abyss_1x_PDP_WO_a7ce7-dbb41a42.jpg"
        }
      ]
    },
    {
      "id": "classic-percale-bedding-move-in-bundle-11",
      "title": "Classic Percale Bedding Move-In Bundle",
      "href": "https://www.brooklinen.com/products/classic-move-in-bundle?component0=41318328664154",
      "topBadge": "COOLING",
      "promoEyebrow": "BLACK FRIDAY SALE",
      "promoTone": "sale",
      "originalPrice": "$674",
      "salePrice": "$470",
      "discountBadge": "30% off",
      "reviewCount": "(18,752)",
      "rating": 4.8,
      "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
      "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg",
      "defaultSwatchIndex": 7,
      "swatches": [
        {
          "label": "Solid White",
          "color": "rgb(255, 255, 255)",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Cream",
          "color": "rgb(252, 250, 243)",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Pebble",
          "color": "rgb(212, 206, 194)",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Tandem Stripe in Pebble",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Pebble-a8280b35.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Fresh Moss",
          "color": "rgb(127, 127, 89)",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Tandem Stripe in Fresh Moss",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Fresh_Moss-1109bc2a.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Cloud",
          "color": "rgb(239, 239, 237)",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Storm",
          "color": "rgb(142, 164, 182)",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Tandem Stripe in Storm",
          "swatchImage": "/sites/brooklinen/swatches/Tandem_Stripe_in_Storm-2c1fc1f6.jpg",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Slate",
          "color": "rgb(70, 69, 74)",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Aegean",
          "color": "rgb(117, 131, 132)",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Oak",
          "color": "rgb(168, 152, 141)",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        },
        {
          "label": "Frost",
          "color": "rgb(213, 218, 222)",
          "mainImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_MIB_1x_WOgrey_bb-6bb6df97.jpg",
          "hoverImage": "/sites/brooklinen/products/BKL_24-06_Bedding_Classic_Storm_Overhead_1x_PDP_-f3979594.jpg"
        }
      ]
    }
  ],
  "trending": [
    {
      "title": "The Cozy Shop",
      "href": "https://www.brooklinen.com/pages/cozy-shop",
      "image": "/sites/brooklinen/trending/BKL_26-09_HolidayOverheads_Look4_165x_WO_8x9_f38-24440483.jpg"
    },
    {
      "title": "Waffle World",
      "href": "https://www.brooklinen.com/collections/dreamweave-waffle",
      "image": "/sites/brooklinen/trending/BKL_26-04_WaffleWorld_Look18_2860x_800x900_WO_46-767127bb.jpg"
    },
    {
      "title": "Hosting Essentials",
      "href": "https://www.brooklinen.com/collections/hosting-essentials",
      "image": "/sites/brooklinen/trending/BKL_26-09_HolidayOverheads_Look2_V1x_488x549_WO_-00056bac.jpg"
    },
    {
      "title": "Bedding Bundles",
      "href": "https://www.brooklinen.com/collections/sheet-bundles",
      "image": "/sites/brooklinen/trending/Bedding_Bundles_8x9_22c62d8b-63e5-45ff-a9cd-9099-6967cbda.jpg"
    }
  ],
  "valueProps": [
    {
      "title": "PREMIUM MATERIALS & EXCLUSIVE STYLES",
      "body": "Only the best—that’s what you deserve."
    },
    {
      "title": "365-DAY HAPPINESS GUARANTEE",
      "body": "It’ll be love at first sleep (or bath)."
    },
    {
      "title": "FAST, FREE SHIPPING",
      "body": "We’re New Yorkers, we move quick.",
      "linkLabel": "Exclusions Apply *",
      "linkHref": "https://www.brooklinen.com/pages/faq"
    }
  ],
  "reviews": [
    {
      "title": "Like Sleeping On A Cloud",
      "quote": "“Literally the best sleep I've gotten in ages. I never want to get out of bed...”",
      "author": "Sarah T."
    },
    {
      "title": "Can't Stop Talking About Them",
      "quote": "“Better than any fine hotel towels I've ever used. I'm so happy with this purchase!”",
      "author": "Linda B."
    },
    {
      "title": "Now I Get It",
      "quote": "“I didn't understand the value of good sheets until now. I'm obsessed.”",
      "author": "James A."
    }
  ],
  "pressLogos": [
    {
      "name": "Wirecutter",
      "image": "/sites/brooklinen/press/logo-wirecutter-c373bc98.png",
      "width": 233,
      "height": 28
    },
    {
      "name": "Good Housekeeping",
      "image": "/sites/brooklinen/press/logo-good-housekeeping-2c04d231.png",
      "width": 127,
      "height": 28
    },
    {
      "name": "Architectural Digest",
      "image": "/sites/brooklinen/press/logo-architectural-digest-6a86f5f6.png",
      "width": 42,
      "height": 28
    },
    {
      "name": "Apartment Therapy",
      "image": "/sites/brooklinen/press/Apartment-Therapy-c8e3c107.png",
      "width": 68,
      "height": 28
    },
    {
      "name": "Good Morning America",
      "image": "/sites/brooklinen/press/6155f04bb97efe856be28f0d_Good_Morning_America-8e43dd56.png",
      "width": 48,
      "height": 28
    },
    {
      "name": "TODAY",
      "image": "/sites/brooklinen/press/module-reviews-press-today-c8dacfaf.png",
      "width": 37,
      "height": 28
    },
    {
      "name": "Vogue",
      "image": "/sites/brooklinen/press/logo-vogue-53d292f5.png",
      "width": 106,
      "height": 28
    }
  ],
  "footerColumns": [
    {
      "heading": "About",
      "links": [
        {
          "label": "About Us",
          "href": "https://www.brooklinen.com/pages/about"
        },
        {
          "label": "Press",
          "href": "https://www.brooklinen.com/pages/press"
        },
        {
          "label": "Reviews",
          "href": "https://www.brooklinen.com/pages/reviews"
        },
        {
          "label": "Our Stores",
          "href": "https://www.brooklinen.com/pages/our-stores"
        },
        {
          "label": "HSA/FSA Eligible",
          "href": "https://www.brooklinen.com/pages/hsa-fsa-eligible"
        },
        {
          "label": "Education Center",
          "href": "https://www.brooklinen.com/blogs/education-center"
        }
      ]
    },
    {
      "heading": "Community",
      "links": [
        {
          "label": "Brooklinen Rewards",
          "href": "https://www.brooklinen.com/pages/rewards"
        },
        {
          "label": "Brookliving",
          "href": "https://www.brooklinen.com/blogs/brookliving"
        },
        {
          "label": "Trade & Hospitality",
          "href": "https://www.brooklinen.com/pages/trade"
        },
        {
          "label": "Corporate Gifting",
          "href": "https://www.brooklinen.com/pages/corporate-gifting"
        }
      ]
    },
    {
      "heading": "Need Help?",
      "links": [
        {
          "label": "FAQ & Support",
          "href": "https://www.brooklinen.com/pages/faq"
        },
        {
          "label": "Returns & Exchanges",
          "href": "https://www.brooklinen.com/pages/returns"
        },
        {
          "label": "Care Guide",
          "href": "https://www.brooklinen.com/pages/care-guide"
        },
        {
          "label": "E-Gift Card",
          "href": "https://www.brooklinen.com/products/rise-ai-giftcard"
        },
        {
          "label": "Gift Card Balance",
          "href": "https://www.brooklinen.com/pages/check-gift-card-balance"
        },
        {
          "label": "Do Not Sell or Share My Personal Information",
          "href": "https://www.brooklinen.com/pages/do-not-sell-request"
        },
        {
          "label": "Your Privacy Choices",
          "href": "https://www.brooklinen.com/pages/privacy"
        }
      ]
    },
    {
      "heading": "Get In Touch",
      "links": [
        {
          "label": "Contact Us",
          "href": "https://www.brooklinen.com/pages/contact"
        },
        {
          "label": "Careers",
          "href": "https://www.brooklinen.com/pages/careers"
        },
        {
          "label": "Sign Up for Texts",
          "href": "https://www.brooklinen.com/pages/sms-signup"
        }
      ]
    }
  ],
  "legalLinks": [
    {
      "label": "Terms of Service",
      "href": "https://www.brooklinen.com/pages/terms-of-service"
    },
    {
      "label": "Privacy Policy",
      "href": "https://www.brooklinen.com/pages/privacy"
    },
    {
      "label": "Accessibility",
      "href": "https://www.brooklinen.com/pages/website-accessibility-notice"
    },
    {
      "label": "SMS Marketing Terms of Service",
      "href": "https://www.brooklinen.com/pages/sms-marketing-terms-of-service"
    },
    {
      "label": "Product Collections",
      "href": "https://www.brooklinen.com/pages/shop-explore"
    }
  ]
} as const;
