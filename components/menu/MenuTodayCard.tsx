import type { DailyMenu } from "@/types/menu";
import { Wheat, Beef, Sprout, Leaf, Apple, Clock3, ChefHat } from "lucide-react";

const FOOD_META = [
  { label: "Makanan pokok", icon: Wheat },
  { label: "Protein hewani", icon: Beef },
  { label: "Protein nabati", icon: Sprout },
  { label: "Sayur", icon: Leaf },
  { label: "Buah", icon: Apple },
];

export function MenuTodayCard({ menu }: { menu: DailyMenu | null }) {
  const foods = menu
    ? [menu.foodMain, menu.foodAnimal, menu.foodPlant, menu.foodVegetable, menu.foodFruit]
    : ["—", "—", "—", "—", "—"];

  return (
    <section className="card p-[24px] md:p-[28px] my-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6">
        <div>
          <span className="inline-flex items-center gap-[6px] px-[10px] py-[6px] rounded-full bg-[#EEF6EF] text-green text-[11px] font-medium">
            <ChefHat size={13} />
            Menu hari ini
          </span>
          <h2 className="font-display text-navy text-[27px] md:text-[31px] mt-[12px] mb-[8px] leading-tight">
            {menu?.menuName ?? "Belum ada menu"}
          </h2>
          <p className="text-muted leading-relaxed text-[13px]">
            {menu?.description ?? "Admin belum mengisi menu hari ini."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[9px] mt-[20px]">
            {foods.map((food, i) => {
              const Icon = FOOD_META[i].icon;
              return (
                <div key={i} className="bg-soft border border-line rounded-[14px] p-[12px] min-h-[92px]">
                  <div className="w-[26px] h-[26px] rounded-[8px] bg-white border border-line flex items-center justify-center text-green mb-2">
                    <Icon size={14} />
                  </div>
                  <small className="block text-muted text-[10px]">{FOOD_META[i].label}</small>
                  <b className="block text-navy text-[12px] leading-snug mt-[3px]">{food}</b>
                </div>
              );
            })}
          </div>

          <div className="mt-[20px] flex gap-3 items-center p-4 bg-gold-bg border border-[#E9D68C] rounded-2xl">
            <div className="w-[42px] h-[42px] shrink-0 rounded-xl bg-white border border-[#E9D68C] flex items-center justify-center text-[#8A6C1B]">
              <Clock3 size={18} />
            </div>
            <div>
              <small className="block text-[#8A6C1B] text-[11px] font-medium">
                Batas konsumsi
              </small>
              <strong className="block text-navy text-[22px] leading-tight mt-[3px]">
                {menu?.consumptionLimit ?? "—"}
              </strong>
            </div>
          </div>
        </div>

        <div className="min-h-[220px] md:min-h-[300px] border border-line rounded-2xl bg-soft overflow-hidden flex items-center justify-center text-muted text-[12px]">
          {menu?.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={menu.photoUrl} alt="Foto menu" className="w-full h-full object-cover" />
          ) : (
            "Foto menu belum tersedia"
          )}
        </div>
      </div>
    </section>
  );
}