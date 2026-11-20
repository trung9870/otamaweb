"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { LinkPicker } from "./LinkPicker";
import {
  LivePreviewFrame,
  type PreviewDevice,
  type PreviewLocale,
} from "./LivePreviewFrame";
import { SectionEditorPanel } from "./SectionEditorPanel";
import { SortableList } from "./SortableList";
import type {
  HeaderNavConfigItem,
  HomepageSectionConfig,
  StoreCategory,
  StoreProduct,
  StoreSettings,
} from "@/lib/store-types";

interface HomepageBuilderTabProps {
  settings: StoreSettings;
  products: StoreProduct[];
  categories: StoreCategory[];
  onSaveSettingsPatch: (patch: Partial<StoreSettings>, successMsg: string) => Promise<void>;
  onJumpToCategories: () => void;
  onDirtyChange: (dirty: boolean) => void;
}

const HEADER_NAV_ID = "header_nav";

const KIND_BADGE: Record<HomepageSectionConfig["kind"], { label: string; cls: string }> = {
  hero: { label: "Video / Ảnh", cls: "bg-[#283455] text-white" },
  strip: { label: "Dải băng", cls: "bg-[#740103]/12 text-[#740103]" },
  carousel: { label: "Sản phẩm", cls: "bg-[#EAF3E4] text-[#417823]" },
  banner: { label: "Banner", cls: "bg-[#FEF3C7] text-[#92400E]" },
  categories: { label: "Danh mục", cls: "bg-[#DBEAFE] text-[#1E40AF]" },
  static: { label: "Nội dung", cls: "bg-[#EFEAE4] text-[#5B647A]" },
};

function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

function summarize(s: HomepageSectionConfig): string {
  if (s.kind === "hero") {
    const mode = (s.mediaType || "video") === "image" ? "Ảnh tĩnh" : "Video nền";
    const first = (s.titleVi || "").split("\n")[0];
    return first ? `${mode} · ${first}` : mode;
  }
  if (s.kind === "carousel") return `${s.productSlugs?.length || 0} sản phẩm · ${s.titleVi || ""}`;
  if (s.kind === "strip" || s.kind === "banner" || s.kind === "categories") {
    return (s.titleVi || "").replace(/\n/g, " ");
  }
  return "Khối nội dung cố định";
}

export function HomepageBuilderTab({
  settings,
  products,
  categories,
  onSaveSettingsPatch,
  onJumpToCategories,
  onDirtyChange,
}: HomepageBuilderTabProps) {
  const savedSections = useMemo(() => settings.homepageSections || [], [settings.homepageSections]);
  const savedNav = useMemo(() => settings.headerNav || [], [settings.headerNav]);

  const [draftSections, setDraftSections] = useState<HomepageSectionConfig[]>(savedSections);
  const [draftNav, setDraftNav] = useState<HeaderNavConfigItem[]>(savedNav);

  // Reset the draft whenever the saved layout changes (after publish / data reset)
  const savedKey = JSON.stringify([savedSections, savedNav]);
  const [syncedKey, setSyncedKey] = useState(savedKey);
  if (savedKey !== syncedKey) {
    setSyncedKey(savedKey);
    setDraftSections(savedSections);
    setDraftNav(savedNav);
  }

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ id: string; nonce: number } | null>(null);
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [locale, setLocale] = useState<PreviewLocale>("vi");
  const [publishing, setPublishing] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktop, () => true);

  const mobilePreviewRef = useRef<HTMLDialogElement>(null);
  const discardDialogRef = useRef<HTMLDialogElement>(null);

  // ---------------------------------------------------------------- dirty state
  const changeCount = useMemo(() => {
    let n = 0;
    const savedById = new Map(savedSections.map((s) => [s.id, JSON.stringify(s)]));
    for (const s of draftSections) {
      if (savedById.get(s.id) !== JSON.stringify(s)) n++;
    }
    const orderChanged =
      draftSections.map((s) => s.id).join("|") !== savedSections.map((s) => s.id).join("|");
    if (orderChanged) n++;
    if (JSON.stringify(draftNav) !== JSON.stringify(savedNav)) n++;
    return n;
  }, [draftSections, draftNav, savedSections, savedNav]);
  const dirty = changeCount > 0;

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // ------------------------------------------------------------ native dialogs
  useEffect(() => {
    const d = mobilePreviewRef.current;
    if (!d) return;
    if (mobilePreviewOpen && !d.open) d.showModal();
    if (!mobilePreviewOpen && d.open) d.close();
  }, [mobilePreviewOpen]);

  useEffect(() => {
    const d = discardDialogRef.current;
    if (!d) return;
    if (confirmDiscardOpen && !d.open) d.showModal();
    if (!confirmDiscardOpen && d.open) d.close();
  }, [confirmDiscardOpen]);

  // ------------------------------------------------------------------ actions
  const draftPatch = useMemo<Partial<StoreSettings>>(
    () => ({ homepageSections: draftSections, headerNav: draftNav }),
    [draftSections, draftNav]
  );

  const selectFromList = (id: string) => {
    setSelectedId(id);
    setFocusRequest({ id, nonce: Date.now() });
  };

  const patchSection = (id: string, patch: Partial<HomepageSectionConfig>) => {
    setDraftSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const handlePreviewPositionChange = useCallback(
    (id: string, viewport: PreviewDevice, x: number, y: number) => {
      setDraftSections((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const prevLayout = s.style?.layout || {};
          const nextLayout =
            viewport === "desktop"
              ? { ...prevLayout, posDesktop: { x, y } }
              : { ...prevLayout, posMobile: { x, y } };
          return {
            ...s,
            style: {
              ...(s.style || {}),
              layout: nextLayout,
            },
          };
        })
      );
    },
    []
  );

  const patchNav = (id: string, patch: Partial<HeaderNavConfigItem>) => {
    setDraftNav((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };

  const handlePublish = async () => {
    if (!dirty || publishing) return;
    setPublishing(true);
    try {
      await onSaveSettingsPatch(
        { homepageSections: draftSections, headerNav: draftNav },
        `Đã lưu & xuất bản ${changeCount} thay đổi ra trang chủ!`
      );
    } catch {
      // toast already shown by parent
    } finally {
      setPublishing(false);
    }
  };

  const discardChanges = () => {
    setDraftSections(savedSections);
    setDraftNav(savedNav);
    setConfirmDiscardOpen(false);
  };

  const selectedSection =
    selectedId && selectedId !== HEADER_NAV_ID
      ? draftSections.find((s) => s.id === selectedId) || null
      : null;

  // ---------------------------------------------------------------- render
  const segmentBtn = (active: boolean) =>
    `min-h-[38px] cursor-pointer rounded-lg px-3 text-[13px] font-bold transition-colors ${
      active ? "bg-white text-[#283455] shadow-sm" : "text-[#5B647A] hover:text-[#283455]"
    }`;

  const backButton = (
    <button
      type="button"
      onClick={() => setSelectedId(null)}
      className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-xl px-2 text-[13.5px] font-bold text-[#283455] hover:bg-[#F3EDE7]"
    >
      ← Tất cả các khối
    </button>
  );

  return (
    <div className="space-y-3">
      {/* ================= TOOLBAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5E0DB] bg-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="text-[19px] font-bold">Bố cục Trang chủ</h1>
          <p
            role="status"
            className={`rounded-full px-3 py-1 text-[12.5px] font-bold ${
              dirty ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#EAF3E4] text-[#417823]"
            }`}
          >
            {dirty ? `● ${changeCount} thay đổi chưa lưu` : "✓ Đã lưu — đang hiển thị trên web"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isDesktop && (
            <div
              role="group"
              aria-label="Thiết bị xem trước"
              className="flex rounded-xl bg-[#F3EDE7] p-1"
            >
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

          <div role="group" aria-label="Ngôn ngữ xem trước" className="flex rounded-xl bg-[#F3EDE7] p-1">
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

          <button
            type="button"
            disabled={!dirty || publishing}
            onClick={() => setConfirmDiscardOpen(true)}
            className="min-h-[42px] cursor-pointer rounded-xl border border-[#C9CFD9] bg-white px-3.5 text-[13.5px] font-bold text-[#283455] hover:bg-[#F9F3ED] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Hủy thay đổi
          </button>
          <button
            type="button"
            disabled={!dirty || publishing}
            onClick={() => void handlePublish()}
            className="min-h-[42px] cursor-pointer rounded-xl bg-[#283455] px-4 text-[13.5px] font-bold text-white hover:bg-[#1D2742] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {publishing ? "Đang xuất bản..." : "Lưu & Xuất bản"}
          </button>
        </div>
      </div>

      {/* ================= 2-COLUMN EDITOR ================= */}
      <div className="grid grid-cols-1 gap-3 lg:h-[calc(100dvh-235px)] lg:min-h-[620px] lg:grid-cols-[minmax(340px,420px)_1fr]">
        {/* ---------- LEFT: section list / editor ---------- */}
        <aside
          aria-label="Bảng điều khiển bố cục"
          className="min-w-0 rounded-2xl border border-[#E5E0DB] bg-[#FDFAF8] p-3.5 lg:overflow-y-auto"
        >
          {/* LIST VIEW */}
          {selectedId === null && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => selectFromList(HEADER_NAV_ID)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#E5E0DB] bg-white px-3.5 py-3 text-left hover:border-[#283455]"
              >
                <span>
                  <span className="block text-[14px] font-bold">Thanh Menu đầu trang</span>
                  <span className="block text-[12.5px] text-[#5B647A]">
                    {draftNav.filter((n) => n.visible).length} mục đang hiện
                  </span>
                </span>
                <span aria-hidden="true" className="text-[#5B647A]">
                  ›
                </span>
              </button>

              <div>
                <p className="mb-1 text-[12px] font-bold uppercase tracking-wider text-[#5B647A]">
                  Các khối trang chủ (từ trên xuống)
                </p>
                <p className="mb-2.5 text-[12.5px] text-[#5B647A]">
                  Cầm ⋮⋮ kéo lên/xuống để đổi thứ tự. Bấm vào khối (hoặc bấm trực tiếp trên bản xem trước) để chỉnh chữ, màu sắc, font, nút &amp; vị trí.
                </p>

                <SortableList
                  items={draftSections}
                  getKey={(s) => s.id}
                  getLabel={(s) => s.labelVi}
                  onReorder={setDraftSections}
                  ariaLabel="Thứ tự các khối trên trang chủ"
                  className="space-y-1.5"
                  renderItem={(sec, { index, handle, isDragging }) => {
                    const badge = KIND_BADGE[sec.kind];
                    const hasCustomStyle = Boolean(
                      sec.style && Object.keys(sec.style).length > 0
                    );
                    return (
                      <div
                        className={`flex items-center gap-1.5 rounded-xl border bg-white py-1.5 pr-1.5 pl-1 ${
                          isDragging
                            ? "border-[#2563eb] shadow-xl"
                            : "border-[#E5E0DB] hover:border-[#9AA3B5]"
                        } ${sec.visible ? "" : "opacity-60"}`}
                      >
                        {handle}
                        <button
                          type="button"
                          onClick={() => selectFromList(sec.id)}
                          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 py-1 text-left"
                        >
                          <span className="w-5 shrink-0 text-center text-[12px] font-bold text-[#8E96A8]">
                            {index + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-1.5">
                              <span className="truncate text-[13.5px] font-bold text-[#283455]">
                                {sec.labelVi}
                              </span>
                            </span>
                            <span className="mt-0.5 flex items-center gap-1.5">
                              <span
                                className={`shrink-0 rounded-full px-2 py-px text-[10.5px] font-bold ${badge.cls}`}
                              >
                                {badge.label}
                              </span>
                              {hasCustomStyle && (
                                <span className="shrink-0 rounded-full bg-[#EFF6FF] px-1.5 py-px text-[10px] font-bold text-[#1D4ED8]">
                                  Đã tùy biến
                                </span>
                              )}
                              <span className="truncate text-[12px] text-[#5B647A]">
                                {summarize(sec)}
                              </span>
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          aria-pressed={sec.visible}
                          aria-label={`${sec.visible ? "Đang hiện" : "Đang ẩn"}: ${sec.labelVi}`}
                          title={sec.visible ? "Đang hiện — bấm để ẩn" : "Đang ẩn — bấm để hiện"}
                          onClick={() => patchSection(sec.id, { visible: !sec.visible })}
                          className={`inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg ${
                            sec.visible
                              ? "text-[#417823] hover:bg-[#EAF3E4]"
                              : "text-[#8E96A8] hover:bg-[#F3EDE7]"
                          }`}
                        >
                          {sec.visible ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <path d="M3 3l18 18" />
                              <path d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17.4 17.4 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6" />
                            </svg>
                          )}
                        </button>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          )}

          {/* HEADER NAV EDITOR */}
          {selectedId === HEADER_NAV_ID && (
            <div className="space-y-3">
              {backButton}
              <div>
                <h2 className="text-[17px] font-bold">Thanh Menu đầu trang</h2>
                <p className="text-[12.5px] text-[#5B647A]">
                  Kéo ⋮⋮ để đổi thứ tự trái → phải, chọn danh mục/trang cho từng mục menu.
                </p>
              </div>

              <SortableList
                items={draftNav}
                getKey={(n) => n.id}
                getLabel={(n) => n.labelVi}
                onReorder={setDraftNav}
                ariaLabel="Thứ tự các mục trên thanh menu"
                className="space-y-2"
                renderItem={(nav, { index, handle, isDragging }) => (
                  <div
                    className={`rounded-xl border bg-white p-2.5 ${
                      isDragging ? "border-[#2563eb] shadow-xl" : "border-[#E5E0DB]"
                    } ${nav.visible ? "" : "opacity-60"}`}
                  >
                    <div className="flex items-center gap-1.5">
                      {handle}
                      <span className="w-5 text-center text-[12px] font-bold text-[#8E96A8]">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        aria-label={`Tên tiếng Việt mục ${index + 1}`}
                        value={nav.labelVi}
                        onChange={(e) => patchNav(nav.id, { labelVi: e.target.value })}
                        className="h-10 min-w-0 flex-1 rounded-lg border border-[#8E96A8] px-2.5 text-[14px] font-bold"
                      />
                      <button
                        type="button"
                        aria-pressed={nav.visible}
                        onClick={() => patchNav(nav.id, { visible: !nav.visible })}
                        className={`h-10 shrink-0 cursor-pointer rounded-lg px-2.5 text-[12px] font-bold ${
                          nav.visible ? "bg-[#EAF3E4] text-[#417823]" : "bg-[#EFEAE4] text-[#5B647A]"
                        }`}
                      >
                        {nav.visible ? "Hiện" : "Ẩn"}
                      </button>
                    </div>
                    <div className="mt-2 space-y-2 pl-[52px]">
                      <input
                        type="text"
                        aria-label={`Tên tiếng Anh mục ${index + 1}`}
                        value={nav.labelEn}
                        onChange={(e) => patchNav(nav.id, { labelEn: e.target.value })}
                        placeholder="Tên tiếng Anh (English label)"
                        className="h-9 w-full rounded-lg border border-[#C9CFD9] px-2.5 text-[13px]"
                      />
                      <LinkPicker
                        id={`nav-href-${nav.id}`}
                        label={`Đường dẫn mục ${index + 1}`}
                        value={nav.href}
                        onChange={(href) => patchNav(nav.id, { href })}
                        categories={categories}
                        products={products}
                        compact
                      />
                    </div>
                    {nav.sourceIndex === null && (
                      <div className="mt-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => setDraftNav((prev) => prev.filter((n) => n.id !== nav.id))}
                          className="cursor-pointer rounded-md px-2 py-1 text-[12px] font-bold text-[#A50E0E] hover:bg-[#FCE8E6]"
                        >
                          Xóa mục này
                        </button>
                      </div>
                    )}
                  </div>
                )}
              />

              <button
                type="button"
                onClick={() =>
                  setDraftNav((prev) => [
                    ...prev,
                    {
                      id: `nav-${Date.now()}`,
                      sourceIndex: null,
                      labelVi: "Mục mới",
                      labelEn: "New Link",
                      href: "/collections/best-sellers",
                      visible: true,
                    },
                  ])
                }
                className="min-h-[42px] w-full cursor-pointer rounded-xl border border-dashed border-[#283455] text-[13.5px] font-bold text-[#283455] hover:bg-[#F9F3ED]"
              >
                + Thêm mục menu
              </button>
            </div>
          )}

          {/* SECTION EDITOR */}
          {selectedSection && (
            <div className="space-y-3">
              {backButton}
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[17px] font-bold">{selectedSection.labelVi}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${KIND_BADGE[selectedSection.kind].cls}`}
                >
                  {KIND_BADGE[selectedSection.kind].label}
                </span>
              </div>
              <SectionEditorPanel
                key={selectedSection.id}
                section={selectedSection}
                allProducts={products}
                allCategories={categories}
                vndRate={settings.vndRate}
                device={device}
                onDeviceSwitch={setDevice}
                onPatch={(patch) => patchSection(selectedSection.id, patch)}
                onJumpToCategories={onJumpToCategories}
              />
            </div>
          )}
        </aside>

        {/* ---------- RIGHT: live preview (desktop) ---------- */}
        {isDesktop && (
          <section
            aria-label="Xem trước trực tiếp bản nháp"
            className="flex min-h-0 min-w-0 flex-col rounded-2xl border border-[#E5E0DB] bg-[#EFEAE4] p-3"
          >
            <p className="mb-2 text-center text-[12px] font-bold text-[#5B647A]">
              BẢN XEM TRƯỚC — bấm vào khối để chỉnh hoặc kéo &ldquo;✥ Kéo đổi vị trí chữ&rdquo;. Khách chỉ thấy sau khi bấm &ldquo;Lưu &amp; Xuất bản&rdquo;.
            </p>
            <div className="min-h-0 flex-1">
              <LivePreviewFrame
                locale={locale}
                device={device}
                draftPatch={draftPatch}
                selectedId={selectedId}
                focusRequest={focusRequest}
                onSelect={setSelectedId}
                onPositionChange={handlePreviewPositionChange}
              />
            </div>
          </section>
        )}
      </div>

      {/* ================= MOBILE FULL-SCREEN PREVIEW ================= */}
      <dialog
        ref={mobilePreviewRef}
        aria-label="Xem trước trang chủ"
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
            <div className="min-h-0 flex-1 p-2">
              <LivePreviewFrame
                locale={locale}
                device="mobile"
                draftPatch={draftPatch}
                selectedId={selectedId}
                focusRequest={focusRequest}
                onSelect={(id) => {
                  setSelectedId(id);
                  setMobilePreviewOpen(false);
                }}
                onPositionChange={handlePreviewPositionChange}
              />
            </div>
          </div>
        )}
      </dialog>

      {/* ================= DISCARD CONFIRMATION ================= */}
      <dialog
        ref={discardDialogRef}
        aria-labelledby="discard-title"
        onClose={() => setConfirmDiscardOpen(false)}
        className="admin-dialog admin-dialog--sm"
      >
        <div className="rounded-2xl bg-white p-6 text-[#283455] shadow-2xl">
          <h2 id="discard-title" className="text-[19px] font-bold">
            Hủy {changeCount} thay đổi chưa lưu?
          </h2>
          <p className="mt-2 text-[14px] text-[#5B647A]">
            Bố cục sẽ quay về đúng như trang chủ đang hiển thị cho khách.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              autoFocus
              onClick={() => setConfirmDiscardOpen(false)}
              className="min-h-[44px] cursor-pointer rounded-xl border border-[#C9CFD9] px-4 text-[14px] font-bold"
            >
              Tiếp tục chỉnh sửa
            </button>
            <button
              type="button"
              onClick={discardChanges}
              className="min-h-[44px] cursor-pointer rounded-xl bg-[#740103] px-4 text-[14px] font-bold text-white hover:bg-[#5A0102]"
            >
              Hủy thay đổi
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
