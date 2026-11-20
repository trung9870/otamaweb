"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { StoreCategory, StoreProduct } from "@/lib/store-types";

interface LinkPickerProps {
  id?: string;
  label: string;
  value: string;
  onChange: (nextHref: string) => void;
  categories: StoreCategory[];
  products: StoreProduct[];
  compact?: boolean;
}

interface LinkOption {
  href: string;
  label: string;
  sublabel: string;
  group: "home" | "categories" | "products" | "pages";
}

const STATIC_PAGE_OPTIONS: readonly Omit<LinkOption, "group">[] = [
  {
    href: "/pages/black-friday-cyber-monday-deals",
    label: "Trang Ưu Đãi Black Friday",
    sublabel: "/pages/black-friday-cyber-monday-deals",
  },
  {
    href: "/pages/all-bundles",
    label: "Tất Cả Combo Tiết Kiệm",
    sublabel: "/pages/all-bundles",
  },
  {
    href: "/pages/best-sheets-ever",
    label: "Chiến dịch Ga Giường Đỉnh Nhất",
    sublabel: "/pages/best-sheets-ever",
  },
  {
    href: "/pages/our-stores",
    label: "Hệ Thống Cửa Hàng",
    sublabel: "/pages/our-stores",
  },
  {
    href: "/pages/faq",
    label: "Hỏi Đáp & Hỗ Trợ (FAQ)",
    sublabel: "/pages/faq",
  },
  {
    href: "/pages/reviews",
    label: "Đánh Giá Khách Hàng",
    sublabel: "/pages/reviews",
  },
  {
    href: "/pages/returns",
    label: "Chính Sách Đổi Trả & Bảo Hành 365 Ngày",
    sublabel: "/pages/returns",
  },
  {
    href: "/pages/care-guide",
    label: "Hướng Dẫn Bảo Quản Vải",
    sublabel: "/pages/care-guide",
  },
  {
    href: "/pages/hsa-fsa-eligible",
    label: "Thanh Toán Thẻ FSA / HSA",
    sublabel: "/pages/hsa-fsa-eligible",
  },
  {
    href: "/pages/corporate-gifting",
    label: "Quà Tặng Doanh Nghiệp",
    sublabel: "/pages/corporate-gifting",
  },
  {
    href: "/pages/about",
    label: "Về Thương Hiệu",
    sublabel: "/pages/about",
  },
  {
    href: "/pages/contact",
    label: "Liên Hệ",
    sublabel: "/pages/contact",
  },
  {
    href: "/pages/check-gift-card-balance",
    label: "Kiểm Tra Số Dư Thẻ Quà Tặng",
    sublabel: "/pages/check-gift-card-balance",
  },
];

const GROUP_LABELS: Record<LinkOption["group"], string> = {
  home: "Trang chính",
  categories: "Danh mục sản phẩm",
  products: "Sản phẩm cụ thể",
  pages: "Trang thông tin & Khuyến mãi",
};

export function LinkPicker({
  id,
  label,
  value,
  onChange,
  categories,
  products,
  compact = false,
}: LinkPickerProps) {
  const reactId = useId();
  const popoverId = `lp-pop-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const inputId = id || `lp-in-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const popoverRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [forceCustomMode, setForceCustomMode] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);

  const allOptions = useMemo<LinkOption[]>(() => {
    const out: LinkOption[] = [
      { href: "/", label: "Trang chủ", sublabel: "/", group: "home" },
      {
        href: "/checkout",
        label: "Trang Thanh Toán / Giỏ Hàng",
        sublabel: "/checkout",
        group: "home",
      },
    ];

    for (const c of categories) {
      if (!c.active) continue;
      const href = `/collections/${c.slug}`;
      out.push({
        href,
        label: c.titleVi || c.titleEn,
        sublabel: href,
        group: "categories",
      });
    }

    for (const p of products) {
      if (!p.active) continue;
      const href = `/products/${p.slug}`;
      out.push({
        href,
        label: p.titleVi || p.titleEn,
        sublabel: href,
        group: "products",
      });
    }

    for (const pg of STATIC_PAGE_OPTIONS) {
      out.push({ ...pg, group: "pages" });
    }

    return out;
  }, [categories, products]);

  const matchedOption = useMemo(() => {
    const clean = (value || "").trim().replace(/\/+$/, "") || "/";
    return (
      allOptions.find((o) => (o.href.replace(/\/+$/, "") || "/") === clean) ||
      null
    );
  }, [allOptions, value]);

  const isCustom = forceCustomMode || (Boolean(value?.trim()) && !matchedOption);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const groups: { key: LinkOption["group"]; title: string; items: LinkOption[] }[] = [
      { key: "home", title: GROUP_LABELS.home, items: [] },
      { key: "categories", title: `${GROUP_LABELS.categories} (${categories.filter((c) => c.active).length})`, items: [] },
      { key: "products", title: `${GROUP_LABELS.products} (${products.filter((p) => p.active).length})`, items: [] },
      { key: "pages", title: GROUP_LABELS.pages, items: [] },
    ];
    const map = new Map(groups.map((g) => [g.key, g]));

    for (const opt of allOptions) {
      if (
        !q ||
        opt.label.toLowerCase().includes(q) ||
        opt.sublabel.toLowerCase().includes(q)
      ) {
        map.get(opt.group)?.items.push(opt);
      }
    }
    return groups.filter((g) => g.items.length > 0);
  }, [allOptions, categories, products, query]);

  useEffect(() => {
    const pop = popoverRef.current;
    if (!pop) return;
    const onToggle = (e: Event) => {
      const te = e as ToggleEvent;
      if (te.newState === "open") {
        setQuery("");
        requestAnimationFrame(() => searchRef.current?.focus());
      }
    };
    pop.addEventListener("toggle", onToggle);
    return () => pop.removeEventListener("toggle", onToggle);
  }, []);

  const closeOverlay = () => {
    const pop = popoverRef.current;
    if (pop && typeof pop.hidePopover === "function") {
      try {
        pop.hidePopover();
      } catch {
        // already closed
      }
    }
    setFallbackOpen(false);
  };

  const handleTriggerClick = () => {
    const pop = popoverRef.current;
    if (pop && "popover" in HTMLElement.prototype) {
      return; // handled natively by popovertarget
    }
    setFallbackOpen((v) => !v);
  };

  const selectHref = (href: string) => {
    setForceCustomMode(false);
    onChange(href);
    closeOverlay();
  };

  const chooseCustom = () => {
    setForceCustomMode(true);
    closeOverlay();
  };

  const badgeText = matchedOption
    ? GROUP_LABELS[matchedOption.group]
    : isCustom
    ? "Tùy chỉnh"
    : "Chưa chọn";

  const displayTitle = matchedOption
    ? matchedOption.label
    : value?.trim()
    ? value.trim()
    : "Chọn trang mở ra khi bấm...";

  const panelBody = (
    <div className="flex max-h-[min(70vh,410px)] flex-col">
      <div className="border-b border-[#E5E0DB] bg-[#FDFAF8] p-2.5">
        <label htmlFor={`${popoverId}-search`} className="visually-hidden">
          Tìm danh mục, sản phẩm hoặc trang
        </label>
        <input
          ref={searchRef}
          id={`${popoverId}-search`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm danh mục, sản phẩm, trang..."
          className="h-9 w-full rounded-lg border border-[#8E96A8] bg-white px-3 text-[13px] text-[#283455] focus-visible:outline-2 focus-visible:outline-[#283455]"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredGroups.map((group) => (
          <div key={group.key} className="mb-2.5 last:mb-0">
            <p className="px-2 py-1 text-[11px] font-bold tracking-wider text-[#5B647A] uppercase">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((opt) => {
                const active = matchedOption?.href === opt.href && !forceCustomMode;
                return (
                  <button
                    key={`${opt.group}-${opt.href}`}
                    type="button"
                    onClick={() => selectHref(opt.href)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
                      active
                        ? "bg-[#283455] font-bold text-white"
                        : "text-[#283455] hover:bg-[#F9F3ED]"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{opt.label}</span>
                      <span
                        className={`block truncate font-mono text-[11px] ${
                          active ? "text-white/80" : "text-[#6E7485]"
                        }`}
                      >
                        {opt.sublabel}
                      </span>
                    </span>
                    {active && <span aria-hidden="true">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <p className="py-5 text-center text-[12.5px] text-[#5B647A]">
            Không tìm thấy mục phù hợp. Bạn có thể chọn &ldquo;Liên kết tùy chỉnh&rdquo; bên dưới.
          </p>
        )}
      </div>

      <div className="border-t border-[#E5E0DB] bg-[#FDFAF8] p-2">
        <button
          type="button"
          onClick={chooseCustom}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] font-bold text-[#283455] hover:bg-[#EFEAE4]"
        >
          <span>🔗 Nhập liên kết tùy chỉnh (Facebook, Shopee, Zalo...)</span>
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <label
        htmlFor={isCustom ? inputId : `${inputId}-btn`}
        className={
          compact
            ? "sr-only"
            : "block text-[13px] font-bold text-[#283455]"
        }
      >
        {label}
      </label>

      {/* Trigger button opening native top-layer popover (modern-web-guidance: viewport-aware-dropdowns) */}
      <button
        id={`${inputId}-btn`}
        type="button"
        popoverTarget={popoverId}
        onClick={handleTriggerClick}
        className={`${
          compact ? "min-h-[38px] px-2.5 py-1" : "mt-1.5 min-h-[46px] px-3 py-1.5"
        } flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-[#8E96A8] bg-white text-left text-[#283455] hover:border-[#283455] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#283455]`}
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="shrink-0 rounded bg-[#F3EDE7] px-1.5 py-0.5 text-[10.5px] font-bold text-[#3D4866]">
              {badgeText}
            </span>
            <span className="truncate text-[13px] font-bold">
              {displayTitle}
            </span>
          </span>
          {!compact && matchedOption && (
            <span className="mt-0.5 block truncate font-mono text-[11px] text-[#6E7485]">
              {matchedOption.sublabel}
            </span>
          )}
        </span>
        <span aria-hidden="true" className="shrink-0 text-[12px] text-[#5B647A]">
          ▾
        </span>
      </button>

      <div
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        className="otama-link-popover"
      >
        {panelBody}
      </div>

      {fallbackOpen && (
        <div className="mt-1 overflow-hidden rounded-xl border border-[#C9CFD9] bg-white shadow-xl">
          {panelBody}
        </div>
      )}

      {isCustom && (
        <div className="mt-2">
          <input
            id={inputId}
            type="text"
            spellCheck={false}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://shopee.vn/... hoặc /collections/..."
            className="admin-input w-full rounded-xl border border-[#8E96A8] px-3 font-mono text-[12.5px]"
          />
          <p className="mt-1 text-[11.5px] text-[#5B647A]">
            Nhập đường dẫn đầy đủ (vd: <code>https://zalo.me/...</code>) hoặc bấm ô bên trên để chọn lại từ danh sách.
          </p>
        </div>
      )}
    </div>
  );
}
