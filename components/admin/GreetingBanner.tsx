"use client";

import { useEffect, useState, useTransition } from "react";
import { Sunrise, Sun, Sunset, Moon, Camera } from "lucide-react";
import { uploadImage } from "@/lib/utils/upload";
import { updateMyAvatar } from "@/app/admin/actions";

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
  avatarUrl: initialAvatarUrl,
}: {
  name: string;
  roleLabel: string;
  initial: string;
  avatarUrl: string;
}) {
  const [period, setPeriod] = useState<GreetingPeriod>("pagi");
  const [photoAvailable, setPhotoAvailable] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setPeriod(getGreetingPeriod(new Date().getHours()));
  }, []);

  const config = GREETING_CONFIG[period];
  const Icon = config.icon;

  useEffect(() => {
    setPhotoAvailable(false);
    const img = new window.Image();
    img.onload = () => setPhotoAvailable(true);
    img.onerror = () => setPhotoAvailable(false);
    img.src = config.photo;
  }, [config.photo]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const result = await uploadImage(file, "site-assets", `avatar-${Date.now()}`);
    setIsUploadingAvatar(false);

    if (!result.success) return;

    setAvatarUrl(result.url);
    startTransition(async () => {
      await updateMyAvatar(result.url);
    });
  }

  return (
    <div
      className="relative overflow-hidden rounded-[18px] mb-6 border border-line bg-navy"
      style={{
        backgroundImage: photoAvailable ? `${config.overlay}, url(${config.photo})` : config.overlay,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.4s ease",
      }}
    >
      <div className="relative p-6 md:p-8">
        <div className="flex items-center gap-4">
          <label
            className="relative w-[52px] h-[52px] rounded-full bg-white/[.14] border border-white/[.22] flex items-center justify-center font-display text-white text-[20px] shrink-0 cursor-pointer overflow-hidden group"
            title="Klik untuk ganti foto profil"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              initial
            )}
            <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera size={16} className="text-white" />
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={isUploadingAvatar}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
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
            {isUploadingAvatar && (
              <span className="block text-[10px] text-[#D7E1EC] mt-1">
                Mengunggah foto...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}