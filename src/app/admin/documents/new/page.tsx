"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument } from "@/actions/documents";

export default function NewDocumentPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    try {
      const doc = await createDocument(title.trim());
      router.push(`/admin/documents/${doc.id}`);
    } catch (err) {
      setError("Belge oluşturulamadı. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-xl">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Yeni Belge Oluştur</h1>
          <p className="text-gray-500 text-sm mt-1">
            Belge oluşturulduğunda sistem otomatik olarak bir QR kod üretecek.
          </p>
        </div>

        {/* Akış Bilgisi */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">📋 İş Akışı</h3>
          <ol className="space-y-2 text-sm text-blue-700">
            <li className="flex gap-2"><span className="font-bold">1.</span> Belge başlığını girin ve oluşturun</li>
            <li className="flex gap-2"><span className="font-bold">2.</span> Sistem QR kod üretir → indirin</li>
            <li className="flex gap-2"><span className="font-bold">3.</span> QR kodu fiziksel belgeye ekleyerek imzalatın</li>
            <li className="flex gap-2"><span className="font-bold">4.</span> İmzalı PDF&apos;i sisteme yükleyin ve bilgileri doldurun</li>
            <li className="flex gap-2"><span className="font-bold">5.</span> Belgeyi &quot;Aktif&quot; yaparak doğrulamaya açın</li>
          </ol>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Belge Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Örn: Elektrik Periyodik Kontrol Raporu"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Oluşturuluyor..." : "Oluştur ve QR Kod Üret →"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
