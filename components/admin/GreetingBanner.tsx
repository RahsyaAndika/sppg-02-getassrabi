"use client";

import { useEffect, useState } from "react";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";

type GreetingPeriod = "pagi" | "siang" | "sore" | "malam";

const GREETING_CONFIG: Record<
  GreetingPeriod,
  { label: string; photo: string; overlay: string; icon: typeof Sun }
> = {
  pagi: {
    label: "Selamat pagi",
    photo: "admin-greeting/pagi.jpeg",
    overlay: "linear-gradient(120deg, rgba(18,42,76,0.85), rgba(22,58,45,0.5))",
    icon: Sunrise,
  },
  siang: {
    label: "Selamat siang",
    photo: "admin-greeting/siang.jpeg",
    overlay: "linear-gradient(120deg, rgba(18,42,76,0.85), rgba(18,42,76,0.55))",
    icon: Sun,
  },
  sore: {
    label: "Selamat sore",
    photo: "admin-greeting/sore.jpeg",
    overlay: "linear-gradient(120deg, rgba(18,42,76,0.88), rgba(90,60,20,0.5))",
    icon: Sunset,
  },
  malam: {
    label: "Selamat malam",
    photo: "admin-greeting/malam.jpeg",
    overlay: "linear-gradient(120deg, rgba(8,14,26,0.9), rgba(18,42,76,0.65))",
    icon: Moon,
  },
};

function getGreetingPeriod(hour: number): GreetingPeriod {
  if (hour < 11) return "pagi";
  if (hour < 15) return "siang";
  if (hour < 19) return "sore";
  return "malam";
}

export function GreetingBanner({
  name,
  roleLabel,
  initial,
}: {
  name: string;
  roleLabel: string;
  initial: string;
}) {
  const [period, setPeriod] = useState<GreetingPeriod>("pagi");
  const [photoAvailable, setPhotoAvailable] = useState(false);

  // Hitung periode waktu dari jam PERANGKAT PENGGUNA (client), bukan server.
  useEffect(() => {
    setPeriod(getGreetingPeriod(new Date().getHours()));
  }, []);

  const config = GREETING_CONFIG[period];
  const Icon = config.icon;

  // Cek foto lokal benar-benar ada sebelum dipasang sebagai background,
  // supaya kalau file belum diupload admin, tidak muncul gambar rusak.
  useEffect(() => {
    setPhotoAvailable(false);
    const img = new window.Image();
    img.onload = () => setPhotoAvailable(true);
    img.onerror = () => setPhotoAvailable(false);
    img.src = config.photo;
  }, [config.photo]);

  return (
    <div
      className="relative overflow-hidden rounded-[18px] mb-6 border border-line bg-navy"
      style={{
        backgroundImage: photoAvailable
          ? `${config.overlay}, url(${config.photo})`
          : config.overlay,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.4s ease",
      }}
    >
      <div className="relative p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="w-[52px] h-[52px] rounded-full bg-white/[.14] border border-white/[.22] flex items-center justify-center font-display text-white text-[20px] shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-[6px] text-[#D7E1EC] text-[12px] m-0">
              <Icon size={13} />
              {config.label},
            </p>
            <h1 className="font-display italic text-white text-[26px] md:text-[30px] m-0 truncate">
              {name}
            </h1>
            <span className="inline-block mt-[8px] px-[10px] py-[4px] rounded-full bg-white/[.14] text-white text-[10px] font-medium">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}