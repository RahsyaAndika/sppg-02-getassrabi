import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function EditArtikelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("articles").select("*").eq("id", id).single();

  if (!data) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-navy text-[16px] font-bold mb-4">Edit Artikel</h2>
      <ArticleForm
        articleId={id}
        initialValues={{
          judul: data.judul,
          slug: data.slug,
          excerpt: data.excerpt ?? "",
          isi: data.isi,
          imageUrl: data.image_url ?? "",
          status: data.status,
          tanggalPublish: data.tanggal_publish,
        }}
      />
    </div>
  );
}