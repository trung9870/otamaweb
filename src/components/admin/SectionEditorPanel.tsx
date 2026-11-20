"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { SortableList } from "./SortableList";
import type {
  HomepageSectionConfig,
  PromoStripTheme,
  StoreProduct,
} from "@/lib/store-types";

interface SectionEditorPanelProps {
  section: HomepageSectionConfig;
  allProducts: StoreProduct[];
  vndRate: number;
  onPatch: (patch: Partial<HomepageSectionConfig>) => void;
  onJumpToCategories: () => void;
}

const STRIP_THEMES: { value: PromoStripTheme; label: string }[] = [
  { value: "burgundy-blue-cta", label: "Đỏ rượu vang — Nút xanh Navy" },
  { value: "burgundy-outline-cta", label: "Đỏ rượu vang — Nút viền trắng" },
  { value: "navy-adaptive-cta", label: "Xanh Navy đậm" },
  { value: "slate-navy-cta", label: "Xám xanh nhạt" },
];

const inputCls =
  "admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3 text-[14px]";
const labelCls = "block text-[13px] font-bold text-[#283455]";

/**
 * Inline editor for one homepage block. Every change is written straight into
 * the editor draft (via onPatch) so the live preview updates instantly; nothing
 * is persisted until "Lưu & Xuất bản".
 */
export function SectionEditorPanel({
  section,
  allProducts,
  vndRate,
  onPatch,
  onJumpToCategories,
}: SectionEditorPanelProps) {
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addSlug, setAddSlug] = useState("");

  const productBySlug = useMemo(
    () => new Map(allProducts.map((p) => [p.slug, p])),
    [allProducts]
  );
  const selectedSlugs = useMemo(() => section.productSlugs || [], [section.productSlugs]);
  const availableToAdd = useMemo(
    () => allProducts.filter((p) => p.active && !selectedSlugs.includes(p.slug)),
    [allProducts, selectedSlugs]
  );

  const mediaType = section.mediaType || "video";
  const vnd = (usd: number) => `${Math.round(usd * vndRate).toLocaleString("vi-VN")}₫`;

  const handleUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    field: "desktopMedia" | "mobileMedia" | "desktopPoster"
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
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
      if (!res.ok || !data.url) throw new Error(data.error || "Tải tệp thất bại.");
      const patch: Partial<HomepageSectionConfig> = { [field]: data.url };
      if (field === "desktopMedia" && section.kind === "hero" && data.kind) {
        patch.mediaType = data.kind;
      }
      onPatch(patch);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Tải tệp thất bại.");
    } finally {
      setUploadingField(null);
    }
  };

  const uploadButton = (
    field: "desktopMedia" | "mobileMedia" | "desktopPoster",
    label: string,
    accept: string,
    primary = false
  ) => (
    <label
      className={`inline-flex min-h-[40px] cursor-pointer items-center rounded-xl px-3.5 text-[13px] font-bold ${
        primary
          ? "bg-[#283455] text-white hover:bg-[#1D2742]"
          : "border border-[#283455] bg-white text-[#283455] hover:bg-[#F9F3ED]"
      }`}
    >
      {uploadingField === field ? "Đang tải lên..." : label}
      <input
        type="file"
        accept={accept}
        className="visually-hidden"
        onChange={(e) => void handleUpload(e, field)}
      />
    </label>
  );

  const isMultiline = section.kind === "hero" || section.kind === "banner";
  const mediaAccept =
    mediaType === "image" ? "image/*" : "video/mp4,video/webm,video/quicktime,image/*";

  return (
    <div className="space-y-5">
      {errorMsg && (
        <div
          role="alert"
          className="rounded-xl border border-[#D93025]/40 bg-[#FCE8E6] px-3.5 py-2.5 text-[13.5px] text-[#A50E0E]"
        >
          {errorMsg}
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E0DB] bg-white px-3.5 py-3">
        <input
          type="checkbox"
          checked={section.visible}
          onChange={(e) => onPatch({ visible: e.target.checked })}
          className="h-5 w-5 accent-[#417823]"
        />
        <span className="text-[14px] font-bold">Hiển thị khối này trên Trang chủ</span>
      </label>

      {/* HERO MEDIA */}
      {section.kind === "hero" && (
        <fieldset className="space-y-3 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
          <legend className="px-1 text-[13.5px] font-bold">Nền của Hero</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["video", "image"] as const).map((t) => (
              <label
                key={t}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#C9CFD9] p-2.5 text-[13px] font-bold has-[:checked]:border-[#283455] has-[:checked]:bg-[#F9F3ED]"
              >
                <input
                  type="radio"
                  name={`media-${section.id}`}
                  value={t}
                  checked={mediaType === t}
                  onChange={() => onPatch({ mediaType: t })}
                  className="h-4 w-4 accent-[#283455]"
                />
                {t === "video" ? "Video nền" : "Ảnh tĩnh"}
              </label>
            ))}
          </div>

          <div>
            <p className={labelCls}>
              {mediaType === "image" ? "Ảnh nền (Desktop)" : "Video nền (.mp4/.webm, tối đa 35MB)"}
            </p>
            <div className="mt-2">{uploadButton("desktopMedia", "Tải tệp từ máy tính", mediaAccept, true)}</div>
            <input
              aria-label="Đường dẫn tệp nền Desktop"
              type="text"
              spellCheck={false}
              value={section.desktopMedia || ""}
              onChange={(e) => onPatch({ desktopMedia: e.target.value })}
              className={`${inputCls} font-mono text-[12.5px]`}
            />
          </div>

          <div>
            <p className={labelCls}>Bản riêng cho Mobile (tùy chọn)</p>
            <div className="mt-2">{uploadButton("mobileMedia", "Tải bản Mobile", mediaAccept)}</div>
            <input
              aria-label="Đường dẫn tệp nền Mobile"
              type="text"
              spellCheck={false}
              value={section.mobileMedia || ""}
              onChange={(e) => onPatch({ mobileMedia: e.target.value })}
              placeholder="Bỏ trống = dùng chung bản Desktop"
              className={`${inputCls} font-mono text-[12.5px]`}
            />
          </div>

          {mediaType === "video" && (
            <div>
              <p className={labelCls}>Ảnh bìa khi video đang tải (tùy chọn)</p>
              <div className="mt-2">{uploadButton("desktopPoster", "Tải ảnh bìa", "image/*")}</div>
              <input
                aria-label="Đường dẫn ảnh bìa video"
                type="text"
                spellCheck={false}
                value={section.desktopPoster || ""}
                onChange={(e) => onPatch({ desktopPoster: e.target.value })}
                className={`${inputCls} font-mono text-[12.5px]`}
              />
            </div>
          )}
        </fieldset>
      )}

      {/* BANNER IMAGE */}
      {section.kind === "banner" && (
        <fieldset className="space-y-3 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
          <legend className="px-1 text-[13.5px] font-bold">Ảnh Banner</legend>
          <div>
            <p className={labelCls}>Ảnh Desktop</p>
            <div className="mt-2">{uploadButton("desktopMedia", "Tải ảnh Desktop", "image/*", true)}</div>
            <input
              aria-label="Đường dẫn ảnh banner Desktop"
              type="text"
              spellCheck={false}
              value={section.desktopMedia || ""}
              onChange={(e) => onPatch({ desktopMedia: e.target.value })}
              className={`${inputCls} font-mono text-[12.5px]`}
            />
          </div>
          <div>
            <p className={labelCls}>Ảnh Mobile (tùy chọn)</p>
            <div className="mt-2">{uploadButton("mobileMedia", "Tải ảnh Mobile", "image/*")}</div>
            <input
              aria-label="Đường dẫn ảnh banner Mobile"
              type="text"
              spellCheck={false}
              value={section.mobileMedia || ""}
              onChange={(e) => onPatch({ mobileMedia: e.target.value })}
              className={`${inputCls} font-mono text-[12.5px]`}
            />
          </div>
        </fieldset>
      )}

      {/* TITLES */}
      {section.kind !== "static" && (
        <div className="space-y-3">
          <div>
            <label htmlFor={`se-tvi-${section.id}`} className={labelCls}>
              Tiêu đề (Tiếng Việt)
            </label>
            {isMultiline ? (
              <textarea
                id={`se-tvi-${section.id}`}
                rows={2}
                value={section.titleVi || ""}
                onChange={(e) => onPatch({ titleVi: e.target.value })}
                className={`${inputCls} py-2`}
              />
            ) : (
              <input
                id={`se-tvi-${section.id}`}
                type="text"
                value={section.titleVi || ""}
                onChange={(e) => onPatch({ titleVi: e.target.value })}
                className={inputCls}
              />
            )}
          </div>
          <div>
            <label htmlFor={`se-ten-${section.id}`} className={labelCls}>
              Tiêu đề (Tiếng Anh)
            </label>
            {isMultiline ? (
              <textarea
                id={`se-ten-${section.id}`}
                rows={2}
                value={section.titleEn || ""}
                onChange={(e) => onPatch({ titleEn: e.target.value })}
                className={`${inputCls} py-2`}
              />
            ) : (
              <input
                id={`se-ten-${section.id}`}
                type="text"
                value={section.titleEn || ""}
                onChange={(e) => onPatch({ titleEn: e.target.value })}
                className={inputCls}
              />
            )}
          </div>
        </div>
      )}

      {/* SUBTITLES */}
      {(section.kind === "hero" || section.kind === "strip") && (
        <div className="space-y-3">
          <div>
            <label htmlFor={`se-svi-${section.id}`} className={labelCls}>
              Mô tả phụ (Tiếng Việt)
            </label>
            <textarea
              id={`se-svi-${section.id}`}
              rows={2}
              value={section.subtitleVi || ""}
              onChange={(e) => onPatch({ subtitleVi: e.target.value })}
              className={`${inputCls} py-2`}
            />
          </div>
          <div>
            <label htmlFor={`se-sen-${section.id}`} className={labelCls}>
              Mô tả phụ (Tiếng Anh)
            </label>
            <textarea
              id={`se-sen-${section.id}`}
              rows={2}
              value={section.subtitleEn || ""}
              onChange={(e) => onPatch({ subtitleEn: e.target.value })}
              className={`${inputCls} py-2`}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      {(section.kind === "hero" || section.kind === "banner" || section.kind === "strip") && (
        <fieldset className="space-y-3 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
          <legend className="px-1 text-[13.5px] font-bold">Nút bấm</legend>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor={`se-cvi-${section.id}`} className={labelCls}>
                Chữ trên nút (VI)
              </label>
              <input
                id={`se-cvi-${section.id}`}
                type="text"
                value={section.ctaLabelVi || ""}
                onChange={(e) => onPatch({ ctaLabelVi: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor={`se-cen-${section.id}`} className={labelCls}>
                Chữ trên nút (EN)
              </label>
              <input
                id={`se-cen-${section.id}`}
                type="text"
                value={section.ctaLabelEn || ""}
                onChange={(e) => onPatch({ ctaLabelEn: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label htmlFor={`se-href-${section.id}`} className={labelCls}>
              Link khi bấm nút
            </label>
            <input
              id={`se-href-${section.id}`}
              type="text"
              spellCheck={false}
              value={section.ctaHref || ""}
              onChange={(e) => onPatch({ ctaHref: e.target.value })}
              placeholder="/collections/best-sellers"
              className={`${inputCls} font-mono text-[13px]`}
            />
          </div>
        </fieldset>
      )}

      {/* STRIP THEME */}
      {section.kind === "strip" && (
        <div>
          <label htmlFor={`se-theme-${section.id}`} className={labelCls}>
            Màu nền dải băng
          </label>
          <select
            id={`se-theme-${section.id}`}
            value={section.theme || "burgundy-blue-cta"}
            onChange={(e) => onPatch({ theme: e.target.value as PromoStripTheme })}
            className={inputCls}
          >
            {STRIP_THEMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* CAROUSEL PRODUCTS — drag & drop ordering */}
      {section.kind === "carousel" && (
        <div className="space-y-3 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
          <div>
            <p className="text-[13.5px] font-bold">
              Sản phẩm trong mục này ({selectedSlugs.length})
            </p>
            <p className="text-[12.5px] text-[#5B647A]">
              Kéo ⋮⋮ để đổi thứ tự — sản phẩm số 1 hiện đầu tiên bên trái.
            </p>
          </div>

          <div className="flex gap-2">
            <label htmlFor={`se-add-${section.id}`} className="visually-hidden">
              Chọn sản phẩm để thêm vào mục
            </label>
            <select
              id={`se-add-${section.id}`}
              value={addSlug}
              onChange={(e) => setAddSlug(e.target.value)}
              className="admin-input min-w-0 flex-1 rounded-xl border border-[#8E96A8] px-2.5 text-[13.5px]"
            >
              <option value="">+ Chọn sản phẩm để thêm...</option>
              {availableToAdd.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.titleVi} ({vnd(p.salePriceUsd)})
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!addSlug}
              onClick={() => {
                if (!addSlug) return;
                onPatch({ productSlugs: [addSlug, ...selectedSlugs] });
                setAddSlug("");
              }}
              className="min-h-[48px] shrink-0 cursor-pointer rounded-xl bg-[#283455] px-3.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Thêm
            </button>
          </div>

          <SortableList
            items={selectedSlugs}
            getKey={(slug) => slug}
            getLabel={(slug) => productBySlug.get(slug)?.titleVi || slug}
            onReorder={(next) => onPatch({ productSlugs: next })}
            ariaLabel="Thứ tự sản phẩm trong mục"
            className="space-y-1.5"
            renderItem={(slug, { index, handle, isDragging }) => {
              const p = productBySlug.get(slug);
              return (
                <div
                  className={`flex items-center gap-2 rounded-lg border bg-[#FDFAF8] p-1.5 pr-2 ${
                    isDragging ? "border-[#2563eb] shadow-lg" : "border-[#ECE7E2]"
                  }`}
                >
                  {handle}
                  <span className="w-5 shrink-0 text-center text-[12px] font-bold text-[#5B647A]">
                    {index + 1}
                  </span>
                  {p?.mainImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.mainImage}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold">{p?.titleVi || slug}</p>
                    <p className="text-[11.5px] text-[#5B647A]">
                      {p ? vnd(p.salePriceUsd) : "Không còn trong kho"}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Bỏ ${p?.titleVi || slug} khỏi mục này`}
                    onClick={() =>
                      onPatch({ productSlugs: selectedSlugs.filter((s) => s !== slug) })
                    }
                    className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-[18px] text-[#A50E0E] hover:bg-[#FCE8E6]"
                  >
                    &times;
                  </button>
                </div>
              );
            }}
          />
          {selectedSlugs.length === 0 && (
            <p className="py-2 text-center text-[12.5px] text-[#5B647A]">
              Chưa chọn sản phẩm nào — web sẽ tự hiển thị danh sách mặc định.
            </p>
          )}
        </div>
      )}

      {/* CATEGORIES SHORTCUT */}
      {section.kind === "categories" && (
        <div className="space-y-2.5 rounded-xl border border-[#DDE3EC] bg-[#F9F3ED] p-3.5 text-[13px] text-[#3D4866]">
          <p>
            Danh mục nào hiện ở khối này và thứ tự trái → phải được chỉnh trong tab{" "}
            <strong>Danh mục</strong> (bật <strong>&ldquo;Hiện trang chủ&rdquo;</strong> và bấm ↑ / ↓).
          </p>
          <button
            type="button"
            onClick={onJumpToCategories}
            className="min-h-[40px] cursor-pointer rounded-xl bg-[#283455] px-4 text-[13px] font-bold text-white"
          >
            Mở tab Danh mục →
          </button>
        </div>
      )}

      {section.kind === "static" && (
        <p className="rounded-xl bg-[#F9F3ED] p-3.5 text-[13px] text-[#3D4866]">
          Khối nội dung cố định — bạn có thể ẩn/hiện hoặc kéo thả để đổi vị trí khối này.
        </p>
      )}
    </div>
  );
}
