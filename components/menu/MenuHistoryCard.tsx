import Link from "next/link";
import { CalendarDays } from "lucide-react";

function formatTanggal(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function MenuHistoryCard({
  menuDate,
  menuName,
  photoUrl,
  totalPortions,
}: {
  id: string;
  menuDate: string;
  menuName: string;
  photoUrl: string;
  totalPortions: number;
}) {
  return (
    <Link
      href={`/menu/${menuDate}`}
      className="card overflow-hidden flex flex-col hover:shadow-[0_16px_36px_rgba(18,42,76,0.12)] transition-shadow"
    >
      <div className="h-[140px] bg-soft flex items-center justify-center text-muted text-[12px] overflow-hidden">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={menuName} className="w-full h-full object-cover" />
        ) : (
          "Foto belum tersedia"
        )}
      </div>
      <div className="p-4">
        <span className="flex items-center gap-[5px] text-muted text-[11px]">
          <CalendarDays size={12} />
          {formatTanggal(menuDate)}
        </span>
        <h3 className="font-display text-navy text-[15px] mt-1 mb-2 leading-snug line-clamp-2">
          {menuName}
        </h3>
        <span className="text-green text-[12px] font-medium">
          {totalPortions.toLocaleString("id-ID")} porsi
        </span>
      </div>
    </Link>
  );
}