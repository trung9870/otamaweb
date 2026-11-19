"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CartProvider } from "./CartContext";
import { Header } from "./Header";
import { LanguageProvider } from "./LanguageContext";
import { QuickViewAndCart } from "./QuickViewAndCart";
import { StoreDataProvider } from "./StoreDataContext";
import { BrooklinenFooter } from "./TrustAndFooter";

export function BrooklinenShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <LanguageProvider>
      <StoreDataProvider>
        <CartProvider>
          <div id="top" className="flex min-h-screen flex-col bg-[#FDFAF8] text-[#283455]">
            <Header />
            <main className="flex-1">{children}</main>
            <BrooklinenFooter />
            <QuickViewAndCart />
          </div>
        </CartProvider>
      </StoreDataProvider>
    </LanguageProvider>
  );
}
