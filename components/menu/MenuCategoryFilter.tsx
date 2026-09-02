"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORY_LABELS: Record<string, string> = {
  reguler: "Reguler",
  spesial: "Spesial",
};

export function MenuCategoryFilter({
  current,
  categories,
}: {
  current: string;
  categories: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.push(`/menu?${params.toString()}`);
  }

  if (categories.length <= 1) return null; // tidak perlu filter kalau kategori cuma 1 macam

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="border border-line rounded-full px-3 py-[10px] text-[12px] font-semibold text-navy bg-white"
    >
      <option value="all">Semua Kategori</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {CATEGORY_LABELS[cat] ?? cat}
        </option>
      ))}
    </select>
  );
}