"use client";

import { useId, useState, type ChangeEvent, type ReactNode } from "react";
import type { CategoryTag } from "@/components/sites/brooklinen/catalog";
import type {
  HomepageSectionKey,
  ProductDetailBlockLayout,
  StoreProduct,
} from "@/lib/store-types";

export type EditorLocale = "vi" | "en";

export type EditorGroupId =
  | "basic"
  | "pricing"
  | "media"
  | "swatches"
  | "description"
  | "story"
  | "visibility";

export interface PanelProps {
  draft: StoreProduct;
  patch: (partial: Partial<StoreProduct>) => void;
  locale: EditorLocale;
  /** Highlight (without scrolling) the matching region in the preview. */
  onRegionFocus: (regionId: string) => void;
}

export const GROUP_META: Record<
  EditorGroupId,
  { label: string; hint: string; region: string; icon: string }
> = {
  basic: {
    label: "Thông tin cơ bản",
    hint: "Tên sản phẩm, đường dẫn, danh mục, bật/tắt bán",
    region: "pd-title",
    icon: "🏷️",
  },
  pricing: {
    label: "Giá & Nhãn khuyến mãi",
    hint: "Giá bán, giá gốc, nhãn góc ảnh, dòng khuyến mãi",
    region: "pd-pricing",
    icon: "💰",
  },
  media: {
    label: "Ảnh sản phẩm",
    hint: "Ảnh chính, ảnh khi rê chuột, thư viện ảnh",
    region: "pd-gallery",
    icon: "🖼️",
  },
  swatches: {
    label: "Màu sắc",
    hint: "Các lựa chọn màu và ảnh theo từng màu",
    region: "pd-swatches",
    icon: "🎨",
  },
  description: {
    label: "Mô tả & Thông số",
    hint: "Mô tả ngắn, bộ sản phẩm gồm, hướng dẫn bảo quản",
    region: "pd-description",
    icon: "📝",
  },
  story: {
    label: "Bài viết chi tiết",
    hint: "Các mục ảnh + nội dung bên dưới trang sản phẩm",
    region: "",
    icon: "📰",
  },
  visibility: {
    label: "Hiển thị & Phân loại",
    hint: "Hiện ở mục nào trên trang chủ, nhóm lọc",
    region: "pd-top",
    icon: "👁️",
  },
};

export const GROUP_ORDER: EditorGroupId[] = [
  "basic",
  "pricing",
  "media",
  "swatches",
  "description",
  "story",
  "visibility",
];

/** Maps a clicked preview region back to the sidebar group that edits it. */
export function regionToGroup(regionId: string): EditorGroupId | null {
  if (regionId.startsWith("story:")) return "story";
  for (const g of GROUP_ORDER) {
    if (GROUP_META[g].region && GROUP_META[g].region === regionId) return g;
  }
  return null;
}

export const BADGE_OPTIONS = [
  { value: "", label: "Không có nhãn" },
  { value: "BEST SELLER", label: "Bán chạy" },
  { value: "NEW", label: "Mới" },
  { value: "SOFTEST", label: "Mềm nhất" },
  { value: "COOLING", label: "Mát lạnh" },
  { value: "LIMITED EDITION", label: "Giới hạn" },
  { value: "BACK IN STOCK", label: "Đã về hàng" },
];

export const EYEBROW_SUGGESTIONS = [
  "BLACK FRIDAY SALE",
  "SELLING FAST!",
  "25% OFF",
  "40% OFF",
  "UP TO 40% OFF",
];

export const TAG_OPTIONS: { tag: CategoryTag; label: string }[] = [
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

export const SECTION_OPTIONS: { key: HomepageSectionKey; label: string }[] = [
  { key: "bestOfSale", label: "Sản Phẩm Sale Nổi Bật" },
  { key: "giftGuide", label: "Gợi Ý Quà Tặng" },
  { key: "collection", label: "Khám Phá Bộ Sưu Tập" },
];

export const LAYOUT_OPTIONS: readonly {
  value: ProductDetailBlockLayout;
  label: string;
  short: string;
}[] = [
  { value: "split-left", label: "Ảnh trái – Chữ phải", short: "Ảnh trái" },
  { value: "split-right", label: "Chữ trái – Ảnh phải", short: "Ảnh phải" },
  { value: "full-banner", label: "Ảnh lớn tràn ngang", short: "Tràn ngang" },
  { value: "two-images", label: "2 ảnh song song", short: "2 ảnh" },
  { value: "text-only", label: "Chỉ bài viết (không ảnh)", short: "Chỉ chữ" },
];

export const inputCls =
  "admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3 text-[14px]";
export const labelCls = "block text-[13px] font-bold text-[#283455]";
export const hintCls = "mt-1 text-[12px] text-[#5B647A]";

export async function uploadMedia(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || "Tải ảnh thất bại.");
  return data.url;
}

/** Grouped card that highlights its preview region whenever any field inside gains focus. */
export function PanelCard({
  title,
  hint,
  region,
  onRegionFocus,
  children,
}: {
  title: string;
  hint?: ReactNode;
  region?: string;
  onRegionFocus?: (id: string) => void;
  children: ReactNode;
}) {
  return (
    <fieldset
      onFocusCapture={region && onRegionFocus ? () => onRegionFocus(region) : undefined}
      onPointerEnter={region && onRegionFocus ? () => onRegionFocus(region) : undefined}
      className="space-y-3 rounded-xl border border-[#E5E0DB] bg-white p-3.5"
    >
      <legend className="px-1 text-[13.5px] font-bold text-[#283455]">{title}</legend>
      {hint && <p className="-mt-1 text-[12px] text-[#5B647A]">{hint}</p>}
      {children}
    </fieldset>
  );
}

/** Tiny "where is this on the page" chip shown next to field labels. */
export function WhereChip({ children }: { children: ReactNode }) {
  return (
    <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2 py-px align-middle text-[10.5px] font-bold text-[#1D4ED8]">
      <span aria-hidden="true">📍</span>
      {children}
    </span>
  );
}

export function LocaleNote({ locale }: { locale: EditorLocale }) {
  return (
    <p className="rounded-lg bg-[#F9F3ED] px-3 py-2 text-[12px] text-[#3D4866]">
      Đang sửa bản{" "}
      <strong>{locale === "vi" ? "Tiếng Việt" : "Tiếng Anh"}</strong>. Bấm{" "}
      <strong>{locale === "vi" ? "EN" : "VI"}</strong> trên thanh công cụ để sửa bản{" "}
      {locale === "vi" ? "Tiếng Anh" : "Tiếng Việt"} (bản xem trước đổi theo).
      {locale === "en" && " Bỏ trống sẽ tự dùng nội dung Tiếng Việt."}
    </p>
  );
}

/** Image slot with thumbnail, upload / change / remove buttons and an advanced URL input. */
export function ImageSlot({
  label,
  value,
  onChange,
  onError,
  aspect = "aspect-[4/3]",
  allowRemove = true,
}: {
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  onError: (msg: string) => void;
  aspect?: string;
  allowRemove?: boolean;
}) {
  const id = useId();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadMedia(file));
    } catch (err) {
      onError(err instanceof Error ? err.message : "Tải ảnh thất bại.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#E5E0DB] bg-[#FDFAF8] p-2.5">
      <p className="text-[12.5px] font-bold text-[#283455]">{label}</p>
      <div
        className={`mt-2 ${aspect} w-full overflow-hidden rounded-lg border border-dashed border-[#C9CFD9] bg-[#F4F4F6]`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[12px] text-[#8E96A8]">
            Chưa có ảnh
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <label className="inline-flex min-h-[36px] cursor-pointer items-center rounded-lg bg-[#283455] px-3 text-[12.5px] font-bold text-white hover:bg-[#1D2742] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#283455]">
          {uploading ? "Đang tải..." : value ? "Đổi ảnh" : "Tải ảnh lên"}
          <input
            type="file"
            accept="image/*"
            className="visually-hidden"
            onChange={(e) => void handleFile(e)}
          />
        </label>
        {value && allowRemove && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="min-h-[36px] cursor-pointer rounded-lg px-2.5 text-[12.5px] font-bold text-[#A50E0E] hover:bg-[#FCE8E6]"
          >
            Xóa ảnh
          </button>
        )}
      </div>
      <details className="mt-1.5">
        <summary className="cursor-pointer text-[11.5px] font-bold text-[#5B647A]">
          Nâng cao: dán đường dẫn ảnh
        </summary>
        <label htmlFor={`${id}-url`} className="visually-hidden">
          Đường dẫn ảnh {label}
        </label>
        <input
          id={`${id}-url`}
          type="text"
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          value={value || ""}
          onChange={(e) => onChange(e.target.value.trim() || undefined)}
          placeholder="https://... hoặc /api/media/..."
          className="mt-1 h-9 w-full rounded-lg border border-[#8E96A8] bg-white px-2.5 font-mono text-[12px]"
        />
      </details>
    </div>
  );
}

export function vndFromUsd(usd: number, rate: number): number {
  return Math.round(usd * rate);
}
