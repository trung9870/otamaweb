import type { Metadata } from "next";
import { BrooklinenShell } from "@/components/sites/brooklinen/BrooklinenShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxury Bedding, Sheets & Comforters Online | Brooklinen",
  description:
    "Brooklinen creates simple, beautiful, high quality luxury bedding and home essentials at a fair price. 25% Off Sitewide Black Friday Sale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FDFAF8] text-[#283455] font-brandon">
        <BrooklinenShell>{children}</BrooklinenShell>
      </body>
    </html>
  );
}
