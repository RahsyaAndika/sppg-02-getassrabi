import Link from "next/link";
import { CalendarDays } from "lucide-react";

function formatTanggal(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleCard({
  slug,
  judul,
  excerpt,
  imageUrl,
  tanggalPublish,
}: {
  slug: string;
  judul: string;
  excerpt: string;
  imageUrl: string;
  tanggalPublish: string;
}) {
  return (
    <Link
      href={`/berita/${slug}`}
      className="card overflow-hidden flex flex-col hover:shadow-[0_16px_40px_rgba(18,42,76,0.12)] transition-shadow"
    >
      <div className="h-[150px] bg-soft flex items-center justify-center text-muted text-[11px] overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={judul} className="w-full h-full object-cover" />
        ) : (
          "Gambar belum tersedia"
        )}
      </div>
      <div className="p-4 flex flex-col grow">
        <span className="flex items-center gap-[5px] text-muted text-[11px]">
          <CalendarDays size={12} />
          {formatTanggal(tanggalPublish)}
        </span>
        <h3 className="font-display text-navy text-[15px] mt-1 mb-2 leading-snug line-clamp-2">
          {judul}
        </h3>
        {excerpt && (
          <p className="text-muted text-[11px] leading-relaxed line-clamp-3">{excerpt}</p>
        )}
      </div>
    </Link>
  );
}