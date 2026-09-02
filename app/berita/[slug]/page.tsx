import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/supabase/queries";

function formatTanggal(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-[780px] mx-auto px-[18px] py-8">
      <Link href="/berita" className="text-navy text-[12px] font-semibold">
        ← Kembali ke Berita
      </Link>

      <h1 className="font-display text-navy text-[26px] md:text-[32px] mt-4 mb-2 leading-tight">
        {article.judul}
      </h1>
      <p className="text-muted text-[11px] mb-5">
        {formatTanggal(article.tanggal_publish)}
      </p>

      {article.image_url && (
        <div className="rounded-2xl overflow-hidden mb-6 bg-[#eef4f1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image_url}
            alt={article.judul}
            className="w-full max-h-[420px] object-cover"
          />
        </div>
      )}

      {/*
        Isi artikel bisa berisi tag <img> (foto kegiatan disisipkan admin).
        Konten HANYA berasal dari input admin (bukan dari pengunjung publik),
        sehingga aman untuk dirender sebagai HTML lewat dangerouslySetInnerHTML.
      */}
      <div
        className="article-content text-[13px] leading-relaxed text-text"
        dangerouslySetInnerHTML={{ __html: article.isi }}
      />
    </div>
  );
}