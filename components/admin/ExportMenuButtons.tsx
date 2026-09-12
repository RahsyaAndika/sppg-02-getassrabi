"use client";

import { useState, useTransition } from "react";
import { getMenuExportData, type MenuExportItem } from "@/app/admin/menu/actions";
import type { HistoryRange } from "@/lib/supabase/queries";
import { FileText, FileSpreadsheet } from "lucide-react";

const RANGE_OPTIONS: { value: HistoryRange; label: string }[] = [
  { value: "week", label: "1 Minggu Terakhir" },
  { value: "month", label: "1 Bulan Terakhir" },
  { value: "3month", label: "3 Bulan Terakhir" },
  { value: "6month", label: "6 Bulan Terakhir" },
  { value: "year", label: "1 Tahun Terakhir" },
];

const STATUS_LABELS: Record<string, string> = {
  published: "Terbit",
  draft: "Draft",
};

const ITEM_CATEGORY_LABELS: Record<string, string> = {
  makanan_pokok: "Makanan Pokok",
  protein_hewani: "Protein Hewani",
  protein_nabati: "Protein Nabati",
  sayur: "Sayur",
  buah: "Buah",
  minuman: "Minuman",
};

const GROUP_ORDER = ["big", "small", "toddler", "preg", "breast"] as const;
const GROUP_LABELS: Record<string, string> = {
  big: "Porsi Besar",
  small: "Porsi Kecil",
  toddler: "Balita",
  preg: "Bumil",
  breast: "Busui",
};

function formatTanggal(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

async function fetchImageAsDataUrl(
  url: string
): Promise<{ dataUrl: string; format: "JPEG" | "PNG" } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const format = blob.type.includes("png") ? "PNG" : "JPEG";
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return { dataUrl, format };
  } catch {
    return null;
  }
}

export function ExportMenuButtons() {
  const [format, setFormat] = useState<"pdf" | "excel" | null>(null);
  const [range, setRange] = useState<HistoryRange>("week");
  const [isPending, startTransition] = useTransition();
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  function openModal(fmt: "pdf" | "excel") {
    setFormat(fmt);
    setRange("week");
    setError("");
  }

  function closeModal() {
    if (isPending) return;
    setFormat(null);
  }

  function buildItemsMap(items: MenuExportItem["items"]) {
    const map: Record<string, string> = {};
    items.forEach((it) => {
      map[it.kategori] = it.nama;
    });
    return map;
  }

  async function exportExcel(rows: MenuExportItem[], rangeLabel: string, filename: string) {
    const XLSX = await import("xlsx");

    const exportRows = rows.map((m) => {
      const itemsMap = buildItemsMap(m.items);
      const row: Record<string, string | number> = {
        Tanggal: formatTanggal(m.menu_date),
        "Nama Menu": m.menu_name,
        Deskripsi: m.description || "-",
        Status: STATUS_LABELS[m.status] ?? m.status,
        "Total Porsi": m.total_portions,
        "Batas Konsumsi": m.consumption_limit || "-",
        "Makanan Pokok": itemsMap.makanan_pokok || "-",
        "Protein Hewani": itemsMap.protein_hewani || "-",
        "Protein Nabati": itemsMap.protein_nabati || "-",
        Sayur: itemsMap.sayur || "-",
        Buah: itemsMap.buah || "-",
        "Penerima Manfaat": m.benefits.length > 0 ? m.benefits.join(", ") : "-",
      };

      GROUP_ORDER.forEach((key) => {
        const p = m.portions.find((x) => x.group_key === key);
        const label = GROUP_LABELS[key];
        row[`${label} - Jumlah Porsi`] = p?.portion_count ?? 0;
        row[`${label} - Energi (kkal)`] = p?.energi_kkal ?? 0;
        row[`${label} - Protein (g)`] = p?.protein_g ?? 0;
        row[`${label} - Lemak (g)`] = p?.lemak_g ?? 0;
        row[`${label} - Karbohidrat (g)`] = p?.karbohidrat_g ?? 0;
        row[`${label} - Serat (g)`] = p?.serat_g ?? 0;
      });

      row["Link Foto"] = m.photo_url || "-";

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const headers = Object.keys(exportRows[0] ?? {});
    const photoColIndex = headers.indexOf("Link Foto");

    if (photoColIndex >= 0) {
      rows.forEach((m, i) => {
        if (!m.photo_url) return;
        const cellAddress = XLSX.utils.encode_cell({ r: i + 1, c: photoColIndex });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].l = { Target: m.photo_url, Tooltip: "Buka foto menu" };
        }
      });
    }

    worksheet["!cols"] = headers.map((h) => ({ wch: Math.max(14, h.length + 2) }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Menu (${rangeLabel})`);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  async function exportPdf(rows: MenuExportItem[], rangeLabel: string, filename: string) {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();

    for (let i = 0; i < rows.length; i++) {
      const m = rows[i];
      setProgress(`Menyiapkan menu ${i + 1} dari ${rows.length}...`);

      if (i > 0) doc.addPage();

      let cursorY = 16;

      doc.setFontSize(14);
      doc.text("SPPG Getassrabi 02 - Laporan Menu MBG", 14, cursorY);
      cursorY += 6;
      doc.setFontSize(9);
      doc.setTextColor(110);
      doc.text(`Periode export: ${rangeLabel}`, 14, cursorY);
      doc.setTextColor(0);
      cursorY += 10;

      doc.setFontSize(12);
      doc.text(`${formatTanggal(m.menu_date)} - ${m.menu_name}`, 14, cursorY);
      cursorY += 6;

      doc.setFontSize(9);
      doc.setTextColor(90);
      const statusText = `Status: ${STATUS_LABELS[m.status] ?? m.status}  |  Total porsi: ${m.total_portions}  |  Batas konsumsi: ${m.consumption_limit || "-"}`;
      doc.text(statusText, 14, cursorY);
      doc.setTextColor(0);
      cursorY += 6;

      if (m.description) {
        const descLines = doc.splitTextToSize(m.description, 130);
        doc.setFontSize(9);
        doc.text(descLines, 14, cursorY);
        cursorY += descLines.length * 4 + 2;
      }

      // Foto menu (kalau ada)
      if (m.photo_url) {
        const img = await fetchImageAsDataUrl(m.photo_url);
        if (img) {
          try {
            doc.addImage(img.dataUrl, img.format, 150, 16, 46, 34);
          } catch {
            // gagal render gambar, lanjut tanpa foto untuk menu ini
          }
        }
      }

      cursorY = Math.max(cursorY, 55);

      const itemsMap = buildItemsMap(m.items);
      autoTable(doc, {
        startY: cursorY,
        head: [["Komponen", "Nama"]],
        body: Object.entries(ITEM_CATEGORY_LABELS)
          .filter(([key]) => itemsMap[key])
          .map(([key, label]) => [label, itemsMap[key]]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [18, 42, 76] },
        margin: { left: 14, right: 14 },
      });

      // @ts-expect-error - lastAutoTable disuntikkan oleh plugin jspdf-autotable
      cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 6;

      autoTable(doc, {
        startY: cursorY,
        head: [["Kelompok", "Jml Porsi", "Energi", "Protein", "Lemak", "Karbo", "Serat"]],
        body: GROUP_ORDER.map((key) => {
          const p = m.portions.find((x) => x.group_key === key);
          return [
            GROUP_LABELS[key],
            String(p?.portion_count ?? 0),
            String(p?.energi_kkal ?? 0),
            String(p?.protein_g ?? 0),
            String(p?.lemak_g ?? 0),
            String(p?.karbohidrat_g ?? 0),
            String(p?.serat_g ?? 0),
          ];
        }),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 122, 79] },
        margin: { left: 14, right: 14 },
      });

      // @ts-expect-error - lastAutoTable disuntikkan oleh plugin jspdf-autotable
      cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 6;

      if (m.benefits.length > 0) {
        doc.setFontSize(9);
        doc.text(`Penerima manfaat: ${m.benefits.join(", ")}`, 14, cursorY);
      }
    }

    doc.save(`${filename}.pdf`);
  }

  function handleExport() {
    setError("");
    startTransition(async () => {
      const rows = await getMenuExportData(range);

      if (rows.length === 0) {
        setError("Tidak ada data menu pada periode ini.");
        return;
      }

      const rangeLabel = RANGE_OPTIONS.find((r) => r.value === range)?.label ?? "";
      const filename = `menu-sppg-${range}-${new Date().toISOString().slice(0, 10)}`;

      setProgress("Menyiapkan data...");

      if (format === "excel") {
        await exportExcel(rows, rangeLabel, filename);
      } else if (format === "pdf") {
        await exportPdf(rows, rangeLabel, filename);
      }

      setProgress("");
      closeModal();
    });
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => openModal("pdf")}
          className="flex items-center gap-2 border border-line text-navy text-[12px] font-medium px-4 py-[10px] rounded-full bg-white hover:bg-soft"
        >
          <FileText size={14} /> Export PDF
        </button>
        <button
          onClick={() => openModal("excel")}
          className="flex items-center gap-2 border border-line text-navy text-[12px] font-medium px-4 py-[10px] rounded-full bg-white hover:bg-soft"
        >
          <FileSpreadsheet size={14} /> Export Excel
        </button>
      </div>

      {format && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <button
            aria-label="Tutup"
            onClick={closeModal}
            className="absolute inset-0 bg-navy/60 backdrop-blur-[2px]"
          />
          <div className="relative bg-white rounded-2xl w-full max-w-[380px] p-6 shadow-[0_20px_50px_rgba(18,42,76,0.25)]">
            <h3 className="font-display text-navy text-[18px] mb-1">
              Export Menu ke {format === "pdf" ? "PDF" : "Excel"}
            </h3>
            <p className="text-muted text-[12px] mb-4">
              {format === "pdf"
                ? "Laporan lengkap: deskripsi, komponen makanan, porsi & gizi per kelompok, penerima manfaat, dan foto menu."
                : "Data lengkap dalam tabel, termasuk link foto menu (foto tidak tertanam langsung di Excel)."}
            </p>

            <div className="space-y-2 mb-5">
              {RANGE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-[10px] cursor-pointer text-[13px] ${
                    range === opt.value
                      ? "border-navy bg-[#EEF6EF] text-navy font-medium"
                      : "border-line text-navy"
                  }`}
                >
                  <input
                    type="radio"
                    name="export-range"
                    value={opt.value}
                    checked={range === opt.value}
                    onChange={() => setRange(opt.value)}
                    className="accent-navy"
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {error && (
              <p className="text-danger text-[12px] bg-[#FDECEA] rounded-lg px-3 py-2 mb-3">
                {error}
              </p>
            )}
            {isPending && progress && (
              <p className="text-muted text-[12px] mb-3">{progress}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={closeModal}
                disabled={isPending}
                className="flex-1 border border-line text-navy text-[13px] font-medium py-[11px] rounded-full disabled:opacity-60"
              >
                Batal
              </button>
              <button
                onClick={handleExport}
                disabled={isPending}
                className="flex-1 bg-navy text-white text-[13px] font-medium py-[11px] rounded-full disabled:opacity-60"
              >
                {isPending ? "Memproses..." : "Export"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}