"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function MenuQrCode({
  menuDate,
  menuName,
}: {
  menuDate: string;
  menuName: string;
}) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const targetUrl = `${siteUrl}/menu/${menuDate}`;

    QRCode.toDataURL(targetUrl, {
      width: 96,
      margin: 1,
      color: { dark: "#122A4C", light: "#FFFFFF" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [menuDate]);

  function handleDownload() {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qr-menu-${menuDate}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (!dataUrl) {
    return <span className="text-muted text-[10px]">Memuat...</span>;
  }

  return (
    <button
      onClick={handleDownload}
      title={`Unduh QR menu ${menuName}`}
      className="flex flex-col items-center gap-1 group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt={`QR menu ${menuDate}`}
        className="w-10 h-10 rounded-md border border-line"
      />
      <span className="text-[9px] text-navy font-medium group-hover:underline">
        Unduh
      </span>
    </button>
  );
}