import { AnnouncementForm } from "@/components/admin/AnnouncementForm";

export default function TambahPengumumanPage() {
  return (
    <div>
      <h2 className="text-navy text-[16px] font-bold mb-4">Tambah Pengumuman</h2>
      <AnnouncementForm
        initialValues={{
          judul: "",
          isi: "",
          status: "active",
          tanggalPublish: new Date().toISOString().slice(0, 10),
        }}
      />
    </div>
  );
}