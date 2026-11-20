"use client";

import { useId, useState } from "react";
import { SortableList } from "../SortableList";
import {
  ImageSlot,
  LAYOUT_OPTIONS,
  LocaleNote,
  PanelCard,
  hintCls,
  inputCls,
  labelCls,
  type PanelProps,
} from "./shared";
import type { ProductDetailBlock, ProductDetailBlockLayout } from "@/lib/store-types";

/** Mini wireframe illustrating each story-block layout. */
function LayoutDiagram({ layout }: { layout: ProductDetailBlockLayout }) {
  const img = "rounded-[3px] bg-[#9AA3B5]";
  const line = "h-[3px] rounded-full bg-[#C9CFD9]";
  const text = (
    <div className="flex flex-1 flex-col justify-center gap-[3px]">
      <div className="h-[4px] w-3/4 rounded-full bg-[#283455]" />
      <div className={`${line} w-full`} />
      <div className={`${line} w-5/6`} />
    </div>
  );
  return (
    <div aria-hidden="true" className="flex h-[38px] w-full gap-1.5 p-1">
      {layout === "split-left" && (
        <>
          <div className={`${img} w-1/2`} />
          {text}
        </>
      )}
      {layout === "split-right" && (
        <>
          {text}
          <div className={`${img} w-1/2`} />
        </>
      )}
      {layout === "full-banner" && (
        <div className="flex w-full flex-col gap-[3px]">
          <div className={`${img} flex-1`} />
          <div className={`${line} mx-auto w-1/2`} />
        </div>
      )}
      {layout === "two-images" && (
        <>
          <div className={`${img} flex-1`} />
          <div className={`${img} flex-1`} />
        </>
      )}
      {layout === "text-only" && (
        <div className="flex w-full flex-col justify-center gap-[3px] rounded-[3px] bg-[#F3EDE7] px-2">
          <div className="h-[4px] w-1/2 rounded-full bg-[#283455]" />
          <div className={`${line} w-full`} />
          <div className={`${line} w-4/5`} />
        </div>
      )}
    </div>
  );
}

/** Visual radio group of the 5 layouts (2–5 exclusive options → visible radios). */
function LayoutPicker({
  name,
  value,
  onChange,
  legend,
}: {
  name: string;
  value?: ProductDetailBlockLayout;
  onChange: (v: ProductDetailBlockLayout) => void;
  legend: string;
}) {
  return (
    <fieldset>
      <legend className={labelCls}>{legend}</legend>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5 sm:grid-cols-5">
        {LAYOUT_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-[#E5E0DB] bg-white p-1.5 text-center text-[11px] font-bold text-[#3D4866] hover:border-[#9AA3B5] has-[:checked]:border-[#283455] has-[:checked]:bg-[#F9F3ED] has-[:checked]:text-[#283455] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#283455]"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="visually-hidden"
            />
            <LayoutDiagram layout={opt.value} />
            <span className="leading-tight">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function newBlock(layout: ProductDetailBlockLayout, fallbackImage: string): ProductDetailBlock {
  return {
    id: `blk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    layout,
    eyebrowVi: layout === "text-only" ? "THÔNG TIN THÊM" : "ĐIỂM NỔI BẬT",
    headingVi: layout === "full-banner" ? "Hình ảnh thực tế sản phẩm" : "Tiêu đề mục mới",
    bodyVi:
      layout === "two-images"
        ? ""
        : "Nhập nội dung chi tiết. Gõ dấu - ở đầu dòng để tạo gạch đầu dòng.",
    image: layout === "text-only" ? undefined : fallbackImage || undefined,
    secondaryImage: layout === "two-images" ? fallbackImage || undefined : undefined,
  };
}

interface StoryBlocksPanelProps extends PanelProps {
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onError: (msg: string) => void;
}

export function StoryBlocksPanel({
  draft,
  patch,
  locale,
  selectedBlockId,
  onSelectBlock,
  onError,
}: StoryBlocksPanelProps) {
  const id = useId();
  const [addOpen, setAddOpen] = useState(false);
  const [addLayout, setAddLayout] = useState<ProductDetailBlockLayout>("split-left");

  const blocks = draft.detailBlocks || [];
  const isVi = locale === "vi";
  const selected = blocks.find((b) => b.id === selectedBlockId) || null;
  const selectedIdx = selected ? blocks.indexOf(selected) : -1;

  const setBlocks = (next: ProductDetailBlock[]) => patch({ detailBlocks: next });
  const patchBlock = (blockId: string, partial: Partial<ProductDetailBlock>) =>
    setBlocks(blocks.map((b) => (b.id === blockId ? { ...b, ...partial } : b)));

  const textOf = (b: ProductDetailBlock, field: "eyebrow" | "heading" | "body" | "caption") => {
    const vi = b[`${field}Vi` as const];
    const en = b[`${field}En` as const];
    return isVi ? vi || "" : en || "";
  };
  const setText = (
    blockId: string,
    field: "eyebrow" | "heading" | "body" | "caption",
    value: string
  ) => patchBlock(blockId, { [`${field}${isVi ? "Vi" : "En"}`]: value } as Partial<ProductDetailBlock>);

  const addBlock = () => {
    const b = newBlock(addLayout, draft.hoverImage || draft.mainImage);
    setBlocks([...blocks, b]);
    setAddOpen(false);
    onSelectBlock(b.id);
  };

  /* ------------------------- SINGLE BLOCK EDITOR ------------------------- */
  if (selected) {
    const showImg = selected.layout !== "text-only";
    const showSecond = selected.layout === "two-images";
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onSelectBlock(null)}
            className="inline-flex min-h-[38px] cursor-pointer items-center rounded-lg px-2 text-[13px] font-bold text-[#283455] hover:bg-[#F3EDE7]"
          >
            ← Tất cả mục bài viết
          </button>
          <span className="rounded-full bg-[#283455] px-2.5 py-0.5 text-[12px] font-bold text-white">
            Mục {selectedIdx + 1} / {blocks.length}
          </span>
        </div>

        <PanelCard title="Bố cục của mục">
          <LayoutPicker
            name={`${id}-layout-${selected.id}`}
            legend="Chọn cách sắp xếp ảnh và chữ"
            value={selected.layout}
            onChange={(v) =>
              patchBlock(selected.id, {
                layout: v,
                image: v !== "text-only" && !selected.image ? draft.mainImage : selected.image,
              })
            }
          />
        </PanelCard>

        {showImg && (
          <PanelCard title={showSecond ? "Hai ảnh minh họa" : "Ảnh minh họa"}>
            <div className={`grid gap-2.5 ${showSecond ? "grid-cols-2" : "grid-cols-1"}`}>
              <ImageSlot
                label={showSecond ? "Ảnh bên trái" : "Ảnh"}
                value={selected.image}
                onChange={(url) => patchBlock(selected.id, { image: url })}
                onError={onError}
                aspect={selected.layout === "full-banner" ? "aspect-[2/1]" : "aspect-[4/3]"}
              />
              {showSecond && (
                <ImageSlot
                  label="Ảnh bên phải"
                  value={selected.secondaryImage}
                  onChange={(url) => patchBlock(selected.id, { secondaryImage: url })}
                  onError={onError}
                />
              )}
            </div>
            <div>
              <label htmlFor={`${id}-cap`} className={labelCls}>
                Chú thích nhỏ dưới ảnh <span className="font-normal text-[#5B647A]">(tùy chọn)</span>
              </label>
              <input
                id={`${id}-cap`}
                type="text"
                value={textOf(selected, "caption")}
                onChange={(e) => setText(selected.id, "caption", e.target.value)}
                placeholder={isVi ? "VD: Ảnh chụp thực tế màu Trắng Kem" : "Caption..."}
                className={inputCls}
              />
            </div>
          </PanelCard>
        )}

        <PanelCard title="Nội dung chữ">
          <LocaleNote locale={locale} />
          <div>
            <label htmlFor={`${id}-eb`} className={labelCls}>
              Nhãn nhỏ phía trên tiêu đề
            </label>
            <input
              id={`${id}-eb`}
              type="text"
              value={textOf(selected, "eyebrow")}
              onChange={(e) => setText(selected.id, "eyebrow", e.target.value)}
              placeholder={isVi ? "VD: CHẤT LIỆU" : "e.g. MATERIALS"}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor={`${id}-hd`} className={labelCls}>
              Tiêu đề
            </label>
            <input
              id={`${id}-hd`}
              type="text"
              value={textOf(selected, "heading")}
              onChange={(e) => setText(selected.id, "heading", e.target.value)}
              placeholder={isVi ? "VD: Càng giặt càng mềm" : "Heading..."}
              className={`${inputCls} font-bold`}
            />
          </div>
          <div>
            <label htmlFor={`${id}-bd`} className={labelCls}>
              Nội dung chi tiết
            </label>
            <textarea
              id={`${id}-bd`}
              rows={6}
              aria-describedby={`${id}-bd-hint`}
              value={textOf(selected, "body")}
              onChange={(e) => setText(selected.id, "body", e.target.value)}
              className={`${inputCls} py-2`}
            />
            <p id={`${id}-bd-hint`} className={hintCls}>
              Mẹo: bắt đầu dòng bằng <code>- </code> để tạo gạch đầu dòng. Xuống dòng để tách đoạn.
            </p>
          </div>
        </PanelCard>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const copy = { ...selected, id: `blk-${Date.now()}` };
              const next = [...blocks];
              next.splice(selectedIdx + 1, 0, copy);
              setBlocks(next);
              onSelectBlock(copy.id);
            }}
            className="min-h-[40px] cursor-pointer rounded-xl border border-[#283455] bg-white px-3.5 text-[13px] font-bold text-[#283455] hover:bg-[#F9F3ED]"
          >
            ⧉ Nhân bản mục này
          </button>
          <button
            type="button"
            onClick={() => {
              setBlocks(blocks.filter((b) => b.id !== selected.id));
              onSelectBlock(null);
            }}
            className="min-h-[40px] cursor-pointer rounded-xl px-3.5 text-[13px] font-bold text-[#A50E0E] hover:bg-[#FCE8E6]"
          >
            Xóa mục này
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------ LIST VIEW ------------------------------ */
  return (
    <div className="space-y-4">
      <PanelCard
        title={`Các mục bài viết (${blocks.length})`}
        hint={
          <>
            Hiện bên dưới phần mua hàng, trước mục Đánh giá. Bấm vào một mục để sửa, cầm{" "}
            <strong>⋮⋮</strong> kéo để đổi thứ tự trên → dưới.
          </>
        }
      >
        {blocks.length === 0 && (
          <p className="rounded-lg bg-[#F9F3ED] px-3 py-3 text-center text-[12.5px] text-[#5B647A]">
            Chưa có mục nào, phần bài viết chi tiết đang được ẩn.
          </p>
        )}
        <SortableList
          items={blocks}
          getKey={(b) => b.id}
          getLabel={(b) => b.headingVi || "Mục bài viết"}
          onReorder={setBlocks}
          ariaLabel="Thứ tự các mục bài viết chi tiết"
          className="space-y-1.5"
          renderItem={(b, { index, handle, isDragging }) => {
            const layoutMeta = LAYOUT_OPTIONS.find((o) => o.value === b.layout);
            return (
              <div
                className={`flex items-center gap-2 rounded-xl border bg-white py-1.5 pr-2 pl-1 ${
                  isDragging ? "border-[#2563eb] shadow-lg" : "border-[#E5E0DB] hover:border-[#9AA3B5]"
                }`}
              >
                {handle}
                <button
                  type="button"
                  onClick={() => onSelectBlock(b.id)}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left"
                >
                  <div className="h-12 w-14 shrink-0 overflow-hidden rounded-md border border-[#ECE7E2] bg-[#F4F4F6]">
                    {b.image && b.layout !== "text-only" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <LayoutDiagram layout={b.layout} />
                    )}
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-[#283455]">
                      {index + 1}. {b.headingVi || b.headingEn || "(Không có tiêu đề)"}
                    </span>
                    <span className="mt-0.5 inline-block rounded-full bg-[#F3EDE7] px-2 text-[10.5px] font-bold text-[#5B647A]">
                      {layoutMeta?.label}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-[#8E96A8]">
                    ›
                  </span>
                </button>
              </div>
            );
          }}
        />
      </PanelCard>

      {addOpen ? (
        <PanelCard title="Thêm mục mới">
          <LayoutPicker
            name={`${id}-add-layout`}
            legend="Chọn bố cục cho mục mới"
            value={addLayout}
            onChange={setAddLayout}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addBlock}
              className="min-h-[42px] flex-1 cursor-pointer rounded-xl bg-[#283455] px-4 text-[13px] font-bold text-white hover:bg-[#1D2742]"
            >
              Thêm mục này
            </button>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="min-h-[42px] cursor-pointer rounded-xl border border-[#C9CFD9] bg-white px-4 text-[13px] font-bold text-[#283455]"
            >
              Hủy
            </button>
          </div>
        </PanelCard>
      ) : (
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="min-h-[46px] w-full cursor-pointer rounded-xl border-2 border-dashed border-[#283455]/50 text-[13.5px] font-bold text-[#283455] hover:bg-[#F9F3ED]"
        >
          + Thêm mục bài viết / ảnh
        </button>
      )}
    </div>
  );
}
