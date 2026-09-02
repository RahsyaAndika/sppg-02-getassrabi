"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/menu", label: "Riwayat Menu" },
  { href: "/login", label: "Admin" },
];

export function NavDropdown() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

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
        className="flex flex-col justify-center gap-[5px] w-[42px] h-[42px] rounded-full border border-white/[.16] bg-white/[.06]"
      >
        <span className="block h-[2px] w-[18px] bg-white mx-auto rounded-full" />
        <span className="block h-[2px] w-[18px] bg-white mx-auto rounded-full" />
        <span className="block h-[2px] w-[18px] bg-white mx-auto rounded-full" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]">
          <button
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 z-0 bg-navy/60 backdrop-blur-[2px]"
          />
          <div
            ref={panelRef}
            className="absolute right-0 top-0 z-10 h-full w-[78vw] max-w-[320px] bg-white shadow-[-16px_0_40px_rgba(18,42,76,0.18)] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-line bg-white">
              <span className="font-display text-navy text-[16px]">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="w-8 h-8 rounded-full flex items-center justify-center text-navy hover:bg-soft"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col px-2 py-3 bg-white">
              {MENU_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-[14px] rounded-xl text-[14px] font-medium ${
                      active ? "text-green bg-[#EEF6EF]" : "text-navy hover:bg-soft"
                    }`}
                  >
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