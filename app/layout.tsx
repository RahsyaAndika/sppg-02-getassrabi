import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/app/components/layout/navbar"
import { Footer } from "@/app/components/layout/footer"

export const metadata: Metadata = {
  title: "SPPG Getassrabi 02 — Informasi Menu MBG",
  description:
    "Portal informasi layanan Makan Bergizi Gratis SPPG Getassrabi 02: menu harian, kandungan gizi, dan jumlah porsi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}