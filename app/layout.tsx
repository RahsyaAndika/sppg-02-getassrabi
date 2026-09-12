import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getSiteSettings } from "@/lib/supabase/queries";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display-raw",
  weight: ["400"],
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-raw",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: `${settings.nama_sppg} — Informasi Menu MBG`,
    description:
      "Portal informasi layanan Makan Bergizi Gratis SPPG Getassrabi 02: menu harian, kandungan gizi, dan jumlah porsi.",
    ...(settings.logo_url ? { icons: { icon: settings.logo_url } } : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="id" className={`${instrumentSerif.variable} ${plusJakarta.variable}`}>
      <body>
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}