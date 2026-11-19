"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { ProductCardData } from "./data";

export interface CartItem {
  key: string;
  slug: string;
  title: string;
  color: string;
  size: string;
  price: number;
  originalPrice: number;
  image: string;
  href: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  quickViewProduct: ProductCardData | null;
  quickViewSwatchIndex: number;
  openCart: () => void;
  closeCart: () => void;
  openQuickView: (product: ProductCardData, swatchIndex: number) => void;
  closeQuickView: () => void;
  addItem: (item: Omit<CartItem, "qty">, quantity?: number) => void;
  updateQty: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = "brooklinen_cart_v1";
const CART_EVENT = "brooklinen:cart-change";
const EMPTY_CART: CartItem[] = [];

let cachedRaw: string | null = null;
let cachedParsed: CartItem[] = EMPTY_CART;

function readClientCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (raw === cachedRaw) return cachedParsed;
    cachedRaw = raw;
    if (!raw) {
      cachedParsed = EMPTY_CART;
      return cachedParsed;
    }
    const parsed = JSON.parse(raw) as unknown;
    cachedParsed = Array.isArray(parsed) ? (parsed as CartItem[]) : EMPTY_CART;
    return cachedParsed;
  } catch {
    return EMPTY_CART;
  }
}

function writeClientCart(next: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(next);
    cachedRaw = serialized;
    cachedParsed = next;
    window.localStorage.setItem(CART_STORAGE_KEY, serialized);
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event(CART_EVENT));
}

function subscribeCart(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const onChange = () => callback();
  window.addEventListener("storage", onChange);
  window.addEventListener(CART_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CART_EVENT, onChange);
  };
}

const CartContext = createContext<CartContextValue | null>(null);

export function parseDollar(value: string): number {
  const num = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore<CartItem[]>(
    subscribeCart,
    readClientCart,
    () => EMPTY_CART
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewState, setQuickViewState] = useState<{
    product: ProductCardData | null;
    swatchIndex: number;
  }>({ product: null, swatchIndex: 0 });

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const openQuickView = useCallback(
    (product: ProductCardData, swatchIndex: number) => {
      setQuickViewState({ product, swatchIndex });
    },
    []
  );

  const closeQuickView = useCallback(() => {
    setQuickViewState((prev) => ({ ...prev, product: null }));
  }, []);

  const addItem = useCallback(
    (incoming: Omit<CartItem, "qty">, quantity = 1) => {
      const prev = readClientCart();
      const existing = prev.find((it) => it.key === incoming.key);
      const next = existing
        ? prev.map((it) =>
            it.key === incoming.key ? { ...it, qty: it.qty + quantity } : it
          )
        : [...prev, { ...incoming, qty: quantity }];
      writeClientCart(next);
    },
    []
  );

  const updateQty = useCallback((key: string, delta: number) => {
    const prev = readClientCart();
    const next = prev
      .map((it) => (it.key === key ? { ...it, qty: it.qty + delta } : it))
      .filter((it) => it.qty > 0);
    writeClientCart(next);
  }, []);

  const removeItem = useCallback((key: string) => {
    const prev = readClientCart();
    writeClientCart(prev.filter((it) => it.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    writeClientCart([]);
  }, []);

  const totalCount = useMemo(
    () => items.reduce((acc, it) => acc + it.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.qty, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalCount,
      subtotal,
      isCartOpen,
      quickViewProduct: quickViewState.product,
      quickViewSwatchIndex: quickViewState.swatchIndex,
      openCart,
      closeCart,
      openQuickView,
      closeQuickView,
      addItem,
      updateQty,
      removeItem,
      clearCart,
    }),
    [
      items,
      totalCount,
      subtotal,
      isCartOpen,
      quickViewState,
      openCart,
      closeCart,
      openQuickView,
      closeQuickView,
      addItem,
      updateQty,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
