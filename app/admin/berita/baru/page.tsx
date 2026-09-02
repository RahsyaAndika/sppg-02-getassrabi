import { ArticleForm } from "@/components/admin/ArticleForm";

export default function TambahArtikelPage() {
  return (
    <div>
      <h2 className="text-navy text-[16px] font-bold mb-4">Tambah Artikel</h2>
      <ArticleForm
        initialValues={{
          judul: "",
          slug: "",
          excerpt: "",
          isi: "",
          imageUrl: "",
          status: "draft",
          tanggalPublish: new Date().toISOString().slice(0, 10),
        }}
      />
    </div>
  );
}