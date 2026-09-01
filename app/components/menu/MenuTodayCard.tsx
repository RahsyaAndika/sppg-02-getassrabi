import type { DailyMenu } from "@/app/types/menu";

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
    <section className="card p-[22px] my-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-5">
        <div>
          <span className="inline-block px-[9px] py-[6px] rounded-full bg-[#edf7f2] text-green text-[9px] font-extrabold tracking-wide uppercase">
            Menu hari ini
          </span>
          <h2 className="text-[26px] md:text-[30px] text-navy mt-[10px] mb-[7px] font-bold">
            {menu?.menuName ?? "Belum ada menu"}
          </h2>
          <p className="text-muted leading-relaxed text-[12px]">
            {menu?.description ?? "Admin belum mengisi menu hari ini."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[9px] mt-[18px]">
            {foods.map((food, i) => (
              <div
                key={i}
                className="bg-soft border border-line rounded-[13px] p-[11px] min-h-[86px]"
              >
                <small className="block text-muted text-[8px] uppercase tracking-wide font-extrabold">
                  {FOOD_LABELS[i]}
                </small>
                <b className="block text-navy text-[11px] leading-snug mt-[6px]">
                  {food}
                </b>
              </div>
            ))}
          </div>

          <div className="mt-[18px] flex gap-3 items-center p-4 bg-gradient-to-br from-gold-bg to-[#fff1c9] border-2 border-gold rounded-2xl">
            <div className="w-[42px] h-[42px] shrink-0 rounded-xl bg-white border border-[#ebdca4] flex items-center justify-center text-[18px]">
              ⏰
            </div>
            <div>
              <small className="block text-[#8d6f1e] text-[9px] font-black tracking-wide uppercase">
                Batas konsumsi
              </small>
              <strong className="block text-navy text-[24px] leading-tight mt-[3px]">
                {menu?.consumptionLimit ?? "—"}
              </strong>
            </div>
          </div>
        </div>

        <div className="min-h-[220px] md:min-h-[286px] border border-line rounded-2xl bg-[#eef4f1] overflow-hidden flex items-center justify-center text-muted text-[11px]">
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
