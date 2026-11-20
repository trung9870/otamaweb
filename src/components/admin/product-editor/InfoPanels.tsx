"use client";

import { useId, useState } from "react";
import {
  BADGE_OPTIONS,
  EYEBROW_SUGGESTIONS,
  LocaleNote,
  PanelCard,
  SECTION_OPTIONS,
  TAG_OPTIONS,
  WhereChip,
  hintCls,
  inputCls,
  labelCls,
  vndFromUsd,
  type PanelProps,
} from "./shared";
import {
  computeDiscountBadge,
  slugifyText,
  type StoreCategory,
} from "@/lib/store-types";

/* ========================================================================== */
/* 1. THÔNG TIN CƠ BẢN                                                         */
/* ========================================================================== */
export function BasicInfoPanel({
  draft,
  patch,
  onRegionFocus,
  categories,
  isNew,
}: PanelProps & { categories: StoreCategory[]; isNew: boolean }) {
  const id = useId();
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const updateTitle = (field: "titleVi" | "titleEn", value: string) => {
    const next: Parameters<typeof patch>[0] = { [field]: value };
    if (!slugTouched) {
      const source = field === "titleEn" ? value || draft.titleVi : draft.titleEn || value;
      next.slug = slugifyText(source);
    }
    patch(next);
  };

  return (
    <div className="space-y-4">
      <PanelCard
        title="Tên sản phẩm"
        region="pd-title"
        onRegionFocus={onRegionFocus}
        hint="Hiện ở tiêu đề lớn và dòng đường dẫn nhỏ phía trên trang sản phẩm."
      >
        <div>
          <label htmlFor={`${id}-tvi`} className={labelCls}>
            Tên Tiếng Việt{" "}
            <span aria-hidden="true" className="text-[#740103]">
              *
            </span>
          </label>
          <input
            id={`${id}-tvi`}
            name="titleVi"
            type="text"
            required
            value={draft.titleVi}
            onChange={(e) => updateTitle("titleVi", e.target.value)}
            placeholder="VD: Bộ Ga Giường Cotton Satin Cao Cấp"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor={`${id}-ten`} className={labelCls}>
            Tên Tiếng Anh <span className="font-normal text-[#5B647A]">(tùy chọn)</span>
          </label>
          <input
            id={`${id}-ten`}
            name="titleEn"
            type="text"
            value={draft.titleEn}
            onChange={(e) => updateTitle("titleEn", e.target.value)}
            placeholder="VD: Luxe Sateen Core Sheet Set"
            className={inputCls}
          />
        </div>
      </PanelCard>

      <PanelCard title="Đường dẫn & Danh mục" region="pd-title" onRegionFocus={onRegionFocus}>
        <div>
          <label htmlFor={`${id}-slug`} className={labelCls}>
            Đường dẫn trang (URL)
          </label>
          <div className="mt-1.5 flex items-center overflow-hidden rounded-xl border border-[#8E96A8] bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#283455]">
            <span className="shrink-0 bg-[#F3EDE7] px-2.5 py-3 font-mono text-[12px] text-[#5B647A]">
              /products/
            </span>
            <input
              id={`${id}-slug`}
              name="slug"
              type="text"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              aria-describedby={`${id}-slug-hint`}
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                patch({ slug: e.target.value });
              }}
              onBlur={(e) => patch({ slug: slugifyText(e.target.value) })}
              placeholder="bo-ga-giuong-cotton"
              className="min-h-[46px] min-w-0 flex-1 border-0 bg-transparent px-2 font-mono text-[13px] outline-none"
            />
          </div>
          <p id={`${id}-slug-hint`} className={hintCls}>
            {isNew && !slugTouched
              ? "Tự tạo theo tên sản phẩm. Chỉ dùng chữ thường không dấu và dấu gạch ngang."
              : "Đổi đường dẫn sẽ làm link cũ (đã chia sẻ) không mở được nữa."}
          </p>
        </div>

        <div>
          <label htmlFor={`${id}-cat`} className={labelCls}>
            Danh mục chính <WhereChip>dòng đường dẫn nhỏ</WhereChip>
          </label>
          <select
            id={`${id}-cat`}
            name="categorySlug"
            value={draft.categorySlug}
            onChange={(e) => patch({ categorySlug: e.target.value })}
            className={inputCls}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.titleVi}
              </option>
            ))}
          </select>
        </div>
      </PanelCard>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5E0DB] bg-white px-3.5 py-3">
        <input
          type="checkbox"
          checked={draft.active}
          onChange={(e) => patch({ active: e.target.checked })}
          className="mt-0.5 h-5 w-5"
        />
        <span>
          <span className="block text-[14px] font-bold">Đang bán ngoài cửa hàng</span>
          <span className="block text-[12px] text-[#5B647A]">
            Bỏ chọn để tạm ẩn sản phẩm khỏi web (không xóa dữ liệu).
          </span>
        </span>
      </label>
    </div>
  );
}

/* ========================================================================== */
/* 2. GIÁ & NHÃN KHUYẾN MÃI                                                    */
/* ========================================================================== */
export function PricingPanel({
  draft,
  patch,
  onRegionFocus,
  vndRate,
}: PanelProps & { vndRate: number }) {
  const id = useId();
  const rate = Math.max(vndRate, 1);
  const [saleText, setSaleText] = useState(String(vndFromUsd(draft.salePriceUsd, rate)));
  const [origText, setOrigText] = useState(
    draft.originalPriceUsd > 0 ? String(vndFromUsd(draft.originalPriceUsd, rate)) : ""
  );

  const saleVnd = Number(saleText || 0);
  const origVnd = Number(origText || 0);
  const discount = computeDiscountBadge(draft.salePriceUsd, draft.originalPriceUsd);

  const applySale = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    setSaleText(clean);
    const usd = Math.max(1, Math.round(Number(clean || 0) / rate));
    patch({
      salePriceUsd: usd,
      discountBadge: computeDiscountBadge(usd, draft.originalPriceUsd),
    });
  };

  const applyOrig = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    setOrigText(clean);
    const usd = clean ? Math.round(Number(clean) / rate) : 0;
    patch({
      originalPriceUsd: usd,
      discountBadge: computeDiscountBadge(draft.salePriceUsd, usd),
    });
  };

  return (
    <div className="space-y-4">
      <PanelCard
        title="Giá bán"
        region="pd-pricing"
        onRegionFocus={onRegionFocus}
        hint="Nhập giá khởi điểm bằng VNĐ (bản tiếng Anh tự đổi sang USD; cỡ lớn hơn như Queen/King tự cộng thêm theo kích cỡ)."
      >
        <div>
          <label htmlFor={`${id}-sale`} className={labelCls}>
            Giá bán (VNĐ){" "}
            <span aria-hidden="true" className="text-[#740103]">
              *
            </span>
          </label>
          <input
            id={`${id}-sale`}
            name="salePriceVnd"
            type="text"
            inputMode="numeric"
            required
            aria-describedby={`${id}-sale-hint`}
            value={saleText}
            onChange={(e) => applySale(e.target.value)}
            className={`${inputCls} font-bold`}
          />
          <p id={`${id}-sale-hint`} className={hintCls}>
            Khách thấy: <strong>{saleVnd.toLocaleString("vi-VN")}₫</strong> · Bản tiếng Anh:{" "}
            <strong>${draft.salePriceUsd}</strong>
          </p>
        </div>
        <div>
          <label htmlFor={`${id}-orig`} className={labelCls}>
            Giá gốc trước giảm (VNĐ){" "}
            <span className="font-normal text-[#5B647A]">— bỏ trống nếu không giảm giá</span>
          </label>
          <input
            id={`${id}-orig`}
            name="originalPriceVnd"
            type="text"
            inputMode="numeric"
            aria-describedby={`${id}-orig-hint`}
            value={origText}
            onChange={(e) => applyOrig(e.target.value)}
            className={inputCls}
          />
          <p id={`${id}-orig-hint`} className={hintCls}>
            {discount ? (
              <>
                Hiện giá gạch ngang{" "}
                <span className="line-through">{origVnd.toLocaleString("vi-VN")}₫</span> và nhãn{" "}
                <span className="rounded bg-[#EAF3E4] px-1.5 py-0.5 font-bold text-[#417823]">
                  Giảm {discount.replace("% Off", "%")}
                </span>{" "}
                (tự tính)
              </>
            ) : (
              "Không hiển thị giá gạch ngang."
            )}
          </p>
        </div>
      </PanelCard>

      <PanelCard
        title="Dòng khuyến mãi nhỏ"
        region="pd-pricing"
        onRegionFocus={onRegionFocus}
        hint="Dòng chữ in hoa nhỏ phía trên tên sản phẩm, có biểu tượng ✦."
      >
        <div>
          <label htmlFor={`${id}-eyebrow`} className={labelCls}>
            Nội dung <WhereChip>phía trên tên sản phẩm</WhereChip>
          </label>
          <input
            id={`${id}-eyebrow`}
            name="promoEyebrow"
            type="text"
            value={draft.promoEyebrow}
            onChange={(e) => patch({ promoEyebrow: e.target.value })}
            placeholder="VD: BLACK FRIDAY SALE (bỏ trống để ẩn)"
            className={inputCls}
          />
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Gợi ý nhanh">
            {EYEBROW_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={draft.promoEyebrow === s}
                onClick={() => patch({ promoEyebrow: s })}
                className={`min-h-[32px] cursor-pointer rounded-full border px-2.5 text-[11.5px] font-bold ${
                  draft.promoEyebrow === s
                    ? "border-[#283455] bg-[#283455] text-white"
                    : "border-[#C9CFD9] bg-white text-[#283455] hover:bg-[#F9F3ED]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <fieldset>
          <legend className={labelCls}>Màu chữ</legend>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {(
              [
                { v: "sale", label: "Xanh lá (Ưu đãi)", color: "#417823" },
                { v: "urgent", label: "Cam (Sắp hết hàng)", color: "#AA3F00" },
              ] as const
            ).map((o) => (
              <label
                key={o.v}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#C9CFD9] p-2.5 text-[13px] font-bold has-[:checked]:border-[#283455] has-[:checked]:bg-[#F9F3ED]"
              >
                <input
                  type="radio"
                  name={`${id}-tone`}
                  value={o.v}
                  checked={draft.promoTone === o.v}
                  onChange={() => patch({ promoTone: o.v })}
                  className="h-4 w-4"
                />
                <span style={{ color: o.color }}>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </PanelCard>

      <PanelCard
        title="Nhãn góc ảnh"
        region="pd-gallery"
        onRegionFocus={onRegionFocus}
        hint="Nhãn trắng nhỏ ở góc trên bên trái ảnh sản phẩm."
      >
        <label htmlFor={`${id}-badge`} className="visually-hidden">
          Nhãn góc ảnh
        </label>
        <select
          id={`${id}-badge`}
          name="topBadge"
          value={draft.topBadge}
          onChange={(e) => patch({ topBadge: e.target.value })}
          className={inputCls}
        >
          {BADGE_OPTIONS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </PanelCard>
    </div>
  );
}

/* ========================================================================== */
/* 5. MÔ TẢ & THÔNG SỐ                                                         */
/* ========================================================================== */
export function DescriptionPanel({ draft, patch, onRegionFocus, locale }: PanelProps) {
  const id = useId();
  const isVi = locale === "vi";
  const [includesText, setIncludesText] = useState(
    (isVi ? draft.includesVi : draft.includesEn).join("\n")
  );

  return (
    <div className="space-y-4">
      <LocaleNote locale={locale} />

      <PanelCard
        title="Mô tả ngắn"
        region="pd-description"
        onRegionFocus={onRegionFocus}
        hint="Đoạn văn ngay dưới giá, cạnh nút Thêm vào giỏ."
      >
        <label htmlFor={`${id}-desc`} className="visually-hidden">
          Mô tả ngắn
        </label>
        <textarea
          id={`${id}-desc`}
          rows={4}
          value={isVi ? draft.descriptionVi : draft.descriptionEn}
          onChange={(e) =>
            patch(isVi ? { descriptionVi: e.target.value } : { descriptionEn: e.target.value })
          }
          placeholder={isVi ? "Giới thiệu ngắn gọn về sản phẩm..." : "Short product summary..."}
          className={`${inputCls} py-2`}
        />
      </PanelCard>

      <PanelCard
        title="Bộ sản phẩm bao gồm"
        region="pd-description"
        onRegionFocus={onRegionFocus}
        hint="Mỗi dòng là một gạch đầu dòng trong mục mở/đóng đầu tiên."
      >
        <label htmlFor={`${id}-inc`} className="visually-hidden">
          Bộ sản phẩm bao gồm
        </label>
        <textarea
          id={`${id}-inc`}
          rows={4}
          value={includesText}
          onChange={(e) => {
            setIncludesText(e.target.value);
            const lines = e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean);
            patch(isVi ? { includesVi: lines } : { includesEn: lines });
          }}
          placeholder={isVi ? "1 Ga chun bọc đệm\n2 Vỏ gối nằm" : "1 Fitted sheet\n2 Pillowcases"}
          className={`${inputCls} py-2`}
        />
      </PanelCard>

      <PanelCard
        title="Hướng dẫn bảo quản"
        region="pd-description"
        onRegionFocus={onRegionFocus}
      >
        <label htmlFor={`${id}-care`} className="visually-hidden">
          Hướng dẫn bảo quản
        </label>
        <textarea
          id={`${id}-care`}
          rows={3}
          value={isVi ? draft.careVi : draft.careEn}
          onChange={(e) => patch(isVi ? { careVi: e.target.value } : { careEn: e.target.value })}
          className={`${inputCls} py-2`}
        />
      </PanelCard>
    </div>
  );
}

/* ========================================================================== */
/* 7. HIỂN THỊ & PHÂN LOẠI                                                     */
/* ========================================================================== */
export function VisibilityPanel({
  draft,
  patch,
  locale,
  vndRate,
}: PanelProps & { vndRate: number }) {
  const title = locale === "vi" ? draft.titleVi || draft.titleEn : draft.titleEn || draft.titleVi;
  const price = (usd: number) =>
    locale === "vi" ? `${vndFromUsd(usd, vndRate).toLocaleString("vi-VN")}₫` : `$${usd}`;
  const badge = BADGE_OPTIONS.find((b) => b.value === draft.topBadge);
  const discount = computeDiscountBadge(draft.salePriceUsd, draft.originalPriceUsd);

  return (
    <div className="space-y-4">
      <PanelCard
        title="Xem trước thẻ sản phẩm"
        hint="Sản phẩm trông như thế này trong các danh sách trên trang chủ và trang danh mục."
      >
        <div className="mx-auto w-full max-w-[240px]">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-[#F4F4F6]">
            {draft.mainImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.mainImage} alt="" className="h-full w-full object-cover" />
            )}
            {draft.topBadge && (
              <span className="absolute top-2 left-2 rounded-full bg-white px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-[#283455] shadow-xs">
                {locale === "vi" ? badge?.label : draft.topBadge}
              </span>
            )}
          </div>
          {draft.promoEyebrow && (
            <p
              className="mt-2 text-[10px] font-bold uppercase tracking-[0.08em]"
              style={{ color: draft.promoTone === "urgent" ? "#AA3F00" : "#417823" }}
            >
              ✦ {draft.promoEyebrow}
            </p>
          )}
          <p className="mt-1 text-[14px] leading-tight font-bold text-[#283455]">
            {title || "Tên sản phẩm"}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-1 text-[12px] text-[#283455]">
            {draft.originalPriceUsd > draft.salePriceUsd && (
              <span className="text-[#6E6E6E] line-through">{price(draft.originalPriceUsd)}</span>
            )}
            <span className="font-bold">{price(draft.salePriceUsd)}</span>
            {discount && (
              <span className="rounded bg-[#EAF3E4] px-1.5 text-[10.5px] font-bold text-[#417823]">
                {locale === "vi" ? `Giảm ${discount.replace("% Off", "%")}` : discount}
              </span>
            )}
          </p>
        </div>
      </PanelCard>

      <PanelCard
        title="Hiện ở mục nào trên Trang chủ"
        hint="Thứ tự sản phẩm trong từng mục được chỉnh ở tab Bố cục Trang chủ."
      >
        <div className="space-y-2">
          {SECTION_OPTIONS.map((sec) => (
            <label
              key={sec.key}
              className="flex min-h-[40px] cursor-pointer items-center gap-2.5 text-[14px]"
            >
              <input
                type="checkbox"
                checked={draft.sections.includes(sec.key)}
                onChange={() =>
                  patch({
                    sections: draft.sections.includes(sec.key)
                      ? draft.sections.filter((s) => s !== sec.key)
                      : [...draft.sections, sec.key],
                  })
                }
                className="h-4 w-4"
              />
              <span>{sec.label}</span>
            </label>
          ))}
        </div>
      </PanelCard>

      <PanelCard
        title="Nhóm lọc (Tags)"
        hint="Giúp sản phẩm xuất hiện đúng trong các trang danh mục có lọc theo nhóm."
      >
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((t) => {
            const checked = draft.tags.includes(t.tag);
            return (
              <label
                key={t.tag}
                className={`relative inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-bold select-none transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#283455] ${
                  checked
                    ? "border-[#283455] bg-[#283455] text-white"
                    : "border-[#C9CFD9] bg-[#FDFAF8] text-[#283455]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    patch({
                      tags: checked
                        ? draft.tags.filter((x) => x !== t.tag)
                        : [...draft.tags, t.tag],
                    })
                  }
                  className="visually-hidden"
                />
                <span aria-hidden="true">{checked ? "✓" : "+"}</span>
                <span>{t.label}</span>
              </label>
            );
          })}
        </div>
      </PanelCard>
    </div>
  );
}
