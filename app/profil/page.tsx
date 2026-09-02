import { getSiteSettings } from "@/lib/supabase/queries";

export default async function ProfilPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <div
        className="relative bg-navy text-white overflow-hidden"
        style={
          settings.profile_photo_url
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(18,42,76,0.35), rgba(18,42,76,0.92)), url(${settings.profile_photo_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="max-w-[860px] mx-auto px-[18px] py-[70px] md:py-[100px] text-center">
          <p className="text-[#9FB0C4] text-[13px] mb-3">Profil</p>
          <h1 className="font-display text-[34px] md:text-[46px] leading-[1.1]">
            {settings.nama_sppg}
          </h1>
          <p className="mt-4 text-[#C4D0DD] text-[14px] leading-relaxed max-w-[560px] mx-auto">
            {settings.deskripsi ||
              "Satuan Pelayanan Pemenuhan Gizi — melayani Makan Bergizi Gratis untuk masyarakat sekitar."}
          </p>
        </div>
      </div>

      <div className="max-w-[780px] mx-auto px-[18px] py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-display text-navy text-[16px] mb-2">Alamat</h2>
            <p className="text-muted text-[13px] leading-relaxed">
              {settings.alamat || "Belum diisi admin."}
            </p>
          </div>
          <div className="card p-6">
            <h2 className="font-display text-navy text-[16px] mb-2">
              Kontak &amp; Media Sosial
            </h2>
            <p className="text-muted text-[13px] leading-relaxed mb-2">
              {settings.kontak || "Belum diisi admin."}
            </p>
            <div className="flex gap-3 text-[13px]">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green font-medium"
                >
                  Instagram
                </a>
              )}
              {settings.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green font-medium"
                >
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}