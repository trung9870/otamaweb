"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCollectionMeta as getStaticCollectionMeta,
  type CatalogProduct,
  type CollectionMeta,
} from "./catalog";
import type { Locale } from "./LanguageContext";
import { formatPrice, formatPriceString } from "./translations";
import {
  buildDefaultCategories,
  buildDefaultProducts,
  buildDefaultSettings,
} from "@/lib/store-seed";
import {
  storeCategoryToCollectionMeta,
  storeProductToCatalogProduct,
  type PublicStorePayload,
  type StorageMode,
  type StoreCategory,
  type StoreProduct,
  type StoreSettings,
} from "@/lib/store-types";

export type LiveCatalogProduct = CatalogProduct & { titleVi?: string };

interface StoreDataContextValue {
  mode: StorageMode;
  ready: boolean;
  storeProducts: StoreProduct[];
  catalog: LiveCatalogProduct[];
  categories: StoreCategory[];
  settings: StoreSettings;
  bestOfSale: LiveCatalogProduct[];
  giftGuide: LiveCatalogProduct[];
  collection: LiveCatalogProduct[];
  getProductBySlug: (slug: string) => LiveCatalogProduct | undefined;
  getCollectionMeta: (slug: string) => CollectionMeta;
  getProductsForCollection: (slug: string) => LiveCatalogProduct[];
  getRelatedProducts: (slug: string, count?: number) => LiveCatalogProduct[];
  resolveProductsBySlugs: (slugs: string[]) => LiveCatalogProduct[];
  formatMoney: (usdAmount: number, locale: Locale) => string;
  formatMoneyString: (rawUsd: string, locale: Locale) => string;
  refreshStore: () => Promise<void>;
}

const DEFAULT_PRODUCTS = buildDefaultProducts();
const DEFAULT_CATEGORIES = buildDefaultCategories();
const DEFAULT_SETTINGS = buildDefaultSettings();

const StoreDataContext = createContext<StoreDataContextValue | null>(null);

export function StoreDataProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<StorageMode>("local");
  const [ready, setReady] = useState(false);
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<StoreCategory[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  const refreshStore = useCallback(async () => {
    try {
      const res = await fetch("/api/store", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as PublicStorePayload;
      if (Array.isArray(data.products)) setStoreProducts(data.products);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
      if (data.mode) setMode(data.mode);
    } catch {
      // Keep static fallback if network fails
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refreshStore();
  }, [refreshStore]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, StoreCategory>();
    for (const c of categories) {
      map.set(c.slug, c);
    }
    return map;
  }, [categories]);

  const catalog = useMemo(() => {
    return storeProducts
      .filter((p) => p.active)
      .map((p) => storeProductToCatalogProduct(p, categoryMap));
  }, [storeProducts, categoryMap]);

  const bestOfSale = useMemo(() => {
    const list = storeProducts
      .filter((p) => p.active && p.sections.includes("bestOfSale"))
      .map((p) => storeProductToCatalogProduct(p, categoryMap));
    return list.length > 0 ? list : catalog.slice(0, 12);
  }, [storeProducts, categoryMap, catalog]);

  const giftGuide = useMemo(() => {
    const list = storeProducts
      .filter((p) => p.active && p.sections.includes("giftGuide"))
      .map((p) => storeProductToCatalogProduct(p, categoryMap));
    return list.length > 0 ? list : catalog.slice(0, 10);
  }, [storeProducts, categoryMap, catalog]);

  const collection = useMemo(() => {
    const list = storeProducts
      .filter((p) => p.active && p.sections.includes("collection"))
      .map((p) => storeProductToCatalogProduct(p, categoryMap));
    return list.length > 0 ? list : catalog.slice(0, 10);
  }, [storeProducts, categoryMap, catalog]);

  const getProductBySlug = useCallback(
    (slug: string) => catalog.find((p) => p.slug === slug),
    [catalog]
  );

  const getCollectionMeta = useCallback(
    (slug: string): CollectionMeta => {
      const found = categoryMap.get(slug);
      if (found) return storeCategoryToCollectionMeta(found);
      return getStaticCollectionMeta(slug);
    },
    [categoryMap]
  );

  const getProductsForCollection = useCallback(
    (slug: string): LiveCatalogProduct[] => {
      const meta = categoryMap.get(slug);
      const directMatch = catalog.filter((p) => p.categorySlug === slug);
      if (meta?.filterTag) {
        const byTag = catalog.filter(
          (p) => p.categorySlug === slug || p.tags.includes(meta.filterTag!)
        );
        if (byTag.length > 0) return byTag;
      }
      if (directMatch.length > 0) return directMatch;
      return catalog;
    },
    [categoryMap, catalog]
  );

  const getRelatedProducts = useCallback(
    (slug: string, count = 4): LiveCatalogProduct[] => {
      const current = catalog.find((p) => p.slug === slug);
      const others = catalog.filter(
        (p) => p.slug !== slug && p.slug !== "rise-ai-giftcard"
      );
      if (!current) return others.slice(0, count);
      return others
        .map((p) => ({
          p,
          score:
            p.tags.filter((t) => current.tags.includes(t)).length +
            (p.categorySlug === current.categorySlug ? 2 : 0),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map((x) => x.p);
    },
    [catalog]
  );

  const resolveProductsBySlugs = useCallback(
    (slugs: string[]): LiveCatalogProduct[] => {
      const bySlug = new Map(catalog.map((p) => [p.slug, p]));
      const out: LiveCatalogProduct[] = [];
      for (const slug of slugs) {
        const match = bySlug.get(slug);
        if (match) out.push(match);
      }
      return out;
    },
    [catalog]
  );

  const formatMoney = useCallback(
    (usdAmount: number, locale: Locale) =>
      formatPrice(usdAmount, locale, settings.vndRate),
    [settings.vndRate]
  );

  const formatMoneyString = useCallback(
    (rawUsd: string, locale: Locale) =>
      formatPriceString(rawUsd, locale, settings.vndRate),
    [settings.vndRate]
  );

  const value = useMemo(
    () => ({
      mode,
      ready,
      storeProducts,
      catalog,
      categories,
      settings,
      bestOfSale,
      giftGuide,
      collection,
      getProductBySlug,
      getCollectionMeta,
      getProductsForCollection,
      getRelatedProducts,
      resolveProductsBySlugs,
      formatMoney,
      formatMoneyString,
      refreshStore,
    }),
    [
      mode,
      ready,
      storeProducts,
      catalog,
      categories,
      settings,
      bestOfSale,
      giftGuide,
      collection,
      getProductBySlug,
      getCollectionMeta,
      getProductsForCollection,
      getRelatedProducts,
      resolveProductsBySlugs,
      formatMoney,
      formatMoneyString,
      refreshStore,
    ]
  );

  return (
    <StoreDataContext.Provider value={value}>
      {children}
    </StoreDataContext.Provider>
  );
}

export function useStoreData(): StoreDataContextValue {
  const ctx = useContext(StoreDataContext);
  if (!ctx) {
    throw new Error("useStoreData must be used inside StoreDataProvider");
  }
  return ctx;
}
