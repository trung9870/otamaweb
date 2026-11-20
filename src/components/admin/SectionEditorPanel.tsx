"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { ButtonStyleControls } from "./ButtonStyleControls";
import { LinkPicker } from "./LinkPicker";
import type { PreviewDevice } from "./LivePreviewFrame";
import { PositionControls } from "./PositionControls";
import { SortableList } from "./SortableList";
import { TextStyleControls } from "./StyleControls";
import type {
  HomepageSectionConfig,
  HomepageSectionStyle,
  PromoStripTheme,
  StoreCategory,
  StoreProduct,
} from "@/lib/store-types";

interface SectionEditorPanelProps {
  section: HomepageSectionConfig;
  allProducts: StoreProduct[];
  allCategories: StoreCategory[];
  vndRate: number;
  device: PreviewDevice;
  onDeviceSwitch: (dev: PreviewDevice) => void;
  onPatch: (patch: Partial<HomepageSectionConfig>) => void;
  onJumpToCategories: () => void;
}

type InspectorTabId = "content" | "style" | "position";

const INSPECTOR_TABS: readonly { id: InspectorTabId; label: string }[] = [
  { id: "content", label: "Nội dung" },
  { id: "style", label: "Kiểu dáng" },
  { id: "position", label: "Vị trí" },
];

const STRIP_THEMES: { value: PromoStripTheme; label: string }[] = [
  { value: "burgundy-blue-cta", label: "Đỏ rượu vang — Nút xanh Navy" },
  { value: "burgundy-outline-cta", label: "Đỏ rượu vang — Nút viền trắng" },
  { value: "navy-adaptive-cta", label: "Xanh Navy đậm" },
  { value: "slate-navy-cta", label: "Xám xanh nhạt" },
];

const inputCls =
  "admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3 text-[14px]";
const labelCls = "block text-[13px] font-bold text-[#283455]";

const subscribeNoop = () => () => {};
const getNativeFocusGroup = () =>
  typeof HTMLElement !== "undefined" &&
  Object.hasOwn(HTMLElement.prototype, "focusGroup");

/**
 * 3-tab inline inspector (Nội dung | Kiểu dáng | Vị trí) for one homepage block.
 * Every edit updates the draft immediately (via onPatch) and nothing is saved
 * to the live storefront until "Lưu & Xuất bản".
 */
export function SectionEditorPanel({
  section,
  allProducts,
  allCategories,
  vndRate,
  device,
  onDeviceSwitch,
  onPatch,
  onJumpToCategories,
}: SectionEditorPanelProps) {
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [activeTab, setActiveTab] = useState<InspectorTabId>("content");
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addSlug, setAddSlug] = useState("");

  const hasNativeFocusgroup = useSyncExternalStore(
    subscribeNoop,
    getNativeFocusGroup,
    () => false
  );

  const tabRefs = useRef<Record<InspectorTabId, HTMLButtonElement | null>>({
    content: null,
    style: null,
    position: null,
  });
  const panelRefs = useRef<Record<InspectorTabId, HTMLDivElement | null>>({
    content: null,
    style: null,
    position: null,
  });

  // Sync hidden="until-found" and listen to Find-in-Page `beforematch` (modern-web-guidance: tabs)
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    for (const t of INSPECTOR_TABS) {
      const panel = panelRefs.current[t.id];
      if (!panel) continue;
      if (t.id === activeTab) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "until-found");
      }
      const onBeforeMatch = () => setActiveTab(t.id);
      panel.addEventListener("beforematch", onBeforeMatch);
      cleanups.push(() => panel.removeEventListener("beforematch", onBeforeMatch));
    }
    return () => cleanups.forEach((fn) => fn());
  }, [activeTab]);

  const selectTab = (next: InspectorTabId, focusBtn = false) => {
    setActiveTab(next);
    const btn = tabRefs.current[next];
    if (btn) {
      if (focusBtn) btn.focus();
      btn.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        container: "nearest",
      } as ScrollIntoViewOptions);
    }
  };

  const handleTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (hasNativeFocusgroup) return;
    const idx = INSPECTOR_TABS.findIndex((t) => t.id === activeTab);
    if (idx < 0) return;
    let nextIdx = idx;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % INSPECTOR_TABS.length;
    else if (e.key === "ArrowLeft")
      nextIdx = (idx - 1 + INSPECTOR_TABS.length) % INSPECTOR_TABS.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = INSPECTOR_TABS.length - 1;
    else return;

    e.preventDefault();
    selectTab(INSPECTOR_TABS[nextIdx].id, true);
  };

  const productBySlug = useMemo(
    () => new Map(allProducts.map((p) => [p.slug, p])),
    [allProducts]
  );
  const selectedSlugs = useMemo(
    () => section.productSlugs || [],
    [section.productSlugs]
  );
  const availableToAdd = useMemo(
    () => allProducts.filter((p) => p.active && !selectedSlugs.includes(p.slug)),
    [allProducts, selectedSlugs]
  );

  const mediaType = section.mediaType || "video";
  const vnd = (usd: number) =>
    `${Math.round(usd * vndRate).toLocaleString("vi-VN")}₫`;

  const patchStyle = (partial: Partial<HomepageSectionStyle>) => {
    const merged: HomepageSectionStyle = { ...(section.style || {}), ...partial };
    const cleaned = Object.fromEntries(
      Object.entries(merged).filter(([, v]) => v !== undefined)
    ) as HomepageSectionStyle;
    onPatch({ style: Object.keys(cleaned).length > 0 ? cleaned : undefined });
  };

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
      className={`relative inline-flex min-h-[40px] cursor-pointer items-center rounded-xl px-3.5 text-[13px] font-bold select-none ${
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

  // Static blocks only support visibility & ordering
  if (section.kind === "static") {
    return (
      <div className="admin-form-scope space-y-4">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E0DB] bg-white px-3.5 py-3">
          <input
            type="checkbox"
            checked={section.visible}
            onChange={(e) => onPatch({ visible: e.target.checked })}
            className="h-5 w-5"
          />
          <span className="text-[14px] font-bold">
            Hiển thị khối này trên Trang chủ
          </span>
        </label>
        <p className="rounded-xl bg-[#F9F3ED] p-3.5 text-[13px] text-[#3D4866]">
          Khối nội dung cố định — bạn có thể ẩn/hiện hoặc kéo thả để đổi vị trí khối này.
        </p>
      </div>
    );
  }

  // Estimate background color for live WCAG contrast warnings
  const isLightSection =
    section.kind === "carousel" ||
    section.kind === "categories" ||
    (section.kind === "strip" &&
      !section.style?.layout?.bgColor &&
      section.theme === "slate-navy-cta");

  const estimatedBgHex =
    section.style?.layout?.bgColor ||
    (section.kind === "carousel" || section.kind === "categories"
      ? "#FDFAF8"
      : section.kind === "banner"
      ? "#740103"
      : section.kind === "strip"
      ? section.theme === "slate-navy-cta"
        ? "#DDE3EC"
        : section.theme === "navy-adaptive-cta"
        ? "#283455"
        : "#740103"
      : "#3A3633");

  const defaultTextHex = isLightSection ? "#283455" : "#FFFFFF";
  const defaultTitleDesktop =
    section.kind === "hero"
      ? section.id === "hero_sheets"
        ? 56
        : 45
      : section.kind === "strip"
      ? 36
      : section.kind === "banner"
      ? 20
      : 24;
  const defaultTitleMobile =
    section.kind === "hero"
      ? 34
      : section.kind === "strip"
      ? 30
      : section.kind === "banner"
      ? 17
      : 20;

  const hasAnyCustomStyle = Boolean(
    section.style && Object.keys(section.style).length > 0
  );

  return (
    <div className="admin-form-scope space-y-3">
      {errorMsg && (
        <div
          role="alert"
          className="rounded-xl border border-[#D93025]/40 bg-[#FCE8E6] px-3.5 py-2.5 text-[13.5px] text-[#A50E0E]"
        >
          {errorMsg}
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E0DB] bg-white px-3.5 py-2.5">
        <input
          type="checkbox"
          checked={section.visible}
          onChange={(e) => onPatch({ visible: e.target.checked })}
          className="h-5 w-5"
        />
        <span className="text-[13.5px] font-bold">
          Hiển thị khối này trên Trang chủ
        </span>
      </label>

      {/* ================= 3-TAB BAR (modern-web-guidance: tabs) ================= */}
      <div
        className="admin-tablist"
        aria-label="Các thẻ tùy chỉnh khối"
        role={hasNativeFocusgroup ? undefined : "tablist"}
        onKeyDown={handleTabKeyDown}
        {...({ focusgroup: "tablist nomemory" } as Record<string, unknown>)}
      >
        {INSPECTOR_TABS.map((t) => {
          const isActive = activeTab === t.id;
          const tabId = `${baseId}-tab-${t.id}`;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              id={tabId}
              type="button"
              role={hasNativeFocusgroup ? undefined : "tab"}
              tabIndex={hasNativeFocusgroup ? undefined : isActive ? 0 : -1}
              aria-selected={isActive}
              onClick={() => selectTab(t.id)}
              className="cursor-pointer px-4 py-2.5 text-[13.5px] font-bold focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#283455]"
              {...(isActive
                ? ({ focusgroupstart: "" } as Record<string, unknown>)
                : {})}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Zero-gap container so hidden="until-found" panels collapse to 0px without intercepting clicks */}
      <div>
        {/* ==================== TAB 1: NỘI DUNG ==================== */}
        <div
          ref={(el) => {
            panelRefs.current.content = el;
          }}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-content`}
          {...(activeTab !== "content"
            ? ({ hidden: "until-found" } as Record<string, unknown>)
            : {})}
        >
          <div className="space-y-4 pt-2">
            {/* HERO MEDIA */}
            {section.kind === "hero" && (
              <fieldset className="space-y-3 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
                <legend className="px-1 text-[13.5px] font-bold">
                  Nền của Hero
                </legend>
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
                        className="h-4 w-4"
                      />
                      {t === "video" ? "Video nền" : "Ảnh tĩnh"}
                    </label>
                  ))}
                </div>

                <div>
                  <p className={labelCls}>
                    {mediaType === "image"
                      ? "Ảnh nền (Desktop)"
                      : "Video nền (.mp4/.webm, tối đa 35MB)"}
                  </p>
                  <div className="mt-2">
                    {uploadButton(
                      "desktopMedia",
                      "Tải tệp từ máy tính",
                      mediaAccept,
                      true
                    )}
                  </div>
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
                  <div className="mt-2">
                    {uploadButton("mobileMedia", "Tải bản Mobile", mediaAccept)}
                  </div>
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
                    <p className={labelCls}>
                      Ảnh bìa khi video đang tải (tùy chọn)
                    </p>
                    <div className="mt-2">
                      {uploadButton("desktopPoster", "Tải ảnh bìa", "image/*")}
                    </div>
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
                  <div className="mt-2">
                    {uploadButton(
                      "desktopMedia",
                      "Tải ảnh Desktop",
                      "image/*",
                      true
                    )}
                  </div>
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
                  <div className="mt-2">
                    {uploadButton("mobileMedia", "Tải ảnh Mobile", "image/*")}
                  </div>
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

            {/* PRIMARY CTA WITH GROUPED LINK PICKER */}
            {(section.kind === "hero" ||
              section.kind === "banner" ||
              section.kind === "strip") && (
              <fieldset className="space-y-3 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
                <legend className="px-1 text-[13.5px] font-bold">Nút bấm chính</legend>
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
                <LinkPicker
                  id={`se-href-${section.id}`}
                  label="Khi bấm nút sẽ mở..."
                  value={section.ctaHref || ""}
                  onChange={(href) => onPatch({ ctaHref: href })}
                  categories={allCategories}
                  products={allProducts}
                />
              </fieldset>
            )}

            {/* SECONDARY CTA FOR HERO SHEETS */}
            {section.id === "hero_sheets" && (
              <fieldset className="space-y-3 rounded-xl border border-[#E5E0DB] bg-white p-3.5">
                <legend className="px-1 text-[13.5px] font-bold">
                  Nút bấm phụ (bỏ trống chữ = ẩn nút)
                </legend>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor={`se-scvi-${section.id}`} className={labelCls}>
                      Chữ nút phụ (VI)
                    </label>
                    <input
                      id={`se-scvi-${section.id}`}
                      type="text"
                      value={section.secondaryCtaLabelVi || ""}
                      onChange={(e) =>
                        onPatch({ secondaryCtaLabelVi: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor={`se-scen-${section.id}`} className={labelCls}>
                      Chữ nút phụ (EN)
                    </label>
                    <input
                      id={`se-scen-${section.id}`}
                      type="text"
                      value={section.secondaryCtaLabelEn || ""}
                      onChange={(e) =>
                        onPatch({ secondaryCtaLabelEn: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>
                <LinkPicker
                  id={`se-shref-${section.id}`}
                  label="Khi bấm nút phụ sẽ mở..."
                  value={section.secondaryCtaHref || ""}
                  onChange={(href) => onPatch({ secondaryCtaHref: href })}
                  categories={allCategories}
                  products={allProducts}
                />
              </fieldset>
            )}

            {/* STRIP PRESET THEME */}
            {section.kind === "strip" && (
              <div>
                <label htmlFor={`se-theme-${section.id}`} className={labelCls}>
                  Tông màu mẫu dải băng
                </label>
                <select
                  id={`se-theme-${section.id}`}
                  value={section.theme || "burgundy-blue-cta"}
                  onChange={(e) =>
                    onPatch({ theme: e.target.value as PromoStripTheme })
                  }
                  className={inputCls}
                >
                  {STRIP_THEMES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11.5px] text-[#5B647A]">
                  Muốn chọn màu tự do cho chữ, nút hoặc nền dải băng? Chuyển sang thẻ{" "}
                  <strong>Kiểu dáng</strong> hoặc <strong>Vị trí</strong>.
                </p>
              </div>
            )}

            {/* CAROUSEL PRODUCTS */}
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
                          isDragging
                            ? "border-[#2563eb] shadow-lg"
                            : "border-[#ECE7E2]"
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
                          <p className="truncate text-[13px] font-bold">
                            {p?.titleVi || slug}
                          </p>
                          <p className="text-[11.5px] text-[#5B647A]">
                            {p ? vnd(p.salePriceUsd) : "Không còn trong kho"}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Bỏ ${p?.titleVi || slug} khỏi mục này`}
                          onClick={() =>
                            onPatch({
                              productSlugs: selectedSlugs.filter((s) => s !== slug),
                            })
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
                  <strong>Danh mục</strong> (bật <strong>&ldquo;Hiện trang chủ&rdquo;</strong>{" "}
                  và bấm ↑ / ↓).
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
          </div>
        </div>

        {/* ==================== TAB 2: KIỂU DÁNG ==================== */}
        <div
          ref={(el) => {
            panelRefs.current.style = el;
          }}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-style`}
          {...(activeTab !== "style"
            ? ({ hidden: "until-found" } as Record<string, unknown>)
            : {})}
        >
          <div className="space-y-4 pt-2">
            <TextStyleControls
              heading="Kiểu chữ Tiêu đề"
              style={section.style?.title}
              device={device}
              onDeviceSwitch={onDeviceSwitch}
              defaultColorHex={defaultTextHex}
              contrastAgainstHex={estimatedBgHex}
              minContrast={3}
              defaultDesktopSize={defaultTitleDesktop}
              defaultMobileSize={defaultTitleMobile}
              maxDesktopSize={88}
              showShadowToggle={
                section.kind === "hero" || section.kind === "banner"
              }
              sampleText={section.titleVi}
              onChange={(next) => patchStyle({ title: next })}
            />

            {(section.kind === "hero" || section.kind === "strip") && (
              <TextStyleControls
                heading="Kiểu chữ Mô tả phụ"
                style={section.style?.subtitle}
                device={device}
                onDeviceSwitch={onDeviceSwitch}
                defaultColorHex={defaultTextHex}
                contrastAgainstHex={estimatedBgHex}
                minContrast={4.5}
                defaultDesktopSize={section.kind === "hero" ? 22 : 18}
                defaultMobileSize={section.kind === "hero" ? 17 : 16}
                maxDesktopSize={42}
                showShadowToggle={section.kind === "hero"}
                sampleText={section.subtitleVi}
                onChange={(next) => patchStyle({ subtitle: next })}
              />
            )}

            {(section.kind === "hero" ||
              section.kind === "banner" ||
              section.kind === "strip") && (
              <ButtonStyleControls
                heading="Kiểu dáng & Màu Nút bấm"
                style={section.style?.button}
                device={device}
                defaultBgHex={
                  section.kind === "strip" && section.theme === "burgundy-blue-cta"
                    ? "#283C6E"
                    : "#283455"
                }
                defaultTextHex="#FFFFFF"
                onChange={(next) => patchStyle({ button: next })}
              />
            )}

            {section.id === "hero_sheets" && section.secondaryCtaLabelVi?.trim() && (
              <ButtonStyleControls
                heading="Kiểu dáng Nút bấm phụ (Tùy chọn)"
                style={section.style?.secondaryButton}
                device={device}
                defaultBgHex="#283455"
                defaultTextHex="#FFFFFF"
                onChange={(next) => patchStyle({ secondaryButton: next })}
              />
            )}
          </div>
        </div>

        {/* ==================== TAB 3: VỊ TRÍ ==================== */}
        <div
          ref={(el) => {
            panelRefs.current.position = el;
          }}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-position`}
          {...(activeTab !== "position"
            ? ({ hidden: "until-found" } as Record<string, unknown>)
            : {})}
        >
          <div className="space-y-4 pt-2">
            <PositionControls
              kind={section.kind}
              layout={section.style?.layout}
              theme={section.theme}
              device={device}
              onDeviceSwitch={onDeviceSwitch}
              onChangeLayout={(next) => patchStyle({ layout: next })}
            />
          </div>
        </div>
      </div>

      {/* Global style reset button */}
      {hasAnyCustomStyle && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onPatch({ style: undefined })}
            className="min-h-[40px] w-full cursor-pointer rounded-xl border border-[#740103]/30 bg-[#FCE8E6]/60 px-3 text-[12.5px] font-bold text-[#740103] hover:bg-[#FCE8E6]"
          >
            ↺ Khôi phục toàn bộ kiểu chữ, màu nút &amp; vị trí mặc định
          </button>
        </div>
      )}
    </div>
  );
}
