"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteArticle } from "@/app/admin/berita/actions";

type Row = {
  id: string;
  judul: string;
  slug: string;
  status: string;
  tanggal_publish: string;
};

function formatTanggal(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ArticleTable({ items }: { items: Row[] }) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteArticle(id);
      setMessage(result.message);
      setConfirmId(null);
    });
  }

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center text-muted text-sm">
        Belum ada artikel. Klik &quot;Tambah Artikel&quot; untuk mulai.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {message && (
        <div className="bg-[#edf7f2] text-green text-[11px] px-4 py-2 border-b border-line">
          {message}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-soft text-navy text-left">
              <th className="p-3 font-bold">Tanggal</th>
              <th className="p-3 font-bold">Judul</th>
              <th className="p-3 font-bold">Slug</th>
              <th className="p-3 font-bold">Status</th>
              <th className="p-3 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="p-3 whitespace-nowrap">
                  {formatTanggal(item.tanggal_publish)}
                </td>
                <td className="p-3 max-w-[240px] truncate">{item.judul}</td>
                <td className="p-3 max-w-[180px] truncate text-muted">/{item.slug}</td>
                <td className="p-3">
                  <span
                    className={`px-[10px] py-[5px] rounded-full text-[10px] font-medium ${
                      item.status === "published"
                        ? "bg-[#EEF6EF] text-green"
                        : "bg-gold-bg text-[#8A6C1B]"
                    }`}
                  >
                    {item.status === "published" ? "Terbit" : "Draft"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2 whitespace-nowrap">
                    <Link
                      href={`/admin/berita/${item.id}`}
                      className="text-navy font-semibold underline"
                    >
                      Edit
                    </Link>
                    {confirmId === item.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isPending}
                          className="text-danger font-semibold"
                        >
                          {isPending ? "Menghapus..." : "Yakin?"}
                        </button>
                        <button onClick={() => setConfirmId(null)} className="text-muted">
                          Batal
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmId(item.id)}
                        className="text-danger font-semibold"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}