"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatTanggalPendek } from "@/lib/utils/date";
import { deleteMenu } from "@/app/admin/menu/actions";

type MenuRow = {
  id: string;
  menu_date: string;
  menu_name: string;
  status: string;
  total_portions: number;
};

export function MenuTable({ menus }: { menus: MenuRow[] }) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteMenu(id);
      setMessage(result.message);
      setConfirmId(null);
    });
  }

  if (menus.length === 0) {
    return (
      <div className="card p-8 text-center text-muted text-sm">
        Belum ada menu. Klik &quot;Tambah Menu&quot; untuk mulai mengisi.
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
              <th className="p-3 font-bold">Nama Menu</th>
              <th className="p-3 font-bold">Total Porsi</th>
              <th className="p-3 font-bold">Status</th>
              <th className="p-3 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id} className="border-t border-line">
                <td className="p-3 whitespace-nowrap">
                  {formatTanggalPendek(menu.menu_date)}
                </td>
                <td className="p-3 max-w-[240px] truncate">{menu.menu_name}</td>
                <td className="p-3">{menu.total_portions.toLocaleString("id-ID")}</td>
                <td className="p-3">
                                    <span
                    className={`px-[10px] py-[5px] rounded-full text-[10px] font-medium ${
                      menu.status === "published"
                        ? "bg-[#EEF6EF] text-green"
                        : "bg-gold-bg text-[#8A6C1B]"
                    }`}
                  >
                    {menu.status === "published" ? "Terbit" : "Draft"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2 whitespace-nowrap">
                    <Link
                      href={`/admin/menu/${menu.id}`}
                      className="text-navy font-semibold underline"
                    >
                      Edit
                    </Link>
                    {confirmId === menu.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(menu.id)}
                          disabled={isPending}
                          className="text-danger font-semibold"
                        >
                          {isPending ? "Menghapus..." : "Yakin?"}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-muted"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmId(menu.id)}
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