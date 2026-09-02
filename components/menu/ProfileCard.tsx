import type { SiteSettings } from "@/lib/supabase/queries";

export function ProfileCard({ settings }: { settings: SiteSettings }) {
  return (
    <section className="card p-[24px] my-4">
      <div className="flex gap-4 items-center">
        <div className="w-[72px] h-[72px] border border-line bg-soft rounded-2xl p-1 overflow-hidden shrink-0 flex items-center justify-center text-navy text-[9px] font-medium">
          {settings.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt={`Logo ${settings.nama_sppg}`}
              className="w-full h-full object-contain"
            />
          ) : (
            "LOGO"
          )}
        </div>
        <div>
          <h2 className="font-display text-navy text-[19px]">Profil {settings.nama_sppg}</h2>
          <p className="mt-1 text-muted text-[12px] leading-relaxed">
            {settings.deskripsi ||
              "Portal informasi layanan Makan Bergizi Gratis yang dikelola dan diperbarui oleh admin SPPG."}
          </p>
        </div>
      </div>
    </section>
  );
}