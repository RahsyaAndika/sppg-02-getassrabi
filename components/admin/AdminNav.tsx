"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/menu", label: "Kelola Menu" },
  { href: "/admin/pengumuman", label: "Pengumuman" },
  { href: "/admin/berita", label: "Berita" },
  { href: "/admin/settings", label: "Pengaturan" },
];

export function AdminNav() {
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

  return (
    <>
      {/* Nav desktop */}
      <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium">
        {ADMIN_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-full transition-colors ${
                active ? "bg-[#EEF6EF] text-green" : "text-navy hover:bg-soft"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <form action="/api/auth/logout" method="post" className="ml-2">
          <button
            type="submit"
            className="px-3 py-2 rounded-full text-danger hover:bg-[#FDECEA] transition-colors"
          >
            Keluar
          </button>
        </form>
      </nav>

      {/* Hamburger mobile */}
      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Buka menu admin"
        className="md:hidden flex flex-col justify-center gap-[5px] w-[40px] h-[40px] rounded-full border border-line bg-soft shrink-0"
      >
        <span className="block h-[2px] w-[16px] bg-navy mx-auto rounded-full" />
        <span className="block h-[2px] w-[16px] bg-navy mx-auto rounded-full" />
        <span className="block h-[2px] w-[16px] bg-navy mx-auto rounded-full" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <button
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 z-0 bg-navy/60 backdrop-blur-[2px]"
          />
          <div className="absolute right-0 top-0 z-10 h-full w-[78vw] max-w-[300px] bg-white shadow-[-16px_0_40px_rgba(18,42,76,0.18)] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-line bg-white">
              <span className="font-display text-navy text-[16px]">Menu Admin</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="w-8 h-8 rounded-full flex items-center justify-center text-navy hover:bg-soft"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col px-2 py-3 bg-white">
              {ADMIN_ITEMS.map((item) => {
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
            <div className="mt-auto p-4 border-t border-line bg-white">
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="w-full text-center px-4 py-[12px] rounded-xl text-[14px] font-medium text-danger hover:bg-[#FDECEA]"
                >
                  Keluar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}