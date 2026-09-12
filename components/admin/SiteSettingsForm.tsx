"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings, type SiteSettingsFormValues } from "@/app/admin/settings/actions";
import { uploadImage } from "@/lib/utils/upload";
import { Image as ImageIcon, UserRound, Info, Share2, PanelBottom } from "lucide-react";

export function SiteSettingsForm({
  initialValues,
}: {
  initialValues: SiteSettingsFormValues;
}) {
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] = useState(false);

  function update<K extends keyof SiteSettingsFormValues>(
    key: K,
    value: SiteSettingsFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const result = await uploadImage(file, "site-assets", "logo");
    setIsUploadingLogo(false);

    if (!result.success) {
      setMessage({ type: "error", text: result.message });
      return;
    }
    update("logoUrl", result.url);
  }

  async function handleProfilePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProfilePhoto(true);
    const result = await uploadImage(file, "site-assets", "profile-photo");
    setIsUploadingProfilePhoto(false);

    if (!result.success) {
      setMessage({ type: "error", text: result.message });
      return;
    }
    update("profilePhotoUrl", result.url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateSiteSettings(values);
      setMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-[640px]">
      {message && (
        <div
          className={`text-[12px] p-3 rounded-lg ${
            message.type === "success"
              ? "bg-[#edf7f2] text-green"
              : "bg-[#fdecea] text-danger"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon size={16} className="text-green" />
          <h3 className="font-display text-navy text-[15px] m-0">Logo</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-[76px] h-[76px] border border-line bg-soft rounded-2xl overflow-hidden flex items-center justify-center text-muted text-[9px] shrink-0">
            {values.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              "LOGO"
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={isUploadingLogo}
              onChange={handleLogoChange}
              className="text-[12px]"
            />
            {isUploadingLogo && (
              <p className="text-muted text-[11px] mt-2">Mengunggah logo...</p>
            )}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <UserRound size={16} className="text-green" />
          <h3 className="font-display text-navy text-[15px] m-0">
            Foto Profil SPPG (tampil di halaman Profil)
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-[120px] h-[80px] border border-line bg-soft rounded-xl overflow-hidden flex items-center justify-center text-muted text-[9px] shrink-0">
            {values.profilePhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.profilePhotoUrl}
                alt="Foto profil SPPG"
                className="w-full h-full object-cover"
              />
            ) : (
              "Belum ada foto"
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={isUploadingProfilePhoto}
              onChange={handleProfilePhotoChange}
              className="text-[12px]"
            />
            {isUploadingProfilePhoto && (
              <p className="text-muted text-[11px] mt-2">Mengunggah foto...</p>
            )}
            <p className="text-muted text-[10px] mt-2 break-words">
              Bisa foto gedung SPPG, kepala SPPG, atau karyawan — akan tampil
              sebagai latar halaman Profil.
            </p>
          </div>
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={16} className="text-green" />
          <h3 className="font-display text-navy text-[15px] m-0">Informasi Umum</h3>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">Nama SPPG</label>
          <input
            required
            value={values.namaSppg}
            onChange={(e) => update("namaSppg", e.target.value)}
            className="w-full p-[10px] border border-line rounded-[10px] text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">Deskripsi</label>
          <textarea
            rows={3}
            value={values.deskripsi}
            onChange={(e) => update("deskripsi", e.target.value)}
            className="w-full p-[10px] border border-line rounded-[10px] text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">Alamat</label>
          <textarea
            rows={2}
            value={values.alamat}
            onChange={(e) => update("alamat", e.target.value)}
            className="w-full p-[10px] border border-line rounded-[10px] text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">
            Kontak (nomor telepon/WhatsApp)
          </label>
          <input
            value={values.kontak}
            onChange={(e) => update("kontak", e.target.value)}
            className="w-full p-[10px] border border-line rounded-[10px] text-sm"
          />
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Share2 size={16} className="text-green" />
          <h3 className="font-display text-navy text-[15px] m-0">Media Sosial</h3>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">
            Link Instagram
          </label>
          <input
            type="url"
            placeholder="https://www.instagram.com/..."
            value={values.instagram}
            onChange={(e) => update("instagram", e.target.value)}
            className="w-full p-[10px] border border-line rounded-[10px] text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">
            Link TikTok
          </label>
          <input
            type="url"
            placeholder="https://www.tiktok.com/@..."
            value={values.tiktok}
            onChange={(e) => update("tiktok", e.target.value)}
            className="w-full p-[10px] border border-line rounded-[10px] text-sm"
          />
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <PanelBottom size={16} className="text-green" />
          <h3 className="font-display text-navy text-[15px] m-0">Footer</h3>
        </div>
        <label className="block text-[10px] font-bold text-navy mb-1">
          Teks Footer (kosongkan untuk pakai teks default)
        </label>
        <input
          value={values.footerText}
          onChange={(e) => update("footerText", e.target.value)}
          className="w-full p-[10px] border border-line rounded-[10px] text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-navy text-white text-[13px] font-medium px-6 py-[12px] rounded-full disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}