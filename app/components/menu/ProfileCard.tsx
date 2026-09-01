export function ProfileCard() {
  return (
    <section className="card p-[22px] my-4">
      <div className="flex gap-4 items-center">
        <div className="w-[76px] h-[76px] border border-line bg-white rounded-2xl p-1 overflow-hidden shrink-0 flex items-center justify-center text-navy text-[9px] font-bold">
          LOGO
        </div>
        <div>
          <h2 className="m-0 text-navy text-[19px] font-bold">
            Profil SPPG Getassrabi 02
          </h2>
          <p className="mt-1 text-muted text-[11px] leading-relaxed">
            Portal informasi layanan Makan Bergizi Gratis yang dikelola dan
            diperbarui oleh admin SPPG.
          </p>
        </div>
      </div>
    </section>
  );
}