"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { CartProvider } from "./CartContext";
import { Header } from "./Header";
import { LanguageProvider } from "./LanguageContext";
import { QuickViewAndCart } from "./QuickViewAndCart";
import { StoreDataProvider, useStoreData } from "./StoreDataContext";
import { BrooklinenFooter } from "./TrustAndFooter";

function ShellBody({ children }: { children: ReactNode }) {
  const { previewMode, selectPreviewSection } = useStoreData();

  // In the admin visual editor, clicks select a section instead of navigating
  const handlePreviewClick = (e: MouseEvent<HTMLDivElement>) => {
    const targetEl = e.target as HTMLElement;
    const sec = targetEl.closest("[data-section-id]");
    const id = sec?.getAttribute("data-section-id");
    if (targetEl.closest('[data-preview-interactive="true"]')) {
      if (id) selectPreviewSection(id);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (id) selectPreviewSection(id);
  };

  return (
    <div
      id="top"
      onClickCapture={previewMode ? handlePreviewClick : undefined}
      className="flex min-h-screen flex-col bg-[#FDFAF8] text-[#283455]"
    >
      {previewMode ? (
        <div data-section-id="header_nav" className="contents">
          <Header />
        </div>
      ) : (
        <Header />
      )}
      <main className="flex-1">{children}</main>
      <BrooklinenFooter />
      <QuickViewAndCart />
    </div>
  );
}

export function BrooklinenShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <LanguageProvider>
      <StoreDataProvider>
        <CartProvider>
          <ShellBody>{children}</ShellBody>
        </CartProvider>
      </StoreDataProvider>
    </LanguageProvider>
  );
}
