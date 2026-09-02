"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ArticleFormValues = {
  judul: string;
  slug: string;
  excerpt: string;
  isi: string;
  imageUrl: string;
  status: "draft" | "published";
  tanggalPublish: string;
};

export async function createArticle(values: ArticleFormValues) {
  const supabase = await createClient();

  const { error } = await supabase.from("articles").insert({
    judul: values.judul,
    slug: values.slug,
    excerpt: values.excerpt,
    isi: values.isi,
    image_url: values.imageUrl,
    status: values.status,
    tanggal_publish: values.tanggalPublish,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "Slug sudah dipakai artikel lain. Ubah slug-nya." };
    }
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  redirect("/admin/berita");
}

export async function updateArticle(id: string, values: ArticleFormValues) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("articles")
    .update({
      judul: values.judul,
      slug: values.slug,
      excerpt: values.excerpt,
      isi: values.isi,
      image_url: values.imageUrl,
      status: values.status,
      tanggal_publish: values.tanggalPublish,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "Slug sudah dipakai artikel lain. Ubah slug-nya." };
    }
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  redirect("/admin/berita");
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  return { success: true, message: "Artikel berhasil dihapus." };
}