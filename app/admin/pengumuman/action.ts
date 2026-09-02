"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AnnouncementFormValues = {
  judul: string;
  isi: string;
  status: "active" | "inactive";
  tanggalPublish: string;
};

export async function createAnnouncement(values: AnnouncementFormValues) {
  const supabase = await createClient();

  const { error } = await supabase.from("announcements").insert({
    judul: values.judul,
    isi: values.isi,
    status: values.status,
    tanggal_publish: values.tanggalPublish,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/pengumuman");
  revalidatePath("/");
  redirect("/admin/pengumuman");
}

export async function updateAnnouncement(id: string, values: AnnouncementFormValues) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("announcements")
    .update({
      judul: values.judul,
      isi: values.isi,
      status: values.status,
      tanggal_publish: values.tanggalPublish,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/pengumuman");
  revalidatePath("/");
  redirect("/admin/pengumuman");
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/pengumuman");
  revalidatePath("/");
  return { success: true, message: "Pengumuman berhasil dihapus." };
}

export async function toggleAnnouncementStatus(id: string, currentStatus: string) {
  const supabase = await createClient();
  const newStatus = currentStatus === "active" ? "inactive" : "active";

  const { error } = await supabase
    .from("announcements")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/pengumuman");
  revalidatePath("/");
  return { success: true, message: `Status diubah menjadi ${newStatus === "active" ? "aktif" : "nonaktif"}.` };
}