"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { CategoryModal } from "./CategoryModal";
import { HomepageBuilderTab } from "./HomepageBuilderTab";
import { ORDER_STATUS_META, OrderDetailModal } from "./OrderDetailModal";
import { ProductModal } from "./ProductModal";
import type {
  AdminDashboardPayload,
  StoreCategory,
  StoreOrder,
  StoreOrderStatus,
  StoreProduct,
  StoreSettings,
} from "@/lib/store-types";

type AdminTab = "overview" | "layout" | "products" | "categories" | "orders" | "settings";

interface ConfirmState {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
}

export function AdminDashboard() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [usingDefaultCreds, setUsingDefaultCreds] = useState(false);
  const [defaultEmailHint, setDefaultEmailHint] = useState("admin@otamaweb.local");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [pwInvalid, setPwInvalid] = useState(false);

  // Dashboard data
  const [data, setData] = useState<AdminDashboardPayload | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [layoutDirty, setLayoutDirty] = useState(false);
  const [toast, setToast] = useState<{ text: string; tone: "ok" | "err" } | null>(null);

  // Filters
  const [productQuery, setProductQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | StoreOrderStatus>("all");

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<StoreCategory | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const confirmDialogRef = useRef<HTMLDialogElement>(null);

  // Settings draft form
  const [settingsDraft, setSettingsDraft] = useState<StoreSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  const showToast = useCallback((text: string, tone: "ok" | "err" = "ok") => {
    setToast({ text, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    document.documentElement.lang = "vi";
  }, []);

  const fetchDashboard = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error("Không tải được dữ liệu quản trị.");
      const payload = (await res.json()) as AdminDashboardPayload;
      setData(payload);
      setSettingsDraft(payload.settings);
      setAuthenticated(true);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Không tải được dữ liệu.",
        "err"
      );
    } finally {
      setLoadingData(false);
    }
  }, [showToast]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/auth/me", { cache: "no-store" });
        const info = (await res.json()) as {
          authenticated?: boolean;
          usingDefaultCredentials?: boolean;
          defaultEmailHint?: string;
        };
        setUsingDefaultCreds(Boolean(info.usingDefaultCredentials));
        if (info.defaultEmailHint) setDefaultEmailHint(info.defaultEmailHint);
        if (info.authenticated) {
          setAuthenticated(true);
          await fetchDashboard();
        }
      } finally {
        setAuthChecked(true);
      }
    })();
  }, [fetchDashboard]);

  // Sync confirm native <dialog>
  useEffect(() => {
    const d = confirmDialogRef.current;
    if (!d) return;
    if (confirmState && !d.open) {
      d.showModal();
    } else if (!confirmState && d.open) {
      d.close();
    }
  }, [confirmState]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (loggingIn) return;
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        throw new Error(body.error || "Đăng nhập thất bại.");
      }
      setAuthenticated(true);
      setLoginPassword("");
      await fetchDashboard();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    setAuthenticated(false);
    setData(null);
  };

  const handleToggleProductActive = async (product: StoreProduct) => {
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(product.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !product.active }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật trạng thái sản phẩm.");
      await fetchDashboard();
      showToast(
        !product.active
          ? `Đã bật hiển thị "${product.titleVi}".`
          : `Đã tạm ẩn "${product.titleVi}".`
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi cập nhật.", "err");
    }
  };

  const requestDeleteProduct = (product: StoreProduct) => {
    setConfirmState({
      title: "Xác nhận xóa sản phẩm?",
      message: `Sản phẩm "${product.titleVi}" sẽ bị xóa khỏi danh mục cửa hàng. Bạn cũng có thể chọn "Ẩn" nếu chỉ muốn tạm ngừng bán.`,
      confirmLabel: "Xóa sản phẩm",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/products/${encodeURIComponent(product.id)}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Xóa sản phẩm thất bại.");
        await fetchDashboard();
        showToast(`Đã xóa sản phẩm "${product.titleVi}".`);
      },
    });
  };

  const requestDeleteCategory = (cat: StoreCategory) => {
    setConfirmState({
      title: "Xác nhận xóa danh mục?",
      message: `Danh mục "${cat.titleVi}" (/collections/${cat.slug}) sẽ bị xóa. Các sản phẩm thuộc danh mục này không bị xóa.`,
      confirmLabel: "Xóa danh mục",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/categories/${encodeURIComponent(cat.slug)}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Xóa danh mục thất bại.");
        await fetchDashboard();
        showToast(`Đã xóa danh mục "${cat.titleVi}".`);
      },
    });
  };

  const requestTab = (tab: AdminTab) => {
    if (activeTab === "layout" && layoutDirty && tab !== "layout") {
      setConfirmState({
        title: "Rời Bố cục khi chưa lưu?",
        message:
          'Bạn còn thay đổi bố cục chưa bấm "Lưu & Xuất bản". Nếu rời đi, các thay đổi này sẽ bị mất.',
        confirmLabel: "Rời đi & bỏ thay đổi",
        onConfirm: async () => {
          setLayoutDirty(false);
          setActiveTab(tab);
        },
      });
      return;
    }
    setActiveTab(tab);
  };

  const handleSaveSettingsPatch = useCallback(
    async (patch: Partial<StoreSettings>, successMsg: string) => {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const body = (await res.json()) as { settings?: StoreSettings; error?: string };
      if (!res.ok || !body.settings) {
        const errText = body.error || "Lưu thay đổi thất bại.";
        showToast(errText, "err");
        throw new Error(errText);
      }
      await fetchDashboard();
      showToast(successMsg);
    },
    [fetchDashboard, showToast]
  );

  const handleMoveProduct = async (idx: number, dir: -1 | 1) => {
    if (!data) return;
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= data.products.length) return;
    const next = [...data.products];
    const [moved] = next.splice(idx, 1);
    next.splice(nextIdx, 0, moved);
    setData({ ...data, products: next });
    try {
      const res = await fetch("/api/admin/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "products",
          orderedIds: next.map((p) => p.id),
        }),
      });
      if (!res.ok) throw new Error("Không lưu được thứ tự sản phẩm.");
      showToast(`Đã chuyển "${moved.titleVi}" tới vị trí #${nextIdx + 1}.`);
    } catch (err) {
      await fetchDashboard();
      showToast(err instanceof Error ? err.message : "Lỗi đổi thứ tự.", "err");
    }
  };

  const handleMoveCategory = async (idx: number, dir: -1 | 1) => {
    if (!data) return;
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= data.categories.length) return;
    const next = [...data.categories];
    const [moved] = next.splice(idx, 1);
    next.splice(nextIdx, 0, moved);
    setData({ ...data, categories: next });
    try {
      const res = await fetch("/api/admin/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "categories",
          orderedIds: next.map((c) => c.slug),
        }),
      });
      if (!res.ok) throw new Error("Không lưu được thứ tự danh mục.");
      showToast(`Đã chuyển danh mục "${moved.titleVi}" tới vị trí #${nextIdx + 1}.`);
    } catch (err) {
      await fetchDashboard();
      showToast(err instanceof Error ? err.message : "Lỗi đổi thứ tự.", "err");
    }
  };

  const handleToggleCategoryHome = async (cat: StoreCategory) => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cat, showOnHome: !cat.showOnHome }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật danh mục.");
      await fetchDashboard();
      showToast(
        !cat.showOnHome
          ? `Đã đưa "${cat.titleVi}" lên khối Danh mục nổi bật Trang chủ.`
          : `Đã ẩn "${cat.titleVi}" khỏi khối Danh mục nổi bật Trang chủ.`
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi cập nhật.", "err");
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    if (!settingsDraft || savingSettings) return;
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsDraft),
      });
      const body = (await res.json()) as { settings?: StoreSettings; error?: string };
      if (!res.ok || !body.settings) {
        throw new Error(body.error || "Lưu cài đặt thất bại.");
      }
      await fetchDashboard();
      showToast("Đã lưu cài đặt cửa hàng thành công!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lưu cài đặt thất bại.", "err");
    } finally {
      setSavingSettings(false);
    }
  };

  const requestResetLocal = () => {
    setConfirmState({
      title: "Khôi phục dữ liệu mẫu ban đầu?",
      message:
        "Thao tác này sẽ đưa toàn bộ sản phẩm, danh mục, đơn hàng và cài đặt Local Demo về trạng thái ban đầu.",
      confirmLabel: "Khôi phục ngay",
      onConfirm: async () => {
        const res = await fetch("/api/admin/reset", { method: "POST" });
        if (!res.ok) throw new Error("Khôi phục thất bại.");
        await fetchDashboard();
        showToast("Đã khôi phục toàn bộ dữ liệu mẫu ban đầu.");
      },
    });
  };

  const vndRate = data?.settings.vndRate || 25000;
  const formatVnd = (usd: number) => `${Math.round(usd * vndRate).toLocaleString("vi-VN")}₫`;

  const categoryLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of data?.categories || []) {
      map.set(c.slug, c.titleVi);
    }
    return map;
  }, [data?.categories]);

  const filteredProducts = useMemo(() => {
    const list = data?.products || [];
    const q = productQuery.trim().toLowerCase();
    return list.filter((p) => {
      if (productCategoryFilter !== "all" && p.categorySlug !== productCategoryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        p.titleVi.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    });
  }, [data?.products, productQuery, productCategoryFilter]);

  const filteredOrders = useMemo(() => {
    const list = data?.orders || [];
    if (orderStatusFilter === "all") return list;
    return list.filter((o) => o.status === orderStatusFilter);
  }, [data?.orders, orderStatusFilter]);

  // Loading auth state
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFAF8] text-[#283455]">
        <p className="text-[15px] font-bold">Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  // ============================================================================
  // SIGN-IN SCREEN (follows modern-web-guidance: autofill-sign-in-form + forms)
  // ============================================================================
  if (!authenticated) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-[#FDFAF8] px-5 py-12 text-[#283455]"
        style={{ fontFamily: '"Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif' }}
      >
        <div className="w-full max-w-[440px] rounded-2xl border border-[#E5E0DB] bg-white p-7 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#F9F3ED] px-3 py-1 text-[12px] font-bold text-[#283455]">
              otamaweb Admin
            </span>
            <Link
              href="/?lang=vi"
              className="text-[13px] font-bold text-[#5B647A] hover:text-[#283455] hover:underline"
            >
              &larr; Về cửa hàng
            </Link>
          </div>

          <h1 className="mt-4 text-[26px] font-bold tracking-tight text-[#283455]">
            Đăng nhập Quản trị
          </h1>
          <p className="mt-1 text-[14px] text-[#5B647A]">
            Quản lý sản phẩm, ảnh, giá VNĐ/USD, danh mục và đơn hàng.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4" noValidate={false}>
            {loginError && (
              <div
                role="alert"
                className="rounded-xl border border-[#D93025]/40 bg-[#FCE8E6] px-4 py-3 text-[13.5px] font-medium text-[#A50E0E]"
              >
                {loginError}
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className="block text-[13.5px] font-bold">
                Email quản trị{" "}
                <span aria-hidden="true" className="text-[#740103]">
                  *
                </span>
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                spellCheck={false}
                autoCapitalize="none"
                enterKeyHint="next"
                required
                value={loginEmail}
                aria-invalid={emailInvalid ? "true" : "false"}
                aria-describedby={emailInvalid ? "admin-email-err" : undefined}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  if (emailInvalid && e.currentTarget.validity.valid) {
                    setEmailInvalid(false);
                  }
                }}
                onBlur={(e) => setEmailInvalid(!e.currentTarget.validity.valid)}
                onInvalid={() => setEmailInvalid(true)}
                placeholder="admin@otamaweb.local"
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
              />
              <div id="admin-email-err" className="admin-error-msg">
                Vui lòng nhập email quản trị đúng định dạng.
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="admin-password" className="block text-[13.5px] font-bold">
                  Mật khẩu{" "}
                  <span aria-hidden="true" className="text-[#740103]">
                    *
                  </span>
                </label>
                <button
                  type="button"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer text-[12.5px] font-bold text-[#283455] underline underline-offset-2"
                >
                  {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                </button>
              </div>
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                enterKeyHint="done"
                required
                value={loginPassword}
                aria-invalid={pwInvalid ? "true" : "false"}
                aria-describedby={pwInvalid ? "admin-pw-err" : undefined}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  if (pwInvalid && e.currentTarget.validity.valid) {
                    setPwInvalid(false);
                  }
                }}
                onBlur={(e) => setPwInvalid(!e.currentTarget.validity.valid)}
                onInvalid={() => setPwInvalid(true)}
                className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
              />
              <div id="admin-pw-err" className="admin-error-msg">
                Vui lòng nhập mật khẩu quản trị.
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="min-h-[50px] w-full cursor-pointer rounded-xl bg-[#283455] text-[15px] font-bold text-white hover:bg-[#1D2742] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingIn ? "Đang đăng nhập..." : "Đăng nhập quản trị"}
            </button>
          </form>

          {usingDefaultCreds && (
            <div className="mt-6 rounded-xl border border-[#DDE3EC] bg-[#F9F3ED] p-4 text-[13px] text-[#3D4866]">
              <p className="font-bold text-[#283455]">
                Tài khoản dùng thử Local Demo:
              </p>
              <p className="mt-1">
                Email: <code className="font-mono font-bold">{defaultEmailHint}</code>
                <br />
                Mật khẩu: <code className="font-mono font-bold">otama123456</code>
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail(defaultEmailHint);
                  setLoginPassword("otama123456");
                  setEmailInvalid(false);
                  setPwInvalid(false);
                }}
                className="mt-2.5 inline-flex min-h-[38px] cursor-pointer items-center rounded-lg border border-[#283455] bg-white px-3 text-[12.5px] font-bold text-[#283455] hover:bg-[#283455] hover:text-white"
              >
                Điền nhanh tài khoản demo
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ============================================================================
  const navItems: { id: AdminTab; label: string; count?: number }[] = [
    { id: "overview", label: "Tổng quan" },
    { id: "layout", label: "Bố cục Trang chủ" },
    { id: "products", label: "Sản phẩm", count: data?.stats.totalProducts },
    { id: "categories", label: "Danh mục", count: data?.stats.totalCategories },
    { id: "orders", label: "Đơn hàng", count: data?.stats.pendingOrders },
    { id: "settings", label: "Cài đặt" },
  ];

  return (
    <div
      className="min-h-screen bg-[#FDFAF8] text-[#283455]"
      style={{ fontFamily: '"Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif' }}
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E5E0DB] bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-[19px] font-bold tracking-tight text-[#283455]">
              otamaweb <span className="font-normal text-[#5B647A]">Admin</span>
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[12px] font-bold ${
                data?.mode === "supabase"
                  ? "bg-[#EAF3E4] text-[#417823]"
                  : "bg-[#FEF3C7] text-[#92400E]"
              }`}
            >
              {data?.mode === "supabase" ? "Supabase Live" : "Chế độ Local Demo"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/?lang=vi"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[40px] items-center rounded-xl border border-[#C9CFD9] bg-white px-3.5 text-[13px] font-bold text-[#283455] hover:bg-[#F9F3ED]"
            >
              Xem cửa hàng ↗
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-[40px] cursor-pointer items-center rounded-xl bg-[#F3EDE7] px-3.5 text-[13px] font-bold text-[#283455] hover:bg-[#E7DFD6]"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          aria-label="Điều hướng quản trị"
          className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 pb-2 sm:px-6"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => requestTab(item.id)}
                className={`inline-flex min-h-[42px] shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 text-[14px] font-bold transition-colors ${
                  isActive
                    ? "bg-[#283455] text-white"
                    : "text-[#3D4866] hover:bg-[#F9F3ED]"
                }`}
              >
                <span>{item.label}</span>
                {typeof item.count === "number" && item.count > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11.5px] ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.id === "orders"
                        ? "bg-[#FEF3C7] text-[#92400E]"
                        : "bg-[#EFEAE4] text-[#283455]"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Polite Status Live Region / Toast */}
      <div role="status" aria-live="polite" className="mx-auto max-w-[1440px] px-4 sm:px-6">
        {toast && (
          <div
            className={`mt-4 flex items-center justify-between rounded-xl border px-4 py-3 text-[14px] font-bold ${
              toast.tone === "err"
                ? "border-[#D93025]/40 bg-[#FCE8E6] text-[#A50E0E]"
                : "border-[#417823]/30 bg-[#EAF3E4] text-[#417823]"
            }`}
          >
            <span>{toast.text}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Đóng thông báo"
              className="cursor-pointer px-2 text-lg leading-none"
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8">
        {loadingData && !data ? (
          <p className="py-12 text-center text-[15px] text-[#5B647A]">
            Đang tải dữ liệu cửa hàng...
          </p>
        ) : null}

        {/* ================================================================ */}
        {/* TAB 1: OVERVIEW                                                  */}
        {/* ================================================================ */}
        {activeTab === "overview" && data && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-[26px] font-bold">Tổng quan cửa hàng</h1>
                <p className="text-[14px] text-[#5B647A]">
                  Mọi chỉnh sửa tại đây sẽ cập nhật trực tiếp ra trang web bán hàng.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setProductModalOpen(true);
                  }}
                  className="min-h-[46px] cursor-pointer rounded-xl bg-[#283455] px-5 text-[14px] font-bold text-white hover:bg-[#1D2742]"
                >
                  + Thêm sản phẩm mới
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("layout")}
                  className="min-h-[46px] cursor-pointer rounded-xl border border-[#283455] bg-white px-5 text-[14px] font-bold text-[#283455] hover:bg-[#F9F3ED]"
                >
                  Sửa Bố cục &amp; Video Trang chủ
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#E5E0DB] bg-white p-5">
                <p className="text-[13px] font-bold text-[#5B647A]">Sản phẩm đang bán</p>
                <p className="mt-2 text-[30px] font-bold text-[#283455]">
                  {data.stats.activeProducts}
                  <span className="text-[16px] font-normal text-[#5B647A]">
                    {" "}
                    / {data.stats.totalProducts}
                  </span>
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E0DB] bg-white p-5">
                <p className="text-[13px] font-bold text-[#5B647A]">Đơn chờ xác nhận</p>
                <p className="mt-2 text-[30px] font-bold text-[#B65B18]">
                  {data.stats.pendingOrders}
                  <span className="text-[16px] font-normal text-[#5B647A]">
                    {" "}
                    / {data.stats.totalOrders} đơn
                  </span>
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E0DB] bg-white p-5">
                <p className="text-[13px] font-bold text-[#5B647A]">Doanh thu đơn hàng</p>
                <p className="mt-2 text-[26px] font-bold text-[#417823]">
                  {data.stats.revenueVnd.toLocaleString("vi-VN")}₫
                </p>
                <p className="text-[12.5px] text-[#5B647A]">
                  Tương đương ${data.stats.revenueUsd.toLocaleString("en-US")} USD
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E0DB] bg-white p-5">
                <p className="text-[13px] font-bold text-[#5B647A]">Tỷ giá VNĐ hiện tại</p>
                <p className="mt-2 text-[26px] font-bold text-[#283455]">
                  {data.settings.vndRate.toLocaleString("vi-VN")}₫
                </p>
                <p className="text-[12.5px] text-[#5B647A]">cho mỗi 1 USD ($)</p>
              </div>
            </div>

            {/* Storage Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#DDE3EC] bg-[#F9F3ED] p-5">
              <div>
                <p className="text-[15px] font-bold text-[#283455]">
                  {data.mode === "supabase"
                    ? "Đang đồng bộ trực tiếp với Supabase"
                    : "Đang chạy chế độ Local Demo (lưu trên máy)"}
                </p>
                <p className="mt-1 text-[13.5px] text-[#3D4866]">
                  {data.mode === "supabase"
                    ? "Toàn bộ sản phẩm, ảnh tải lên và đơn hàng đang được lưu an toàn trên Supabase."
                    : "Bạn có thể thoải mái thêm/sửa sản phẩm, tải ảnh và đặt thử đơn hàng ngay bây giờ. Khi sẵn sàng đưa lên mạng, chỉ cần dán khóa Supabase vào .env.local là chạy thật."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className="min-h-[42px] shrink-0 cursor-pointer rounded-xl bg-white px-4 text-[13.5px] font-bold text-[#283455] shadow-xs hover:bg-[#283455] hover:text-white"
              >
                Xem hướng dẫn nối Supabase &rarr;
              </button>
            </div>

            {/* Recent Orders */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 id="recent-orders-heading" className="text-[19px] font-bold">
                  Đơn hàng gần đây
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="cursor-pointer text-[13.5px] font-bold text-[#283455] underline"
                >
                  Xem tất cả đơn hàng
                </button>
              </div>

              <div
                tabIndex={0}
                role="region"
                aria-labelledby="recent-orders-heading"
                className="admin-table-wrapper"
              >
                <table className="admin-table">
                  <caption className="visually-hidden">
                    Danh sách đơn hàng gần đây
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Mã đơn</th>
                      <th scope="col">Khách hàng</th>
                      <th scope="col">Tổng tiền</th>
                      <th scope="col">Trạng thái</th>
                      <th scope="col">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.slice(0, 5).map((ord) => {
                      const meta = ORDER_STATUS_META[ord.status];
                      const ordVnd = Math.round(
                        ord.totalUsd * (ord.vndRateAtOrder || vndRate)
                      );
                      return (
                        <tr key={ord.id}>
                          <th scope="row" className="font-mono text-[13.5px]">
                            {ord.id}
                          </th>
                          <td data-label="Khách hàng">
                            <div className="text-right sm:text-left">
                              <p className="font-bold">{ord.customerName}</p>
                              <p className="text-[12.5px] text-[#5B647A]">
                                {ord.customerPhone || ord.customerEmail}
                              </p>
                            </div>
                          </td>
                          <td data-label="Tổng tiền" className="font-bold">
                            {ordVnd.toLocaleString("vi-VN")}₫
                          </td>
                          <td data-label="Trạng thái">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-[12px] font-bold ${meta.badgeClass}`}
                            >
                              {meta.label}
                            </span>
                          </td>
                          <td data-label="Thao tác">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(ord)}
                              className="cursor-pointer rounded-lg border border-[#283455] px-3 py-1.5 text-[13px] font-bold text-[#283455] hover:bg-[#283455] hover:text-white"
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {data.orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-[#5B647A]">
                          Chưa có đơn hàng nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 1B: HOMEPAGE LAYOUT & HEADER MENU BUILDER                    */}
        {/* ================================================================ */}
        {activeTab === "layout" && data && (
          <HomepageBuilderTab
            settings={data.settings}
            products={data.products}
            categories={data.categories}
            onSaveSettingsPatch={handleSaveSettingsPatch}
            onJumpToCategories={() => requestTab("categories")}
            onDirtyChange={setLayoutDirty}
          />
        )}

        {/* ================================================================ */}
        {/* TAB 2: PRODUCTS                                                  */}
        {/* ================================================================ */}
        {activeTab === "products" && data && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 id="products-table-heading" className="text-[26px] font-bold">
                  Quản lý sản phẩm ({filteredProducts.length})
                </h1>
                <p className="text-[14px] text-[#5B647A]">
                  Thêm sản phẩm mới, tải ảnh, chỉnh giá VNĐ/USD, đổi màu sắc hoặc tạm ẩn.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setProductModalOpen(true);
                }}
                className="min-h-[48px] cursor-pointer rounded-xl bg-[#283455] px-5 text-[14px] font-bold text-white hover:bg-[#1D2742]"
              >
                + Thêm sản phẩm mới
              </button>
            </div>

            {/* Search & Filter Landmark */}
            <search className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E5E0DB] bg-white p-4">
              <div className="min-w-[220px] flex-1">
                <label htmlFor="admin-prod-search" className="visually-hidden">
                  Tìm kiếm sản phẩm
                </label>
                <input
                  id="admin-prod-search"
                  type="search"
                  spellCheck={false}
                  enterKeyHint="search"
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Tìm theo tên tiếng Việt, tiếng Anh hoặc slug..."
                  className="admin-input w-full rounded-xl border border-[#8E96A8] px-3.5"
                />
              </div>

              <div className="w-full sm:w-64">
                <label htmlFor="admin-prod-cat" className="visually-hidden">
                  Lọc theo danh mục
                </label>
                <select
                  id="admin-prod-cat"
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="admin-input w-full rounded-xl border border-[#8E96A8] px-3.5"
                >
                  <option value="all">Tất cả danh mục</option>
                  {data.categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.titleVi}
                    </option>
                  ))}
                </select>
              </div>
            </search>

            {/* Responsive Products Table */}
            <div
              tabIndex={0}
              role="region"
              aria-labelledby="products-table-heading"
              className="admin-table-wrapper"
            >
              <table className="admin-table">
                <caption className="visually-hidden">
                  Danh sách sản phẩm trong cửa hàng
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Thứ tự</th>
                    <th scope="col">Sản phẩm</th>
                    <th scope="col">Danh mục</th>
                    <th scope="col">Giá bán</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, idx) => {
                    const canReorder =
                      productQuery.trim() === "" && productCategoryFilter === "all";
                    return (
                    <tr key={p.id}>
                      <td data-label="Thứ tự">
                        <div className="flex items-center gap-1">
                          <span className="w-6 text-[13px] font-bold text-[#5B647A]">
                            #{idx + 1}
                          </span>
                          {canReorder && (
                            <>
                              <button
                                type="button"
                                disabled={idx === 0}
                                aria-label={`Đưa ${p.titleVi} lên trên`}
                                onClick={() => void handleMoveProduct(idx, -1)}
                                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#C9CFD9] bg-white text-[13px] font-bold text-[#283455] hover:bg-[#F9F3ED] disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                disabled={idx === filteredProducts.length - 1}
                                aria-label={`Đưa ${p.titleVi} xuống dưới`}
                                onClick={() => void handleMoveProduct(idx, 1)}
                                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#C9CFD9] bg-white text-[13px] font-bold text-[#283455] hover:bg-[#F9F3ED] disabled:opacity-30"
                              >
                                ↓
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                      <th scope="row">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.mainImage}
                            alt={p.titleVi}
                            className="h-12 w-12 shrink-0 rounded-lg border border-[#ECE7E2] bg-[#F4F4F6] object-cover"
                          />
                          <div className="min-w-0">
                            <p className="max-w-[260px] truncate text-[14.5px] font-bold text-[#283455]">
                              {p.titleVi}
                            </p>
                            <p className="max-w-[260px] truncate text-[12px] font-normal text-[#5B647A]">
                              {p.titleEn}
                            </p>
                          </div>
                        </div>
                      </th>
                      <td data-label="Danh mục">
                        <span className="rounded-lg bg-[#F9F3ED] px-2.5 py-1 text-[12.5px] font-bold text-[#283455]">
                          {categoryLabelMap.get(p.categorySlug) || p.categorySlug}
                        </span>
                      </td>
                      <td data-label="Giá bán">
                        <div className="text-right sm:text-left">
                          <p className="font-bold text-[#283455]">
                            {formatVnd(p.salePriceUsd)}
                          </p>
                          <p className="text-[12px] text-[#5B647A]">
                            ${p.salePriceUsd} USD
                            {p.originalPriceUsd > p.salePriceUsd
                              ? ` · Gốc ${formatVnd(p.originalPriceUsd)}`
                              : ""}
                          </p>
                        </div>
                      </td>
                      <td data-label="Trạng thái">
                        <button
                          type="button"
                          onClick={() => void handleToggleProductActive(p)}
                          className={`cursor-pointer rounded-full px-3 py-1 text-[12px] font-bold ${
                            p.active
                              ? "bg-[#EAF3E4] text-[#417823]"
                              : "bg-[#EFEAE4] text-[#5B647A]"
                          }`}
                        >
                          {p.active ? "Đang bán" : "Đang ẩn"}
                        </button>
                      </td>
                      <td data-label="Thao tác">
                        <div className="flex flex-wrap items-center justify-end gap-2 sm:justify-start">
                          <Link
                            href={`/products/${p.slug}?lang=vi`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-[#D4D8E0] px-2.5 py-1.5 text-[12.5px] font-bold text-[#5B647A] hover:border-[#283455] hover:text-[#283455]"
                          >
                            Xem
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(p);
                              setProductModalOpen(true);
                            }}
                            className="cursor-pointer rounded-lg border border-[#283455] px-3 py-1.5 text-[12.5px] font-bold text-[#283455] hover:bg-[#283455] hover:text-white"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDeleteProduct(p)}
                            className="cursor-pointer rounded-lg border border-[#D93025]/40 px-2.5 py-1.5 text-[12.5px] font-bold text-[#A50E0E] hover:bg-[#FCE8E6]"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-[#5B647A]">
                        Không tìm thấy sản phẩm phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: CATEGORIES                                                */}
        {/* ================================================================ */}
        {activeTab === "categories" && data && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 id="categories-table-heading" className="text-[26px] font-bold">
                  Quản lý danh mục ({data.categories.length})
                </h1>
                <p className="text-[14px] text-[#5B647A]">
                  Tùy chỉnh tên danh mục song ngữ, mô tả banner và đường dẫn bộ sưu tập.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryModalOpen(true);
                }}
                className="min-h-[48px] cursor-pointer rounded-xl bg-[#283455] px-5 text-[14px] font-bold text-white hover:bg-[#1D2742]"
              >
                + Thêm danh mục mới
              </button>
            </div>

            <div
              tabIndex={0}
              role="region"
              aria-labelledby="categories-table-heading"
              className="admin-table-wrapper"
            >
              <table className="admin-table">
                <caption className="visually-hidden">Danh sách danh mục sản phẩm</caption>
                <thead>
                  <tr>
                    <th scope="col">Thứ tự</th>
                    <th scope="col">Tên danh mục</th>
                    <th scope="col">Đường dẫn</th>
                    <th scope="col">Nổi bật trang chủ</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categories.map((cat, idx) => (
                    <tr key={cat.slug}>
                      <td data-label="Thứ tự">
                        <div className="flex items-center gap-1">
                          <span className="w-6 text-[13px] font-bold text-[#5B647A]">
                            #{idx + 1}
                          </span>
                          <button
                            type="button"
                            disabled={idx === 0}
                            aria-label={`Đưa danh mục ${cat.titleVi} lên trên`}
                            onClick={() => void handleMoveCategory(idx, -1)}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#C9CFD9] bg-white text-[13px] font-bold text-[#283455] hover:bg-[#F9F3ED] disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={idx === data.categories.length - 1}
                            aria-label={`Đưa danh mục ${cat.titleVi} xuống dưới`}
                            onClick={() => void handleMoveCategory(idx, 1)}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#C9CFD9] bg-white text-[13px] font-bold text-[#283455] hover:bg-[#F9F3ED] disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>
                      </td>
                      <th scope="row">
                        <div className="flex items-center gap-2.5">
                          {cat.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cat.image}
                              alt=""
                              className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-bold text-[#283455]">{cat.titleVi}</p>
                            <p className="text-[12px] font-normal text-[#5B647A]">
                              {cat.titleEn}
                            </p>
                          </div>
                        </div>
                      </th>
                      <td data-label="Đường dẫn" className="font-mono text-[13px]">
                        <Link
                          href={`/collections/${cat.slug}?lang=vi`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:text-[#283455]"
                        >
                          /collections/{cat.slug}
                        </Link>
                      </td>
                      <td data-label="Nổi bật trang chủ">
                        <button
                          type="button"
                          aria-pressed={cat.showOnHome}
                          onClick={() => void handleToggleCategoryHome(cat)}
                          className={`cursor-pointer rounded-full px-3 py-1 text-[12px] font-bold ${
                            cat.showOnHome
                              ? "bg-[#DBEAFE] text-[#1E40AF]"
                              : "bg-[#F3F4F6] text-[#6E7485]"
                          }`}
                        >
                          {cat.showOnHome ? "Hiện trang chủ" : "Không"}
                        </button>
                      </td>
                      <td data-label="Trạng thái">
                        <span
                          className={`rounded-full px-3 py-1 text-[12px] font-bold ${
                            cat.active
                              ? "bg-[#EAF3E4] text-[#417823]"
                              : "bg-[#EFEAE4] text-[#5B647A]"
                          }`}
                        >
                          {cat.active ? "Đang bật" : "Đang ẩn"}
                        </span>
                      </td>
                      <td data-label="Thao tác">
                        <div className="flex items-center justify-end gap-2 sm:justify-start">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(cat);
                              setCategoryModalOpen(true);
                            }}
                            className="cursor-pointer rounded-lg border border-[#283455] px-3 py-1.5 text-[12.5px] font-bold text-[#283455] hover:bg-[#283455] hover:text-white"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDeleteCategory(cat)}
                            className="cursor-pointer rounded-lg border border-[#D93025]/40 px-2.5 py-1.5 text-[12.5px] font-bold text-[#A50E0E] hover:bg-[#FCE8E6]"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: ORDERS                                                    */}
        {/* ================================================================ */}
        {activeTab === "orders" && data && (
          <div className="space-y-5">
            <div>
              <h1 id="orders-table-heading" className="text-[26px] font-bold">
                Quản lý đơn hàng ({filteredOrders.length})
              </h1>
              <p className="text-[14px] text-[#5B647A]">
                Đơn khách đặt tại trang /checkout sẽ tự động hiển thị tại đây.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "all", label: "Tất cả" },
                  { id: "pending", label: "Chờ xác nhận" },
                  { id: "confirmed", label: "Đã xác nhận" },
                  { id: "shipping", label: "Đang giao" },
                  { id: "completed", label: "Hoàn thành" },
                  { id: "cancelled", label: "Đã hủy" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setOrderStatusFilter(f.id)}
                  className={`min-h-[40px] cursor-pointer rounded-full px-4 text-[13px] font-bold transition-colors ${
                    orderStatusFilter === f.id
                      ? "bg-[#283455] text-white"
                      : "border border-[#D4D8E0] bg-white text-[#283455] hover:bg-[#F9F3ED]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div
              tabIndex={0}
              role="region"
              aria-labelledby="orders-table-heading"
              className="admin-table-wrapper"
            >
              <table className="admin-table">
                <caption className="visually-hidden">Danh sách đơn hàng</caption>
                <thead>
                  <tr>
                    <th scope="col">Mã đơn</th>
                    <th scope="col">Khách hàng</th>
                    <th scope="col">Thanh toán</th>
                    <th scope="col">Tổng tiền</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => {
                    const meta = ORDER_STATUS_META[ord.status];
                    const ordVnd = Math.round(
                      ord.totalUsd * (ord.vndRateAtOrder || vndRate)
                    );
                    return (
                      <tr key={ord.id}>
                        <th scope="row">
                          <p className="font-mono text-[13.5px] font-bold">{ord.id}</p>
                          <p className="text-[12px] font-normal text-[#5B647A]">
                            {new Date(ord.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                        </th>
                        <td data-label="Khách hàng">
                          <div className="text-right sm:text-left">
                            <p className="font-bold">{ord.customerName}</p>
                            <p className="text-[12.5px] text-[#5B647A]">
                              {ord.customerPhone || ord.customerEmail} &middot; {ord.city}
                            </p>
                          </div>
                        </td>
                        <td data-label="Thanh toán">
                          <span className="text-[13px] font-bold">
                            {ord.paymentMethod === "bank_transfer"
                              ? "Chuyển khoản"
                              : "COD"}
                          </span>
                        </td>
                        <td data-label="Tổng tiền">
                          <div className="text-right sm:text-left">
                            <p className="font-bold">
                              {ordVnd.toLocaleString("vi-VN")}₫
                            </p>
                            <p className="text-[12px] text-[#5B647A]">
                              {ord.items.length} sản phẩm
                            </p>
                          </div>
                        </td>
                        <td data-label="Trạng thái">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-[12px] font-bold ${meta.badgeClass}`}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td data-label="Thao tác">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="cursor-pointer rounded-lg border border-[#283455] px-3 py-1.5 text-[13px] font-bold text-[#283455] hover:bg-[#283455] hover:text-white"
                          >
                            Xem &amp; Xử lý
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-[#5B647A]">
                        Chưa có đơn hàng nào ở trạng thái này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 5: SETTINGS & SUPABASE CONNECTION GUIDE                      */}
        {/* ================================================================ */}
        {activeTab === "settings" && settingsDraft && data && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <form
              onSubmit={handleSaveSettings}
              className="space-y-6 rounded-2xl border border-[#E5E0DB] bg-white p-6"
            >
              <div>
                <h1 className="text-[24px] font-bold">Trang chủ &amp; Cài đặt chung</h1>
                <p className="text-[13.5px] text-[#5B647A]">
                  Chỉnh tỷ giá VNĐ, ưu đãi freeship, dòng thông báo đầu trang và tài khoản nhận chuyển khoản.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="st-name" className="block text-[13.5px] font-bold">
                    Tên cửa hàng
                  </label>
                  <input
                    id="st-name"
                    type="text"
                    value={settingsDraft.storeName}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, storeName: e.target.value })
                    }
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
                  />
                </div>
                <div>
                  <label htmlFor="st-rate" className="block text-[13.5px] font-bold">
                    Tỷ giá quy đổi (1 USD = ? VNĐ)
                  </label>
                  <input
                    id="st-rate"
                    type="text"
                    inputMode="numeric"
                    value={settingsDraft.vndRate}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        vndRate: Number(e.target.value.replace(/[^0-9]/g, "")) || 25000,
                      })
                    }
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="st-fs" className="block text-[13px] font-bold">
                    Freeship từ (USD)
                  </label>
                  <input
                    id="st-fs"
                    type="text"
                    inputMode="numeric"
                    value={settingsDraft.freeShippingThresholdUsd}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        freeShippingThresholdUsd:
                          Number(e.target.value.replace(/[^0-9]/g, "")) || 0,
                      })
                    }
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
                  />
                  <p className="mt-1 text-[12px] text-[#5B647A]">
                    = {(settingsDraft.freeShippingThresholdUsd * settingsDraft.vndRate).toLocaleString("vi-VN")}₫
                  </p>
                </div>

                <div>
                  <label htmlFor="st-fg" className="block text-[13px] font-bold">
                    Tặng túi từ (USD)
                  </label>
                  <input
                    id="st-fg"
                    type="text"
                    inputMode="numeric"
                    value={settingsDraft.freeGiftThresholdUsd}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        freeGiftThresholdUsd:
                          Number(e.target.value.replace(/[^0-9]/g, "")) || 0,
                      })
                    }
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
                  />
                  <p className="mt-1 text-[12px] text-[#5B647A]">
                    = {(settingsDraft.freeGiftThresholdUsd * settingsDraft.vndRate).toLocaleString("vi-VN")}₫
                  </p>
                </div>

                <div>
                  <label htmlFor="st-ship" className="block text-[13px] font-bold">
                    Phí ship mặc định (USD)
                  </label>
                  <input
                    id="st-ship"
                    type="text"
                    inputMode="numeric"
                    value={settingsDraft.shippingFeeUsd}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        shippingFeeUsd:
                          Number(e.target.value.replace(/[^0-9]/g, "")) || 0,
                      })
                    }
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5"
                  />
                  <p className="mt-1 text-[12px] text-[#5B647A]">
                    = {(settingsDraft.shippingFeeUsd * settingsDraft.vndRate).toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="st-ann-vi" className="block text-[13.5px] font-bold">
                    Thanh thông báo đầu trang — Tiếng Việt (mỗi dòng 1 slide)
                  </label>
                  <textarea
                    id="st-ann-vi"
                    rows={3}
                    value={settingsDraft.announcementVi.join("\n")}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        announcementVi: e.target.value.split("\n"),
                      })
                    }
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2.5 text-[14px]"
                  />
                </div>
                <div>
                  <label htmlFor="st-ann-en" className="block text-[13.5px] font-bold">
                    Thanh thông báo đầu trang — Tiếng Anh (mỗi dòng 1 slide)
                  </label>
                  <textarea
                    id="st-ann-en"
                    rows={3}
                    value={settingsDraft.announcementEn.join("\n")}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        announcementEn: e.target.value.split("\n"),
                      })
                    }
                    className="admin-input mt-1.5 w-full rounded-xl border border-[#8E96A8] px-3.5 py-2.5 text-[14px]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DDE3EC] bg-[#F9F3ED] p-4 text-[13.5px]">
                <p className="text-[#3D4866]">
                  Muốn thay <strong>Video/Ảnh Hero chính</strong>, sắp xếp thứ tự khối hoặc chỉnh <strong>Thanh Menu</strong>?
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("layout")}
                  className="min-h-[40px] shrink-0 cursor-pointer rounded-xl bg-[#283455] px-4 text-[13px] font-bold text-white"
                >
                  Mở Bố cục Trang chủ →
                </button>
              </div>

              {/* Bank Transfer Info */}
              <fieldset className="space-y-3 rounded-xl border border-[#E5E0DB] bg-[#FDFAF8] p-4">
                <legend className="px-1 text-[13.5px] font-bold text-[#283455]">
                  Thông tin chuyển khoản &amp; Liên hệ (hiển thị tại trang Thanh toán)
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label htmlFor="st-bank" className="block text-[12.5px] font-bold">
                      Ngân hàng
                    </label>
                    <input
                      id="st-bank"
                      type="text"
                      value={settingsDraft.bankName}
                      onChange={(e) =>
                        setSettingsDraft({ ...settingsDraft, bankName: e.target.value })
                      }
                      className="admin-input mt-1 w-full rounded-xl border border-[#8E96A8] px-3"
                    />
                  </div>
                  <div>
                    <label htmlFor="st-stk" className="block text-[12.5px] font-bold">
                      Số tài khoản
                    </label>
                    <input
                      id="st-stk"
                      type="text"
                      value={settingsDraft.bankAccountNo}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          bankAccountNo: e.target.value,
                        })
                      }
                      className="admin-input mt-1 w-full rounded-xl border border-[#8E96A8] px-3 font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="st-owner" className="block text-[12.5px] font-bold">
                      Chủ tài khoản
                    </label>
                    <input
                      id="st-owner"
                      type="text"
                      value={settingsDraft.bankAccountName}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          bankAccountName: e.target.value,
                        })
                      }
                      className="admin-input mt-1 w-full rounded-xl border border-[#8E96A8] px-3"
                    />
                  </div>
                </div>
              </fieldset>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {data.mode === "local" ? (
                  <button
                    type="button"
                    onClick={requestResetLocal}
                    className="min-h-[46px] cursor-pointer rounded-xl border border-[#D93025]/40 px-4 text-[13.5px] font-bold text-[#A50E0E] hover:bg-[#FCE8E6]"
                  >
                    Khôi phục dữ liệu mẫu
                  </button>
                ) : (
                  <div />
                )}
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="min-h-[48px] cursor-pointer rounded-xl bg-[#283455] px-7 text-[14.5px] font-bold text-white hover:bg-[#1D2742] disabled:opacity-60"
                >
                  {savingSettings ? "Đang lưu..." : "Lưu cài đặt"}
                </button>
              </div>
            </form>

            {/* Right Column: 3-step Supabase Upgrade Guide */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-[#DDE3EC] bg-white p-6">
                <p className="inline-block rounded-full bg-[#EAF3E4] px-3 py-1 text-[12px] font-bold text-[#417823]">
                  Sẵn sàng chạy thật
                </p>
                <h2 className="mt-3 text-[19px] font-bold text-[#283455]">
                  3 bước kết nối Supabase
                </h2>
                <p className="mt-1 text-[13.5px] text-[#5B647A]">
                  Toàn bộ code API đã hỗ trợ tự động chuyển sang Supabase — không cần sửa thêm code.
                </p>

                <ol className="mt-4 list-decimal space-y-3 pl-5 text-[13.5px] text-[#3D4866]">
                  <li>
                    Tạo project miễn phí tại{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#283455] underline"
                    >
                      supabase.com
                    </a>{" "}
                    → vào <strong>SQL Editor</strong> chạy toàn bộ file{" "}
                    <code className="rounded bg-[#F3F4F6] px-1.5 py-0.5 font-mono text-[12px]">
                      supabase/schema.sql
                    </code>
                    .
                  </li>
                  <li>
                    Tạo file{" "}
                    <code className="rounded bg-[#F3F4F6] px-1.5 py-0.5 font-mono text-[12px]">
                      .env.local
                    </code>{" "}
                    (copy từ{" "}
                    <code className="rounded bg-[#F3F4F6] px-1.5 py-0.5 font-mono text-[12px]">
                      .env.example
                    </code>
                    ) và dán{" "}
                    <code className="font-mono text-[12px]">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
                    <code className="font-mono text-[12px]">SUPABASE_SERVICE_ROLE_KEY</code> cùng
                    email/mật khẩu Admin mới của bạn.
                  </li>
                  <li>
                    Chạy lệnh{" "}
                    <code className="rounded bg-[#F3F4F6] px-1.5 py-0.5 font-mono text-[12px]">
                      npm run seed:supabase
                    </code>{" "}
                    để đẩy sẵn toàn bộ sản phẩm mẫu lên database, sau đó khởi động lại web (hoặc deploy Vercel).
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Product Create/Edit Modal (<dialog>) */}
      <ProductModal
        open={productModalOpen}
        product={editingProduct}
        categories={data?.categories || []}
        vndRate={vndRate}
        onClose={() => setProductModalOpen(false)}
        onSaved={(saved, isNew) => {
          void fetchDashboard();
          showToast(
            isNew
              ? `Đã tạo sản phẩm mới "${saved.titleVi}".`
              : `Đã cập nhật sản phẩm "${saved.titleVi}".`
          );
        }}
      />

      {/* Category Create/Edit Modal (<dialog>) */}
      <CategoryModal
        open={categoryModalOpen}
        category={editingCategory}
        onClose={() => setCategoryModalOpen(false)}
        onSaved={(saved) => {
          void fetchDashboard();
          showToast(`Đã lưu danh mục "${saved.titleVi}".`);
        }}
      />

      {/* Order Detail Modal (<dialog>) */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdated={(updated) => {
          void fetchDashboard();
          showToast(`Đã cập nhật trạng thái đơn ${updated.id}.`);
        }}
      />

      {/* Destructive Action Confirmation Dialog (autofocus on safe Cancel button) */}
      <dialog
        ref={confirmDialogRef}
        aria-labelledby="confirm-dialog-title"
        onClose={() => {
          if (confirmDialogRef.current) confirmDialogRef.current.returnValue = "";
          setConfirmState(null);
        }}
        className="admin-dialog admin-dialog--sm"
      >
        {confirmState && (
          <div className="rounded-2xl bg-white p-6 text-[#283455] shadow-2xl">
            <h2 id="confirm-dialog-title" className="text-[19px] font-bold">
              {confirmState.title}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#5B647A]">
              {confirmState.message}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                autoFocus
                disabled={confirmBusy}
                onClick={() => setConfirmState(null)}
                className="min-h-[44px] cursor-pointer rounded-xl border border-[#C9CFD9] px-5 text-[14px] font-bold text-[#283455] hover:bg-[#F9F3ED]"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={confirmBusy}
                onClick={async () => {
                  setConfirmBusy(true);
                  try {
                    await confirmState.onConfirm();
                    setConfirmState(null);
                  } catch (err) {
                    showToast(
                      err instanceof Error ? err.message : "Thao tác thất bại.",
                      "err"
                    );
                  } finally {
                    setConfirmBusy(false);
                  }
                }}
                className="min-h-[44px] cursor-pointer rounded-xl bg-[#740103] px-5 text-[14px] font-bold text-white hover:bg-[#5A0102] disabled:opacity-60"
              >
                {confirmBusy ? "Đang xử lý..." : confirmState.confirmLabel}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
