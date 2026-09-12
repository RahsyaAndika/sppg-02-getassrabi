import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementTable } from "@/components/admin/AnnouncementTable";
import { Megaphone } from "lucide-react";

export default async function AdminPengumumanPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("announcements")
    .select("id, judul, status, tanggal_publish")
    .order("tanggal_publish", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><Megaphone size={18} className="text-green" /><h2 className="font-display text-navy text-[19px] m-0">Kelola Pengumuman</h2>          <p className="text-muted text-[11px] mt-1">
            {items?.length ?? 0} pengumuman terdaftar
          </p>
        </div>
        <Link
          href="/admin/pengumuman/baru"
          className="bg-navy text-white text-[12px] font-medium px-5 py-[11px] rounded-full"
        >
          + Tambah Pengumuman
        </Link>
      </div>

      <AnnouncementTable items={items ?? []} />
    </div>
  );
}