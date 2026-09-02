import type { SiteSettings } from "@/lib/supabase/queries";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-10 bg-navy text-[#D7DEE6]">
      <div className="max-w-[1080px] mx-auto px-[18px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
          <div>
            <div className="font-display text-white text-[19px] mb-2">
              {settings.nama_sppg}
            </div>
            <p className="text-[12px] leading-relaxed text-[#AEB9C6] max-w-[280px]">
              {settings.deskripsi ||
                "Satuan Pelayanan Pemenuhan Gizi — portal informasi menu Makan Bergizi Gratis, diperbarui setiap hari."}
            </p>
          </div>

          <div>
            <h3 className="text-white text-[12px] font-semibold mb-3">Alamat</h3>
            <p className="text-[12px] leading-relaxed text-[#AEB9C6]">
              {settings.alamat || "Belum diisi admin."}
            </p>
          </div>

          <div>
            <h3 className="text-white text-[12px] font-semibold mb-3">Media sosial</h3>
            <div className="flex flex-col gap-2 text-[12px]">
              {settings.instagram && (
                <a 
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#AEB9C6] hover:text-white transition-colors"
                >
                  Instagram
                </a>
              )}
              {settings.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#AEB9C6] hover:text-white transition-colors"
                >
                  TikTok
                </a>
              )}
              {!settings.instagram && !settings.tiktok && (
                <span className="text-[#7E8A99]">Belum tersedia.</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-white text-[12px] font-semibold mb-3">Kontak</h3>
            <p className="text-[12px] leading-relaxed text-[#AEB9C6]">
              {settings.kontak || "Belum diisi admin."}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[.1] text-[11px] text-[#8A96A5]">
          {settings.footer_text ||
            `© ${new Date().getFullYear()} ${settings.nama_sppg} — Portal Informasi Menu MBG`}
        </div>
      </div>
    </footer>
  );
}