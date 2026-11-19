"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CollectionView } from "./CollectionView";
import { isShoppingHubPage } from "./catalog";
import { useLanguage } from "./LanguageContext";
import { UI_COPY } from "./translations";
import { StarRating } from "./icons";

const STORES = [
  { city: "Brooklyn — Williamsburg", addr: "127 Berry St, Brooklyn, NY 11249", hours: "Mon–Sun 11am – 7pm" },
  { city: "New York — SoHo", addr: "130 Greene St, New York, NY 10012", hours: "Mon–Sun 11am – 7pm" },
  { city: "Boston — Newbury St", addr: "177 Newbury St, Boston, MA 02116", hours: "Mon–Sun 11am – 7pm" },
  { city: "Chicago — Armitage", addr: "844 W Armitage Ave, Chicago, IL 60614", hours: "Mon–Sun 11am – 7pm" },
  { city: "San Francisco — Fillmore", addr: "2120 Fillmore St, San Francisco, CA 94115", hours: "Mon–Sun 11am – 7pm" },
  { city: "Los Angeles — Santa Monica", addr: "1324 Montana Ave, Santa Monica, CA 90403", hours: "Mon–Sun 11am – 7pm" },
];

const FAQS = {
  en: [
    {
      q: "How does the 25% Off Black Friday Sale work?",
      a: "25% off sitewide applies automatically across sheets, comforters, bath, and gifts. Select bundles reach up to 40% total savings, and orders $250+ automatically qualify for a FREE Super-Fluff Tote ($75 value).",
    },
    {
      q: "Do you offer free shipping?",
      a: "Yes! All orders of $100 or more qualify for fast, free standard shipping within the contiguous U.S.",
    },
    {
      q: "What is the 365-Day Happiness Guarantee?",
      a: "Try your Brooklinen bedding or bath essentials at home for up to a full year. If you don't love them, we make returns and exchanges effortless.",
    },
    {
      q: "Classic Percale vs. Luxe Sateen — which should I choose?",
      a: "Choose Classic Percale (270 thread count) if you sleep warm and love crisp, cool, matte hotel sheets. Choose Luxe Sateen (480 thread count) if you prefer buttery-smooth softness with a slight sheen.",
    },
  ],
  vi: [
    {
      q: "Ưu đãi Black Friday Giảm 25% hoạt động như thế nào?",
      a: "Giảm giá 25% được áp dụng trên toàn cửa hàng cho ga giường, ruột chăn, đồ tắm và quà tặng. Một số combo tiết kiệm lên đến 40%, và đơn từ 6.250.000₫ tự động nhận miễn phí túi Super-Fluff Tote (trị giá 1.875.000₫).",
    },
    {
      q: "Brooklinen có miễn phí giao hàng không?",
      a: "Có! Mọi đơn hàng từ 2.500.000₫ trở lên đều được hưởng miễn phí vận chuyển tiêu chuẩn nhanh chóng.",
    },
    {
      q: "Chính sách Bảo hành Hài lòng 365 ngày là gì?",
      a: "Bạn có thể trải nghiệm chăn ga gối và đồ tắm Brooklinen tại nhà trong trọn 1 năm. Nếu chưa hoàn toàn ưng ý, bạn có thể đổi hoặc trả hàng dễ dàng.",
    },
    {
      q: "Nên chọn Classic Percale hay Luxe Sateen?",
      a: "Chọn Classic Percale (270 sợi) nếu bạn dễ nóng khi ngủ và thích cảm giác giòn mát, thoáng khí như khách sạn 5 sao. Chọn Luxe Sateen (480 sợi) nếu bạn thích bề mặt mềm mượt như bơ và ánh bóng nhẹ tinh tế.",
    },
  ],
};

const PAGE_TITLES: Record<string, { en: string; vi: string; enLead: string; viLead: string }> = {
  about: {
    en: "About Brooklinen",
    vi: "Về Brooklinen",
    enLead: "Founded in Brooklyn in 2014 to bring hotel-luxury bedding and bath essentials home without the luxury markup.",
    viLead: "Thành lập tại Brooklyn từ năm 2014 với sứ mệnh mang trải nghiệm chăn ga và đồ tắm chuẩn khách sạn 5 sao về nhà với mức giá hợp lý.",
  },
  press: {
    en: "In the Press",
    vi: "Brooklinen Trên Báo Chí",
    enLead: "Named Best Sheets by NYT Wirecutter, Architectural Digest Approved, and Oprah's Favorite Things 2025.",
    viLead: "Được vinh danh bởi NYT Wirecutter, Architectural Digest Approved và Oprah's Favorite Things 2025.",
  },
  rewards: {
    en: "Brooklinen Rewards",
    vi: "Thành Viên Brooklinen Rewards",
    enLead: "Earn points on every order, unlock birthday perks, and get early access to limited seasonal drops.",
    viLead: "Tích điểm trên mọi đơn hàng, nhận quà sinh nhật và ưu tiên tiếp cận các bộ sưu tập giới hạn.",
  },
  trade: {
    en: "Trade & Hospitality",
    vi: "Khách Sạn & Đối Tác Thiết Kế",
    enLead: "Exclusive pricing and dedicated account support for interior designers, architects, and boutique hotels.",
    viLead: "Chính sách giá ưu đãi và hỗ trợ riêng biệt dành cho nhà thiết kế nội thất, kiến trúc sư và khách sạn boutique.",
  },
  "corporate-gifting": {
    en: "Corporate Gifting",
    vi: "Quà Tặng Doanh Nghiệp",
    enLead: "Memorable, cozy gifts for teams, clients, and holiday milestones—custom curated at volume savings.",
    viLead: "Món quà tinh tế, êm ái dành cho đối tác, khách hàng và đội ngũ — đóng gói chỉn chu kèm ưu đãi số lượng lớn.",
  },
  returns: {
    en: "Returns & Exchanges",
    vi: "Chính Sách Đổi Trả 365 Ngày",
    enLead: "We stand behind every stitch with our 365-Day Happiness Guarantee.",
    viLead: "Chúng tôi cam kết chất lượng từng đường kim mũi chỉ với Bảo hành Hài lòng 365 ngày.",
  },
  "care-guide": {
    en: "Fabric Care Guide",
    vi: "Hướng Dẫn Bảo Quản Vải",
    enLead: "Simple wash and dry tips to keep your Percale, Sateen, Linen, and Turkish Cotton cloud-soft for years.",
    viLead: "Bí quyết giặt và sấy đơn giản giúp vải Percale, Sateen, Linen và Cotton Thổ Nhĩ Kỳ luôn êm mềm bền đẹp nhiều năm.",
  },
  careers: {
    en: "Careers at Brooklinen",
    vi: "Tuyển Dụng Tại Brooklinen",
    enLead: "Join our Brooklyn HQ and retail store teams building the future of home comfort.",
    viLead: "Gia nhập đội ngũ trụ sở Brooklyn và hệ thống cửa hàng để kiến tạo chuẩn mực mới cho không gian sống êm ái.",
  },
  "education-center": {
    en: "Sleep & Fabric Education Center",
    vi: "Trung Tâm Kiến Thức Giấc Ngủ & Chất Liệu",
    enLead: "Deep dives on Percale vs. Sateen weaves, down fill power, GSM towel weights, and seasonal layering.",
    viLead: "Hướng dẫn chuyên sâu về kiểu dệt Percale vs. Sateen, độ phồng lông vũ, định lượng khăn GSM và cách phối chăn ga theo mùa.",
  },
  brookliving: {
    en: "Brookliving Journal",
    vi: "Tạp Chí Brookliving",
    enLead: "Home tours, cozy styling stories, and hosting inspiration from our community.",
    viLead: "Khám phá không gian sống, mẹo trang trí phòng ngủ ấm cúng và cảm hứng đón khách từ cộng đồng Brooklinen.",
  },
};

export function InfoPageView({
  slug,
  section = "pages",
}: {
  slug: string;
  section?: "pages" | "blogs" | "account";
}) {
  const { locale } = useLanguage();
  const [contactSent, setContactSent] = useState(false);
  const [giftCode, setGiftCode] = useState("");
  const [giftResult, setGiftResult] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // Shopping hub slugs under /pages/* render full CollectionView directly!
  if (section === "pages" && isShoppingHubPage(slug)) {
    return <CollectionView slug={slug} />;
  }

  // Account login / register
  if (section === "account") {
    const isRegister = slug === "register";
    const handleAuth = (e: FormEvent) => {
      e.preventDefault();
      setAuthMessage(
        locale === "vi"
          ? isRegister
            ? "Đã tạo tài khoản demo thành công! Ưu đãi Black Friday 25% đã sẵn sàng."
            : "Đăng nhập demo thành công! Chào mừng bạn quay lại Brooklinen."
          : isRegister
            ? "Demo account created! Your 25% Black Friday offer is ready."
            : "Signed in to demo account! Welcome back to Brooklinen."
      );
    };
    return (
      <div className="mx-auto max-w-[480px] px-5 py-16">
        <div className="rounded-2xl border border-[#ECE7E2] bg-white p-8 shadow-xs">
          <h1 className="font-toledo text-[32px] text-[#283455]">
            {isRegister
              ? locale === "vi"
                ? "Tạo Tài Khoản"
                : "Create Account"
              : locale === "vi"
                ? "Đăng Nhập"
                : "Sign In"}
          </h1>
          <p className="mt-2 text-[14.5px] text-[#5B647A]">
            {locale === "vi"
              ? "Quản lý đơn hàng, tích điểm Brooklinen Rewards và lưu danh sách yêu thích."
              : "Manage orders, earn Brooklinen Rewards, and save favorites."}
          </p>

          <form onSubmit={handleAuth} className="mt-6 space-y-4">
            {isRegister && (
              <div>
                <label htmlFor="acc-name" className="block text-[13px] font-bold text-[#283455]">
                  {locale === "vi" ? "Họ và tên" : "Full Name"}
                </label>
                <input
                  id="acc-name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1.5 h-12 w-full rounded-xl border border-[#C9CFD9] px-4 text-[15px] focus:border-[#283455] focus:outline-none"
                />
              </div>
            )}
            <div>
              <label htmlFor="acc-email" className="block text-[13px] font-bold text-[#283455]">
                Email
              </label>
              <input
                id="acc-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                className="mt-1.5 h-12 w-full rounded-xl border border-[#C9CFD9] px-4 text-[15px] focus:border-[#283455] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="acc-pass" className="block text-[13px] font-bold text-[#283455]">
                {locale === "vi" ? "Mật khẩu" : "Password"}
              </label>
              <input
                id="acc-pass"
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
                className="mt-1.5 h-12 w-full rounded-xl border border-[#C9CFD9] px-4 text-[15px] focus:border-[#283455] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="h-[52px] w-full cursor-pointer rounded-[20px] bg-[#283455] text-[14px] font-bold text-white hover:bg-[#1D2742]"
            >
              {isRegister
                ? locale === "vi"
                  ? "Đăng Ký Ngay"
                  : "Create Account"
                : locale === "vi"
                  ? "Đăng Nhập"
                  : "Sign In"}
            </button>
            {authMessage && (
              <p role="status" className="rounded-xl bg-[#EAF3E4] p-3 text-[13.5px] font-medium text-[#417823]">
                {authMessage}
              </p>
            )}
          </form>

          <p className="mt-5 text-center text-[13.5px] text-[#5B647A]">
            {isRegister ? (
              <Link href="/account/login" className="font-bold text-[#283455] underline">
                {locale === "vi" ? "Đã có tài khoản? Đăng nhập" : "Already have an account? Sign in"}
              </Link>
            ) : (
              <Link href="/account/register" className="font-bold text-[#283455] underline">
                {locale === "vi" ? "Chưa có tài khoản? Đăng ký ngay" : "New to Brooklinen? Create an account"}
              </Link>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Our Stores directory
  if (slug === "our-stores") {
    return (
      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-16 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-4 text-[13px] text-[#5B647A]">
          <Link href="/" className="hover:underline">
            {locale === "vi" ? "Trang chủ" : "Home"}
          </Link>{" "}
          / <span className="font-bold text-[#283455]">{locale === "vi" ? "Hệ thống cửa hàng" : "Our Stores"}</span>
        </nav>
        <h1 className="font-toledo text-[36px] text-[#283455] lg:text-[46px]">
          {locale === "vi" ? "Ghé Thăm Cửa Hàng Brooklinen" : "Come Say Hi, IRL"}
        </h1>
        <p className="mt-3 max-w-[640px] text-[17px] text-[#3D4866]">
          {locale === "vi"
            ? "Trải nghiệm trực tiếp chất vải Classic Percale, Luxe Sateen và Super-Plush tại cửa hàng gần bạn nhất."
            : "Feel Classic Percale, Luxe Sateen, and Super-Plush in person at a Brooklinen store near you."}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STORES.map((s) => (
            <article key={s.city} className="rounded-2xl border border-[#ECE7E2] bg-white p-6">
              <h2 className="font-toledo text-[22px] text-[#283455]">{s.city}</h2>
              <p className="mt-2 text-[14.5px] text-[#3D4866]">{s.addr}</p>
              <p className="mt-1 text-[13.5px] text-[#6E7485]">{s.hours}</p>
              <Link
                href="/collections/best-sellers"
                className="mt-4 inline-block text-[13.5px] font-bold text-[#283455] underline underline-offset-2"
              >
                {locale === "vi" ? "Xem ưu đãi tại cửa hàng →" : "Shop In-Store Favorites →"}
              </Link>
            </article>
          ))}
        </div>
      </div>
    );
  }

  // Reviews page
  if (slug === "reviews") {
    const reviews = UI_COPY[locale].reviews;
    return (
      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-16 lg:py-16">
        <div className="rounded-2xl bg-[#F9F3ED] p-8 text-center lg:p-12">
          <h1 className="font-toledo text-[36px] text-[#283455] lg:text-[48px]">
            {locale === "vi" ? "Hơn 175.000 Đánh Giá 5 Sao" : "175k+ 5-Star Reviews"}
          </h1>
          <div className="mt-3 flex items-center justify-center gap-2">
            <StarRating rating={5} size={20} />
            <span className="text-[16px] font-bold text-[#283455]">4.8 / 5</span>
          </div>
          <p className="mx-auto mt-3 max-w-[560px] text-[16px] text-[#3D4866]">
            {locale === "vi"
              ? "Hàng trăm nghìn giấc ngủ ngon mỗi đêm — xem khách hàng nói gì về chăn ga và đồ tắm Brooklinen."
              : "Real feedback from hundreds of thousands of sleepers who upgraded their bed and bath."}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...reviews, ...reviews].map((r, i) => (
            <article key={`${r.author}-${i}`} className="rounded-2xl border border-[#ECE7E2] bg-white p-7">
              <StarRating rating={5} size={15} />
              <h2 className="mt-3 font-toledo text-[23px] text-[#283455]">{r.title}</h2>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[#3D4866]">{r.quote}</p>
              <p className="mt-4 text-[14px] font-bold text-[#283455]">{r.author}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  // FAQ & Support
  if (slug === "faq") {
    return (
      <div className="mx-auto max-w-[860px] px-5 py-12 lg:py-16">
        <h1 className="font-toledo text-[36px] text-[#283455] lg:text-[44px]">
          {locale === "vi" ? "Hỏi Đáp & Hỗ Trợ" : "FAQ & Support"}
        </h1>
        <section
          aria-label={locale === "vi" ? "Câu hỏi thường gặp" : "Frequently Asked Questions"}
          className="mt-8 divide-y divide-[#E5E0DB] rounded-2xl border border-[#ECE7E2] bg-white px-6"
        >
          {FAQS[locale].map((item, i) => (
            <details key={item.q} name="faq" open={i === 0} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-bold text-[#283455]">
                <span>{item.q}</span>
                <span className="shrink-0 text-xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-[#3D4866]">{item.a}</p>
            </details>
          ))}
        </section>
      </div>
    );
  }

  // Contact page
  if (slug === "contact") {
    return (
      <div className="mx-auto max-w-[640px] px-5 py-12 lg:py-16">
        <h1 className="font-toledo text-[36px] text-[#283455]">
          {locale === "vi" ? "Liên Hệ Với Chúng Tôi" : "Contact Us"}
        </h1>
        <p className="mt-2 text-[15.5px] text-[#3D4866]">
          {locale === "vi"
            ? "Đội ngũ chăm sóc khách hàng của Brooklinen luôn sẵn sàng hỗ trợ về chọn size, chất liệu và đơn hàng."
            : "Our customer experience team is here 7 days a week for sizing, fabric, and order help."}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setContactSent(true);
          }}
          className="mt-7 space-y-4 rounded-2xl border border-[#ECE7E2] bg-white p-7"
        >
          <div>
            <label htmlFor="c-name" className="block text-[13px] font-bold">
              {locale === "vi" ? "Tên của bạn" : "Your Name"}
            </label>
            <input
              id="c-name"
              type="text"
              autoComplete="name"
              required
              className="mt-1.5 h-11 w-full rounded-xl border border-[#C9CFD9] px-4 text-[14.5px]"
            />
          </div>
          <div>
            <label htmlFor="c-email" className="block text-[13px] font-bold">
              Email
            </label>
            <input
              id="c-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              className="mt-1.5 h-11 w-full rounded-xl border border-[#C9CFD9] px-4 text-[14.5px]"
            />
          </div>
          <div>
            <label htmlFor="c-msg" className="block text-[13px] font-bold">
              {locale === "vi" ? "Nội dung cần hỗ trợ" : "How can we help?"}
            </label>
            <textarea
              id="c-msg"
              rows={4}
              required
              className="mt-1.5 w-full rounded-xl border border-[#C9CFD9] p-4 text-[14.5px]"
            />
          </div>
          <button
            type="submit"
            className="h-[50px] cursor-pointer rounded-[20px] bg-[#283455] px-8 text-[14px] font-bold text-white"
          >
            {locale === "vi" ? "Gửi Tin Nhắn" : "Send Message"}
          </button>
          {contactSent && (
            <p role="status" className="rounded-xl bg-[#EAF3E4] p-3 text-[13.5px] font-medium text-[#417823]">
              {locale === "vi"
                ? "Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm."
                : "Thanks for reaching out! Our team has received your message."}
            </p>
          )}
        </form>
      </div>
    );
  }

  // Gift card balance checker
  if (slug === "check-gift-card-balance") {
    return (
      <div className="mx-auto max-w-[540px] px-5 py-14">
        <div className="rounded-2xl border border-[#ECE7E2] bg-white p-8">
          <h1 className="font-toledo text-[32px] text-[#283455]">
            {locale === "vi" ? "Kiểm Tra Số Dư Thẻ Quà Tặng" : "Check Gift Card Balance"}
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setGiftResult(
                locale === "vi"
                  ? `Mã thẻ ${giftCode.toUpperCase() || "DEMO"} hiện có số dư khả dụng: 2.500.000₫ (dữ liệu demo).`
                  : `Card ${giftCode.toUpperCase() || "DEMO"} has an available demo balance of $100.00.`
              );
            }}
            className="mt-5 space-y-4"
          >
            <input
              type="text"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              placeholder={locale === "vi" ? "Nhập mã thẻ quà tặng..." : "Enter gift card code..."}
              className="h-12 w-full rounded-xl border border-[#C9CFD9] px-4 text-[15px]"
            />
            <button
              type="submit"
              className="h-[50px] w-full cursor-pointer rounded-[20px] bg-[#283455] text-[14px] font-bold text-white"
            >
              {locale === "vi" ? "Kiểm Tra Số Dư" : "Check Balance"}
            </button>
            {giftResult && (
              <p role="status" className="rounded-xl bg-[#F9F3ED] p-3.5 text-[14px] font-medium text-[#283455]">
                {giftResult}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Generic editorial / legal / blog page
  const info = PAGE_TITLES[slug] || {
    en: slug
      .split("-")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
      .join(" "),
    vi: slug
      .split("-")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
      .join(" "),
    enLead: "Official Brooklinen information page recreated locally for seamless navigation.",
    viLead: "Trang thông tin Brooklinen được dựng local giúp trải nghiệm duyệt web liền mạch.",
  };

  return (
    <div className="mx-auto max-w-[920px] px-5 py-14 lg:py-16">
      <nav aria-label="Breadcrumb" className="mb-4 text-[13px] text-[#5B647A]">
        <Link href="/" className="hover:underline">
          {locale === "vi" ? "Trang chủ" : "Home"}
        </Link>{" "}
        / <span className="font-bold text-[#283455]">{locale === "vi" ? info.vi : info.en}</span>
      </nav>
      <h1 className="font-toledo text-[36px] text-[#283455] lg:text-[46px]">
        {locale === "vi" ? info.vi : info.en}
      </h1>
      <p className="mt-4 text-[17px] leading-[1.6] text-[#3D4866]">
        {locale === "vi" ? info.viLead : info.enLead}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 rounded-2xl bg-[#F9F3ED] p-8 sm:grid-cols-3">
        {UI_COPY[locale].valueProps.map((vp) => (
          <div key={vp.title}>
            <h2 className="text-[13.5px] font-bold tracking-[0.1em] uppercase text-[#283455]">
              {vp.title}
            </h2>
            <p className="mt-2 text-[14.5px] text-[#3D4866]">{vp.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/collections/best-sellers"
          className="inline-flex h-[52px] items-center justify-center rounded-[20px] bg-[#283455] px-8 text-[14px] font-bold text-white hover:bg-[#1D2742]"
        >
          {locale === "vi" ? "Mua Sản Phẩm Bán Chạy" : "Shop Best Sellers"}
        </Link>
        <Link
          href="/"
          className="inline-flex h-[52px] items-center justify-center rounded-[20px] border border-[#283455] px-8 text-[14px] font-bold text-[#283455] hover:bg-[#283455] hover:text-white"
        >
          {locale === "vi" ? "Về Trang Chủ" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}
