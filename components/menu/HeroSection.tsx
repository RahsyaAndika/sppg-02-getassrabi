import { UtensilsCrossed } from "lucide-react";

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
    <div
      className="relative overflow-hidden bg-navy text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.06) 0, transparent 45%), radial-gradient(circle at 85% 80%, rgba(201,162,39,0.12) 0, transparent 50%)",
      }}
    >
      <div className="max-w-[1080px] mx-auto px-[18px] py-[38px] md:py-[54px]">
        <div className="flex items-center gap-2 text-[#9FB0C4] text-[13px] mb-3">
          <UtensilsCrossed size={14} />
          <span>{formatTanggal(menuDate)}</span>
        </div>
        <h1 className="font-display text-[36px] md:text-[50px] leading-[1.08] tracking-tight max-w-[560px]">
          Menu Makan Bergizi Gratis
        </h1>
        <p className="mt-4 text-[#C4D0DD] text-[14px] leading-relaxed max-w-[520px]">
          Kandungan gizi, jumlah porsi, dan penerima manfaat, diperbarui
          setiap hari oleh SPPG Getassrabi 02.
        </p>
      </div>
    </div>
  );
}