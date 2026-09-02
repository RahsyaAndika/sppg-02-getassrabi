import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArticleTable } from "@/components/admin/ArticleTable";

export default async function AdminBeritaPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("articles")
    .select("id, judul, slug, status, tanggal_publish")
    .order("tanggal_publish", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-navy text-[19px] m-0">Kelola Berita</h2>
          <p className="text-muted text-[11px] mt-1">
            {items?.length ?? 0} artikel terdaftar
          </p>
        </div>
          <Link
          href="/admin/berita/baru"
          className="bg-navy text-white text-[12px] font-medium px-5 py-[11px] rounded-full"
        >
          + Tambah Artikel
        </Link>
      </div>

      <ArticleTable items={items ?? []} />
    </div>
  );
}