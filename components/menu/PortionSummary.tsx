import type { DailyMenu,  } from "@/types/menu";
import { PortionGroup } from "@/types/menu";

const GROUPS: PortionGroup[] = ["big", "small", "toddler", "preg", "breast"];

export function TotalPortionsCard({ total }: { total: number }) {
  return (
    <section className="card p-[24px] my-4">
      <h2 className="font-display text-navy text-[20px] mb-1">Total porsi</h2>
      <p className="text-muted text-[12px] mb-4">Jumlah porsi yang diproduksi hari ini.</p>
      <div className="bg-soft border border-line rounded-2xl p-[20px] max-w-[360px]">
        <small className="text-muted text-[11px]">Total porsi hari ini</small>
        <strong className="block font-display text-navy text-[34px] mt-1">
          {total.toLocaleString("id-ID")}
        </strong>
      </div>
    </section>
  );
}

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
      <h2 className="font-display text-navy text-[20px] mb-1">Analisis gizi per porsi</h2>
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
      <h2 className="font-display text-navy text-[20px] mb-1">Jumlah porsi per kelompok</h2>
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

export function BenefitsCard({ benefits }: { benefits: string[] }) {
  return (
    <section className="card p-[24px] my-4">
      <h2 className="font-display text-navy text-[20px] mb-1">Penerima manfaat</h2>
      <p className="text-muted text-[12px] mb-4">Kelompok penerima yang dilayani SPPG.</p>
      <div className="flex flex-wrap gap-[8px]">
        {benefits.length > 0 ? (
          benefits.map((b, i) => (
            <span
              key={i}
              className="px-[12px] py-[7px] rounded-full bg-[#EEF6EF] text-green border border-[#DCEEE1] text-[11px] font-medium"
            >
              {b}
            </span>
          ))
        ) : (
          <span className="text-muted text-[12px]">Belum ada data.</span>
        )}
      </div>
    </section>
  );
}