import type { DailyMenu,  } from "@/app/types/menu";
import { PortionGroup } from "@/app/types/menu"

const GROUPS: PortionGroup[] = ["big", "small", "toddler", "preg", "breast"];

export function TotalPortionsCard({ total }: { total: number }) {
  return (
    <section className="card p-[22px] my-4">
      <div className="flex justify-between items-end gap-3 mb-[14px]">
        <div>
          <h2 className="m-0 text-navy text-[20px] font-bold">Total Porsi</h2>
          <p className="mt-1 text-muted text-[11px]">
            Jumlah porsi yang diproduksi hari ini.
          </p>
        </div>
      </div>
      <div className="bg-gradient-to-br from-soft to-[#edf7f2] border border-[#d9e8e1] rounded-2xl p-[18px] max-w-[360px]">
        <small className="text-muted text-[10px]">Total porsi hari ini</small>
        <strong className="block text-navy text-[32px] mt-1">
          {total.toLocaleString("id-ID")}
        </strong>
      </div>
    </section>
  );
}

export function NutritionGrid({ menu }: { menu: DailyMenu | null }) {
  const labs: [
    keyof NonNullable<DailyMenu["nutrition"]["big"]>,
    string,
    string,
  ][] = [
    ["e", "Energi", "kkal"],
    ["p", "Protein", "g"],
    ["l", "Lemak", "g"],
    ["c", "Karbohidrat", "g"],
    ["s", "Serat", "g"],
  ];

  return (
    <section className="card p-[22px] my-4">
      <div className="mb-[14px]">
        <h2 className="m-0 text-navy text-[20px] font-bold">
          Analisis Gizi per Porsi
        </h2>
        <p className="mt-1 text-muted text-[11px]">
          Nilai gizi dipisahkan berdasarkan kelompok porsi.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-[9px]">
        {GROUPS.map((k) => {
          const g = menu?.nutrition[k] ?? {};
          return (
            <div
              key={k}
              className="bg-white border border-line rounded-[15px] p-[13px]"
            >
              <h3 className="text-[12px] m-0 mb-[10px] text-navy font-semibold">
                {PortionGroup[k]}
              </h3>
              {labs.map(([key, label, unit]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-[#eef2f0] last:border-b-0 text-[10px]"
                >
                  <span className="text-muted">{label}</span>
                  <strong className="text-navy">
                    {g[key] ? `${g[key]} ${unit}` : "—"}
                  </strong>
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
    <section className="card p-[22px] my-4">
      <div className="mb-[14px]">
        <h2 className="m-0 text-navy text-[20px] font-bold">
          Jumlah Porsi per Kelompok
        </h2>
        <p className="mt-1 text-muted text-[11px]">
          Rincian produksi berdasarkan kelompok sasaran.
        </p>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-[9px]">
        {GROUPS.map((k) => (
          <div
            key={k}
            className="border border-line rounded-2xl p-[14px] text-center"
          >
            <b className="text-[11px]">{PortionGroup[k]}</b>
            <strong className="block text-green text-[24px] mt-[5px]">
              {(menu?.portions[k] ?? 0).toLocaleString("id-ID")}
            </strong>
            <small className="text-muted text-[9px]">porsi</small>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BenefitsCard({ benefits }: { benefits: string[] }) {
  return (
    <section className="card p-[22px] my-4">
      <div className="mb-[14px]">
        <h2 className="m-0 text-navy text-[20px] font-bold">
          Penerima Manfaat
        </h2>
        <p className="mt-1 text-muted text-[11px]">
          Kelompok penerima yang dilayani SPPG.
        </p>
      </div>
      <div className="flex flex-wrap gap-[7px]">
        {benefits.length > 0 ? (
          benefits.map((b, i) => (
            <span
              key={i}
              className="px-[11px] py-2 rounded-full bg-[#edf7f2] text-green border border-[#dceee6] text-[10px] font-extrabold"
            >
              {b}
            </span>
          ))
        ) : (
          <span className="text-muted text-[11px]">Belum ada data.</span>
        )}
      </div>
    </section>
  );
}
