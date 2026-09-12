"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  UtensilsCrossed,
  Megaphone,
  Newspaper,
  Settings,
  LogOut,
} from "lucide-react";

const ADMIN_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Kelola Menu", icon: UtensilsCrossed },
  { href: "/admin/pengumuman", label: "Pengumuman", icon: Megaphone },
  { href: "/admin/berita", label: "Berita", icon: Newspaper },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
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
      <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium">
        {ADMIN_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-[6px] px-3 py-2 rounded-full transition-colors ${
                active ? "bg-[#EEF6EF] text-green" : "text-navy hover:bg-soft"
              }`}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          );
        })}
        <form action="/api/auth/logout" method="post" className="ml-2">
          <button
            type="submit"
            className="flex items-center gap-[6px] px-3 py-2 rounded-full text-danger hover:bg-[#FDECEA] transition-colors"
          >
            <LogOut size={14} />
            Keluar
          </button>
        </form>
      </nav>

      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Buka menu admin"
        className="md:hidden flex items-center justify-center w-[40px] h-[40px] rounded-full border border-line bg-soft text-navy shrink-0"
      >
        <Menu size={18} />
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
              <span className="font-display text-navy text-[19px]">Menu Admin</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="w-8 h-8 rounded-full flex items-center justify-center text-navy hover:bg-soft"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="flex flex-col px-2 py-3 bg-white">
              {ADMIN_ITEMS.map((item) => {
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
            <div className="mt-auto p-4 border-t border-line bg-white">
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-[12px] rounded-xl text-[14px] font-medium text-danger hover:bg-[#FDECEA]"
                >
                  <LogOut size={16} />
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