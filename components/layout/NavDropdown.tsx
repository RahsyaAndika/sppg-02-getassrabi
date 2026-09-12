"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, UserRound, CalendarDays, Newspaper, LogIn } from "lucide-react";

const MENU_ITEMS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/profil", label: "Profil", icon: UserRound },
  { href: "/menu", label: "Riwayat Menu", icon: CalendarDays },
  { href: "/berita", label: "Berita", icon: Newspaper },
  { href: "/login", label: "Admin", icon: LogIn },
];

export function NavDropdown() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Buka menu navigasi"
        className="flex items-center justify-center w-[42px] h-[42px] rounded-full border border-white/[.16] bg-white/[.06] text-white"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]">
          <button
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 z-0 bg-navy/60 backdrop-blur-[2px]"
          />
          <div className="absolute right-0 top-0 z-10 h-full w-[78vw] max-w-[320px] bg-white shadow-[-16px_0_40px_rgba(18,42,76,0.18)] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-line bg-white">
              <span className="font-display text-navy text-[19px]">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="w-8 h-8 rounded-full flex items-center justify-center text-navy hover:bg-soft"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="flex flex-col px-2 py-3 bg-white">
              {MENU_ITEMS.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-[14px] rounded-xl text-[14px] font-medium ${
                      active ? "text-green bg-[#EEF6EF]" : "text-navy hover:bg-soft"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto px-6 py-5 border-t border-line bg-white text-[11px] text-muted">
              SPPG Getassrabi 02 · Portal Menu MBG
            </div>
          </div>
        </div>
      )}
    </>
  );
}