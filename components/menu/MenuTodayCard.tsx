import type { DailyMenu } from "@/types/menu";

const FOOD_LABELS = [
  "Makanan pokok",
  "Protein hewani",
  "Protein nabati",
  "Sayur",
  "Buah",
];

export function MenuTodayCard({ menu }: { menu: DailyMenu | null }) {
  const foods = menu
    ? [
        menu.foodMain,
        menu.foodAnimal,
        menu.foodPlant,
        menu.foodVegetable,
        menu.foodFruit,
      ]
    : ["—", "—", "—", "—", "—"];

  return (
    <section className="card p-[24px] md:p-[28px] my-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6">
        <div>
          <span className="inline-block px-[10px] py-[6px] rounded-full bg-[#EEF6EF] text-green text-[11px] font-medium">
            Menu hari ini
          </span>
          <h2 className="font-display text-navy text-[26px] md:text-[30px] mt-[12px] mb-[8px] leading-tight">
            {menu?.menuName ?? "Belum ada menu"}
          </h2>
          <p className="text-muted leading-relaxed text-[13px]">
            {menu?.description ?? "Admin belum mengisi menu hari ini."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[9px] mt-[20px]">
            {foods.map((food, i) => (
              <div
                key={i}
                className="bg-soft border border-line rounded-[14px] p-[12px] min-h-[86px]"
              >
                <small className="block text-muted text-[10px]">
                  {FOOD_LABELS[i]}
                </small>
                <b className="block text-navy text-[12px] leading-snug mt-[6px]">
                  {food}
                </b>
              </div>
            ))}
          </div>

          <div className="mt-[20px] flex gap-3 items-center p-4 bg-gold-bg border border-[#E9D68C] rounded-2xl">
            <div className="w-[42px] h-[42px] shrink-0 rounded-xl bg-white border border-[#E9D68C] flex items-center justify-center text-[#8A6C1B]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
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
            <img
              src={menu.photoUrl}
              alt="Foto menu"
              className="w-full h-full object-cover"
            />
          ) : (
            "Foto menu belum tersedia"
          )}
        </div>
      </div>
    </section>
  );
}