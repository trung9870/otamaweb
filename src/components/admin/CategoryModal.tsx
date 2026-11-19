"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { CategoryTag } from "@/components/sites/brooklinen/catalog";
import { slugifyText, type StoreCategory } from "@/lib/store-types";

interface CategoryModalProps {
  open: boolean;
  category: StoreCategory | null;
  onClose: () => void;
  onSaved: (saved: StoreCategory) => void;
}

const FILTER_TAG_OPTIONS: { value: "" | CategoryTag; label: string }[] = [
  { value: "", label: "Hiển thị tất cả sản phẩm / theo danh mục chính" },
  { value: "sheets", label: "Nhóm Ga giường (sheets)" },
  { value: "bed", label: "Nhóm Chăn gối (bed)" },
  { value: "bath", label: "Nhóm Phòng tắm (bath)" },
  { value: "bundles", label: "Nhóm Combo (bundles)" },
  { value: "gifts", label: "Nhóm Quà tặng (gifts)" },
  { value: "throws", label: "Nhóm Chăn đắp (throws)" },
  { value: "home", label: "Nhóm Nhà cửa (home)" },
  { value: "trending", label: "Nhóm Mới & Hot (trending)" },
  { value: "sale", label: "Nhóm Khuyến mãi (sale)" },
  { value: "awards", label: "Nhóm Đạt giải thưởng (awards)" },
];

export function CategoryModal({
  open,
  category,
  onClose,
  onSaved,
}: CategoryModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isEdit = Boolean(category);

  const [titleVi, setTitleVi] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitleVi, setSubtitleVi] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [bannerTone, setBannerTone] = useState<"cream" | "navy" | "burgundy">("cream");
  const [filterTag, setFilterTag] = useState<"" | CategoryTag>("");
  const [image, setImage] = useState("");
  const [showOnHome, setShowOnHome] = useState(false);
  const [active, setActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open) {
      if (category) {
        setTitleVi(category.titleVi);
        setTitleEn(category.titleEn);
        setSlug(category.slug);
        setSubtitleVi(category.subtitleVi);
        setSubtitleEn(category.subtitleEn);
        setBannerTone(category.bannerTone);
        setFilterTag(category.filterTag || "");
        setImage(category.image || "");
        setShowOnHome(category.showOnHome);
        setActive(category.active);
      } else {
        setTitleVi("");
        setTitleEn("");
        setSlug("");
        setSubtitleVi("");
        setSubtitleEn("");
        setBannerTone("cream");
        setFilterTag("");
        setImage("");
        setShowOnHome(false);
        setActive(true);
      }
      setErrorMsg(null);
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [open, category]);

  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setErrorMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Tải ảnh thất bại.");
      setImage(data.url);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Tải ảnh thất bại.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim() || slugifyText(titleEn || titleVi),
          titleVi: titleVi.trim(),
          titleEn: titleEn.trim() || titleVi.trim(),
          subtitleVi: subtitleVi.trim(),
          subtitleEn: subtitleEn.trim() || subtitleVi.trim(),
          bannerTone,
          filterTag: filterTag || undefined,
          image: image.trim() || undefined,
          showOnHome,
          active,
          sortOrder: category?.sortOrder,
        }),
      });
      const data = (await res.json()) as { category?: StoreCategory; error?: string };
      if (!res.ok || !data.category) {
        throw new Error(data.error || "Không thể lưu danh mục.");
      }
      onSaved(data.category);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Không thể lưu danh mục.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="category-modal-title"
      onClose={() => {
        if (dialogRef.current) dialogRef.current.returnValue = "";
        onClose();
      }}
      className="admin-dialog"
    >
      <div className="flex max-h-[90svh] flex-col overflow-hidden rounded-2xl bg-[#FDFAF8] text-[#283455] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5E0DB] bg-white px-6 py-4">
          <h2 id="category-modal-title" className="text-[20px] font-bold">
            {isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ danh mục"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-2xl hover:bg-[#F3EDE7]"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          aria-labelledby="category-modal-title"
          className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
        >
          {errorMsg && (
            <div
              role="alert"
              className="rounded-xl border border-[#D93025]/40 bg-[#FCE8E6] px-4 py-3 text-[14px] text-[#A50E0E]"
            >
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cm-vi" className="block text-[13.5px] font-bold">
                Tên danh mục (Tiếng Việt) *
              </label>
              <input
                id="cm-vi"
                name="titleVi"
                type="text"
                autoFocus
                required
                value={titleVi}
                onChange={(e) => {
                  setTitleVi(e.target.value);
                  if (!isEdit && !titleEn) setSlug(slugifyText(e.target.value));
                }}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
              />
            </div>

            <div>
              <label htmlFor="cm-en" className="block text-[13.5px] font-bold">
                Tên danh mục (Tiếng Anh)
              </label>
              <input
                id="cm-en"
                name="titleEn"
                type="text"
                value={titleEn}
                onChange={(e) => {
                  setTitleEn(e.target.value);
                  if (!isEdit) setSlug(slugifyText(e.target.value || titleVi));
                }}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cm-slug" className="block text-[13.5px] font-bold">
                Đường dẫn `/collections/...`
              </label>
              <input
                id="cm-slug"
                name="slug"
                type="text"
                spellCheck={false}
                readOnly={isEdit}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={`admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 font-mono text-[14px] ${
                  isEdit ? "bg-[#F3F4F6] text-[#5B647A]" : ""
                }`}
              />
            </div>

            <div>
              <label htmlFor="cm-tone" className="block text-[13.5px] font-bold">
                Màu banner đầu trang
              </label>
              <select
                id="cm-tone"
                name="bannerTone"
                value={bannerTone}
                onChange={(e) =>
                  setBannerTone(
                    e.target.value === "navy" || e.target.value === "burgundy"
                      ? e.target.value
                      : "cream"
                  )
                }
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3"
              >
                <option value="cream">Kem sáng (Mặc định)</option>
                <option value="navy">Xanh Navy đậm</option>
                <option value="burgundy">Đỏ rượu vang (Sale)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="cm-tag" className="block text-[13.5px] font-bold">
              Tự động gom sản phẩm theo nhóm (Tag)
            </label>
            <select
              id="cm-tag"
              name="filterTag"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value as "" | CategoryTag)}
              className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3"
            >
              {FILTER_TAG_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cm-sub-vi" className="block text-[13.5px] font-bold">
                Mô tả ngắn (Tiếng Việt)
              </label>
              <textarea
                id="cm-sub-vi"
                name="subtitleVi"
                rows={2}
                value={subtitleVi}
                onChange={(e) => setSubtitleVi(e.target.value)}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2"
              />
            </div>
            <div>
              <label htmlFor="cm-sub-en" className="block text-[13.5px] font-bold">
                Mô tả ngắn (Tiếng Anh)
              </label>
              <textarea
                id="cm-sub-en"
                name="subtitleEn"
                rows={2}
                value={subtitleEn}
                onChange={(e) => setSubtitleEn(e.target.value)}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2"
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E0DB] bg-white p-4">
            <label htmlFor="cm-img" className="block text-[13.5px] font-bold">
              Ảnh đại diện danh mục (tùy chọn)
            </label>
            <div className="mt-2 flex items-center gap-3">
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt="Xem trước ảnh danh mục"
                  className="h-14 w-14 rounded-lg object-cover"
                />
              )}
              <label className="inline-flex min-h-[40px] cursor-pointer items-center rounded-xl bg-[#283455] px-4 py-2 text-[13px] font-bold text-white">
                {uploading ? "Đang tải..." : "Tải ảnh danh mục"}
                <input
                  type="file"
                  accept="image/*"
                  className="visually-hidden"
                  onChange={(e) => void handleUploadImage(e)}
                />
              </label>
            </div>
            <input
              id="cm-img"
              name="image"
              type="text"
              spellCheck={false}
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/api/media/... hoặc URL ảnh"
              className="admin-input mt-2.5 w-full rounded-xl border border-[#8E96A8] px-3 text-[13px]"
            />
          </div>

          <div className="flex flex-wrap gap-5">
            <label className="flex cursor-pointer items-center gap-2.5 text-[14px] font-bold">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 accent-[#417823]"
              />
              <span>Hiển thị danh mục</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-[14px] font-bold">
              <input
                type="checkbox"
                checked={showOnHome}
                onChange={(e) => setShowOnHome(e.target.checked)}
                className="h-4 w-4 accent-[#283455]"
              />
              <span>Nổi bật trang chủ</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#E5E0DB] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] cursor-pointer rounded-xl border border-[#C9CFD9] bg-white px-6 text-[14px] font-bold text-[#283455]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="min-h-[48px] cursor-pointer rounded-xl bg-[#283455] px-7 text-[14px] font-bold text-white hover:bg-[#1D2742] disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu danh mục"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
