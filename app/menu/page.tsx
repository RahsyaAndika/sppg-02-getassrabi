import { HeroSection } from "@/components/menu/HeroSection";
import { MenuHistoryFilter } from "@/components/menu/MenuHistoryFilter";
import { MenuSearchBar } from "@/components/menu/MenuSearchBar";
import { MenuCategoryFilter } from "@/components/menu/MenuCategoryFilter";
import { MenuHistoryCard } from "@/components/menu/MenuHistoryCard";
import {
  getMenuHistory,
  getMenuCategories,
  type HistoryRange,
} from "@/lib/supabase/queries";

const VALID_RANGES: HistoryRange[] = ["week", "month", "3month", "6month", "year"];

export default async function MenuHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const range: HistoryRange = VALID_RANGES.includes(params.range as HistoryRange)
    ? (params.range as HistoryRange)
    : "week";
  const search = params.q ?? "";
  const category = params.category ?? "all";

  const [menus, categories] = await Promise.all([
    getMenuHistory(range, search, category),
    getMenuCategories(),
  ]);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <HeroSection menuDate={today} />
      <div className="max-w-[1080px] mx-auto px-[18px]">
        <div className="mt-5 mb-1">
          <h1 className="font-display text-navy text-[24px] m-0">Riwayat Menu</h1>
          <p className="text-muted text-[11px] mt-1">{menus.length} menu ditemukan</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <MenuSearchBar current={search} />
          <div className="flex gap-2">
            <MenuCategoryFilter current={category} categories={categories} />
            <MenuHistoryFilter current={range} />
          </div>
        </div>

        {menus.length === 0 ? (
          <div className="card p-10 text-center text-muted text-sm">
            {search
              ? `Tidak ada menu yang cocok dengan pencarian "${search}".`
              : "Belum ada menu untuk periode ini."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {menus.map((menu) => (
              <MenuHistoryCard
                key={menu.id}
                id={menu.id}
                menuDate={menu.menu_date}
                menuName={menu.menu_name}
                photoUrl={menu.photo_url}
                totalPortions={menu.total_portions}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}