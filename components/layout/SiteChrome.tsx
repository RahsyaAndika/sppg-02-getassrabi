"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import type { SiteSettings } from "@/lib/supabase/queries";

const CHROME_LESS_PREFIXES = ["/admin", "/login"];

export function SiteChrome({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome = CHROME_LESS_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}