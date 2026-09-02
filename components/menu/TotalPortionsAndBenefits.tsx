export function TotalPortionsAndBenefits({
  total,
  benefits,
}: {
  total: number;
  benefits: string[];
}) {
  return (
    <section className="card p-[24px] my-4">
      <h2 className="font-display text-navy text-[20px] mb-1">Total porsi</h2>
      <p className="text-muted text-[12px] mb-4">Jumlah porsi yang diproduksi hari ini.</p>
      <div className="bg-soft border border-line rounded-2xl p-[20px] max-w-[360px] mb-6">
        <small className="text-muted text-[11px]">Total porsi hari ini</small>
        <strong className="block font-display text-navy text-[34px] mt-1">
          {total.toLocaleString("id-ID")}
        </strong>
      </div>

      <h3 className="font-display text-navy text-[15px] mb-1">Penerima manfaat</h3>
      <p className="text-muted text-[12px] mb-3">Kelompok penerima yang dilayani SPPG.</p>
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