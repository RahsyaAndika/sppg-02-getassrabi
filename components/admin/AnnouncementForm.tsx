"use client";

import { useState, useTransition } from "react";
import {
  createAnnouncement,
  updateAnnouncement,
  type AnnouncementFormValues,
} from "@/app/admin/pengumuman/action";

export function AnnouncementForm({
  initialValues,
  announcementId,
}: {
  initialValues: AnnouncementFormValues;
  announcementId?: string;
}) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof AnnouncementFormValues>(
    key: K,
    value: AnnouncementFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = announcementId
        ? await updateAnnouncement(announcementId, values)
        : await createAnnouncement(values);

      if (result && !result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-3 max-w-[600px]">
      {error && (
        <div className="bg-[#fdecea] text-danger text-[12px] p-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-bold text-navy mb-1">Judul</label>
        <input
          required
          value={values.judul}
          onChange={(e) => update("judul", e.target.value)}
          className="w-full p-[10px] border border-line rounded-[10px] text-sm"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-navy mb-1">Isi Pengumuman</label>
        <textarea
          required
          rows={4}
          value={values.isi}
          onChange={(e) => update("isi", e.target.value)}
          className="w-full p-[10px] border border-line rounded-[10px] text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">
            Tanggal Publikasi
          </label>
          <input
            type="date"
            required
            value={values.tanggalPublish}
            onChange={(e) => update("tanggalPublish", e.target.value)}
            className="w-full p-[10px] border border-line rounded-[10px] text-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">Status</label>
          <select
            value={values.status}
            onChange={(e) => update("status", e.target.value as "active" | "inactive")}
            className="w-full p-[10px] border border-line rounded-[10px] text-sm"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-navy text-white text-[13px] font-bold px-5 py-[10px] rounded-[10px] disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan Pengumuman"}
        </button>
      </div>
    </form>
  );
}