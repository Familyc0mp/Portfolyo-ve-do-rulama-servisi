import { getDocumentById } from "@/actions/documents";
import { notFound } from "next/navigation";
import DocumentEditForm from "@/components/admin/DocumentEditForm";
import QRDisplay from "@/components/admin/QRDisplay";
import SignerManager from "@/components/admin/SignerManager";
import Link from "next/link";
import type { DocumentStatus } from "@/types/database";

const statusConfig: Record<DocumentStatus, { label: string; color: string }> = {
  PENDING: { label: "Beklemede", color: "bg-yellow-100 text-yellow-800" },
  ACTIVE: { label: "Aktif", color: "bg-green-100 text-green-800" },
  EXPIRED: { label: "Süresi Doldu", color: "bg-gray-100 text-gray-600" },
  REVOKED: { label: "İptal Edildi", color: "bg-red-100 text-red-800" },
};

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await getDocumentById(id);

  if (!document) notFound();

  const status = statusConfig[document.status as DocumentStatus];
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify/${document.token}`;

  return (
    <div className="p-8">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/documents" className="hover:text-gray-700">Belgeler</Link>
            <span>›</span>
            <span className="text-gray-900">{document.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">{document.title}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>
        <Link
          href={`/verify/${document.token}`}
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Doğrulama Sayfası
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol: Form ve İmzacılar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Belge Bilgileri Formu */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Belge Bilgileri</h2>
            <DocumentEditForm document={document} />
          </div>

          {/* İmzacı Yönetimi */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">İmzacılar</h2>
            <SignerManager
              documentId={document.id}
              initialSigners={document.signers || []}
            />
          </div>
        </div>

        {/* Sağ: QR Kod */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">QR Kod</h2>
            <QRDisplay token={document.token} verifyUrl={verifyUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
