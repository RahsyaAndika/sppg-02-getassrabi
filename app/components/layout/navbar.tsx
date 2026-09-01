import Link from "next/link";

export function Navbar() {
  return (
    <header className="bg-gradient-to-br from-navy via-navy-light to-teal-dark text-white">
      <div className="max-w-[1080px] mx-auto px-[18px]">
        <div className="flex items-center justify-between py-[18px]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-[54px] h-[54px] rounded-[15px] bg-white p-1 shadow-[0_7px_20px_rgba(0,0,0,0.13)] overflow-hidden shrink-0">
              {/* Logo akan diambil dari Supabase Storage setelah Tahap 10 tersambung */}
              <div className="w-full h-full flex items-center justify-center text-navy text-[10px] font-bold">
                LOGO
              </div>
            </div>
            <div>
              <b className="block text-[15px]">SPPG GETASSRABI 02</b>
              <small className="block text-[#d1dce5] text-[10px] mt-[3px]">
                Dapur Makan Bergizi Gratis
              </small>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-[12px] font-semibold">
            <Link href="/" className="hover:opacity-80">Beranda</Link>
            <Link href="/menu" className="hover:opacity-80">Menu MBG</Link>
            <Link href="/berita" className="hover:opacity-80">Berita</Link>
          </nav>

          <Link
            href="/login"
            className="border border-white/[.18] bg-white/[.06] text-white px-[14px] py-[10px] rounded-[11px] font-extrabold text-[13px]"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}