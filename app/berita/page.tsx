import Link from "next/link";
import { ArticleCard } from "@/components/berita/ArticleCard";
import { getArticles } from "@/lib/supabase/queries";

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));

  const { articles, totalPages } = await getArticles(page);

  return (
    <div className="max-w-[1080px] mx-auto px-[18px] py-8">
      <h1 className="font-display text-navy text-[26px] mb-1">
        Berita &amp; Kegiatan
      </h1>
      <p className="text-muted text-[12px] mb-6">
        Dokumentasi kegiatan dan informasi terbaru dari SPPG Getassrabi 02.
      </p>

      {articles.length === 0 ? (
        <div className="card p-10 text-center text-muted text-sm">
          Belum ada berita yang dipublikasikan.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a) => (
            <ArticleCard
              key={a.id}
              slug={a.slug}
              judul={a.judul}
              excerpt={a.excerpt}
              imageUrl={a.image_url}
              tanggalPublish={a.tanggal_publish}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8 text-[12px]">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/berita?page=${p}`}
              className={`px-3 py-1 rounded-lg border ${
                p === page ? "bg-navy text-white border-navy" : "border-line text-navy"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}