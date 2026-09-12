import type { Announcement } from "@/lib/supabase/queries";
import { Megaphone } from "lucide-react";

function formatTanggal(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null;

  return (
    <section className="my-4 space-y-3">
      {announcements.map((a) => (
        <div key={a.id} className="card p-4 border-l-[3px]" style={{ borderLeftColor: "var(--color-gold)" }}>
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-[6px] text-[11px] font-medium text-[#8A6C1B]">
              <Megaphone size={13} />
              Pengumuman
            </span>
            <span className="text-[11px] text-muted">{formatTanggal(a.tanggal_publish)}</span>
          </div>
          <h3 className="font-display text-navy text-[15px] m-0 mb-1">{a.judul}</h3>
          <p className="text-muted text-[12px] leading-relaxed m-0">{a.isi}</p>
        </div>
      ))}
    </section>
  );
}