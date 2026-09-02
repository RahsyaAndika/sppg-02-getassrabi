import Link from "next/link";
import { NavDropdown } from "./NavDropdown";
import type { SiteSettings } from "@/lib/supabase/queries";

export function Navbar({ settings }: { settings: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 bg-navy/95 backdrop-blur border-b border-white/[.08] text-white">
      <div className="max-w-[1080px] mx-auto px-[18px]">
        <div className="flex items-center justify-between py-[14px]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-[46px] h-[46px] rounded-[13px] bg-white p-1 overflow-hidden shrink-0">
              {settings.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logo_url}
                  alt={`Logo ${settings.nama_sppg}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-navy text-[9px] font-bold">
                  LOGO
                </div>
              )}
            </div>
            <div>
              <b className="block font-display text-[16px] tracking-tight">
                {settings.nama_sppg}
              </b>
              <small className="block text-[#B9C6D6] text-[10px] mt-[2px]">
                Dapur Makan Bergizi Gratis
              </small>
            </div>
          </Link>

          <NavDropdown />
        </div>
      </div>
    </header>
  );
}