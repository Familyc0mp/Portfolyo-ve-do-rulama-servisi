import { getDocuments } from "@/actions/documents";
import Link from "next/link";
import type { DocumentStatus } from "@/types/database";

const statusConfig: Record<DocumentStatus, { label: string; color: string }> = {
  PENDING: { label: "Beklemede", color: "bg-yellow-100 text-yellow-800" },
  ACTIVE: { label: "Aktif", color: "bg-green-100 text-green-800" },
  EXPIRED: { label: "Süresi Doldu", color: "bg-gray-100 text-gray-600" },
  REVOKED: { label: "İptal Edildi", color: "bg-red-100 text-red-800" },
};

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="p-8">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Belgeler</h1>
          <p className="text-gray-500 text-sm mt-1">{documents.length} belge bulundu</p>
        </div>
        <Link
          href="/admin/documents/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Belge
        </Link>
      </div>

      {/* Belge Listesi */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Belge Başlığı</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Durum</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Kurum</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Geçerlilik</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Oluşturulma</th>
              <th className="text-right px-6 py-3 font-medium text-gray-600">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {documents.map((doc) => {
              const status = statusConfig[doc.status as DocumentStatus];
              return (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{doc.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {doc.institution_name || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {doc.valid_until
                      ? new Date(doc.valid_until).toLocaleDateString("tr-TR")
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(doc.created_at).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/verify/${doc.token}`}
                        target="_blank"
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        Görüntüle
                      </Link>
                      <Link
                        href={`/admin/documents/${doc.id}`}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Düzenle →
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            {documents.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                  <p className="text-lg mb-2">📄</p>
                  <p>Henüz belge bulunmuyor.</p>
                  <Link href="/admin/documents/new" className="text-blue-600 hover:underline text-sm mt-1 inline-block">
                    İlk belgeyi oluşturun →
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
