import { getAllPortfolioContent } from "@/actions/portfolio";
import type { HeroContent, ServicesContent, AboutContent, ContactContent } from "@/types/database";
import Link from "next/link";

export const revalidate = 60; // Her 60 saniyede bir yenile

export default async function HomePage() {
  const contents = await getAllPortfolioContent();
  const contentMap = Object.fromEntries(contents.map((c) => [c.section, c.content]));

  const hero = contentMap.hero as HeroContent | undefined;
  const services = contentMap.services as ServicesContent | undefined;
  const about = contentMap.about as AboutContent | undefined;
  const contact = contentMap.contact as ContactContent | undefined;

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">{hero?.title || "Şirket Adı"}</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#hizmetler" className="hover:text-blue-600 transition">Hizmetler</a>
            <a href="#hakkimizda" className="hover:text-blue-600 transition">Hakkımızda</a>
            <a href="#iletisim" className="hover:text-blue-600 transition">İletişim</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Dijital Evrak Doğrulama Sistemi
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {hero?.title || "Şirket Adınız"}
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {hero?.subtitle || "Profesyonel hizmetlerimiz ve güvenilir evrak doğrulama sistemimizle yanınızdayız."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={hero?.cta_link || "#hizmetler"}
              className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition"
            >
              {hero?.cta_text || "Hizmetlerimiz"}
            </a>
            <a
              href="#iletisim"
              className="px-8 py-3 border border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Bize Ulaşın
            </a>
          </div>
        </div>
      </section>

      {/* Hizmetler */}
      <section id="hizmetler" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{services?.title || "Hizmetlerimiz"}</h2>
            <p className="text-gray-500 mt-3">{services?.subtitle || "Sunduğumuz profesyonel hizmetler"}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(services?.items || [
              { id: "1", title: "Periyodik Kontrol", description: "Yasal zorunluluklar kapsamında periyodik kontrol ve muayene hizmetleri", icon: "🔧" },
              { id: "2", title: "Teknik Rapor", description: "Uzman kadromuzca hazırlanan detaylı teknik raporlar", icon: "📋" },
              { id: "3", title: "Dijital Doğrulama", description: "QR kod ile anında evrak doğrulama imkânı", icon: "✅" },
            ]).map((service) => (
              <div key={service.id} className="p-6 border border-gray-200 rounded-2xl hover:shadow-md transition">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evrak Doğrulama Bilgi Kartı */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-blue-200 p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Evrak Doğrulama</h2>
              <p className="text-gray-600 mb-4">
                Tarafınıza sunulan evrakların gerçekliğini QR kodu okutarak anında doğrulayabilirsiniz.
                Belge bilgileri, imzacılar ve geçerlilik tarihleri şeffaf biçimde görüntülenir.
              </p>
              <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 inline-block">
                📱 QR kodu okutun → Belge bilgilerini görün
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hakkımızda */}
      <section id="hakkimizda" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {about?.title || "Hakkımızda"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {about?.description || "Şirketimiz hakkında bilgi buraya gelecek."}
          </p>
          {about?.founded_year && (
            <div className="mt-8 inline-flex items-center gap-2 bg-gray-100 rounded-full px-5 py-2 text-sm text-gray-600">
              🏢 {about.founded_year} yılından bu yana hizmetinizdeyiz
            </div>
          )}
        </div>
      </section>

      {/* İletişim */}
      <section id="iletisim" className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{contact?.title || "İletişim"}</h2>
          <p className="text-gray-400 mb-10">Sorularınız için bizimle iletişime geçin</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition">
                <div className="text-2xl mb-2">📧</div>
                <p className="text-sm text-gray-400 mb-1">E-posta</p>
                <p className="font-medium">{contact.email}</p>
              </a>
            )}
            {contact?.phone && (
              <a href={`tel:${contact.phone}`} className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition">
                <div className="text-2xl mb-2">📞</div>
                <p className="text-sm text-gray-400 mb-1">Telefon</p>
                <p className="font-medium">{contact.phone}</p>
              </a>
            )}
            {contact?.address && (
              <div className="bg-gray-800 rounded-2xl p-6">
                <div className="text-2xl mb-2">📍</div>
                <p className="text-sm text-gray-400 mb-1">Adres</p>
                <p className="font-medium text-sm">{contact.address}</p>
              </div>
            )}
            {!contact?.email && !contact?.phone && !contact?.address && (
              <div className="md:col-span-3 text-gray-500">
                İletişim bilgileri admin panelinden eklenecek.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 py-6 px-4 text-center text-sm">
        <p>
          © {new Date().getFullYear()} {hero?.title || "Şirket Adı"} — Tüm hakları saklıdır.
        </p>
        <p className="mt-1 text-xs text-gray-600">
          Evrak doğrulama için QR kodu okutun veya{" "}
          <Link href="/verify" className="text-gray-500 hover:text-gray-400 underline">
            doğrulama sayfasını
          </Link>{" "}
          ziyaret edin.
        </p>
      </footer>
    </div>
  );
}
