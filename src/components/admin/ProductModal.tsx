"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { CategoryTag } from "@/components/sites/brooklinen/catalog";
import type { SwatchItem } from "@/components/sites/brooklinen/data";
import {
  computeDiscountBadge,
  slugifyText,
  type HomepageSectionKey,
  type StoreCategory,
  type StoreProduct,
} from "@/lib/store-types";

interface ProductModalProps {
  open: boolean;
  product: StoreProduct | null;
  categories: StoreCategory[];
  vndRate: number;
  onClose: () => void;
  onSaved: (saved: StoreProduct, isNew: boolean) => void;
}

const BADGE_OPTIONS = [
  { value: "", label: "Không có nhãn" },
  { value: "BEST SELLER", label: "Bán chạy (BEST SELLER)" },
  { value: "NEW", label: "Mới (NEW)" },
  { value: "SOFTEST", label: "Mềm nhất (SOFTEST)" },
  { value: "COOLING", label: "Mát lạnh (COOLING)" },
  { value: "LIMITED EDITION", label: "Giới hạn (LIMITED EDITION)" },
  { value: "BACK IN STOCK", label: "Đã về hàng (BACK IN STOCK)" },
];

const TAG_OPTIONS: { tag: CategoryTag; label: string }[] = [
  { tag: "sheets", label: "Ga giường" },
  { tag: "bed", label: "Chăn gối" },
  { tag: "bath", label: "Phòng tắm" },
  { tag: "throws", label: "Chăn đắp" },
  { tag: "bundles", label: "Combo" },
  { tag: "gifts", label: "Quà tặng" },
  { tag: "trending", label: "Mới & Hot" },
  { tag: "sale", label: "Sale" },
  { tag: "awards", label: "Đạt giải" },
];

const SECTION_OPTIONS: { key: HomepageSectionKey; label: string }[] = [
  { key: "bestOfSale", label: "Mục Sale Nổi Bật (Trang chủ)" },
  { key: "giftGuide", label: "Mục Gợi Ý Quà Tặng (Trang chủ)" },
  { key: "collection", label: "Mục Bộ Sưu Tập (Trang chủ)" },
];

export function ProductModal({
  open,
  product,
  categories,
  vndRate,
  onClose,
  onSaved,
}: ProductModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isEdit = Boolean(product);

  const [titleVi, setTitleVi] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [slug, setSlug] = useState("");
  const [categorySlug, setCategorySlug] = useState("all-sheets");
  const [salePriceVnd, setSalePriceVnd] = useState("2500000");
  const [originalPriceVnd, setOriginalPriceVnd] = useState("3300000");
  const [topBadge, setTopBadge] = useState("NEW");
  const [promoEyebrow, setPromoEyebrow] = useState("BLACK FRIDAY SALE");
  const [promoTone, setPromoTone] = useState<"sale" | "urgent">("sale");
  const [mainImage, setMainImage] = useState("");
  const [hoverImage, setHoverImage] = useState("");
  const [descriptionVi, setDescriptionVi] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [careVi, setCareVi] = useState("");
  const [careEn, setCareEn] = useState("");
  const [tags, setTags] = useState<CategoryTag[]>(["sale", "sheets"]);
  const [sections, setSections] = useState<HomepageSectionKey[]>(["bestOfSale"]);
  const [swatches, setSwatches] = useState<SwatchItem[]>([]);
  const [active, setActive] = useState(true);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open) {
      if (product) {
        setTitleVi(product.titleVi);
        setTitleEn(product.titleEn);
        setSlug(product.slug);
        setCategorySlug(product.categorySlug || "all-sheets");
        setSalePriceVnd(String(Math.round(product.salePriceUsd * vndRate)));
        setOriginalPriceVnd(
          product.originalPriceUsd > 0
            ? String(Math.round(product.originalPriceUsd * vndRate))
            : ""
        );
        setTopBadge(product.topBadge || "");
        setPromoEyebrow(product.promoEyebrow || "");
        setPromoTone(product.promoTone || "sale");
        setMainImage(product.mainImage || "");
        setHoverImage(product.hoverImage || "");
        setDescriptionVi(product.descriptionVi || "");
        setDescriptionEn(product.descriptionEn || "");
        setCareVi(product.careVi || "");
        setCareEn(product.careEn || "");
        setTags(product.tags.length > 0 ? product.tags : ["sale"]);
        setSections(product.sections || []);
        setSwatches(product.swatches || []);
        setActive(product.active);
      } else {
        setTitleVi("");
        setTitleEn("");
        setSlug("");
        setCategorySlug(categories[0]?.slug || "all-sheets");
        setSalePriceVnd("2500000");
        setOriginalPriceVnd("3300000");
        setTopBadge("NEW");
        setPromoEyebrow("BLACK FRIDAY SALE");
        setPromoTone("sale");
        setMainImage(
          "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg"
        );
        setHoverImage("");
        setDescriptionVi("");
        setDescriptionEn("");
        setCareVi("Giặt máy chế độ nước lạnh với đồ cùng màu. Sấy nhẹ ở nhiệt độ thấp.");
        setCareEn("Machine wash cold with like colors. Tumble dry low.");
        setTags(["sale", "sheets"]);
        setSections(["bestOfSale"]);
        setSwatches([]);
        setActive(true);
      }
      setErrorMsg(null);
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [open, product, categories, vndRate]);

  const parsedSaleVnd = Math.max(0, Number(salePriceVnd.replace(/[^0-9]/g, "")) || 0);
  const parsedOrigVnd = Math.max(0, Number(originalPriceVnd.replace(/[^0-9]/g, "")) || 0);
  const saleUsd = Math.max(1, Math.round(parsedSaleVnd / Math.max(vndRate, 1)));
  const origUsd = parsedOrigVnd > 0 ? Math.round(parsedOrigVnd / Math.max(vndRate, 1)) : 0;
  const previewDiscount = computeDiscountBadge(saleUsd, origUsd);

  const handleUploadFile = async (
    e: ChangeEvent<HTMLInputElement>,
    target: "main" | "hover" | { swatchIdx: number }
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const fieldId =
      typeof target === "string" ? target : `swatch-${target.swatchIdx}`;
    setUploadingField(fieldId);
    setErrorMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Tải ảnh thất bại.");
      }
      if (target === "main") {
        setMainImage(data.url);
      } else if (target === "hover") {
        setHoverImage(data.url);
      } else {
        setSwatches((prev) =>
          prev.map((sw, idx) =>
            idx === target.swatchIdx
              ? { ...sw, mainImage: data.url!, swatchImage: data.url! }
              : sw
          )
        );
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Tải ảnh thất bại.");
    } finally {
      setUploadingField(null);
    }
  };

  const toggleTag = (tag: CategoryTag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSection = (sec: HomepageSectionKey) => {
    setSections((prev) =>
      prev.includes(sec) ? prev.filter((s) => s !== sec) : [...prev, sec]
    );
  };

  const handleAddSwatch = () => {
    setSwatches((prev) => [
      ...prev,
      {
        label: "Màu mới",
        color: "#D9D4CE",
        mainImage: mainImage || "",
        hoverImage: hoverImage || mainImage || "",
      },
    ]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!titleVi.trim() && !titleEn.trim()) {
      setErrorMsg("Vui lòng nhập tên sản phẩm.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const payload = {
      slug: slug.trim() || slugifyText(titleEn || titleVi),
      titleVi: titleVi.trim() || titleEn.trim(),
      titleEn: titleEn.trim() || titleVi.trim(),
      categorySlug,
      salePriceUsd: saleUsd,
      originalPriceUsd: origUsd,
      discountBadge: previewDiscount,
      topBadge,
      promoEyebrow,
      promoTone,
      mainImage: mainImage.trim(),
      hoverImage: hoverImage.trim() || mainImage.trim(),
      descriptionVi: descriptionVi.trim(),
      descriptionEn: descriptionEn.trim() || descriptionVi.trim(),
      careVi: careVi.trim(),
      careEn: careEn.trim() || careVi.trim(),
      tags: tags.length > 0 ? tags : ["sale"],
      sections,
      swatches: swatches.filter((s) => s.label.trim()),
      active,
    };

    try {
      const endpoint = isEdit
        ? `/api/admin/products/${encodeURIComponent(product!.id)}`
        : "/api/admin/products";
      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { product?: StoreProduct; error?: string };
      if (!res.ok || !data.product) {
        throw new Error(data.error || "Không thể lưu sản phẩm.");
      }
      onSaved(data.product, !isEdit);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Không thể lưu sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="product-modal-title"
      onClose={() => {
        if (dialogRef.current) dialogRef.current.returnValue = "";
        onClose();
      }}
      className="admin-dialog"
    >
      <div className="flex max-h-[90svh] flex-col overflow-hidden rounded-2xl bg-[#FDFAF8] text-[#283455] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0DB] bg-white px-6 py-4">
          <div>
            <h2 id="product-modal-title" className="text-[20px] font-bold text-[#283455]">
              {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <p className="text-[13px] text-[#5B647A]">
              Nhập giá bằng VNĐ — hệ thống tự động quy đổi sang USD khi khách chọn tiếng Anh.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ sản phẩm"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-2xl text-[#283455] hover:bg-[#F3EDE7]"
          >
            &times;
          </button>
        </div>

        {/* Body Form */}
        <form
          onSubmit={handleSubmit}
          aria-labelledby="product-modal-title"
          className="flex-1 space-y-6 overflow-y-auto px-6 py-5"
        >
          {errorMsg && (
            <div
              role="alert"
              className="rounded-xl border border-[#D93025]/40 bg-[#FCE8E6] px-4 py-3 text-[14px] font-medium text-[#A50E0E]"
            >
              {errorMsg}
            </div>
          )}

          {/* Names & Slug */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pm-title-vi" className="block text-[13.5px] font-bold">
                Tên sản phẩm (Tiếng Việt){" "}
                <span aria-hidden="true" className="text-[#740103]">
                  *
                </span>
              </label>
              <input
                id="pm-title-vi"
                name="titleVi"
                type="text"
                autoFocus
                required
                value={titleVi}
                onChange={(e) => {
                  setTitleVi(e.target.value);
                  if (!isEdit && !titleEn) {
                    setSlug(slugifyText(e.target.value));
                  }
                }}
                placeholder="VD: Bộ Ga Giường Cotton Satin Cao Cấp"
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
              />
              <div className="admin-error-msg">Vui lòng nhập tên sản phẩm.</div>
            </div>

            <div>
              <label htmlFor="pm-title-en" className="block text-[13.5px] font-bold">
                Tên sản phẩm (Tiếng Anh)
              </label>
              <input
                id="pm-title-en"
                name="titleEn"
                type="text"
                value={titleEn}
                onChange={(e) => {
                  setTitleEn(e.target.value);
                  if (!isEdit) {
                    setSlug(slugifyText(e.target.value || titleVi));
                  }
                }}
                placeholder="VD: Luxe Sateen Core Sheet Set"
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pm-slug" className="block text-[13.5px] font-bold">
                Đường dẫn URL (slug)
              </label>
              <input
                id="pm-slug"
                name="slug"
                type="text"
                spellCheck={false}
                autoCapitalize="none"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="bo-ga-giuong-cotton-satin"
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 font-mono text-[14px]"
              />
            </div>

            <div>
              <label htmlFor="pm-category" className="block text-[13.5px] font-bold">
                Danh mục chính
              </label>
              <select
                id="pm-category"
                name="categorySlug"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.titleVi} ({c.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing in VNĐ with live USD preview */}
          <div className="rounded-xl border border-[#E5E0DB] bg-white p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pm-price-vnd" className="block text-[13.5px] font-bold">
                  Giá bán (VNĐ){" "}
                  <span aria-hidden="true" className="text-[#740103]">
                    *
                  </span>
                </label>
                <input
                  id="pm-price-vnd"
                  name="salePriceVnd"
                  type="text"
                  inputMode="numeric"
                  required
                  value={salePriceVnd}
                  onChange={(e) => setSalePriceVnd(e.target.value.replace(/[^0-9]/g, ""))}
                  className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 font-bold"
                />
                <p className="mt-1 text-[12.5px] text-[#5B647A]">
                  Hiển thị: <strong>{parsedSaleVnd.toLocaleString("vi-VN")}₫</strong> &middot;
                  Bản tiếng Anh: <strong>${saleUsd}</strong>
                </p>
              </div>

              <div>
                <label htmlFor="pm-orig-vnd" className="block text-[13.5px] font-bold">
                  Giá gốc trước giảm (VNĐ — bỏ trống nếu không sale)
                </label>
                <input
                  id="pm-orig-vnd"
                  name="originalPriceVnd"
                  type="text"
                  inputMode="numeric"
                  value={originalPriceVnd}
                  onChange={(e) =>
                    setOriginalPriceVnd(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
                />
                <p className="mt-1 text-[12.5px] text-[#5B647A]">
                  {origUsd > saleUsd ? (
                    <>
                      Gạch ngang:{" "}
                      <span className="line-through">
                        {parsedOrigVnd.toLocaleString("vi-VN")}₫
                      </span>{" "}
                      &middot; Nhãn:{" "}
                      <span className="rounded bg-[#EAF3E4] px-1.5 py-0.5 font-bold text-[#417823]">
                        {previewDiscount}
                      </span>
                    </>
                  ) : (
                    "Không hiển thị giá gạch ngang"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Product Images with direct upload */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E5E0DB] bg-white p-4">
              <label htmlFor="pm-main-img" className="block text-[13.5px] font-bold">
                Ảnh chính sản phẩm
              </label>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#E5E0DB] bg-[#F4F4F6]">
                  {mainImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mainImage}
                      alt="Xem trước ảnh chính"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <label className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-xl bg-[#283455] px-3.5 py-2 text-[13px] font-bold text-white hover:bg-[#1D2742]">
                    {uploadingField === "main" ? "Đang tải..." : "Tải ảnh từ máy"}
                    <input
                      type="file"
                      accept="image/*"
                      className="visually-hidden"
                      onChange={(e) => void handleUploadFile(e, "main")}
                    />
                  </label>
                </div>
              </div>
              <input
                id="pm-main-img"
                name="mainImage"
                type="text"
                spellCheck={false}
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                placeholder="/api/media/... hoặc https://..."
                className="admin-input mt-2.5 w-full rounded-xl border border-[#8E96A8] px-3 text-[13px]"
              />
            </div>

            <div className="rounded-xl border border-[#E5E0DB] bg-white p-4">
              <label htmlFor="pm-hover-img" className="block text-[13.5px] font-bold">
                Ảnh phụ khi rê chuột (tùy chọn)
              </label>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#E5E0DB] bg-[#F4F4F6]">
                  {(hoverImage || mainImage) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={hoverImage || mainImage}
                      alt="Xem trước ảnh phụ"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <label className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-xl border border-[#283455] px-3.5 py-2 text-[13px] font-bold text-[#283455] hover:bg-[#F9F3ED]">
                    {uploadingField === "hover" ? "Đang tải..." : "Tải ảnh phụ"}
                    <input
                      type="file"
                      accept="image/*"
                      className="visually-hidden"
                      onChange={(e) => void handleUploadFile(e, "hover")}
                    />
                  </label>
                </div>
              </div>
              <input
                id="pm-hover-img"
                name="hoverImage"
                type="text"
                spellCheck={false}
                value={hoverImage}
                onChange={(e) => setHoverImage(e.target.value)}
                placeholder="Bỏ trống sẽ dùng ảnh chính"
                className="admin-input mt-2.5 w-full rounded-xl border border-[#8E96A8] px-3 text-[13px]"
              />
            </div>
          </div>

          {/* Badges & Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="pm-badge" className="block text-[13.5px] font-bold">
                Nhãn góc ảnh
              </label>
              <select
                id="pm-badge"
                name="topBadge"
                value={topBadge}
                onChange={(e) => setTopBadge(e.target.value)}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3"
              >
                {BADGE_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pm-eyebrow" className="block text-[13.5px] font-bold">
                Dòng khuyến mãi nhỏ
              </label>
              <input
                id="pm-eyebrow"
                name="promoEyebrow"
                type="text"
                value={promoEyebrow}
                onChange={(e) => setPromoEyebrow(e.target.value)}
                placeholder="VD: BLACK FRIDAY SALE"
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
              />
            </div>

            <div>
              <label htmlFor="pm-tone" className="block text-[13.5px] font-bold">
                Màu dòng khuyến mãi
              </label>
              <select
                id="pm-tone"
                name="promoTone"
                value={promoTone}
                onChange={(e) =>
                  setPromoTone(e.target.value === "urgent" ? "urgent" : "sale")
                }
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3"
              >
                <option value="sale">Xanh lá (Ưu đãi)</option>
                <option value="urgent">Cam nổi bật (Sắp hết hàng)</option>
              </select>
            </div>
          </div>

          {/* Homepage Sections & Category Tags */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset className="rounded-xl border border-[#E5E0DB] bg-white p-4">
              <legend className="px-1 text-[13.5px] font-bold text-[#283455]">
                Hiển thị trên Trang chủ
              </legend>
              <div className="mt-2 space-y-2.5">
                {SECTION_OPTIONS.map((sec) => (
                  <label
                    key={sec.key}
                    className="flex cursor-pointer items-center gap-2.5 text-[14px]"
                  >
                    <input
                      type="checkbox"
                      checked={sections.includes(sec.key)}
                      onChange={() => toggleSection(sec.key)}
                      className="h-4 w-4 accent-[#283455]"
                    />
                    <span>{sec.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-xl border border-[#E5E0DB] bg-white p-4">
              <legend className="px-1 text-[13.5px] font-bold text-[#283455]">
                Nhóm lọc (Tags)
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {TAG_OPTIONS.map((t) => {
                  const checked = tags.includes(t.tag);
                  return (
                    <label
                      key={t.tag}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-bold transition-colors ${
                        checked
                          ? "border-[#283455] bg-[#283455] text-white"
                          : "border-[#C9CFD9] bg-[#FDFAF8] text-[#283455]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTag(t.tag)}
                        className="visually-hidden"
                      />
                      <span>{t.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {/* Color Swatches Editor */}
          <fieldset className="rounded-xl border border-[#E5E0DB] bg-white p-4">
            <legend className="px-1 text-[13.5px] font-bold text-[#283455]">
              Biến thể màu sắc ({swatches.length})
            </legend>
            <div className="mt-2 space-y-2.5">
              {swatches.map((sw, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center gap-2.5 rounded-lg border border-[#ECE7E2] bg-[#FDFAF8] p-2.5"
                >
                  <input
                    type="color"
                    aria-label={`Mã màu ${idx + 1}`}
                    value={sw.color || "#D9D4CE"}
                    onChange={(e) =>
                      setSwatches((prev) =>
                        prev.map((item, i) =>
                          i === idx ? { ...item, color: e.target.value } : item
                        )
                      )
                    }
                    className="h-9 w-9 cursor-pointer rounded border border-[#C9CFD9]"
                  />
                  <input
                    type="text"
                    aria-label={`Tên màu ${idx + 1}`}
                    value={sw.label}
                    onChange={(e) =>
                      setSwatches((prev) =>
                        prev.map((item, i) =>
                          i === idx ? { ...item, label: e.target.value } : item
                        )
                      )
                    }
                    placeholder="Tên màu (VD: Trắng kem)"
                    className="h-10 min-w-[140px] flex-1 rounded-lg border border-[#C9CFD9] bg-white px-3 text-[14px]"
                  />
                  <label className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-[#283455] bg-white px-3 text-[12.5px] font-bold text-[#283455] hover:bg-[#F9F3ED]">
                    {uploadingField === `swatch-${idx}` ? "Đang tải..." : "Ảnh màu"}
                    <input
                      type="file"
                      accept="image/*"
                      className="visually-hidden"
                      onChange={(e) => void handleUploadFile(e, { swatchIdx: idx })}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSwatches((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="h-10 cursor-pointer rounded-lg px-2.5 text-[13px] font-bold text-[#740103] hover:bg-[#FCE8E6]"
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSwatch}
                className="inline-flex h-10 cursor-pointer items-center rounded-xl border border-dashed border-[#283455] px-4 text-[13px] font-bold text-[#283455] hover:bg-[#F9F3ED]"
              >
                + Thêm màu mới
              </button>
            </div>
          </fieldset>

          {/* Descriptions */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pm-desc-vi" className="block text-[13.5px] font-bold">
                Mô tả sản phẩm (Tiếng Việt)
              </label>
              <textarea
                id="pm-desc-vi"
                name="descriptionVi"
                rows={3}
                value={descriptionVi}
                onChange={(e) => setDescriptionVi(e.target.value)}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2.5"
              />
            </div>

            <div>
              <label htmlFor="pm-desc-en" className="block text-[13.5px] font-bold">
                Mô tả sản phẩm (Tiếng Anh)
              </label>
              <textarea
                id="pm-desc-en"
                name="descriptionEn"
                rows={3}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2.5"
              />
            </div>
          </div>

          {/* Active toggle */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E0DB] bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-5 w-5 accent-[#417823]"
            />
            <span className="text-[14.5px] font-bold text-[#283455]">
              Hiển thị sản phẩm này ngoài cửa hàng
            </span>
          </label>

          {/* Footer actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#E5E0DB] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] cursor-pointer rounded-xl border border-[#C9CFD9] bg-white px-6 text-[14px] font-bold text-[#283455] hover:bg-[#F3EDE7]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="min-h-[48px] cursor-pointer rounded-xl bg-[#283455] px-7 text-[14px] font-bold text-white hover:bg-[#1D2742] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
