import { getDocuments } from "@/actions/documents";
import Link from "next/link";
import type { DocumentStatus } from "@/types/database";

const statusConfig: Record<DocumentStatus, { label: string; color: string }> = {
  PENDING: { label: "Beklemede", color: "bg-yellow-100 text-yellow-800" },
  ACTIVE: { label: "Aktif", color: "bg-green-100 text-green-800" },
  EXPIRED: { label: "Süresi Doldu", color: "bg-gray-100 text-gray-600" },
  REVOKED: { label: "İptal Edildi", color: "bg-red-100 text-red-800" },
};

export default async function DashboardPage() {
  const documents = await getDocuments();

  const counts = {
    total: documents.length,
    PENDING: documents.filter((d) => d.status === "PENDING").length,
    ACTIVE: documents.filter((d) => d.status === "ACTIVE").length,
    EXPIRED: documents.filter((d) => d.status === "EXPIRED").length,
    REVOKED: documents.filter((d) => d.status === "REVOKED").length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Evrak yönetim sistemine hoş geldiniz</p>
      </div>

      {/* Stat Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Toplam Belge", value: counts.total, color: "bg-blue-50 text-blue-700", icon: "📄" },
          { label: "Aktif", value: counts.ACTIVE, color: "bg-green-50 text-green-700", icon: "✅" },
          { label: "Beklemede", value: counts.PENDING, color: "bg-yellow-50 text-yellow-700", icon: "⏳" },
          { label: "İptal/Süresi Doldu", value: counts.REVOKED + counts.EXPIRED, color: "bg-red-50 text-red-700", icon: "❌" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-5 ${stat.color}`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-sm font-medium opacity-80 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Hızlı İşlemler */}
      <div className="flex gap-3 mb-8">
        <Link
          href="/admin/documents/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Belge Oluştur
        </Link>
        <Link
          href="/admin/documents"
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Tüm Belgeleri Gör
        </Link>
      </div>

      {/* Son Belgeler */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Son Belgeler</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {documents.slice(0, 5).map((doc) => {
            const status = statusConfig[doc.status as DocumentStatus];
            return (
              <div key={doc.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(doc.created_at).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}>
                    {status.label}
                  </span>
                  <Link
                    href={`/admin/documents/${doc.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Düzenle →
                  </Link>
                </div>
              </div>
            );
          })}
          {documents.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              Henüz belge bulunmuyor.{" "}
              <Link href="/admin/documents/new" className="text-blue-600 hover:underline">
                İlk belgeyi oluşturun
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
