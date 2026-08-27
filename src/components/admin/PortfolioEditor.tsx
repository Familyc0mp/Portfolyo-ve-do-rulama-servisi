"use client";

import { useState } from "react";
import { updatePortfolioContent } from "@/actions/portfolio";

interface PortfolioEditorProps {
  initialContent: Record<string, Record<string, unknown>>;
}

const tabs = [
  { id: "hero", label: "🏠 Ana Sayfa (Hero)" },
  { id: "services", label: "🛠️ Hizmetler" },
  { id: "about", label: "ℹ️ Hakkımızda" },
  { id: "contact", label: "📞 İletişim" },
];

export default function PortfolioEditor({ initialContent }: PortfolioEditorProps) {
  const [activeTab, setActiveTab] = useState("hero");
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleChange(section: string, key: string, value: string) {
    setContent((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [key]: value },
    }));
  }

  async function handleSave(section: string) {
    setLoading(true);
    setMessage(null);
    try {
      await updatePortfolioContent(section, content[section] || {});
      setMessage({ type: "success", text: "İçerik kaydedildi. Ana sayfa otomatik güncellendi." });
    } catch {
      setMessage({ type: "error", text: "Kaydetme başarısız." });
    } finally {
      setLoading(false);
    }
  }

  const field = (section: string, key: string, label: string, placeholder?: string, multiline?: boolean) => {
    const val = String(content[section]?.[key] || "");
    return (
      <div key={key}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {multiline ? (
          <textarea
            value={val}
            onChange={(e) => handleChange(section, key, e.target.value)}
            rows={4}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        ) : (
          <input
            type="text"
            value={val}
            onChange={(e) => handleChange(section, key, e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>
    );
  };

  const renderSection = () => {
    switch (activeTab) {
      case "hero":
        return (
          <div className="space-y-4">
            {field("hero", "title", "Başlık", "Şirket adınız veya slogan")}
            {field("hero", "subtitle", "Alt Başlık", "Kısa açıklama", true)}
            {field("hero", "cta_text", "Buton Metni", "Örn: Hizmetlerimiz")}
            {field("hero", "cta_link", "Buton Linki", "#hizmetler")}
          </div>
        );
      case "services":
        return (
          <div className="space-y-4">
            {field("services", "title", "Bölüm Başlığı", "Örn: Hizmetlerimiz")}
            {field("services", "subtitle", "Bölüm Alt Başlığı", "Kısa açıklama")}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700">
              <strong>Not:</strong> Hizmet kartlarını eklemek/düzenlemek için JSON formatında düzenleme gerekiyor.
              Yakında görsel editör eklenecek.
            </div>
          </div>
        );
      case "about":
        return (
          <div className="space-y-4">
            {field("about", "title", "Bölüm Başlığı", "Hakkımızda")}
            {field("about", "description", "Şirket Açıklaması", "Şirketiniz hakkında bilgi", true)}
            {field("about", "founded_year", "Kuruluş Yılı", "2020")}
          </div>
        );
      case "contact":
        return (
          <div className="space-y-4">
            {field("contact", "title", "Bölüm Başlığı", "İletişim")}
            {field("contact", "email", "E-posta", "info@sirket.com")}
            {field("contact", "phone", "Telefon", "+90 212 000 00 00")}
            {field("contact", "address", "Adres", "Şehir, İlçe, Ülke", true)}
            {field("contact", "maps_url", "Google Maps URL", "https://maps.google.com/...")}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Sekmeler */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* İçerik */}
      <div className="p-6">
        {renderSection()}

        {message && (
          <div className={`mt-4 text-sm px-4 py-3 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        <button
          onClick={() => handleSave(activeTab)}
          disabled={loading}
          className="mt-5 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </div>
  );
}
