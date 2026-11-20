"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type {
  HomepageSectionConfig,
  PromoStripTheme,
  StoreProduct,
} from "@/lib/store-types";

interface HomepageSectionModalProps {
  section: HomepageSectionConfig | null;
  allProducts: StoreProduct[];
  vndRate: number;
  onClose: () => void;
  onSave: (updated: HomepageSectionConfig) => Promise<void>;
  onJumpToCategories: () => void;
}

const STRIP_THEMES: { value: PromoStripTheme; label: string }[] = [
  { value: "burgundy-blue-cta", label: "Đỏ rượu vang — Nút xanh Navy" },
  { value: "burgundy-outline-cta", label: "Đỏ rượu vang — Nút viền trắng" },
  { value: "navy-adaptive-cta", label: "Xanh Navy đậm" },
  { value: "slate-navy-cta", label: "Xám xanh nhạt" },
];

export function HomepageSectionModal({
  section,
  allProducts,
  vndRate,
  onClose,
  onSave,
  onJumpToCategories,
}: HomepageSectionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<HomepageSectionConfig | null>(null);
  const [addSlug, setAddSlug] = useState("");
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reorderNote, setReorderNote] = useState("");

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (section) {
      setDraft({
        ...section,
        productSlugs: section.productSlugs ? [...section.productSlugs] : undefined,
      });
      setAddSlug("");
      setErrorMsg(null);
      setReorderNote("");
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [section]);

  const productBySlug = useMemo(
    () => new Map(allProducts.map((p) => [p.slug, p])),
    [allProducts]
  );

  const selectedSlugs = useMemo(
    () => draft?.productSlugs || [],
    [draft?.productSlugs]
  );
  const availableToAdd = useMemo(
    () => allProducts.filter((p) => !selectedSlugs.includes(p.slug)),
    [allProducts, selectedSlugs]
  );

  const handleUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    field: "desktopMedia" | "mobileMedia" | "desktopPoster"
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !draft) return;

    setUploadingField(field);
    setErrorMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as {
        url?: string;
        kind?: "image" | "video";
        error?: string;
      };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Tải tệp thất bại.");
      }

      setDraft((prev) => {
        if (!prev) return prev;
        const next: HomepageSectionConfig = { ...prev, [field]: data.url };
        // Auto-switch mediaType when uploading desktopMedia for Hero
        if (field === "desktopMedia" && prev.kind === "hero" && data.kind) {
          next.mediaType = data.kind;
        }
        return next;
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Tải tệp thất bại.");
    } finally {
      setUploadingField(null);
    }
  };

  const moveCarouselProduct = (idx: number, dir: -1 | 1) => {
    if (!draft?.productSlugs) return;
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= draft.productSlugs.length) return;
    const list = [...draft.productSlugs];
    const [moved] = list.splice(idx, 1);
    list.splice(nextIdx, 0, moved);
    setDraft({ ...draft, productSlugs: list });
    const pName = productBySlug.get(moved)?.titleVi || moved;
    setReorderNote(`Đã chuyển "${pName}" tới vị trí số ${nextIdx + 1}.`);
  };

  const removeCarouselProduct = (slug: string) => {
    if (!draft?.productSlugs) return;
    setDraft({
      ...draft,
      productSlugs: draft.productSlugs.filter((s) => s !== slug),
    });
  };

  const addCarouselProduct = () => {
    if (!draft || !addSlug) return;
    const current = draft.productSlugs || [];
    if (current.includes(addSlug)) return;
    setDraft({ ...draft, productSlugs: [addSlug, ...current] });
    setAddSlug("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft || saving) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      await onSave(draft);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Không thể lưu khối này.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="section-modal-title"
      onClose={() => {
        if (dialogRef.current) dialogRef.current.returnValue = "";
        onClose();
      }}
      className="admin-dialog"
    >
      {draft && (
        <div className="flex max-h-[90svh] flex-col overflow-hidden rounded-2xl bg-[#FDFAF8] text-[#283455] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E0DB] bg-white px-6 py-4">
            <div>
              <h2 id="section-modal-title" className="text-[20px] font-bold">
                Chỉnh sửa: {draft.labelVi}
              </h2>
              <p className="text-[13px] text-[#5B647A]">
                Lưu lại là trang chủ ngoài cửa hàng cập nhật ngay lập tức.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng chỉnh sửa khối"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-2xl hover:bg-[#F3EDE7]"
            >
              &times;
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            aria-labelledby="section-modal-title"
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

            <p role="status" className="visually-hidden">
              {reorderNote}
            </p>

            {/* Visibility Toggle */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E0DB] bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={draft.visible}
                onChange={(e) => setDraft({ ...draft, visible: e.target.checked })}
                className="h-5 w-5 accent-[#417823]"
              />
              <span className="text-[14.5px] font-bold">
                Hiển thị khối này trên Trang chủ
              </span>
            </label>

            {/* ============================================================ */}
            {/* HERO MEDIA (VIDEO OR STATIC IMAGE)                           */}
            {/* ============================================================ */}
            {draft.kind === "hero" && (
              <div className="space-y-4 rounded-xl border border-[#E5E0DB] bg-white p-4">
                <fieldset>
                  <legend className="text-[14px] font-bold text-[#283455]">
                    Loại nền của Hero
                  </legend>
                  <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#C9CFD9] p-3 has-[:checked]:border-[#283455] has-[:checked]:bg-[#F9F3ED]">
                      <input
                        type="radio"
                        name="heroMediaType"
                        value="video"
                        checked={(draft.mediaType || "video") === "video"}
                        onChange={() => setDraft({ ...draft, mediaType: "video" })}
                        className="h-4 w-4 accent-[#283455]"
                      />
                      <span className="text-[14px] font-bold">
                        Video nền (.mp4 / .webm)
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#C9CFD9] p-3 has-[:checked]:border-[#283455] has-[:checked]:bg-[#F9F3ED]">
                      <input
                        type="radio"
                        name="heroMediaType"
                        value="image"
                        checked={draft.mediaType === "image"}
                        onChange={() => setDraft({ ...draft, mediaType: "image" })}
                        className="h-4 w-4 accent-[#283455]"
                      />
                      <span className="text-[14px] font-bold">
                        Ảnh banner tĩnh (JPG / PNG / WEBP)
                      </span>
                    </label>
                  </div>
                </fieldset>

                {/* Live Preview */}
                {draft.desktopMedia && (
                  <div className="overflow-hidden rounded-xl border border-[#E5E0DB] bg-[#262321]">
                    {(draft.mediaType || "video") === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={draft.desktopMedia}
                        alt="Xem trước nền Hero"
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <video
                        key={draft.desktopMedia}
                        src={draft.desktopMedia}
                        poster={draft.desktopPoster || undefined}
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                        className="h-44 w-full object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Desktop Media Upload */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sm-desk-media" className="block text-[13px] font-bold">
                      {(draft.mediaType || "video") === "image"
                        ? "Ảnh nền Desktop"
                        : "Video nền Desktop (.mp4 / .webm, tối đa 35MB)"}
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl bg-[#283455] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#1D2742]">
                        {uploadingField === "desktopMedia"
                          ? "Đang tải lên..."
                          : "Tải tệp từ máy tính"}
                        <input
                          type="file"
                          accept={
                            (draft.mediaType || "video") === "image"
                              ? "image/*"
                              : "video/mp4,video/webm,video/quicktime,image/*"
                          }
                          className="visually-hidden"
                          onChange={(e) => void handleUpload(e, "desktopMedia")}
                        />
                      </label>
                    </div>
                    <input
                      id="sm-desk-media"
                      type="text"
                      spellCheck={false}
                      value={draft.desktopMedia || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, desktopMedia: e.target.value })
                      }
                      placeholder="/api/media/... hoặc https://..."
                      className="admin-input mt-2 w-full rounded-xl border border-[#8E96A8] px-3 text-[13px]"
                    />
                  </div>

                  <div>
                    <label htmlFor="sm-mob-media" className="block text-[13px] font-bold">
                      Bản Mobile (tùy chọn — bỏ trống sẽ dùng chung Desktop)
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl border border-[#283455] px-4 py-2 text-[13px] font-bold text-[#283455] hover:bg-[#F9F3ED]">
                        {uploadingField === "mobileMedia"
                          ? "Đang tải lên..."
                          : "Tải bản Mobile riêng"}
                        <input
                          type="file"
                          accept={
                            (draft.mediaType || "video") === "image"
                              ? "image/*"
                              : "video/mp4,video/webm,video/quicktime,image/*"
                          }
                          className="visually-hidden"
                          onChange={(e) => void handleUpload(e, "mobileMedia")}
                        />
                      </label>
                    </div>
                    <input
                      id="sm-mob-media"
                      type="text"
                      spellCheck={false}
                      value={draft.mobileMedia || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, mobileMedia: e.target.value })
                      }
                      placeholder="Bỏ trống = dùng bản Desktop"
                      className="admin-input mt-2 w-full rounded-xl border border-[#8E96A8] px-3 text-[13px]"
                    />
                  </div>
                </div>

                {(draft.mediaType || "video") === "video" && (
                  <div>
                    <label htmlFor="sm-poster" className="block text-[13px] font-bold">
                      Ảnh bìa chờ tải video (Poster — tùy chọn)
                    </label>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <label className="inline-flex min-h-[40px] cursor-pointer items-center rounded-xl border border-[#C9CFD9] px-3.5 text-[12.5px] font-bold text-[#283455] hover:bg-[#F9F3ED]">
                        {uploadingField === "desktopPoster"
                          ? "Đang tải..."
                          : "Tải ảnh Poster"}
                        <input
                          type="file"
                          accept="image/*"
                          className="visually-hidden"
                          onChange={(e) => void handleUpload(e, "desktopPoster")}
                        />
                      </label>
                      <input
                        id="sm-poster"
                        type="text"
                        spellCheck={false}
                        value={draft.desktopPoster || ""}
                        onChange={(e) =>
                          setDraft({ ...draft, desktopPoster: e.target.value })
                        }
                        placeholder="/api/media/... hoặc URL ảnh"
                        className="admin-input min-w-[200px] flex-1 rounded-xl border border-[#8E96A8] px-3 text-[13px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* BANNER IMAGE (MINI HERO TOTE)                                */}
            {/* ============================================================ */}
            {draft.kind === "banner" && (
              <div className="space-y-4 rounded-xl border border-[#E5E0DB] bg-white p-4">
                {draft.desktopMedia && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={draft.desktopMedia}
                    alt="Xem trước banner"
                    className="h-32 w-full rounded-xl object-cover"
                  />
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sm-ban-desk" className="block text-[13px] font-bold">
                      Ảnh Banner Desktop
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex min-h-[40px] cursor-pointer items-center rounded-xl bg-[#283455] px-4 text-[13px] font-bold text-white">
                        {uploadingField === "desktopMedia" ? "Đang tải..." : "Tải ảnh Desktop"}
                        <input
                          type="file"
                          accept="image/*"
                          className="visually-hidden"
                          onChange={(e) => void handleUpload(e, "desktopMedia")}
                        />
                      </label>
                    </div>
                    <input
                      id="sm-ban-desk"
                      type="text"
                      spellCheck={false}
                      value={draft.desktopMedia || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, desktopMedia: e.target.value })
                      }
                      className="admin-input mt-2 w-full rounded-xl border border-[#8E96A8] px-3 text-[13px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="sm-ban-mob" className="block text-[13px] font-bold">
                      Ảnh Banner Mobile (tùy chọn)
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex min-h-[40px] cursor-pointer items-center rounded-xl border border-[#283455] px-4 text-[13px] font-bold text-[#283455]">
                        {uploadingField === "mobileMedia" ? "Đang tải..." : "Tải ảnh Mobile"}
                        <input
                          type="file"
                          accept="image/*"
                          className="visually-hidden"
                          onChange={(e) => void handleUpload(e, "mobileMedia")}
                        />
                      </label>
                    </div>
                    <input
                      id="sm-ban-mob"
                      type="text"
                      spellCheck={false}
                      value={draft.mobileMedia || ""}
                      onChange={(e) =>
                        setDraft({ ...draft, mobileMedia: e.target.value })
                      }
                      className="admin-input mt-2 w-full rounded-xl border border-[#8E96A8] px-3 text-[13px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TEXT & CTA FIELDS (HERO, BANNER, STRIP, CAROUSEL, CATEGORIES) */}
            {/* ============================================================ */}
            {draft.kind !== "static" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="sm-title-vi" className="block text-[13.5px] font-bold">
                    Tiêu đề (Tiếng Việt)
                  </label>
                  {draft.kind === "hero" || draft.kind === "banner" ? (
                    <textarea
                      id="sm-title-vi"
                      rows={2}
                      autoFocus
                      value={draft.titleVi || ""}
                      onChange={(e) => setDraft({ ...draft, titleVi: e.target.value })}
                      className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2"
                    />
                  ) : (
                    <input
                      id="sm-title-vi"
                      type="text"
                      autoFocus
                      value={draft.titleVi || ""}
                      onChange={(e) => setDraft({ ...draft, titleVi: e.target.value })}
                      className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
                    />
                  )}
                </div>

                <div>
                  <label htmlFor="sm-title-en" className="block text-[13.5px] font-bold">
                    Tiêu đề (Tiếng Anh)
                  </label>
                  {draft.kind === "hero" || draft.kind === "banner" ? (
                    <textarea
                      id="sm-title-en"
                      rows={2}
                      value={draft.titleEn || ""}
                      onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })}
                      className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2"
                    />
                  ) : (
                    <input
                      id="sm-title-en"
                      type="text"
                      value={draft.titleEn || ""}
                      onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })}
                      className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
                    />
                  )}
                </div>
              </div>
            )}

            {(draft.kind === "hero" || draft.kind === "strip") && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="sm-sub-vi" className="block text-[13.5px] font-bold">
                    Mô tả phụ (Tiếng Việt)
                  </label>
                  <textarea
                    id="sm-sub-vi"
                    rows={2}
                    value={draft.subtitleVi || ""}
                    onChange={(e) => setDraft({ ...draft, subtitleVi: e.target.value })}
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="sm-sub-en" className="block text-[13.5px] font-bold">
                    Mô tả phụ (Tiếng Anh)
                  </label>
                  <textarea
                    id="sm-sub-en"
                    rows={2}
                    value={draft.subtitleEn || ""}
                    onChange={(e) => setDraft({ ...draft, subtitleEn: e.target.value })}
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2"
                  />
                </div>
              </div>
            )}

            {(draft.kind === "hero" || draft.kind === "banner" || draft.kind === "strip") && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="sm-cta-vi" className="block text-[13px] font-bold">
                    Chữ trên nút (VI)
                  </label>
                  <input
                    id="sm-cta-vi"
                    type="text"
                    value={draft.ctaLabelVi || ""}
                    onChange={(e) => setDraft({ ...draft, ctaLabelVi: e.target.value })}
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3"
                  />
                </div>
                <div>
                  <label htmlFor="sm-cta-en" className="block text-[13px] font-bold">
                    Chữ trên nút (EN)
                  </label>
                  <input
                    id="sm-cta-en"
                    type="text"
                    value={draft.ctaLabelEn || ""}
                    onChange={(e) => setDraft({ ...draft, ctaLabelEn: e.target.value })}
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3"
                  />
                </div>
                <div>
                  <label htmlFor="sm-cta-href" className="block text-[13px] font-bold">
                    Link khi bấm nút
                  </label>
                  <input
                    id="sm-cta-href"
                    type="text"
                    spellCheck={false}
                    value={draft.ctaHref || ""}
                    onChange={(e) => setDraft({ ...draft, ctaHref: e.target.value })}
                    placeholder="/collections/best-sellers"
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3 font-mono text-[13px]"
                  />
                </div>
              </div>
            )}

            {draft.kind === "strip" && (
              <div>
                <label htmlFor="sm-theme" className="block text-[13.5px] font-bold">
                  Màu nền dải băng
                </label>
                <select
                  id="sm-theme"
                  value={draft.theme || "burgundy-blue-cta"}
                  onChange={(e) =>
                    setDraft({ ...draft, theme: e.target.value as PromoStripTheme })
                  }
                  className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
                >
                  {STRIP_THEMES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ============================================================ */}
            {/* CAROUSEL ORDERED PRODUCT PICKER                              */}
            {/* ============================================================ */}
            {draft.kind === "carousel" && (
              <div className="space-y-3 rounded-xl border border-[#E5E0DB] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[14px] font-bold text-[#283455]">
                    Thứ tự sản phẩm hiển thị trong mục này ({selectedSlugs.length})
                  </p>
                  <span className="text-[12.5px] text-[#5B647A]">
                    Sản phẩm số 1 sẽ hiện đầu tiên bên trái
                  </span>
                </div>

                {/* Add product dropdown */}
                <div className="flex flex-wrap gap-2">
                  <label htmlFor="sm-add-prod" className="visually-hidden">
                    Chọn sản phẩm để thêm vào mục này
                  </label>
                  <select
                    id="sm-add-prod"
                    value={addSlug}
                    onChange={(e) => setAddSlug(e.target.value)}
                    className="admin-input min-w-[200px] flex-1 rounded-xl border border-[#8E96A8] px-3 text-[14px]"
                  >
                    <option value="">-- Chọn sản phẩm để thêm vào mục này --</option>
                    {availableToAdd.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.titleVi} ({Math.round(p.salePriceUsd * vndRate).toLocaleString("vi-VN")}₫)
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!addSlug}
                    onClick={addCarouselProduct}
                    className="min-h-[48px] cursor-pointer rounded-xl bg-[#283455] px-4 text-[13.5px] font-bold text-white hover:bg-[#1D2742] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    + Thêm lên đầu
                  </button>
                </div>

                {/* Ordered list */}
                <ol className="space-y-2">
                  {selectedSlugs.map((slug, idx) => {
                    const prod = productBySlug.get(slug);
                    return (
                      <li
                        key={slug}
                        className="admin-sortable-item flex items-center gap-3 rounded-xl border border-[#ECE7E2] bg-[#FDFAF8] p-2.5"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#283455] text-[12px] font-bold text-white">
                          {idx + 1}
                        </span>
                        {prod?.mainImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={prod.mainImage}
                            alt={prod.titleVi}
                            className="h-11 w-11 shrink-0 rounded-lg object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-bold text-[#283455]">
                            {prod?.titleVi || slug}
                          </p>
                          <p className="text-[12px] text-[#5B647A]">
                            {prod
                              ? `${Math.round(prod.salePriceUsd * vndRate).toLocaleString("vi-VN")}₫`
                              : "Không tìm thấy trong kho"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            aria-label={`Đưa ${prod?.titleVi || slug} lên`}
                            onClick={() => moveCarouselProduct(idx, -1)}
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#C9CFD9] bg-white text-[14px] font-bold text-[#283455] hover:bg-[#F3EDE7] disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={idx === selectedSlugs.length - 1}
                            aria-label={`Đưa ${prod?.titleVi || slug} xuống`}
                            onClick={() => moveCarouselProduct(idx, 1)}
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#C9CFD9] bg-white text-[14px] font-bold text-[#283455] hover:bg-[#F3EDE7] disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            aria-label={`Bỏ ${prod?.titleVi || slug} khỏi mục này`}
                            onClick={() => removeCarouselProduct(slug)}
                            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg px-2.5 text-[13px] font-bold text-[#A50E0E] hover:bg-[#FCE8E6]"
                          >
                            Bỏ
                          </button>
                        </div>
                      </li>
                    );
                  })}
                  {selectedSlugs.length === 0 && (
                    <li className="py-4 text-center text-[13.5px] text-[#5B647A]">
                      Chưa chọn sản phẩm nào. Nếu để trống, web sẽ tự lấy danh sách mặc định.
                    </li>
                  )}
                </ol>
              </div>
            )}

            {/* ============================================================ */}
            {/* CATEGORIES SHORTCUT                                          */}
            {/* ============================================================ */}
            {draft.kind === "categories" && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DDE3EC] bg-[#F9F3ED] p-4 text-[13.5px]">
                <p className="text-[#3D4866]">
                  Để chọn danh mục nào hiện ở khối này và đổi thứ tự trái → phải, bạn chỉ cần bật <strong>&ldquo;Nổi bật trang chủ&rdquo;</strong> và bấm <strong>↑ / ↓</strong> ngay trong tab <strong>Danh mục</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onJumpToCategories();
                  }}
                  className="min-h-[40px] shrink-0 cursor-pointer rounded-xl bg-[#283455] px-4 text-[13px] font-bold text-white"
                >
                  Mở tab Danh mục →
                </button>
              </div>
            )}

            {/* Footer actions */}
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
                {saving ? "Đang lưu..." : "Lưu thay đổi khối"}
              </button>
            </div>
          </form>
        </div>
      )}
    </dialog>
  );
}
