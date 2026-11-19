"use client";

import type { ReactNode } from "react";
import { CartProvider } from "./CartContext";
import { Header } from "./Header";
import { LanguageProvider } from "./LanguageContext";
import { QuickViewAndCart } from "./QuickViewAndCart";
import { BrooklinenFooter } from "./TrustAndFooter";

export function BrooklinenShell({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        <div id="top" className="flex min-h-screen flex-col bg-[#FDFAF8] text-[#283455]">
          <Header />
          <main className="flex-1">{children}</main>
          <BrooklinenFooter />
          <QuickViewAndCart />
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
