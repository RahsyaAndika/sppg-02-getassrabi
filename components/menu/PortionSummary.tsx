import type { DailyMenu } from "@/types/menu";
import { PortionGroup } from "@/types/menu";
import { Flame, Users } from "lucide-react";

const GROUPS: PortionGroup[] = ["big", "small", "toddler", "preg", "breast"];

export function NutritionGrid({ menu }: { menu: DailyMenu | null }) {
  const labs: [keyof NonNullable<DailyMenu["nutrition"]["big"]>, string, string][] = [
    ["e", "Energi", "kkal"],
    ["p", "Protein", "g"],
    ["l", "Lemak", "g"],
    ["c", "Karbohidrat", "g"],
    ["s", "Serat", "g"],
  ];

  return (
    <section className="card p-[24px] my-4">
      <div className="flex items-center gap-2 mb-1">
        <Flame size={17} className="text-gold" />
        <h2 className="font-display text-navy text-[20px] m-0">Analisis gizi per porsi</h2>
      </div>
      <p className="text-muted text-[12px] mb-4">Nilai gizi dipisahkan berdasarkan kelompok porsi.</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-[10px]">
        {GROUPS.map((k) => {
          const g = menu?.nutrition[k] ?? {};
          return (
            <div key={k} className="bg-soft border border-line rounded-[16px] p-[14px]">
              <h3 className="text-[12px] m-0 mb-[10px] text-navy font-medium">
                {PortionGroup[k]}
              </h3>
              {labs.map(([key, label, unit]) => (
                <div key={key} className="flex justify-between py-[7px] border-b border-line last:border-b-0 text-[11px]">
                  <span className="text-muted">{label}</span>
                  <strong className="text-navy">{g[key] ? `${g[key]} ${unit}` : "—"}</strong>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function PortionsPerGroup({ menu }: { menu: DailyMenu | null }) {
  return (
    <section className="card p-[24px] my-4">
      <div className="flex items-center gap-2 mb-1">
        <Users size={17} className="text-green" />
        <h2 className="font-display text-navy text-[20px] m-0">Jumlah porsi per kelompok</h2>
      </div>
      <p className="text-muted text-[12px] mb-4">Rincian produksi berdasarkan kelompok sasaran.</p>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-[10px]">
        {GROUPS.map((k) => (
          <div key={k} className="border border-line rounded-2xl p-[16px] text-center bg-soft">
            <b className="text-[12px] text-navy">{PortionGroup[k]}</b>
            <strong className="block font-display text-green text-[26px] mt-[6px]">
              {(menu?.portions[k] ?? 0).toLocaleString("id-ID")}
            </strong>
            <small className="text-muted text-[10px]">porsi</small>
          </div>
        ))}
      </div>
    </section>
  );
}