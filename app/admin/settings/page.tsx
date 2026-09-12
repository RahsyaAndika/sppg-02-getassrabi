import { createClient } from "@/lib/supabase/server";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { Settings } from "lucide-react";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Settings size={18} className="text-green" />
        <h2 className="font-display text-navy text-[19px] m-0">Pengaturan Website</h2>
      </div>

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