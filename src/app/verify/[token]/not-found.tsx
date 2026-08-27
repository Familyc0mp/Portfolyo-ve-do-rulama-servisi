import Link from "next/link";

export default function VerifyNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Belge Bulunamadı</h1>
        <p className="text-gray-500 mb-6">
          Bu QR koda ait bir belge sistemde kayıtlı değil. Lütfen kodu tekrar tarayın veya belge sahibiyle iletişime geçin.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
