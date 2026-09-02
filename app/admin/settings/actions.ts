"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SiteSettingsFormValues = {
  namaSppg: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  instagram: string;
  tiktok: string;
  logoUrl: string;
  footerText: string;
  profilePhotoUrl: string;
};

export async function updateSiteSettings(values: SiteSettingsFormValues) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({
      nama_sppg: values.namaSppg,
      deskripsi: values.deskripsi,
      alamat: values.alamat,
      kontak: values.kontak,
      instagram: values.instagram,
      tiktok: values.tiktok,
      logo_url: values.logoUrl,
      footer_text: values.footerText,
      profile_photo_url: values.profilePhotoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    return { success: false, message: error.message };
  }

  // Revalidate semua halaman yang menampilkan navbar/footer/profil
  revalidatePath("/", "layout");

  return { success: true, message: "Pengaturan berhasil disimpan." };
}