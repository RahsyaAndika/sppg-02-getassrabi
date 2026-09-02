import { createClient } from "@/lib/supabase/server";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h2 className="text-navy text-[16px] font-bold mb-4">Pengaturan Website</h2>
      <SiteSettingsForm
        initialValues={{
          namaSppg: data?.nama_sppg ?? "",
          deskripsi: data?.deskripsi ?? "",
          alamat: data?.alamat ?? "",
          kontak: data?.kontak ?? "",
          instagram: data?.instagram ?? "",
          tiktok: data?.tiktok ?? "",
          logoUrl: data?.logo_url ?? "",
          footerText: data?.footer_text ?? "",
          profilePhotoUrl: data?.profile_photo_url ?? "",
        }}
      />
    </div>
  );
}