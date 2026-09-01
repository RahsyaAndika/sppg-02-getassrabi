import Link from "next/link"

export function Footer() {
  return (
    <>
      <div className="max-w-[1080px] mx-auto px-[18px]">
        <section className="card bg-gradient-to-br from-navy to-navy-light text-white border-0 p-[22px] my-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div>
              <div className="text-[13px] font-black">SPPG GETASSRABI 02</div>
              <div className="text-[#d7e1e8] text-[10px] leading-relaxed mt-1">
                Satuan Pelayanan Pemenuhan Gizi
                <br />
                Portal informasi menu MBG harian.
              </div>
            </div>

            <div>
              <div className="text-[13px] font-black">ALAMAT</div>
              <div className="text-[#d7e1e8] text-[10px] leading-relaxed mt-1">
                Getassrabi, Gebog, Kudus,
                <br />
                Jawa Tengah
              </div>
            </div>

            <div>
              <div className="text-[13px] font-black">MEDIA SOSIAL</div>
              <a href="https://www.instagram.com/sppg.getassrabi.02?igsi=Mzc0ODIwOTBqY3hs"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white no-underline text-[10px] mt-[7px]">
                    Instagram · @sppg.getassrabi.02
                    </a>
                
        
             
              <a href="https://www.tiktok.com/@sppg.getassrabi.02?_r=1&_t=ZS-99LJOWHACNI"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white no-underline text-[10px] mt-[7px]"
              >
                TikTok · @sppg.getassrabi.02
                </a>
                
            </div>

            <div className="bg-white text-navy p-2 rounded-xl text-center text-[8px] font-bold justify-self-start md:justify-self-auto">
              {/* QR code asli akan dipasang ulang di sini */}
              <div className="w-[90px] h-[90px] bg-gray-100 flex items-center justify-center text-gray-400">
                QR
              </div>
              Scan untuk membuka menu
            </div>
          </div>
        </section>
    </div>

      <footer className="py-6 text-center text-muted text-[9px]">
        SPPG GETASSRABI 02 • Portal Informasi Menu MBG
      </footer>
    </>
  );
}