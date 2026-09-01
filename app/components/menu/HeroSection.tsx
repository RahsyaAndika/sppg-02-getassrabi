function formatTanggal(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function HeroSection({ menuDate }: { menuDate: string }) {
  return (
    <div className="bg-gradient-to-br from-navy via-navy-light to-teal-dark text-white">
      <div className="max-w-[1080px] mx-auto px-[18px] py-[26px] md:py-[34px]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_290px] gap-6 items-end">
          <div>
            <span className="inline-block border border-white/[.15] bg-white/[.05] px-[10px] py-[7px] rounded-full text-[9px] tracking-wide font-extrabold uppercase">
              Informasi layanan harian
            </span>
            <h1 className="text-[33px] md:text-[42px] tracking-tight mt-[14px] mb-2 font-bold">
              Menu MBG Hari Ini
            </h1>
            <p className="max-w-[700px] text-[#dbe6ea] leading-relaxed text-[13px]">
              Informasi menu, kandungan gizi, jumlah porsi, batas konsumsi,
              dan penerima manfaat dalam satu halaman.
            </p>
          </div>
          <div className="border border-white/[.14] bg-white/[.05] rounded-2xl p-[15px] justify-self-start md:justify-self-auto">
            <small className="block text-[#cdd9df] text-[9px] uppercase tracking-wide">
              Tanggal layanan
            </small>
            <strong className="block text-[17px] mt-1">
              {formatTanggal(menuDate)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}