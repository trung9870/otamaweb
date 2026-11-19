import type { Locale } from "./LanguageContext";

const PRODUCT_TITLE_VI: Record<string, string> = {
  "Classic Percale Core Sheet Set": "Bộ Ga Giường Classic Percale Core",
  "Luxe Sateen Core Sheet Set": "Bộ Ga Giường Luxe Sateen Core",
  "Super-Plush Robe": "Áo Choàng Tắm Super-Plush",
  "Down Comforter": "Ruột Chăn Lông Vũ Down",
  "Down Pillow": "Gối Lông Vũ Down",
  "Classic Percale Duvet Cover": "Vỏ Chăn Classic Percale",
  "Dreamweave Waffle Robe": "Áo Choàng Tổ Ong Dreamweave Waffle",
  "Dreamweave Waffle Bed Blanket": "Chăn Phủ Tổ Ong Dreamweave Waffle",
  "Super Fluff Throw Blanket": "Chăn Đắp Siêu Mềm Super Fluff",
  "Washed European Linen Core Sheet Set": "Bộ Ga Giường Vải Lanh Châu Âu Washed Linen",
  "Classic Percale Pillowcase Set": "Bộ Vỏ Gối Classic Percale",
  "Luxe Sateen Duvet Cover": "Vỏ Chăn Luxe Sateen",
  "Dreamweave Waffle Throw Blanket": "Chăn Đắp Tổ Ong Dreamweave Waffle",
  "Mulberry Silk Bundle": "Combo Lụa Tơ Tằm Mulberry",
  "Super-Plush Complete Get Ready Bundle": "Combo Chăm Sóc Toàn Diện Super-Plush",
  "Classic Percale Hardcore Sheet Bundle": "Combo Ga Giường Đầy Đủ Classic Percale",
  "Super-Plush Slippers": "Dép Đi Trong Nhà Super-Plush",
  "Super-Plush Pouch": "Túi Đựng Đồ Super-Plush",
  "Heritage Wool Bed Blanket": "Chăn Len Cao Cấp Heritage Wool",
  "Mulberry Silk Eyemask": "Bịt Mắt Ngủ Lụa Mulberry",
  "Luxe Sateen Hardcore Sheet Bundle": "Combo Ga Giường Đầy Đủ Luxe Sateen",
  "Luxe Sateen Duvet Set": "Bộ Vỏ Chăn & Gối Luxe Sateen",
  "Luxe Sateen No Flat Sheet Set Bundle": "Combo Ga Giường Tối Giản Luxe Sateen",
  "Classic Percale No Flat Sheet Set Bundle": "Combo Ga Giường Tối Giản Classic Percale",
  "Classic Percale Dreamweave Starter Bundle": "Combo Khởi Đầu Dreamweave Classic Percale",
  "Luxe Sateen Dreamweave Starter Bundle": "Combo Khởi Đầu Dreamweave Luxe Sateen",
  "Luxe Sateen Bedding Move-In Bundle": "Combo Trọn Bộ Phòng Ngủ Luxe Sateen",
  "Classic Percale Bedding Move-In Bundle": "Combo Trọn Bộ Phòng Ngủ Classic Percale",
};

const BADGE_VI: Record<string, string> = {
  "BEST SELLER": "BÁN CHẠY",
  SOFTEST: "MỀM NHẤT",
  COOLING: "MÁT LẠNH",
  "BACK IN STOCK": "ĐÃ VỀ HÀNG",
  NEW: "MỚI",
  "LIMITED EDITION": "GIỚI HẠN",
  "BLACK FRIDAY SALE": "ƯU ĐÃI BLACK FRIDAY",
  "SELLING FAST!": "SẮP HẾT HÀNG!",
  "25% OFF": "GIẢM 25%",
  "40% OFF": "GIẢM 40%",
  "SAVE 35%": "TIẾT KIỆM 35%",
  "UP TO 40% OFF": "GIẢM TỚI 40%",
  "UP TO 35% OFF": "GIẢM TỚI 35%",
};

const COLOR_VI: Record<string, string> = {
  "Solid White": "Trắng trơn",
  White: "Trắng",
  Cream: "Kem",
  Ivory: "Trắng ngà",
  Pebble: "Xám sỏi",
  "Fresh Moss": "Xanh rêu tươi",
  "Wild Moss": "Xanh rêu đậm",
  "Night Sky": "Xanh đêm",
  Cappuccino: "Nâu Cappuccino",
  Flax: "Vàng lanh",
  "Soft Fog": "Xám sương",
  Tomato: "Đỏ cà chua",
  Pewter: "Xám thiếc",
  Slate: "Xám đá",
  Storm: "Xanh bão",
  Abyss: "Xanh biển sâu",
  "Warm Terracotta": "Cam đất ấm",
  "Striped Frost": "Sọc xanh băng",
  "Striped Abyss": "Sọc xanh navy đậm",
  "Striped Botanical Green": "Sọc xanh lá",
  "Striped Oak": "Sọc gỗ sồi",
  "Striped Maple": "Sọc nâu phong",
  "Striped Poppy": "Sọc đỏ Poppy",
  "Striped Menthe": "Sọc xanh bạc hà",
  "Tandem Stripe in Storm": "Sọc xanh Storm",
  "Tandem Stripe in Pebble": "Sọc xám Pebble",
  "Tandem Stripe in Fresh Moss": "Sọc xanh rêu",
  Default: "Mặc định",
};

const SIZE_VI: Record<string, string> = {
  "One Size": "Một cỡ",
  $50: "1.250.000₫",
  $100: "2.500.000₫",
  $150: "3.750.000₫",
  $250: "6.250.000₫",
};

export const USD_TO_VND_RATE = 25000;

export function formatPrice(usdAmount: number, locale: Locale): string {
  if (locale === "en") {
    return `$${Math.round(usdAmount).toLocaleString("en-US")}`;
  }
  const vnd = Math.round(usdAmount * USD_TO_VND_RATE);
  return `${vnd.toLocaleString("vi-VN")}₫`;
}

export function formatPriceString(rawUsd: string, locale: Locale): string {
  if (!rawUsd) return "";
  if (locale === "en") return rawUsd;
  const num = Number(rawUsd.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(num) || num <= 0) return rawUsd;
  return formatPrice(num, "vi");
}

export function translateProductTitle(title: string, locale: Locale): string {
  if (locale === "en") return title;
  return PRODUCT_TITLE_VI[title] || title;
}

export function translateBadge(badge: string, locale: Locale): string {
  if (locale === "en") return badge;
  return BADGE_VI[badge] || badge;
}

export function translateDiscount(discount: string, locale: Locale): string {
  if (locale === "en" || !discount) return discount;
  const m = discount.match(/(\d+)%/);
  return m ? `Giảm ${m[1]}%` : discount;
}

export function translateColor(color: string, locale: Locale): string {
  if (locale === "en") return color;
  return COLOR_VI[color] || color;
}

export function translateSize(size: string, locale: Locale): string {
  if (locale === "en") return size;
  return SIZE_VI[size] || size;
}

export const UI_COPY = {
  en: {
    announcements: [
      "Mystery Madness: 40% off a featured bundle, EVERY 48 HOURS",
      "FREE Super Fluff Tote (value: $75) with purchase of $250.",
      "25% Off sitewide at the Biggest Sale of the Year. Shop Black Friday.",
      "Fast, free shipping on orders over $100, plus 365-day happiness guarantee.",
    ],
    termsApply: "Terms apply",
    offerTermsTitle: "Offer Terms",
    offerTermsBody:
      "25% off sitewide and storewide applied at checkout using code BFCM26. Select bundles qualify for 40% total savings, inclusive of the 25% sitewide and storewide discount. The free Superfluff Tote offer and 40% total savings on the qualifying bundles expire at 7:30 AM EST on 11/21/26. Valid online and in store. While supplies last. Excludes Spaces by Brooklinen brands. Purchases totaling $250 or more in a single transaction qualify for a free Superfluff Tote ($75 retail value). Free ground shipping within the contiguous U.S. on all orders of $100 or more.",
    gotIt: "Got It",
    prevAnnouncement: "Previous announcement",
    nextAnnouncement: "Next announcement",
    searchPlaceholder: "Search ...",
    searchModalTitle: "Search Brooklinen",
    searchInputPlaceholder: "Search sheets, robes, blankets, bundles...",
    searchEmpty: (q: string) => `No homepage items matched “${q}”.`,
    freeShippingBanner: "Free shipping on orders $100+*",
    shopAllPrefix: "Shop All",
    languageLabel: "Language",
    accountLinks: [
      { label: "Claim Your Offer", href: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals" },
      { label: "Create Account", href: "https://www.brooklinen.com/account/register" },
      { label: "Sign In", href: "https://www.brooklinen.com/account/login" },
      { label: "My Rewards", href: "https://www.brooklinen.com/pages/rewards" },
      { label: "Our Stores", href: "https://www.brooklinen.com/pages/our-stores" },
    ],
    navItems: [
      {
        label: "Black Friday Deals",
        featuredTitle: "25% Off Sitewide + Free Tote on $250+",
        featuredDesc: "Shop our biggest sale of the year across sheets, comforters, bath, and gifts.",
        columns: [
          {
            heading: "Featured Deals",
            links: [
              "Shop All Black Friday Deals",
              "Mystery Bundles (48 Hours Only)",
              "Best of Sale",
              "Gifts on Sale",
            ],
          },
          {
            heading: "Shop By Category",
            links: [
              "Sheet Sets",
              "Duvet Covers & Comforters",
              "Bath Towels & Robes",
              "Throws & Blankets",
            ],
          },
        ],
      },
      {
        label: "Gift Guide",
        featuredTitle: "Shop the Gift Guide",
        featuredDesc: "Cozy robes, throws, silk pillowcases, and bundles ready to wrap.",
        columns: [
          {
            heading: "Shop Gifts",
            links: ["All Holiday Gifts", "The Cozy Shop", "Hosting Essentials", "E-Gift Cards"],
          },
          {
            heading: "By Price",
            links: ["Gifts Under $50", "Gifts Under $100", "Luxury Gifts"],
          },
        ],
      },
      {
        label: "Sheets",
        featuredTitle: "Best. Sheets. Ever.",
        featuredDesc: "Compare cool, crisp Classic Percale and buttery-soft Luxe Sateen.",
        columns: [
          {
            heading: "Sheet Collections",
            links: [
              "All Sheets",
              "Luxe Sateen",
              "Classic Percale",
              "Washed European Linen",
              "Heathered Cashmere",
            ],
          },
          {
            heading: "Shop By Piece",
            links: ["Core Sheet Sets", "Hardcore Sheet Bundles", "Pillowcases", "Fitted Sheets"],
          },
        ],
      },
      {
        label: "Bed",
        featuredTitle: "Build Your Dream Bed",
        featuredDesc: "Layer comforters, pillows, duvet covers, and blankets.",
        columns: [
          {
            heading: "Bedding",
            links: ["All Bedding", "Duvet Covers", "Comforters", "Pillows", "Quilts & Blankets"],
          },
        ],
      },
      {
        label: "Bath & Robes",
        featuredTitle: "Super-Plush Bath",
        featuredDesc: "Oprah's Favorite Things 2025 Super-Plush Robes & Turkish Cotton Towels.",
        columns: [
          {
            heading: "Bath Essentials",
            links: [
              "All Bath",
              "Super-Plush Towels",
              "Robes",
              "Bath Mats & Shower Curtains",
              "Bath Bundles",
            ],
          },
        ],
      },
      {
        label: "Bundle Savings",
        featuredTitle: "Shop 40% Off Today's Bundle",
        featuredDesc: "40% off new Mystery Bundles, every 48 hours. Check back for new bundles.",
        columns: [
          {
            heading: "Save On Bundles",
            links: ["Black Friday Deals", "All Bundles", "Bedding Bundles", "Bath Bundles"],
          },
        ],
      },
      {
        label: "Home",
        featuredTitle: "Waffle World",
        featuredDesc: "Textured throws, pillows, and accents made for lounging.",
        columns: [
          {
            heading: "Home & Accents",
            links: ["All Home Accessories", "Throw Blankets", "Decorative Pillows", "Waffle World"],
          },
        ],
      },
      {
        label: "New & Trending",
        featuredTitle: "New Arrivals",
        featuredDesc: "Fresh seasonal stripes, solids, and cozy holiday releases.",
        columns: [
          {
            heading: "Discover",
            links: ["New Arrivals", "The Cozy Shop", "Waffle World", "Hosting Essentials"],
          },
        ],
      },
    ],
    mobileQuickPills: ["Black Friday Deals", "Gift Guide", "Bundle Savings"],
    heroPrimary: {
      headingLines: ["25% Off Sitewide", "Black Friday Sale"],
      subtitleLines: [
        "It’s our biggest sale of the year. For a limited time",
        "get a free Super-Fluff tote on orders $250+.",
      ],
      ctaLabel: "Shop Now",
    },
    stripMystery: {
      heading: "40% Off, 48 Hours Only",
      body: "Check back every 48 hours for featured mystery bundles, always at 40% off.",
      ctaLabel: "Shop the Bundles",
    },
    bestOfSaleHeading: "Best of Sale",
    quickView: "Quick View",
    fromPrice: "From:",
    miniHeroTote: {
      lines: ["48 Hours Only: Free Super Fluff", "Tote with $250+ purchase"],
      ctaLabel: "Shop Now",
    },
    shopByCategoryHeading: "Shop by Category",
    categories: [
      "All Sheets",
      "All Bedding",
      "Bundle Savings",
      "All Bath",
      "Duvet Inserts & Pillows",
      "New Arrivals",
    ],
    badgeUpTo40: "Up to 40% off",
    stripGifts: {
      heading: "Shop Gifts on Sale",
      body: "Gift the best in bed & bath. Shop gifts on sale, for a limited time only.",
      ctaLabel: "Shop Now",
    },
    giftGuideHeading: "Shop the Gift Guide",
    heroSheets: {
      textHeadline: "",
      subtitle:
        "Get our cool, crisp Classic Percale or soft, smooth Luxe Sheets, and sleep like the best.",
      ctas: ["Shop Sheets", "Explore the Campaign"],
      playVideo: "Play campaign video",
      pauseVideo: "Pause campaign video",
    },
    collectionHeading: "Shop the Collection",
    newTrendingHeading: "New & Trending",
    trendingTitles: ["The Cozy Shop", "Waffle World", "Hosting Essentials", "Bedding Bundles"],
    shopNow: "Shop Now",
    stripFsa: {
      heading: "We're FSA/HSA Eligible",
      body: "Use your pre-tax dollars on the best in bed.",
      ctaLabel: "Shop Now",
    },
    whyHeading: "Why Brooklinen?",
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
      },
    ],
    reviewsDesktopHeading: ["175k+ 5-Star", "Reviews", "Don’t Lie"],
    reviewsMobileEyebrow: "175K+ 5-STAR REVIEWS DON’T LIE",
    readOurReviews: "Read Our Reviews",
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
    pressHeading: "In the News",
    shopAwardWinners: "Shop Award-Winners",
    stripStores: {
      heading: "Come Say Hi, IRL",
      body: "We've got comfort in the bag (yours) at a store near you.",
      ctaLabel: "Find Your Store",
    },
    footerNewsletter: {
      heading: "Get on the List",
      sub: "Sign up to know when we launch new products.",
      placeholder: "Email",
      invalidEmail: "Please enter a valid email.",
      successEmail: "You’re on the list! Thanks for subscribing.",
      consentBefore:
        "Please keep me up to date with Brooklinen news and offers by email. I can unsubscribe at any time. I have read the Brooklinen ",
      privacyPolicy: "Privacy Policy",
    },
    footerColumns: [
      {
        heading: "About",
        links: [
          "About Us",
          "Press",
          "Reviews",
          "Our Stores",
          "HSA/FSA Eligible",
          "Education Center",
        ],
      },
      {
        heading: "Community",
        links: ["Brooklinen Rewards", "Brookliving", "Trade & Hospitality", "Corporate Gifting"],
      },
      {
        heading: "Need Help?",
        links: [
          "FAQ & Support",
          "Returns & Exchanges",
          "Care Guide",
          "E-Gift Card",
          "Gift Card Balance",
          "Do Not Sell or Share My Personal Information",
          "Your Privacy Choices",
        ],
      },
      {
        heading: "Get In Touch",
        links: ["Contact Us", "Careers", "Sign Up for Texts"],
      },
    ],
    legalLinks: [
      "Terms of Service",
      "Privacy Policy",
      "Accessibility",
      "SMS Marketing Terms of Service",
      "Product Collections",
    ],
    quickViewModal: {
      reviewsSuffix: "reviews",
      colorLabel: "Color:",
      sizeLabel: "Size",
      addToBag: "Add to Bag",
      viewFullDetails: "View Full Product Details",
    },
    cartDrawer: {
      title: "Your Bag",
      addMorePrefix: "Add",
      forFreeShipping: "for FREE Shipping",
      andMore: "and",
      forFreeTote: "for a FREE Super-Fluff Tote!",
      freeShippingUnlocked: "Free Shipping unlocked!",
      freeToteSuffix: "for a FREE Super-Fluff Tote ($75 value).",
      allUnlocked: "Free Shipping + FREE Super-Fluff Tote ($75 value) unlocked!",
      emptyTitle: "Your bag is empty",
      emptyBody: "Click Quick View on any product card to test adding items to your bag.",
      continueShopping: "Continue Shopping",
      remove: "Remove",
      subtotal: "Subtotal",
      taxNote: "25% Black Friday savings applied. Taxes calculated at checkout.",
      checkout: "Proceed to Checkout",
    },
  },
  vi: {
    announcements: [
      "Ưu Đãi Bí Ẩn: Giảm 40% cho combo đặc biệt, ĐỔI MỚI MỖI 48 GIỜ",
      "TẶNG MIỄN PHÍ túi tote Super Fluff (trị giá 1.875.000₫) cho đơn từ 6.250.000₫.",
      "Giảm 25% toàn cửa hàng trong đợt Sale Lớn Nhất Năm. Mua ngay Black Friday.",
      "Giao hàng nhanh miễn phí cho đơn từ 2.500.000₫, kèm bảo hành hài lòng 365 ngày.",
    ],
    termsApply: "Áp dụng điều khoản",
    offerTermsTitle: "Điều Khoản Ưu Đãi",
    offerTermsBody:
      "Ưu đãi giảm 25% toàn trang web và cửa hàng được áp dụng khi thanh toán với mã BFCM26. Một số combo đặc biệt đạt mức tiết kiệm tổng 40% (đã bao gồm giảm 25% toàn cửa hàng). Chương trình tặng túi Super-Fluff Tote miễn phí (trị giá 1.875.000₫) cho đơn hàng từ 6.250.000₫ trở lên và giảm 40% cho các combo chọn lọc kết thúc lúc 7:30 sáng EST ngày 21/11/26. Áp dụng mua trực tuyến và tại cửa hàng đến khi hết quà. Miễn phí giao hàng tiêu chuẩn cho đơn từ 2.500.000₫.",
    gotIt: "Đã hiểu",
    prevAnnouncement: "Thông báo trước",
    nextAnnouncement: "Thông báo tiếp theo",
    searchPlaceholder: "Tìm kiếm ...",
    searchModalTitle: "Tìm kiếm Brooklinen",
    searchInputPlaceholder: "Tìm ga giường, áo choàng, chăn đắp, combo...",
    searchEmpty: (q: string) => `Không tìm thấy sản phẩm nào khớp với “${q}”.`,
    freeShippingBanner: "Miễn phí giao hàng cho đơn từ 2.500.000₫*",
    shopAllPrefix: "Xem tất cả",
    languageLabel: "Ngôn ngữ",
    accountLinks: [
      { label: "Nhận ưu đãi của bạn", href: "https://www.brooklinen.com/pages/black-friday-cyber-monday-deals" },
      { label: "Tạo tài khoản", href: "https://www.brooklinen.com/account/register" },
      { label: "Đăng nhập", href: "https://www.brooklinen.com/account/login" },
      { label: "Điểm thưởng Rewards", href: "https://www.brooklinen.com/pages/rewards" },
      { label: "Hệ thống cửa hàng", href: "https://www.brooklinen.com/pages/our-stores" },
    ],
    navItems: [
      {
        label: "Black Friday",
        featuredTitle: "Giảm 25% Toàn Cửa Hàng + Quà Tặng",
        featuredDesc: "Đợt giảm giá lớn nhất năm cho ga giường, chăn gối, đồ tắm và quà tặng.",
        columns: [
          {
            heading: "Ưu Đãi Nổi Bật",
            links: [
              "Tất cả ưu đãi Black Friday",
              "Combo Bí Ẩn (Chỉ 48 Giờ)",
              "Sản phẩm Sale bán chạy",
              "Quà tặng đang giảm giá",
            ],
          },
          {
            heading: "Theo Danh Mục",
            links: [
              "Bộ ga giường",
              "Vỏ chăn & Ruột chăn",
              "Khăn tắm & Áo choàng",
              "Chăn đắp & Chăn phủ",
            ],
          },
        ],
      },
      {
        label: "Quà Tặng",
        featuredTitle: "Gợi Ý Quà Tặng",
        featuredDesc: "Áo choàng êm ái, chăn đắp, vỏ gối lụa và combo quà tặng tinh tế.",
        columns: [
          {
            heading: "Chọn Quà Tặng",
            links: ["Tất cả quà lễ hội", "Góc Ấm Cúng", "Đón Khách Chu Đáo", "Thẻ Quà Tặng Điện Tử"],
          },
          {
            heading: "Theo Ngân Sách",
            links: ["Quà dưới 1.250.000₫", "Quà dưới 2.500.000₫", "Quà tặng cao cấp"],
          },
        ],
      },
      {
        label: "Ga Giường",
        featuredTitle: "Ga Giường. Đỉnh. Nhất.",
        featuredDesc: "So sánh Classic Percale thoáng mát sắc nét và Luxe Sateen mềm mịn như bơ.",
        columns: [
          {
            heading: "Dòng Ga Giường",
            links: [
              "Tất cả ga giường",
              "Luxe Sateen",
              "Classic Percale",
              "Vải Lanh Châu Âu",
              "Len Cashmere Pha",
            ],
          },
          {
            heading: "Mua Theo Món",
            links: ["Bộ ga cơ bản Core", "Combo ga đầy đủ Hardcore", "Vỏ gối", "Ga chun bọc đệm"],
          },
        ],
      },
      {
        label: "Chăn Gối",
        featuredTitle: "Tạo Nên Chiếc Giường Mơ Ước",
        featuredDesc: "Phối lớp hoàn hảo với ruột chăn, gối lông vũ, vỏ chăn và chăn đắp.",
        columns: [
          {
            heading: "Đồ Phòng Ngủ",
            links: ["Tất cả chăn gối", "Vỏ chăn", "Ruột chăn", "Gối nằm", "Chăn trần & Chăn phủ"],
          },
        ],
      },
      {
        label: "Phòng Tắm",
        featuredTitle: "Bộ Sưu Tập Super-Plush",
        featuredDesc: "Áo choàng Super-Plush đạt giải Oprah's Favorite Things 2025 & khăn cotton Thổ Nhĩ Kỳ.",
        columns: [
          {
            heading: "Đồ Phòng Tắm",
            links: [
              "Tất cả đồ tắm",
              "Khăn tắm Super-Plush",
              "Áo choàng tắm",
              "Thảm tắm & Rèm tắm",
              "Combo phòng tắm",
            ],
          },
        ],
      },
      {
        label: "Combo",
        featuredTitle: "Giảm 40% Combo Hôm Nay",
        featuredDesc: "Giảm 40% cho các Combo Bí Ẩn mới sau mỗi 48 giờ. Quay lại thường xuyên nhé.",
        columns: [
          {
            heading: "Tiết Kiệm Theo Combo",
            links: ["Ưu đãi Black Friday", "Tất cả Combo", "Combo Chăn Ga", "Combo Phòng Tắm"],
          },
        ],
      },
      {
        label: "Nhà Cửa",
        featuredTitle: "Thế Giới Waffle",
        featuredDesc: "Chăn dệt tổ ong, gối tựa và phụ kiện trang trí êm ái cho phòng khách.",
        columns: [
          {
            heading: "Trang Trí Nhà Cửa",
            links: ["Tất cả phụ kiện nhà", "Chăn đắp sofa", "Gối trang trí", "Thế Giới Waffle"],
          },
        ],
      },
      {
        label: "Mới & Hot",
        featuredTitle: "Hàng Mới Về",
        featuredDesc: "Họa tiết kẻ sọc mùa mới, gam màu tinh tế và bộ sưu tập lễ hội ấm cúng.",
        columns: [
          {
            heading: "Khám Phá",
            links: ["Hàng mới về", "Góc Ấm Cúng", "Thế Giới Waffle", "Đón Khách Chu Đáo"],
          },
        ],
      },
    ],
    mobileQuickPills: ["Black Friday", "Quà Tặng", "Combo Tiết Kiệm"],
    heroPrimary: {
      headingLines: ["Giảm 25% Toàn Cửa Hàng", "Ưu Đãi Black Friday"],
      subtitleLines: [
        "Đợt ưu đãi lớn nhất năm của chúng tôi. Nhận ngay túi tote",
        "Super-Fluff miễn phí cho đơn hàng từ 6.250.000₫ trong thời gian có hạn.",
      ],
      ctaLabel: "Mua ngay",
    },
    stripMystery: {
      heading: "Giảm 40%, Chỉ Trong 48 Giờ",
      body: "Quay lại sau mỗi 48 giờ để khám phá các combo bí ẩn nổi bật, luôn giảm 40%.",
      ctaLabel: "Xem các Combo",
    },
    bestOfSaleHeading: "Sản Phẩm Sale Nổi Bật",
    quickView: "Xem nhanh",
    fromPrice: "Từ:",
    miniHeroTote: {
      lines: ["Chỉ 48 Giờ: Tặng Túi Super Fluff", "miễn phí cho đơn từ 6.250.000₫"],
      ctaLabel: "Mua ngay",
    },
    shopByCategoryHeading: "Mua theo Danh mục",
    categories: [
      "Tất cả Ga giường",
      "Tất cả Chăn gối",
      "Combo Tiết kiệm",
      "Tất cả Đồ tắm",
      "Ruột chăn & Gối",
      "Hàng mới về",
    ],
    badgeUpTo40: "Giảm tới 40%",
    stripGifts: {
      heading: "Quà Tặng Đang Giảm Giá",
      body: "Trao tặng trải nghiệm phòng ngủ & phòng tắm tuyệt vời nhất. Ưu đãi chỉ trong thời gian có hạn.",
      ctaLabel: "Mua ngay",
    },
    giftGuideHeading: "Gợi Ý Quà Tặng",
    heroSheets: {
      textHeadline: "GA GIƯỜNG. ĐỈNH. NHẤT.",
      subtitle:
        "Chọn Classic Percale mát mịn sắc nét hoặc Luxe Sateen êm ái mượt mà, để ngủ ngon như mơ.",
      ctas: ["Mua Ga Giường", "Khám Phá Chiến Dịch"],
      playVideo: "Phát video chiến dịch",
      pauseVideo: "Tạm dừng video chiến dịch",
    },
    collectionHeading: "Khám Phá Bộ Sưu Tập",
    newTrendingHeading: "Mới & Nổi Bật",
    trendingTitles: ["Góc Ấm Cúng", "Thế Giới Waffle", "Đón Khách Chu Đáo", "Combo Chăn Ga"],
    shopNow: "Mua ngay",
    stripFsa: {
      heading: "Hỗ Trợ Thanh Toán FSA/HSA",
      body: "Sử dụng khoản tiền trước thuế của bạn cho giấc ngủ êm ái nhất.",
      ctaLabel: "Mua ngay",
    },
    whyHeading: "Vì sao chọn Brooklinen?",
    valueProps: [
      {
        title: "CHẤT LIỆU CAO CẤP & THIẾT KẾ ĐỘC QUYỀN",
        body: "Chỉ những gì tốt nhất — vì bạn xứng đáng.",
      },
      {
        title: "BẢO HÀNH HÀI LÒNG 365 NGÀY",
        body: "Yêu ngay từ giấc ngủ (hay lần tắm) đầu tiên.",
      },
      {
        title: "GIAO HÀNG NHANH, MIỄN PHÍ",
        body: "Phong cách New York, giao hàng cực nhanh.",
        linkLabel: "Áp dụng điều kiện *",
      },
    ],
    reviewsDesktopHeading: ["Hơn 175.000", "Đánh Giá 5 Sao", "Không Biết Nói Dối"],
    reviewsMobileEyebrow: "HƠN 175.000 ĐÁNH GIÁ 5 SAO KHÔNG BIẾT NÓI DỐI",
    readOurReviews: "Đọc thêm đánh giá",
    reviews: [
      {
        title: "Êm Ái Như Ngủ Trên Mây",
        quote: "“Thật sự là giấc ngủ ngon nhất sau nhiều năm. Tôi chẳng muốn rời khỏi giường nữa...”",
        author: "Sarah T.",
      },
      {
        title: "Không Thể Ngừng Khen Ngợi",
        quote: "“Còn êm hơn cả khăn tắm ở những khách sạn hạng sang tôi từng ở. Quá hài lòng với lựa chọn này!”",
        author: "Linda B.",
      },
      {
        title: "Giờ Tôi Đã Hiểu",
        quote: "“Trước đây tôi chưa từng hiểu giá trị của một bộ ga giường chất lượng cho đến bây giờ. Quá mê luôn.”",
        author: "James A.",
      },
    ],
    pressHeading: "Trên Báo Chí",
    shopAwardWinners: "Mua Sản Phẩm Đạt Giải",
    stripStores: {
      heading: "Ghé Chơi Trực Tiếp Nhé",
      body: "Sự êm ái đã sẵn sàng trong túi (của bạn) tại cửa hàng gần nhất.",
      ctaLabel: "Tìm Cửa Hàng",
    },
    footerNewsletter: {
      heading: "Đăng Ký Nhận Tin",
      sub: "Đăng ký để nhận thông báo sớm nhất khi ra mắt sản phẩm mới.",
      placeholder: "Email của bạn",
      invalidEmail: "Vui lòng nhập địa chỉ email hợp lệ.",
      successEmail: "Bạn đã đăng ký thành công! Cảm ơn đã đồng hành cùng Brooklinen.",
      consentBefore:
        "Vui lòng gửi cho tôi tin tức và ưu đãi mới nhất từ Brooklinen qua email. Tôi có thể hủy đăng ký bất kỳ lúc nào và đã đọc ",
      privacyPolicy: "Chính sách bảo mật",
    },
    footerColumns: [
      {
        heading: "Về Chúng Tôi",
        links: [
          "Giới thiệu",
          "Báo chí",
          "Đánh giá khách hàng",
          "Hệ thống cửa hàng",
          "Hỗ trợ HSA/FSA",
          "Trung tâm kiến thức",
        ],
      },
      {
        heading: "Cộng Đồng",
        links: [
          "Brooklinen Rewards",
          "Tạp chí Brookliving",
          "Khách sạn & Đối tác",
          "Quà tặng doanh nghiệp",
        ],
      },
      {
        heading: "Cần Hỗ Trợ?",
        links: [
          "Hỏi đáp & Hỗ trợ",
          "Đổi trả hàng",
          "Hướng dẫn bảo quản",
          "Thẻ quà tặng điện tử",
          "Kiểm tra số dư thẻ quà",
          "Không bán hoặc chia sẻ dữ liệu cá nhân",
          "Tùy chọn quyền riêng tư",
        ],
      },
      {
        heading: "Liên Hệ",
        links: ["Liên hệ chúng tôi", "Tuyển dụng", "Đăng ký nhận tin SMS"],
      },
    ],
    legalLinks: [
      "Điều khoản dịch vụ",
      "Chính sách bảo mật",
      "Khả năng tiếp cận",
      "Điều khoản tiếp thị SMS",
      "Bộ sưu tập sản phẩm",
    ],
    quickViewModal: {
      reviewsSuffix: "đánh giá",
      colorLabel: "Màu sắc:",
      sizeLabel: "Kích cỡ",
      addToBag: "Thêm vào giỏ",
      viewFullDetails: "Xem chi tiết sản phẩm",
    },
    cartDrawer: {
      title: "Giỏ Hàng",
      addMorePrefix: "Thêm",
      forFreeShipping: "để được MIỄN PHÍ giao hàng",
      andMore: "và thêm",
      forFreeTote: "để nhận MIỄN PHÍ túi Super-Fluff Tote!",
      freeShippingUnlocked: "Đã mở khóa Miễn Phí Giao Hàng!",
      freeToteSuffix: "để nhận MIỄN PHÍ túi Super-Fluff Tote (trị giá 1.875.000₫).",
      allUnlocked: "Đã mở khóa Miễn Phí Giao Hàng + Túi Super-Fluff Tote (1.875.000₫)!",
      emptyTitle: "Giỏ hàng của bạn đang trống",
      emptyBody: "Bấm Xem nhanh trên bất kỳ sản phẩm nào để thử thêm vào giỏ hàng.",
      continueShopping: "Tiếp tục mua sắm",
      remove: "Xóa",
      subtotal: "Tạm tính",
      taxNote: "Đã áp dụng ưu đãi Black Friday 25%. Thuế được tính khi thanh toán.",
      checkout: "Tiến hành thanh toán",
    },
  },
} as const;
