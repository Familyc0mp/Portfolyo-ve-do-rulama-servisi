import { getDocumentByToken } from "@/actions/documents";
import { notFound } from "next/navigation";
import type { DocumentStatus, Signer } from "@/types/database";
import Link from "next/link";

const statusConfig: Record<
  DocumentStatus,
  { label: string; color: string; bg: string; icon: string; description: string }
> = {
  PENDING: {
    label: "Beklemede",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    icon: "⏳",
    description: "Bu belge henüz aktifleştirilmemiştir.",
  },
  ACTIVE: {
    label: "Geçerli Belge",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: "✅",
    description: "Bu belge doğrulanmıştır ve geçerlidir.",
  },
  EXPIRED: {
    label: "Süresi Doldu",
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
    icon: "⌛",
    description: "Bu belgenin geçerlilik süresi sona ermiştir.",
  },
  REVOKED: {
    label: "İptal Edildi",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: "❌",
    description: "Bu belge iptal edilmiştir.",
  },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const document = await getDocumentByToken(token);

  if (!document) notFound();

  const status = statusConfig[document.status as DocumentStatus];
  const signers: Signer[] = document.signers || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-semibold text-sm">Evrak Doğrulama Sistemi</span>
          </Link>
          <span className="text-xs text-gray-400">Resmi Doğrulama</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* Durum Kartı */}
        <div className={`rounded-2xl border-2 p-6 ${status.bg}`}>
          <div className="flex items-start gap-4">
            <span className="text-4xl">{status.icon}</span>
            <div>
              <h1 className={`text-xl font-bold ${status.color}`}>{status.label}</h1>
              <p className={`text-sm mt-1 ${status.color} opacity-80`}>{status.description}</p>
            </div>
          </div>
        </div>

        {/* Belge Bilgileri */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Belge Bilgileri</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Belge Başlığı</p>
              <p className="text-gray-900 font-medium mt-1">{document.title}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Oluşturulma Tarihi</p>
                <p className="text-gray-900 text-sm font-medium mt-1">{formatDate(document.created_date)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Geçerlilik Başlangıcı</p>
                <p className="text-gray-900 text-sm font-medium mt-1">{formatDate(document.valid_from)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Geçerlilik Bitişi</p>
                <p className="text-gray-900 text-sm font-medium mt-1">{formatDate(document.valid_until)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kurum Bilgileri */}
        {(document.institution_name || document.institution_director) && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Kurum Bilgileri</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {document.institution_name && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Kurum Adı</p>
                    <p className="text-gray-900 font-medium mt-1">{document.institution_name}</p>
                  </div>
                )}
                {document.institution_director && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Müdür</p>
                    <p className="text-gray-900 font-medium mt-1">{document.institution_director}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* İmzacılar */}
        {signers.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900">
                İmzacılar
                <span className="ml-2 text-xs font-normal text-gray-400">({signers.length} kişi)</span>
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {signers.map((signer, index) => (
                <div key={signer.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {signer.first_name} {signer.last_name}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">{signer.profession}</p>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {signer.ekipnet_number && (
                          <div>
                            <span className="text-xs text-gray-400">Ekipnet No: </span>
                            <span className="text-xs font-medium text-gray-700">{signer.ekipnet_number}</span>
                          </div>
                        )}
                        {signer.chamber_registration_number && (
                          <div>
                            <span className="text-xs text-gray-400">Oda Kayıt No: </span>
                            <span className="text-xs font-medium text-gray-700">{signer.chamber_registration_number}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PDF İndirme */}
        {document.pdf_url && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">İmzalı Belge</p>
                <p className="text-xs text-gray-500">PDF formatında görüntüleyin veya indirin</p>
              </div>
            </div>
            <a
              href={document.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Görüntüle / İndir
            </a>
          </div>
        )}

        {/* Alt Bilgi */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">
            Bu doğrulama sayfası{" "}
            <Link href="/" className="text-blue-500 hover:underline">
              resmi sistemimiz
            </Link>{" "}
            tarafından üretilmiştir.
          </p>
          <p className="text-xs text-gray-300 mt-1 font-mono">
            token: {token}
          </p>
        </div>
      </main>
    </div>
  );
}
