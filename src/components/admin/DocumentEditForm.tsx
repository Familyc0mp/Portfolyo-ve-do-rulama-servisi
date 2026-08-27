"use client";

import { useState } from "react";
import { updateDocument, updateDocumentStatus, uploadPDF } from "@/actions/documents";
import type { Document, DocumentStatus } from "@/types/database";

export default function DocumentEditForm({ document }: { document: Document }) {
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(document.pdf_url || "");

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    try {
      await updateDocument(document.id, {
        title: formData.get("title") as string,
        created_date: formData.get("created_date") as string || undefined,
        valid_from: formData.get("valid_from") as string || undefined,
        valid_until: formData.get("valid_until") as string || undefined,
        institution_name: formData.get("institution_name") as string || undefined,
        institution_director: formData.get("institution_director") as string || undefined,
        notes: formData.get("notes") as string || undefined,
      });
      setMessage({ type: "success", text: "Belge bilgileri kaydedildi." });
    } catch {
      setMessage({ type: "error", text: "Kaydetme başarısız." });
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(status: DocumentStatus) {
    setLoading(true);
    try {
      await updateDocumentStatus(document.id, status);
      setMessage({ type: "success", text: `Belge durumu "${status}" olarak güncellendi.` });
    } catch {
      setMessage({ type: "error", text: "Durum güncellenemedi." });
    } finally {
      setLoading(false);
    }
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);
    try {
      const url = await uploadPDF(document.id, formData);
      setCurrentPdfUrl(url);
      setMessage({ type: "success", text: "PDF başarıyla yüklendi." });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "PDF yüklenemedi.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Durum Değiştirme */}
      <div className="flex gap-2 flex-wrap">
        {(["PENDING", "ACTIVE", "REVOKED"] as DocumentStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={document.status === s || loading}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
              document.status === s
                ? "bg-gray-200 text-gray-600 border-gray-300 cursor-default"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "PENDING" ? "Beklemede Yap" : s === "ACTIVE" ? "✅ Aktifleştir" : "❌ İptal Et"}
          </button>
        ))}
      </div>

      {/* Ana Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Belge Başlığı *</label>
          <input
            name="title"
            defaultValue={document.title}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Oluşturulma Tarihi</label>
            <input
              type="date"
              name="created_date"
              defaultValue={document.created_date || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Geçerlilik Başlangıcı</label>
            <input
              type="date"
              name="valid_from"
              defaultValue={document.valid_from || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Geçerlilik Bitişi</label>
            <input
              type="date"
              name="valid_until"
              defaultValue={document.valid_until || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kurum Adı</label>
            <input
              name="institution_name"
              defaultValue={document.institution_name || ""}
              placeholder="Örn: XYZ Fabrikası A.Ş."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Müdür Adı</label>
            <input
              name="institution_director"
              defaultValue={document.institution_director || ""}
              placeholder="Örn: Ahmet Yılmaz"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notu</label>
          <textarea
            name="notes"
            defaultValue={document.notes || ""}
            rows={2}
            placeholder="İç kullanım için not (doğrulama sayfasında gösterilmez)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {message && (
          <div className={`text-sm px-4 py-3 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>

      {/* PDF Yükleme */}
      <div className="border-t border-gray-100 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">İmzalanmış PDF</label>
        {currentPdfUrl && (
          <div className="flex items-center gap-2 mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-green-700">PDF yüklenmiş</span>
            <a href={currentPdfUrl} target="_blank" className="text-xs text-green-600 underline ml-auto">Görüntüle</a>
          </div>
        )}
        <div className="relative">
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            disabled={pdfLoading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {pdfLoading && <span className="text-xs text-gray-500 mt-1 block">Yükleniyor...</span>}
        </div>
      </div>
    </div>
  );
}
