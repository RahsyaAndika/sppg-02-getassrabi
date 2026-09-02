import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";

export default async function EditPengumumanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-navy text-[16px] font-bold mb-4">Edit Pengumuman</h2>
      <AnnouncementForm
        announcementId={id}
        initialValues={{
          judul: data.judul,
          isi: data.isi,
          status: data.status,
          tanggalPublish: data.tanggal_publish,
        }}
      />
    </div>
  );
}