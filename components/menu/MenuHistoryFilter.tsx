"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { HistoryRange } from "@/lib/supabase/queries";

const OPTIONS: { value: HistoryRange; label: string }[] = [
  { value: "week", label: "1 Minggu Terakhir" },
  { value: "month", label: "1 Bulan Terakhir" },
  { value: "3month", label: "3 Bulan Terakhir" },
  { value: "6month", label: "6 Bulan Terakhir" },
  { value: "year", label: "1 Tahun Terakhir" },
];

export function MenuHistoryFilter({ current }: { current: HistoryRange }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", value);
    router.push(`/menu?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="border border-line rounded-full px-3 py-[10px] text-[12px] font-semibold text-navy bg-white"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}