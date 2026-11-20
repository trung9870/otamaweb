"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { HomepageSectionModal } from "./HomepageSectionModal";
import type {
  HeaderNavConfigItem,
  HomepageSectionConfig,
  StoreProduct,
  StoreSettings,
} from "@/lib/store-types";

interface HomepageBuilderTabProps {
  settings: StoreSettings;
  products: StoreProduct[];
  onSaveSettingsPatch: (
    patch: Partial<StoreSettings>,
    successMsg: string
  ) => Promise<void>;
  onJumpToCategories: () => void;
}

const KIND_BADGE: Record<
  HomepageSectionConfig["kind"],
  { label: string; cls: string }
> = {
  hero: { label: "Hero Video / Ảnh", cls: "bg-[#283455] text-white" },
  strip: { label: "Dải băng", cls: "bg-[#740103]/15 text-[#740103]" },
  carousel: { label: "Sản phẩm", cls: "bg-[#EAF3E4] text-[#417823]" },
  banner: { label: "Banner ảnh", cls: "bg-[#FEF3C7] text-[#92400E]" },
  categories: { label: "Danh mục", cls: "bg-[#DBEAFE] text-[#1E40AF]" },
  static: { label: "Khối nội dung", cls: "bg-[#EFEAE4] text-[#5B647A]" },
};

function runTransition(update: () => void) {
  if (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    typeof document.startViewTransition === "function"
  ) {
    document.startViewTransition(() => {
      flushSync(update);
    });
  } else {
    update();
  }
}

export function HomepageBuilderTab({
  settings,
  products,
  onSaveSettingsPatch,
  onJumpToCategories,
}: HomepageBuilderTabProps) {
  const [sections, setSections] = useState<HomepageSectionConfig[]>(
    settings.homepageSections || []
  );
  const [headerNav, setHeaderNav] = useState<HeaderNavConfigItem[]>(
    settings.headerNav || []
  );
  const [editingSection, setEditingSection] =
    useState<HomepageSectionConfig | null>(null);
  const [savingNav, setSavingNav] = useState(false);
  const [reorderStatus, setReorderStatus] = useState("");

  // Keep local state aligned if parent settings refresh (e.g., after reset)
  const [syncedKey, setSyncedKey] = useState(
    JSON.stringify([settings.homepageSections, settings.headerNav])
  );
  const nextKey = JSON.stringify([settings.homepageSections, settings.headerNav]);
  if (nextKey !== syncedKey) {
    setSyncedKey(nextKey);
    setSections(settings.homepageSections || []);
    setHeaderNav(settings.headerNav || []);
  }

  const moveSection = async (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const next = [...sections];
    const [moved] = next.splice(idx, 1);
    next.splice(targetIdx, 0, moved);

    runTransition(() => {
      setSections(next);
    });
    setReorderStatus(
      `Đã chuyển khối "${moved.labelVi}" tới vị trí số ${targetIdx + 1} trên ${next.length}.`
    );

    await onSaveSettingsPatch(
      { homepageSections: next },
      `Đã đổi vị trí khối "${moved.labelVi}" tới #${targetIdx + 1}.`
    );
  };

  const toggleSectionVisible = async (id: HomepageSectionConfig["id"]) => {
    const next = sections.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    const changed = next.find((s) => s.id === id);
    setSections(next);
    await onSaveSettingsPatch(
      { homepageSections: next },
      changed?.visible
        ? `Đã bật hiển thị khối "${changed.labelVi}".`
        : `Đã tạm ẩn khối "${changed?.labelVi}".`
    );
  };

  const handleSaveSingleSection = async (updated: HomepageSectionConfig) => {
    const next = sections.map((s) => (s.id === updated.id ? updated : s));
    setSections(next);
    await onSaveSettingsPatch(
      { homepageSections: next },
      `Đã lưu thay đổi cho khối "${updated.labelVi}".`
    );
  };

  // Header Menu helpers
  const moveNavItem = (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= headerNav.length) return;
    const next = [...headerNav];
    const [moved] = next.splice(idx, 1);
    next.splice(targetIdx, 0, moved);
    runTransition(() => {
      setHeaderNav(next);
    });
    setReorderStatus(
      `Đã chuyển mục menu "${moved.labelVi}" sang vị trí số ${targetIdx + 1}.`
    );
  };

  const updateNavField = <K extends keyof HeaderNavConfigItem>(
    idx: number,
    key: K,
    value: HeaderNavConfigItem[K]
  ) => {
    setHeaderNav((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    );
  };

  const addNavItem = () => {
    setHeaderNav((prev) => [
      ...prev,
      {
        id: `nav-${Date.now()}`,
        sourceIndex: null,
        labelVi: "Mục mới",
        labelEn: "New Link",
        href: "/collections/best-sellers",
        visible: true,
      },
    ]);
  };

  const removeNavItem = (id: string) => {
    setHeaderNav((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveNav = async () => {
    setSavingNav(true);
    try {
      await onSaveSettingsPatch(
        { headerNav },
        "Đã lưu cấu hình Thanh Menu đầu trang!"
      );
    } finally {
      setSavingNav(false);
    }
  };

  const summarizeSection = (s: HomepageSectionConfig): string => {
    if (s.kind === "hero") {
      const mode = (s.mediaType || "video") === "image" ? "Ảnh tĩnh" : "Video nền";
      const firstLine = (s.titleVi || "").split("\n")[0] || "";
      return `${mode}${firstLine ? ` · "${firstLine}"` : ""}`;
    }
    if (s.kind === "carousel") {
      const count = s.productSlugs?.length || 0;
      return `${count} sản phẩm đã chọn · Tiêu đề: "${s.titleVi || ""}"`;
    }
    if (s.kind === "strip" || s.kind === "banner") {
      return (s.titleVi || "").replace(/\n/g, " ");
    }
    if (s.kind === "categories") {
      return `Tiêu đề: "${s.titleVi || "Mua Sắm Theo Danh Mục"}"`;
    }
    return "Có thể bật/tắt hoặc đổi vị trí lên xuống";
  };

  return (
    <div className="space-y-8">
      <p role="status" className="visually-hidden">
        {reorderStatus}
      </p>

      {/* ================================================================ */}
      {/* PART 1: HOMEPAGE SECTIONS (ORDER + VISIBILITY + MEDIA/PRODUCTS)  */}
      {/* ================================================================ */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold">Bố cục Trang chủ</h1>
            <p className="text-[14px] text-[#5B647A]">
              Đổi video/ảnh Hero chính, chọn thứ tự sản phẩm trong từng mục, bật/tắt hoặc bấm <strong>↑ / ↓</strong> để sắp xếp thứ tự các khối từ trên xuống dưới.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const hero = sections.find((s) => s.id === "hero_primary");
              if (hero) setEditingSection(hero);
            }}
            className="min-h-[46px] cursor-pointer rounded-xl bg-[#283455] px-5 text-[14px] font-bold text-white hover:bg-[#1D2742]"
          >
            Thay Video / Ảnh Hero chính
          </button>
        </div>

        <ol className="space-y-2.5">
          {sections.map((sec, idx) => {
            const badge = KIND_BADGE[sec.kind];
            return (
              <li
                key={sec.id}
                className={`admin-sortable-item flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 transition-colors ${
                  sec.visible
                    ? "border-[#E5E0DB] bg-white"
                    : "border-dashed border-[#D4D8E0] bg-[#F7F4F0] opacity-75"
                }`}
              >
                <div className="flex min-w-[240px] flex-1 items-center gap-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F9F3ED] text-[13px] font-bold text-[#283455]">
                    {idx + 1}
                  </span>

                  {/* Mini thumbnail preview for hero/banner */}
                  {sec.desktopMedia && (sec.kind === "hero" || sec.kind === "banner") && (
                    <div className="hidden h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-[#E5E0DB] bg-[#262321] sm:block">
                      {sec.kind === "hero" && (sec.mediaType || "video") === "video" ? (
                        sec.desktopPoster ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={sec.desktopPoster}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-white">
                            VIDEO
                          </div>
                        )
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sec.desktopMedia}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[15px] font-bold text-[#283455]">
                        {sec.labelVi}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[13px] text-[#5B647A]">
                      {summarizeSection(sec)}
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    aria-label={`Đưa khối ${sec.labelVi} lên trên`}
                    onClick={() => void moveSection(idx, -1)}
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#C9CFD9] bg-white text-[15px] font-bold text-[#283455] hover:bg-[#F9F3ED] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    aria-label={`Đưa khối ${sec.labelVi} xuống dưới`}
                    onClick={() => void moveSection(idx, 1)}
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#C9CFD9] bg-white text-[15px] font-bold text-[#283455] hover:bg-[#F9F3ED] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    aria-pressed={sec.visible}
                    onClick={() => void toggleSectionVisible(sec.id)}
                    className={`min-h-[40px] cursor-pointer rounded-xl px-3.5 text-[13px] font-bold ${
                      sec.visible
                        ? "bg-[#EAF3E4] text-[#417823]"
                        : "bg-[#EFEAE4] text-[#5B647A]"
                    }`}
                  >
                    {sec.visible ? "Đang hiện" : "Đang ẩn"}
                  </button>

                  {sec.kind !== "static" && (
                    <button
                      type="button"
                      onClick={() => setEditingSection(sec)}
                      className="min-h-[40px] cursor-pointer rounded-xl border border-[#283455] bg-white px-4 text-[13px] font-bold text-[#283455] hover:bg-[#283455] hover:text-white"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ================================================================ */}
      {/* PART 2: HEADER TOP NAVIGATION MENU                               */}
      {/* ================================================================ */}
      <section className="rounded-2xl border border-[#E5E0DB] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-bold text-[#283455]">
              Thanh Menu đầu trang (Header)
            </h2>
            <p className="text-[13.5px] text-[#5B647A]">
              Đổi tên, đổi thứ tự trái → phải, ẩn/hiện hoặc thêm mục mới lên thanh menu chính.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={addNavItem}
              className="min-h-[44px] cursor-pointer rounded-xl border border-[#283455] px-4 text-[13.5px] font-bold text-[#283455] hover:bg-[#F9F3ED]"
            >
              + Thêm mục menu
            </button>
            <button
              type="button"
              disabled={savingNav}
              onClick={() => void handleSaveNav()}
              className="min-h-[44px] cursor-pointer rounded-xl bg-[#283455] px-5 text-[13.5px] font-bold text-white hover:bg-[#1D2742] disabled:opacity-60"
            >
              {savingNav ? "Đang lưu..." : "Lưu thanh Menu"}
            </button>
          </div>
        </div>

        <ol className="mt-5 space-y-2.5">
          {headerNav.map((nav, idx) => (
            <li
              key={nav.id}
              className="admin-sortable-item grid grid-cols-1 items-center gap-2.5 rounded-xl border border-[#ECE7E2] bg-[#FDFAF8] p-3 lg:grid-cols-[auto_1fr_1fr_1.2fr_auto]"
            >
              <div className="flex items-center gap-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#283455] text-[12px] font-bold text-white">
                  {idx + 1}
                </span>
                <button
                  type="button"
                  disabled={idx === 0}
                  aria-label={`Đưa mục ${nav.labelVi} sang trái`}
                  onClick={() => moveNavItem(idx, -1)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#C9CFD9] bg-white text-[14px] font-bold disabled:opacity-35"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={idx === headerNav.length - 1}
                  aria-label={`Đưa mục ${nav.labelVi} sang phải`}
                  onClick={() => moveNavItem(idx, 1)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#C9CFD9] bg-white text-[14px] font-bold disabled:opacity-35"
                >
                  ↓
                </button>
              </div>

              <input
                type="text"
                aria-label={`Tên tiếng Việt mục ${idx + 1}`}
                value={nav.labelVi}
                onChange={(e) => updateNavField(idx, "labelVi", e.target.value)}
                placeholder="Tên Tiếng Việt"
                className="h-11 rounded-xl border border-[#8E96A8] bg-white px-3 text-[14px] font-bold"
              />

              <input
                type="text"
                aria-label={`Tên tiếng Anh mục ${idx + 1}`}
                value={nav.labelEn}
                onChange={(e) => updateNavField(idx, "labelEn", e.target.value)}
                placeholder="English Label"
                className="h-11 rounded-xl border border-[#8E96A8] bg-white px-3 text-[14px]"
              />

              <input
                type="text"
                aria-label={`Đường dẫn mục ${idx + 1}`}
                spellCheck={false}
                value={nav.href}
                onChange={(e) => updateNavField(idx, "href", e.target.value)}
                placeholder="/collections/..."
                className="h-11 rounded-xl border border-[#8E96A8] bg-white px-3 font-mono text-[13px]"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  aria-pressed={nav.visible}
                  onClick={() => updateNavField(idx, "visible", !nav.visible)}
                  className={`min-h-[38px] cursor-pointer rounded-lg px-3 text-[12.5px] font-bold ${
                    nav.visible
                      ? "bg-[#EAF3E4] text-[#417823]"
                      : "bg-[#EFEAE4] text-[#5B647A]"
                  }`}
                >
                  {nav.visible ? "Hiện" : "Ẩn"}
                </button>
                {nav.sourceIndex === null && (
                  <button
                    type="button"
                    onClick={() => removeNavItem(nav.id)}
                    className="min-h-[38px] cursor-pointer rounded-lg px-2.5 text-[12.5px] font-bold text-[#A50E0E] hover:bg-[#FCE8E6]"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <HomepageSectionModal
        section={editingSection}
        allProducts={products}
        vndRate={settings.vndRate}
        onClose={() => setEditingSection(null)}
        onSave={handleSaveSingleSection}
        onJumpToCategories={onJumpToCategories}
      />
    </div>
  );
}
