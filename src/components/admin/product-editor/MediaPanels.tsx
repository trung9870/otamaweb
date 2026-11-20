"use client";

import { useId, useState, type ChangeEvent } from "react";
import { SortableList } from "../SortableList";
import { PanelCard, uploadMedia, type PanelProps } from "./shared";
import type { SwatchItem } from "@/components/sites/brooklinen/data";

/* ========================================================================== */
/* 3. ẢNH SẢN PHẨM                                                             */
/* ========================================================================== */
function buildImageList(main: string, hover: string, gallery: string[] | undefined): string[] {
  return Array.from(
    new Set([main, hover, ...(gallery || [])].map((u) => (u || "").trim()).filter(Boolean))
  );
}

export function MediaPanel({
  draft,
  patch,
  onRegionFocus,
  onError,
}: PanelProps & { onError: (msg: string) => void }) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const images = buildImageList(draft.mainImage, draft.hoverImage, draft.galleryImages);

  const setImages = (list: string[]) => {
    const clean = Array.from(new Set(list.filter(Boolean)));
    patch({
      mainImage: clean[0] || "",
      hoverImage: clean[1] || clean[0] || "",
      galleryImages: clean.slice(2),
    });
  };

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of files) urls.push(await uploadMedia(f));
      setImages([...images, ...urls]);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Tải ảnh thất bại.");
    } finally {
      setUploading(false);
    }
  };

  const roleLabel = (idx: number) =>
    idx === 0 ? "Ảnh chính" : idx === 1 ? "Ảnh khi rê chuột" : `Ảnh phụ ${idx - 1}`;

  return (
    <div className="space-y-4">
      <PanelCard
        title={`Thư viện ảnh (${images.length})`}
        region="pd-gallery"
        onRegionFocus={onRegionFocus}
        hint={
          <>
            Cầm <strong>⋮⋮</strong> kéo để đổi thứ tự. <strong>Ảnh số 1</strong> là ảnh chính,{" "}
            <strong>ảnh số 2</strong> hiện khi khách rê chuột vào sản phẩm ở các danh sách.
          </>
        }
      >
        <SortableList
          items={images}
          getKey={(u) => u}
          getLabel={(u) => roleLabel(images.indexOf(u))}
          onReorder={setImages}
          ariaLabel="Thứ tự ảnh sản phẩm"
          className="space-y-1.5"
          renderItem={(url, { index, handle, isDragging }) => (
            <div
              className={`flex items-center gap-2 rounded-xl border bg-[#FDFAF8] p-1.5 pr-2 ${
                isDragging ? "border-[#2563eb] shadow-lg" : "border-[#ECE7E2]"
              }`}
            >
              {handle}
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F4F4F6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-[#283455]">
                  {index + 1}. {roleLabel(index)}
                </p>
                {index === 0 ? (
                  <span className="mt-0.5 inline-block rounded-full bg-[#EAF3E4] px-2 text-[10.5px] font-bold text-[#417823]">
                    ★ Hiện đầu tiên
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setImages([url, ...images.filter((u) => u !== url)])}
                    className="mt-0.5 cursor-pointer text-[11.5px] font-bold text-[#2563EB] hover:underline"
                  >
                    Đặt làm ảnh chính
                  </button>
                )}
              </div>
              <button
                type="button"
                disabled={images.length <= 1}
                aria-label={`Xóa ${roleLabel(index)}`}
                title={images.length <= 1 ? "Sản phẩm cần ít nhất 1 ảnh" : "Xóa ảnh"}
                onClick={() => setImages(images.filter((u) => u !== url))}
                className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[18px] text-[#A50E0E] hover:bg-[#FCE8E6] disabled:cursor-not-allowed disabled:opacity-30"
              >
                &times;
              </button>
            </div>
          )}
        />

        <label className="flex min-h-[46px] w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-[#283455]/40 bg-[#FDFAF8] text-[13px] font-bold text-[#283455] hover:bg-[#F3EDE7] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#283455]">
          {uploading ? "Đang tải ảnh lên..." : "+ Tải thêm ảnh từ máy (chọn được nhiều ảnh)"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="visually-hidden"
            onChange={(e) => void handleFiles(e)}
          />
        </label>

        <details>
          <summary className="cursor-pointer text-[12px] font-bold text-[#5B647A]">
            Nâng cao: thêm ảnh bằng đường dẫn
          </summary>
          <div className="mt-2 flex gap-2">
            <label htmlFor={`${id}-url`} className="visually-hidden">
              Đường dẫn ảnh
            </label>
            <input
              id={`${id}-url`}
              type="text"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://... hoặc /api/media/..."
              className="h-10 min-w-0 flex-1 rounded-lg border border-[#8E96A8] bg-white px-2.5 font-mono text-[12px]"
            />
            <button
              type="button"
              disabled={!urlInput.trim()}
              onClick={() => {
                setImages([...images, urlInput.trim()]);
                setUrlInput("");
              }}
              className="h-10 shrink-0 cursor-pointer rounded-lg bg-[#283455] px-3 text-[12.5px] font-bold text-white disabled:opacity-40"
            >
              Thêm
            </button>
          </div>
        </details>
      </PanelCard>
    </div>
  );
}

/* ========================================================================== */
/* 4. MÀU SẮC                                                                  */
/* ========================================================================== */
let swatchKeySeq = 0;
const nextSwatchKey = () => `sw-${++swatchKeySeq}`;

export function SwatchesPanel({
  draft,
  patch,
  onRegionFocus,
  onError,
}: PanelProps & { onError: (msg: string) => void }) {
  const id = useId();
  const [keys, setKeys] = useState<string[]>(() => draft.swatches.map(() => nextSwatchKey()));
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  // Keep keys aligned if the list length changes from outside (defensive)
  const safeKeys =
    keys.length === draft.swatches.length
      ? keys
      : draft.swatches.map((_, i) => keys[i] || `sw-fallback-${i}`);

  const items = draft.swatches.map((sw, i) => ({ key: safeKeys[i], sw }));

  const commit = (next: { key: string; sw: SwatchItem }[], defaultIdx?: number) => {
    setKeys(next.map((n) => n.key));
    const p: Parameters<typeof patch>[0] = { swatches: next.map((n) => n.sw) };
    if (defaultIdx !== undefined) p.defaultSwatchIndex = defaultIdx;
    patch(p);
  };

  const defaultKey = items[draft.defaultSwatchIndex]?.key ?? items[0]?.key;

  const reorder = (next: { key: string; sw: SwatchItem }[]) => {
    const newDefault = Math.max(0, next.findIndex((n) => n.key === defaultKey));
    commit(next, newDefault);
  };

  const patchSwatch = (key: string, partial: Partial<SwatchItem>) => {
    commit(items.map((it) => (it.key === key ? { ...it, sw: { ...it.sw, ...partial } } : it)));
  };

  const removeSwatch = (key: string) => {
    const next = items.filter((it) => it.key !== key);
    const newDefault = Math.max(0, next.findIndex((n) => n.key === defaultKey));
    commit(next, newDefault);
  };

  const addSwatch = () => {
    commit([
      ...items,
      {
        key: nextSwatchKey(),
        sw: {
          label: "Màu mới",
          color: "#D9D4CE",
          mainImage: draft.mainImage || "",
          hoverImage: draft.hoverImage || draft.mainImage || "",
        },
      },
    ]);
  };

  const uploadFor = async (
    e: ChangeEvent<HTMLInputElement>,
    key: string,
    field: "mainImage" | "swatchImage"
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingKey(`${key}-${field}`);
    try {
      const url = await uploadMedia(file);
      patchSwatch(key, field === "mainImage" ? { mainImage: url, hoverImage: url } : { swatchImage: url });
    } catch (err) {
      onError(err instanceof Error ? err.message : "Tải ảnh thất bại.");
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <div className="space-y-4">
      <PanelCard
        title={`Các lựa chọn màu (${items.length})`}
        region="pd-swatches"
        onRegionFocus={onRegionFocus}
        hint={
          <>
            Kéo <strong>⋮⋮</strong> để đổi thứ tự ô màu. Mỗi màu có thể có ảnh sản phẩm riêng: khách bấm
            màu nào, ảnh lớn đổi theo màu đó (thử bấm ô màu trên bản xem trước).
          </>
        }
      >
        {items.length === 0 && (
          <p className="rounded-lg bg-[#F9F3ED] px-3 py-3 text-center text-[12.5px] text-[#5B647A]">
            Sản phẩm chưa có lựa chọn màu, khu vực chọn màu sẽ được ẩn.
          </p>
        )}

        <SortableList
          items={items}
          getKey={(it) => it.key}
          getLabel={(it) => it.sw.label}
          onReorder={reorder}
          ariaLabel="Thứ tự các màu"
          className="space-y-2"
          renderItem={(it, { index, handle, isDragging }) => {
            const isDefault = it.key === defaultKey;
            return (
              <div
                className={`rounded-xl border bg-[#FDFAF8] p-2 ${
                  isDragging ? "border-[#2563eb] shadow-lg" : "border-[#ECE7E2]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {handle}
                  <label
                    className="otama-color-swatch relative inline-flex h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-[#8E96A8]"
                    style={{ backgroundColor: it.sw.color || "#D9D4CE" }}
                    title="Đổi mã màu"
                  >
                    {it.sw.swatchImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.sw.swatchImage} alt="" className="h-full w-full object-cover" />
                    )}
                    <span className="visually-hidden">Mã màu {it.sw.label}</span>
                    <input
                      type="color"
                      value={it.sw.color || "#D9D4CE"}
                      onChange={(e) => patchSwatch(it.key, { color: e.target.value })}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </label>
                  <label htmlFor={`${id}-name-${it.key}`} className="visually-hidden">
                    Tên màu số {index + 1}
                  </label>
                  <input
                    id={`${id}-name-${it.key}`}
                    type="text"
                    value={it.sw.label}
                    onChange={(e) => patchSwatch(it.key, { label: e.target.value })}
                    className="h-9 min-w-0 flex-1 rounded-lg border border-[#8E96A8] bg-white px-2.5 text-[13.5px] font-bold"
                  />
                  <button
                    type="button"
                    aria-label={`Xóa màu ${it.sw.label}`}
                    onClick={() => removeSwatch(it.key)}
                    className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[18px] text-[#A50E0E] hover:bg-[#FCE8E6]"
                  >
                    &times;
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 pl-10">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[#F4F4F6]">
                    {it.sw.mainImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.sw.mainImage} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <label className="inline-flex min-h-[32px] cursor-pointer items-center rounded-lg border border-[#283455] bg-white px-2.5 text-[11.5px] font-bold text-[#283455] hover:bg-[#F9F3ED] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#283455]">
                    {uploadingKey === `${it.key}-mainImage` ? "Đang tải..." : "Ảnh sản phẩm màu này"}
                    <input
                      type="file"
                      accept="image/*"
                      className="visually-hidden"
                      onChange={(e) => void uploadFor(e, it.key, "mainImage")}
                    />
                  </label>
                  <label className="inline-flex min-h-[32px] cursor-pointer items-center rounded-lg border border-[#C9CFD9] bg-white px-2.5 text-[11.5px] font-bold text-[#5B647A] hover:bg-[#F9F3ED] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#283455]">
                    {uploadingKey === `${it.key}-swatchImage` ? "Đang tải..." : "Ảnh họa tiết ô màu"}
                    <input
                      type="file"
                      accept="image/*"
                      className="visually-hidden"
                      onChange={(e) => void uploadFor(e, it.key, "swatchImage")}
                    />
                  </label>
                  <label className="ml-auto inline-flex min-h-[32px] cursor-pointer items-center gap-1.5 text-[11.5px] font-bold text-[#283455]">
                    <input
                      type="radio"
                      name={`${id}-default`}
                      checked={isDefault}
                      onChange={() => patch({ defaultSwatchIndex: index })}
                      className="h-4 w-4"
                    />
                    Màu mặc định
                  </label>
                </div>
              </div>
            );
          }}
        />

        <button
          type="button"
          onClick={addSwatch}
          className="min-h-[42px] w-full cursor-pointer rounded-xl border border-dashed border-[#283455] text-[13px] font-bold text-[#283455] hover:bg-[#F9F3ED]"
        >
          + Thêm màu mới
        </button>
      </PanelCard>
    </div>
  );
}
