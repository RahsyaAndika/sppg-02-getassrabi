"use client";

import { useRef, useState, useTransition } from "react";
import { createArticle, updateArticle, type ArticleFormValues } from "@/app/admin/berita/actions";
import { uploadImage } from "@/lib/utils/upload";
import { generateSlug } from "@/lib/utils/slug";

export function ArticleForm({
  initialValues,
  articleId,
}: {
  initialValues: ArticleFormValues;
  articleId?: string;
}) {
  const [values, setValues] = useState(initialValues);
  const [slugTouched, setSlugTouched] = useState(!!articleId);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingInline, setIsUploadingInline] = useState(false);
  const isiRef = useRef<HTMLTextAreaElement>(null);

  function update<K extends keyof ArticleFormValues>(key: K, value: ArticleFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleJudulChange(value: string) {
    update("judul", value);
    if (!slugTouched) {
      update("slug", generateSlug(value));
    }
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    const path = `cover-${Date.now()}`;
    const result = await uploadImage(file, "article-images", path);
    setIsUploadingCover(false);

    if (!result.success) {
      setError(result.message);
      return;
    }
    update("imageUrl", result.url);
  }

  async function handleInlineImageInsert(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingInline(true);
    const path = `inline-${Date.now()}`;
    const result = await uploadImage(file, "article-images", path);
    setIsUploadingInline(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    const imgTag = `\n<img src="${result.url}" alt="Foto kegiatan">\n`;
    const textarea = isiRef.current;

    if (textarea) {
      const cursorPos = textarea.selectionStart ?? values.isi.length;
      const newIsi =
        values.isi.slice(0, cursorPos) + imgTag + values.isi.slice(cursorPos);
      update("isi", newIsi);
    } else {
      update("isi", values.isi + imgTag);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = articleId
        ? await updateArticle(articleId, values)
        : await createArticle(values);

      if (result && !result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-[720px]">
      {error && (
        <div className="bg-[#fdecea] text-danger text-[12px] p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="card p-5 space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">Judul</label>
          <input
            required
            value={values.judul}
            onChange={(e) => handleJudulChange(e.target.value)}
            className="w-full p-[10px] border border-line rounded-[10px] text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">
            Slug (URL) — otomatis dari judul, bisa diubah manual
          </label>
          <div className="flex items-center gap-1">
            <span className="text-muted text-[12px]">/berita/</span>
            <input
              required
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug", generateSlug(e.target.value));
              }}
              className="flex-1 p-[10px] border border-line rounded-[10px] text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy mb-1">
            Ringkasan (excerpt)
          </label>
          <textarea
            rows={2}
            value={values.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
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
              onChange={(e) => update("status", e.target.value as "draft" | "published")}
              className="w-full p-[10px] border border-line rounded-[10px] text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Terbit</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-navy text-[13px] font-bold mb-3">Gambar Cover</h3>
        <div className="flex items-start gap-4">
          <div className="w-[160px] h-[100px] border border-dashed border-line rounded-xl bg-soft overflow-hidden flex items-center justify-center text-muted text-[10px] shrink-0">
            {values.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.imageUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              "Belum ada cover"
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={isUploadingCover}
              onChange={handleCoverChange}
              className="text-[12px]"
            />
            {isUploadingCover && (
              <p className="text-muted text-[11px] mt-2">Mengunggah...</p>
            )}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-navy text-[13px] font-bold mb-1">Isi Berita</h3>
        <p className="text-muted text-[11px] mb-3">
          Tulis isi berita di bawah ini. Untuk menyisipkan foto kegiatan di
          tengah isi, gunakan tombol &quot;Sisipkan Foto&quot; — foto akan
          otomatis ditambahkan ke posisi kursor Anda.
        </p>

        <textarea
          ref={isiRef}
          required
          rows={10}
          value={values.isi}
          onChange={(e) => update("isi", e.target.value)}
          placeholder="Tulis isi berita di sini. Bisa pakai <p>paragraf</p> untuk memisah alinea."
          className="w-full p-[10px] border border-line rounded-[10px] text-sm font-mono"
        />

        <div className="mt-2">
          <label className="inline-block bg-soft border border-line text-navy text-[11px] font-semibold px-3 py-2 rounded-lg cursor-pointer">
            {isUploadingInline ? "Mengunggah foto..." : "📷 Sisipkan Foto ke Isi"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={isUploadingInline}
              onChange={handleInlineImageInsert}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-navy text-white text-[13px] font-bold px-5 py-[10px] rounded-[10px] disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan Artikel"}
        </button>
      </div>
    </form>
  );
}