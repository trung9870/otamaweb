"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  LivePreviewFrame,
  type PreviewDevice,
  type PreviewLocale,
} from "../LivePreviewFrame";
import { BasicInfoPanel, DescriptionPanel, PricingPanel, VisibilityPanel } from "./InfoPanels";
import { MediaPanel, SwatchesPanel } from "./MediaPanels";
import {
  GROUP_META,
  GROUP_ORDER,
  regionToGroup,
  vndFromUsd,
  type EditorGroupId,
} from "./shared";
import { StoryBlocksPanel } from "./StoryBlocksPanel";
import { getDefaultProductDetailBlocks } from "@/lib/product-detail-defaults";
import {
  computeDiscountBadge,
  slugifyText,
  type StoreCategory,
  type StoreProduct,
} from "@/lib/store-types";

const PREVIEW_PATH = "/products/__preview__";
const NEW_PRODUCT_ID = "__new__";

interface ProductEditorViewProps {
  product: StoreProduct | null;
  categories: StoreCategory[];
  vndRate: number;
  onSaved: (saved: StoreProduct, isNew: boolean) => Promise<void> | void;
  onClose: () => void;
  onDirtyChange: (dirty: boolean) => void;
}

function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

function buildBlankProduct(categories: StoreCategory[]): StoreProduct {
  return {
    id: NEW_PRODUCT_ID,
    slug: "",
    titleEn: "",
    titleVi: "",
    categorySlug: categories[0]?.slug || "all-sheets",
    tags: ["sale", "sheets"],
    salePriceUsd: 100,
    originalPriceUsd: 132,
    discountBadge: computeDiscountBadge(100, 132),
    topBadge: "NEW",
    promoEyebrow: "BLACK FRIDAY SALE",
    promoTone: "sale",
    mainImage:
      "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
    hoverImage:
      "/sites/brooklinen/products/BKL_25-11_Bedding_Classic_TandemStripeInStorm_CS-fa940239.jpg",
    galleryImages: [],
    reviewCount: "(Mới)",
    rating: 5,
    defaultSwatchIndex: 0,
    swatches: [],
    descriptionEn: "",
    descriptionVi: "",
    includesEn: ["OEKO-TEX® certified premium materials", "Thoughtfully packaged and gift-ready"],
    includesVi: [
      "100% chất liệu tuyển chọn đạt chứng nhận OEKO-TEX®",
      "Đóng gói chỉn chu, sẵn sàng làm quà tặng",
    ],
    careEn: "Machine wash cold with like colors. Tumble dry low.",
    careVi: "Giặt máy chế độ nước lạnh với đồ cùng màu. Sấy nhẹ ở nhiệt độ thấp.",
    detailBlocks: [
      {
        id: "blk-new-1",
        layout: "split-left",
        eyebrowVi: "ĐIỂM NỔI BẬT",
        headingVi: "Chất liệu êm ái, nâng niu giấc ngủ mỗi đêm",
        bodyVi:
          "Mô tả chi tiết về chất vải, đường may và trải nghiệm thực tế của sản phẩm.\n- Thoáng khí, mềm mịn tự nhiên\n- Bền màu qua nhiều lần giặt",
        image:
          "/sites/brooklinen/categories/BKL_25111_UtilityEducation_Scene2Shot2_071x_8x9_-83ce0562.jpg",
      },
    ],
    sections: ["bestOfSale"],
    active: true,
    sortOrder: 0,
    updatedAt: "",
  };
}

/** Fill optional fields so draft vs. baseline comparison is stable. */
function normalizeProduct(p: StoreProduct): StoreProduct {
  return {
    ...p,
    galleryImages: p.galleryImages || [],
    detailBlocks: p.detailBlocks !== undefined ? p.detailBlocks : getDefaultProductDetailBlocks(p),
  };
}

function groupSummary(g: EditorGroupId, d: StoreProduct, vndRate: number): string {
  switch (g) {
    case "basic":
      return d.titleVi || "Chưa đặt tên";
    case "pricing":
      return `${vndFromUsd(d.salePriceUsd, vndRate).toLocaleString("vi-VN")}₫${
        d.originalPriceUsd > d.salePriceUsd ? ` · ${computeDiscountBadge(d.salePriceUsd, d.originalPriceUsd).replace("% Off", "% giảm")}` : ""
      }`;
    case "media": {
      const n = new Set([d.mainImage, d.hoverImage, ...(d.galleryImages || [])].filter(Boolean)).size;
      return `${n} ảnh`;
    }
    case "swatches":
      return d.swatches.length > 0 ? `${d.swatches.length} màu` : "Không có lựa chọn màu";
    case "description":
      return (d.descriptionVi || "Chưa có mô tả").slice(0, 48);
    case "story":
      return `${d.detailBlocks?.length || 0} mục ảnh + nội dung`;
    case "visibility":
      return d.active ? `Đang bán · ${d.sections.length} mục trang chủ` : "Đang ẩn khỏi web";
  }
}

export function ProductEditorView({
  product,
  categories,
  vndRate,
  onSaved,
  onClose,
  onDirtyChange,
}: ProductEditorViewProps) {
  const [baseline, setBaseline] = useState<StoreProduct>(() =>
    normalizeProduct(product || buildBlankProduct(categories))
  );
  const [draft, setDraft] = useState<StoreProduct>(baseline);
  const [resetNonce, setResetNonce] = useState(0);
  const isNew = baseline.id === NEW_PRODUCT_ID;

  const [activeGroup, setActiveGroup] = useState<EditorGroupId | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ id: string; nonce: number } | null>(null);
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [locale, setLocale] = useState<PreviewLocale>("vi");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<"discard" | "leave" | null>(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktop, () => true);
  const confirmRef = useRef<HTMLDialogElement>(null);
  const mobilePreviewRef = useRef<HTMLDialogElement>(null);

  // ------------------------------------------------------------ dirty state
  const changeCount = useMemo(() => {
    let n = 0;
    const keys = new Set([...Object.keys(baseline), ...Object.keys(draft)]) as Set<
      keyof StoreProduct
    >;
    for (const k of keys) {
      if (JSON.stringify(baseline[k]) !== JSON.stringify(draft[k])) n++;
    }
    return n;
  }, [baseline, draft]);
  const dirty = changeCount > 0;

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!savedMsg) return;
    const t = setTimeout(() => setSavedMsg(null), 3500);
    return () => clearTimeout(t);
  }, [savedMsg]);

  // --------------------------------------------------------- native dialogs
  useEffect(() => {
    const d = confirmRef.current;
    if (!d) return;
    if (confirm && !d.open) d.showModal();
    if (!confirm && d.open) d.close();
  }, [confirm]);

  useEffect(() => {
    const d = mobilePreviewRef.current;
    if (!d) return;
    if (mobilePreviewOpen && !d.open) d.showModal();
    if (!mobilePreviewOpen && d.open) d.close();
  }, [mobilePreviewOpen]);

  // ---------------------------------------------------------------- actions
  const patch = useCallback((partial: Partial<StoreProduct>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  const focusRegion = useCallback((regionId: string) => {
    if (!regionId) return;
    setSelectedId(regionId);
    setFocusRequest({ id: regionId, nonce: Date.now() });
  }, []);

  const highlightRegion = useCallback((regionId: string) => {
    setSelectedId(regionId);
  }, []);

  const openGroup = (g: EditorGroupId) => {
    setActiveGroup(g);
    setSelectedBlockId(null);
    const firstBlock = draft.detailBlocks?.[0];
    const region =
      g === "story" ? (firstBlock ? `story:${firstBlock.id}` : "") : GROUP_META[g].region;
    focusRegion(region);
  };

  const selectBlock = (blockId: string | null) => {
    setSelectedBlockId(blockId);
    if (blockId) focusRegion(`story:${blockId}`);
  };

  const handlePreviewSelect = (regionId: string) => {
    const g = regionToGroup(regionId);
    if (!g) return;
    setActiveGroup(g);
    setSelectedId(regionId);
    setSelectedBlockId(regionId.startsWith("story:") ? regionId.slice(6) : null);
    if (!isDesktop) setMobilePreviewOpen(false);
  };

  const requestClose = () => {
    if (dirty) setConfirm("leave");
    else onClose();
  };

  const discard = () => {
    setDraft(baseline);
    setResetNonce((n) => n + 1);
    setSelectedBlockId(null);
    setConfirm(null);
  };

  const handleSave = async (e?: FormEvent) => {
    e?.preventDefault();
    if (saving) return;
    if (!draft.titleVi.trim() && !draft.titleEn.trim()) {
      setErrorMsg("Vui lòng nhập tên sản phẩm (nhóm Thông tin cơ bản).");
      setActiveGroup("basic");
      return;
    }
    setSaving(true);
    setErrorMsg(null);

    const payload = {
      slug: slugifyText(draft.slug) || slugifyText(draft.titleEn || draft.titleVi),
      titleVi: draft.titleVi.trim() || draft.titleEn.trim(),
      titleEn: draft.titleEn.trim() || draft.titleVi.trim(),
      categorySlug: draft.categorySlug,
      salePriceUsd: draft.salePriceUsd,
      originalPriceUsd: draft.originalPriceUsd,
      discountBadge: computeDiscountBadge(draft.salePriceUsd, draft.originalPriceUsd),
      topBadge: draft.topBadge,
      promoEyebrow: draft.promoEyebrow.trim(),
      promoTone: draft.promoTone,
      mainImage: draft.mainImage.trim(),
      hoverImage: draft.hoverImage.trim() || draft.mainImage.trim(),
      galleryImages: draft.galleryImages || [],
      descriptionVi: draft.descriptionVi.trim(),
      descriptionEn: draft.descriptionEn.trim() || draft.descriptionVi.trim(),
      includesVi: draft.includesVi,
      includesEn: draft.includesEn.length > 0 ? draft.includesEn : draft.includesVi,
      careVi: draft.careVi.trim(),
      careEn: draft.careEn.trim() || draft.careVi.trim(),
      detailBlocks: draft.detailBlocks || [],
      tags: draft.tags.length > 0 ? draft.tags : ["sale"],
      sections: draft.sections,
      swatches: draft.swatches.filter((s) => s.label.trim()),
      defaultSwatchIndex: draft.defaultSwatchIndex,
      active: draft.active,
    };

    try {
      const res = await fetch(
        isNew ? "/api/admin/products" : `/api/admin/products/${encodeURIComponent(baseline.id)}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = (await res.json()) as { product?: StoreProduct; error?: string };
      if (!res.ok || !data.product) throw new Error(data.error || "Không thể lưu sản phẩm.");
      const fresh = normalizeProduct(data.product);
      setBaseline(fresh);
      setDraft(fresh);
      setResetNonce((n) => n + 1);
      setSavedMsg(isNew ? "Đã tạo sản phẩm mới!" : "Đã lưu thay đổi!");
      await onSaved(data.product, isNew);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Không thể lưu sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------------- render
  const segmentBtn = (active: boolean) =>
    `min-h-[38px] cursor-pointer rounded-lg px-3 text-[13px] font-bold transition-colors ${
      active ? "bg-white text-[#283455] shadow-sm" : "text-[#5B647A] hover:text-[#283455]"
    }`;

  const panelProps = {
    draft,
    patch,
    locale,
    onRegionFocus: highlightRegion,
  };
  const panelKey = `${activeGroup}-${resetNonce}-${locale}`;

  const renderPanel = () => {
    switch (activeGroup) {
      case "basic":
        return (
          <BasicInfoPanel key={panelKey} {...panelProps} categories={categories} isNew={isNew} />
        );
      case "pricing":
        return <PricingPanel key={panelKey} {...panelProps} vndRate={vndRate} />;
      case "media":
        return <MediaPanel key={panelKey} {...panelProps} onError={setErrorMsg} />;
      case "swatches":
        return (
          <SwatchesPanel
            key={panelKey}
            {...panelProps}
            onFocusRegion={focusRegion}
            onError={setErrorMsg}
          />
        );
      case "description":
        return <DescriptionPanel key={panelKey} {...panelProps} />;
      case "story":
        return (
          <StoryBlocksPanel
            key={`${panelKey}-${selectedBlockId || "list"}`}
            {...panelProps}
            selectedBlockId={selectedBlockId}
            onSelectBlock={selectBlock}
            onError={setErrorMsg}
          />
        );
      case "visibility":
        return <VisibilityPanel key={panelKey} {...panelProps} vndRate={vndRate} />;
      default:
        return null;
    }
  };

  const preview = (dev: PreviewDevice) => (
    <LivePreviewFrame
      locale={locale}
      device={dev}
      path={PREVIEW_PATH}
      productDraft={draft}
      selectedId={selectedId}
      focusRequest={focusRequest}
      onSelect={handlePreviewSelect}
    />
  );

  return (
    <form
      onSubmit={(e) => void handleSave(e)}
      aria-labelledby="product-editor-title"
      className="space-y-3"
    >
      {/* ================= TOOLBAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5E0DB] bg-white px-4 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={requestClose}
            className="inline-flex min-h-[40px] cursor-pointer items-center rounded-xl px-2.5 text-[13.5px] font-bold text-[#283455] hover:bg-[#F3EDE7]"
          >
            ← Danh sách sản phẩm
          </button>
          <h1 id="product-editor-title" className="max-w-[340px] truncate text-[18px] font-bold">
            {isNew ? "Thêm sản phẩm mới" : baseline.titleVi}
          </h1>
          <p
            role="status"
            className={`rounded-full px-3 py-1 text-[12.5px] font-bold ${
              dirty ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#EAF3E4] text-[#417823]"
            }`}
          >
            {savedMsg
              ? `✓ ${savedMsg}`
              : dirty
              ? `● ${changeCount} thay đổi chưa lưu`
              : isNew
              ? "Bản nháp sản phẩm mới"
              : "✓ Đã lưu — đang hiển thị trên web"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isDesktop && (
            <div role="group" aria-label="Thiết bị xem trước" className="flex rounded-xl bg-[#F3EDE7] p-1">
              <button
                type="button"
                aria-pressed={device === "desktop"}
                onClick={() => setDevice("desktop")}
                className={segmentBtn(device === "desktop")}
              >
                🖥 Máy tính
              </button>
              <button
                type="button"
                aria-pressed={device === "mobile"}
                onClick={() => setDevice("mobile")}
                className={segmentBtn(device === "mobile")}
              >
                📱 Điện thoại
              </button>
            </div>
          )}
          <div role="group" aria-label="Ngôn ngữ đang sửa và xem trước" className="flex rounded-xl bg-[#F3EDE7] p-1">
            {(["vi", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={locale === l}
                onClick={() => setLocale(l)}
                className={segmentBtn(locale === l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          {!isDesktop && (
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(true)}
              className="min-h-[42px] cursor-pointer rounded-xl border border-[#283455] bg-white px-3.5 text-[13.5px] font-bold text-[#283455]"
            >
              👁 Xem trước
            </button>
          )}
          {!isNew && (
            <Link
              href={`/products/${baseline.slug}?lang=vi`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[42px] items-center rounded-xl border border-[#C9CFD9] bg-white px-3 text-[13px] font-bold text-[#5B647A] hover:text-[#283455]"
            >
              Trang thật ↗
            </Link>
          )}
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={() => setConfirm("discard")}
            className="min-h-[42px] cursor-pointer rounded-xl border border-[#C9CFD9] bg-white px-3.5 text-[13.5px] font-bold text-[#283455] hover:bg-[#F9F3ED] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Hủy thay đổi
          </button>
          <button
            type="submit"
            disabled={saving || (!dirty && !isNew)}
            className="min-h-[42px] cursor-pointer rounded-xl bg-[#283455] px-4 text-[13.5px] font-bold text-white hover:bg-[#1D2742] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Đang lưu..." : isNew ? "Tạo sản phẩm" : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {/* ================= 2-COLUMN EDITOR ================= */}
      <div className="grid grid-cols-1 gap-3 lg:h-[calc(100dvh-235px)] lg:min-h-[620px] lg:grid-cols-[minmax(360px,440px)_1fr]">
        <aside
          aria-label="Bảng chỉnh sửa sản phẩm"
          className="admin-form-scope min-w-0 rounded-2xl border border-[#E5E0DB] bg-[#FDFAF8] p-3.5 lg:overflow-y-auto"
        >
          {errorMsg && (
            <div
              role="alert"
              className="mb-3 flex items-start justify-between gap-2 rounded-xl border border-[#D93025]/40 bg-[#FCE8E6] px-3.5 py-2.5 text-[13px] text-[#A50E0E]"
            >
              <span>
                <span aria-hidden="true">⚠️ </span>
                {errorMsg}
              </span>
              <button
                type="button"
                aria-label="Đóng thông báo lỗi"
                onClick={() => setErrorMsg(null)}
                className="cursor-pointer px-1 text-[16px] leading-none"
              >
                &times;
              </button>
            </div>
          )}

          {activeGroup === null ? (
            <div className="space-y-2">
              <p className="mb-1 text-[12.5px] text-[#5B647A]">
                Chọn một nhóm để chỉnh. Bạn cũng có thể <strong>bấm trực tiếp lên bản xem trước</strong>{" "}
                (ảnh, giá, mô tả, từng mục bài viết…) để mở đúng chỗ cần sửa.
              </p>
              {GROUP_ORDER.map((g) => {
                const meta = GROUP_META[g];
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => openGroup(g)}
                    onPointerEnter={() => meta.region && highlightRegion(meta.region)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E5E0DB] bg-white px-3.5 py-3 text-left hover:border-[#283455]"
                  >
                    <span aria-hidden="true" className="text-[20px]">
                      {meta.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-bold text-[#283455]">{meta.label}</span>
                      <span className="block truncate text-[12px] text-[#5B647A]">
                        {groupSummary(g, draft, vndRate)}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-[#8E96A8]">
                      ›
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {!(activeGroup === "story" && selectedBlockId) && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGroup(null);
                      setSelectedBlockId(null);
                    }}
                    className="inline-flex min-h-[38px] cursor-pointer items-center rounded-lg px-2 text-[13px] font-bold text-[#283455] hover:bg-[#F3EDE7]"
                  >
                    ← Tất cả nhóm
                  </button>
                  <div>
                    <h2 className="flex items-center gap-2 text-[17px] font-bold">
                      <span aria-hidden="true">{GROUP_META[activeGroup].icon}</span>
                      {GROUP_META[activeGroup].label}
                    </h2>
                    <p className="text-[12.5px] text-[#5B647A]">{GROUP_META[activeGroup].hint}</p>
                  </div>
                </>
              )}
              {renderPanel()}
            </div>
          )}
        </aside>

        {isDesktop && (
          <section
            aria-label="Xem trước trang sản phẩm (bản nháp)"
            className="flex min-h-0 min-w-0 flex-col rounded-2xl border border-[#E5E0DB] bg-[#EFEAE4] p-3"
          >
            <p className="mb-2 text-center text-[12px] font-bold text-[#5B647A]">
              BẢN XEM TRƯỚC — bấm vào ảnh, giá, mô tả hay từng mục bài viết để chỉnh. Khách chỉ thấy sau khi bấm
              &ldquo;{isNew ? "Tạo sản phẩm" : "Lưu thay đổi"}&rdquo;.
            </p>
            <div className="min-h-0 flex-1">{preview(device)}</div>
          </section>
        )}
      </div>

      {/* ================= MOBILE FULL-SCREEN PREVIEW ================= */}
      <dialog
        ref={mobilePreviewRef}
        aria-label="Xem trước trang sản phẩm"
        onClose={() => setMobilePreviewOpen(false)}
        className="admin-preview-dialog"
      >
        {mobilePreviewOpen && (
          <div className="flex h-full flex-col bg-[#EFEAE4]">
            <div className="flex items-center justify-between gap-2 border-b border-[#E5E0DB] bg-white px-3 py-2">
              <p className="text-[13.5px] font-bold text-[#283455]">Xem trước bản nháp</p>
              <button
                type="button"
                autoFocus
                onClick={() => setMobilePreviewOpen(false)}
                className="min-h-[40px] cursor-pointer rounded-xl bg-[#283455] px-4 text-[13px] font-bold text-white"
              >
                Đóng
              </button>
            </div>
            <div className="min-h-0 flex-1 p-2">{preview("mobile")}</div>
          </div>
        )}
      </dialog>

      {/* ================= CONFIRM DISCARD / LEAVE ================= */}
      <dialog
        ref={confirmRef}
        aria-labelledby="pe-confirm-title"
        onClose={() => setConfirm(null)}
        className="admin-dialog admin-dialog--sm"
      >
        <div className="rounded-2xl bg-white p-6 text-[#283455] shadow-2xl">
          <h2 id="pe-confirm-title" className="text-[19px] font-bold">
            {confirm === "leave"
              ? `Rời đi khi còn ${changeCount} thay đổi chưa lưu?`
              : `Hủy ${changeCount} thay đổi chưa lưu?`}
          </h2>
          <p className="mt-2 text-[14px] text-[#5B647A]">
            {confirm === "leave"
              ? "Các thay đổi chưa lưu sẽ bị mất."
              : "Sản phẩm sẽ quay về đúng như đang hiển thị cho khách."}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              autoFocus
              onClick={() => setConfirm(null)}
              className="min-h-[44px] cursor-pointer rounded-xl border border-[#C9CFD9] px-4 text-[14px] font-bold"
            >
              Tiếp tục chỉnh sửa
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm === "leave") {
                  setConfirm(null);
                  onDirtyChange(false);
                  onClose();
                } else {
                  discard();
                }
              }}
              className="min-h-[44px] cursor-pointer rounded-xl bg-[#740103] px-4 text-[14px] font-bold text-white hover:bg-[#5A0102]"
            >
              {confirm === "leave" ? "Rời đi & bỏ thay đổi" : "Hủy thay đổi"}
            </button>
          </div>
        </div>
      </dialog>
    </form>
  );
}
