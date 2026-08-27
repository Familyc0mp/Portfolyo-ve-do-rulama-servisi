"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRDisplayProps {
  token: string;
  verifyUrl: string;
}

export default function QRDisplay({ token, verifyUrl }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    generateQR();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function generateQR() {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 280;
    canvas.width = size;
    canvas.height = size;

    // 1. QR kodu canvas'a çiz
    await QRCode.toCanvas(canvas, verifyUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: size,
      color: {
        dark: "#1a1a2e",
        light: "#ffffff",
      },
    });

    // 2. Ortaya onay (✓) ikonu ekle
    const iconSize = 52;
    const x = (size - iconSize) / 2;
    const y = (size - iconSize) / 2;

    // Beyaz arka plan
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x + iconSize / 2, y + iconSize / 2, iconSize / 2 + 4, 0, 2 * Math.PI);
    ctx.fill();

    // Yeşil daire
    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.arc(x + iconSize / 2, y + iconSize / 2, iconSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    // ✓ işareti
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x + 13, y + iconSize / 2);
    ctx.lineTo(x + iconSize / 2 - 2, y + iconSize - 14);
    ctx.lineTo(x + iconSize - 10, y + 14);
    ctx.stroke();

    // Data URL olarak kaydet
    const dataUrl = canvas.toDataURL("image/png");
    setQrDataUrl(dataUrl);
  }

  function downloadQR() {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qr-${token.slice(0, 8)}.png`;
    link.href = qrDataUrl;
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas (gizli - üretim için) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Önizleme */}
      {qrDataUrl ? (
        <div className="border-2 border-gray-100 rounded-xl p-3 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="QR Kod"
            className="w-56 h-56 object-contain"
          />
        </div>
      ) : (
        <div className="w-56 h-56 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-xs">QR Oluşturuluyor...</span>
        </div>
      )}

      {/* URL Bilgisi */}
      <div className="w-full">
        <p className="text-xs text-gray-500 mb-1 font-medium">Doğrulama URL&apos;i:</p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-600 break-all font-mono">{verifyUrl}</p>
        </div>
      </div>

      {/* İndirme Butonu */}
      <button
        onClick={downloadQR}
        disabled={!qrDataUrl}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        PNG İndir
      </button>

      {/* Token Bilgisi */}
      <p className="text-xs text-gray-400 text-center">
        Token: <span className="font-mono">{token.slice(0, 8)}...</span>
      </p>
    </div>
  );
}
