"use client";

import { useState, useTransition } from "react";
import {
  MENU_ITEM_LABELS,
  PORTION_GROUP_LABELS,
  type MenuFormValues,
  type MenuItemCategory,
  type PortionGroupKey,
} from "@/types/admin-menu";
import { createMenu, updateMenu } from "@/app/admin/menu/actions";
import { uploadImage } from "@/lib/utils/upload";

const ITEM_CATEGORIES = Object.keys(MENU_ITEM_LABELS) as MenuItemCategory[];
const PORTION_GROUPS = Object.keys(PORTION_GROUP_LABELS) as PortionGroupKey[];

export function MenuForm({
  initialValues,
  menuId,
}: {
  initialValues: MenuFormValues;
  menuId?: string;
}) {
  const [values, setValues] = useState<MenuFormValues>(initialValues);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function update<K extends keyof MenuFormValues>(key: K, value: MenuFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateItem(category: MenuItemCategory, nama: string) {
    setValues((prev) => ({
      ...prev,
      items: { ...prev.items, [category]: nama },
    }));
  }

  function updatePortion(
    group: PortionGroupKey,
    field: keyof MenuFormValues["portions"][PortionGroupKey],
    value: string | number
  ) {
    setValues((prev) => ({
      ...prev,
      portions: {
        ...prev.portions,
        [group]: { ...prev.portions[group], [field]: value },
      },
    }));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    const path = `menu-${values.menuDate}-${Date.now()}`;
    const result = await uploadImage(file, "menu-images", path);

    setIsUploading(false);

    if (!result.success) {
      setUploadError(result.message);
      return;
    }

    update("photoUrl", result.url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = menuId
        ? await updateMenu(menuId, values)
        : await createMenu(values);

      // Kalau result ada isinya berarti gagal (redirect di server action
      // tidak akan mengembalikan nilai kalau sukses).
      if (result && !result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-[#fdecea] text-danger text-[12px] p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* DATA INTI */}
      <div className="card p-5">
        <h3 className="text-navy text-[13px] font-bold mb-3">Data Menu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-navy mb-1">
              Tanggal
            </label>
            <input
              type="date"
              required
              value={values.menuDate}
              onChange={(e) => update("menuDate", e.target.value)}
              className="w-full p-[10px] border border-line rounded-[10px] text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-navy mb-1">
              Status
            </label>
            <select
              value={values.status}
              onChange={(e) =>
                update("status", e.target.value as "draft" | "published")
              }
              className="w-full p-[10px] border border-line rounded-[10px] text-sm"
            >
              <option value="published">Terbit</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-navy mb-1">
              Nama Menu
            </label>
            <input
              required
              value={values.menuName}
              onChange={(e) => update("menuName", e.target.value)}
              className="w-full p-[10px] border border-line rounded-[10px] text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-navy mb-1">
              Deskripsi
            </label>
            <textarea
              rows={2}
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full p-[10px] border border-line rounded-[10px] text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-navy mb-1">
              Total Porsi
            </label>
            <input
              type="number"
              min={0}
              value={values.totalPortions}
              onChange={(e) => update("totalPortions", Number(e.target.value))}
              className="w-full p-[10px] border border-line rounded-[10px] text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-navy mb-1">
              Batas Konsumsi
            </label>
            <input
              placeholder="Contoh: Jam 09.00 WIB"
              value={values.consumptionLimit}
              onChange={(e) => update("consumptionLimit", e.target.value)}
              className="w-full p-[10px] border border-line rounded-[10px] text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-navy mb-1">
              Penerima Manfaat (pisahkan dengan koma)
            </label>
            <input
              placeholder="Siswa PAUD, Siswa SD, Ibu Hamil"
              value={values.benefits}
              onChange={(e) => update("benefits", e.target.value)}
              className="w-full p-[10px] border border-line rounded-[10px] text-sm"
            />
          </div>
        </div>
      </div>

      {/* KOMPONEN MAKANAN */}
      <div className="card p-5">
        <h3 className="text-navy text-[13px] font-bold mb-3">Komponen Makanan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ITEM_CATEGORIES.map((cat) => (
            <div key={cat}>
              <label className="block text-[10px] font-bold text-navy mb-1">
                {MENU_ITEM_LABELS[cat]}
              </label>
              <input
                value={values.items[cat]}
                onChange={(e) => updateItem(cat, e.target.value)}
                className="w-full p-[10px] border border-line rounded-[10px] text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* PORSI & GIZI PER KELOMPOK */}
      <div className="card p-5">
        <h3 className="text-navy text-[13px] font-bold mb-1">
          Porsi &amp; Gizi per Kelompok
        </h3>
        <p className="text-muted text-[11px] mb-3">
          Isi jumlah porsi dan nilai gizi (angka saja) untuk tiap kelompok sasaran.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {PORTION_GROUPS.map((group) => (
            <div key={group} className="bg-soft border border-line rounded-xl p-3">
              <h4 className="text-navy text-[11px] font-bold mb-2">
                {PORTION_GROUP_LABELS[group]}
              </h4>

              <label className="block text-[9px] text-muted mb-[2px]">Jumlah Porsi</label>
              <input
                type="number"
                min={0}
                value={values.portions[group].count}
                onChange={(e) => updatePortion(group, "count", Number(e.target.value))}
                className="w-full p-2 mb-2 border border-line rounded-lg text-[11px]"
              />

              {(["e", "p", "l", "c", "s"] as const).map((field) => {
                const fieldLabel = { e: "Energi", p: "Protein", l: "Lemak", c: "Karbo", s: "Serat" }[field];
                return (
                  <div key={field} className="mb-1">
                    <label className="block text-[9px] text-muted mb-[2px]">
                      {fieldLabel}
                    </label>
                    <input
                      value={values.portions[group][field]}
                      onChange={(e) => updatePortion(group, field, e.target.value)}
                      className="w-full p-2 border border-line rounded-lg text-[11px]"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

            <div className="card p-5">
        <h3 className="text-navy text-[13px] font-bold mb-3">Foto Menu</h3>
        <div className="flex items-start gap-4">
          <div className="w-[160px] h-[120px] border border-dashed border-line rounded-xl bg-soft overflow-hidden flex items-center justify-center text-muted text-[10px] shrink-0">
            {values.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.photoUrl} alt="Foto menu" className="w-full h-full object-cover" />
            ) : (
              "Belum ada foto"
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={isUploading}
              onChange={handlePhotoChange}
              className="text-[12px]"
            />
            {isUploading && (
              <p className="text-muted text-[11px] mt-2">Mengunggah foto...</p>
            )}
            {uploadError && (
              <p className="text-danger text-[11px] mt-2">{uploadError}</p>
            )}
            <p className="text-muted text-[10px] mt-2">
              Format JPG/PNG/WebP,
              maksimal 3MB.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-navy text-white text-[13px] font-bold px-5 py-[10px] rounded-[10px] disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan Menu"}
        </button>
      </div>
    </form>
  );
}