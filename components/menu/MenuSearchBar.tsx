"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function MenuSearchBar({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(current);

  // Debounce: tunggu 400ms setelah user berhenti mengetik, baru update URL.
  // Ini penting supaya nyaman dipakai di mobile — tidak reload tiap huruf.
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      router.push(`/menu?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari nama menu..."
        className="w-full border border-line rounded-full pl-9 pr-3 py-[10px] text-[12px] outline-none focus:border-navy"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}