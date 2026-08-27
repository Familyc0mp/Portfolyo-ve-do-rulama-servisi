"use client";

import { useState } from "react";
import { createSigner, deleteSigner, updateSigner } from "@/actions/signers";
import type { Signer } from "@/types/database";

interface SignerManagerProps {
  documentId: string;
  initialSigners: Signer[];
}

interface SignerFormData {
  first_name: string;
  last_name: string;
  profession: string;
  ekipnet_number: string;
  chamber_registration_number: string;
}

const emptyForm: SignerFormData = {
  first_name: "",
  last_name: "",
  profession: "",
  ekipnet_number: "",
  chamber_registration_number: "",
};

export default function SignerManager({ documentId, initialSigners }: SignerManagerProps) {
  const [signers, setSigners] = useState<Signer[]>(initialSigners);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SignerFormData>(emptyForm);
  const [loading, setLoading] = useState(false);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const signer = await createSigner(documentId, {
        ...form,
        display_order: signers.length,
      });
      setSigners((prev) => [...prev, signer]);
      setForm(emptyForm);
      setShowForm(false);
    } catch {
      alert("İmzacı eklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    try {
      const updated = await updateSigner(editingId, documentId, form);
      setSigners((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
      setEditingId(null);
      setForm(emptyForm);
    } catch {
      alert("Güncellenemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(signerId: string) {
    if (!confirm("Bu imzacıyı silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    try {
      await deleteSigner(signerId, documentId);
      setSigners((prev) => prev.filter((s) => s.id !== signerId));
    } catch {
      alert("Silinemedi.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(signer: Signer) {
    setEditingId(signer.id);
    setForm({
      first_name: signer.first_name,
      last_name: signer.last_name,
      profession: signer.profession,
      ekipnet_number: signer.ekipnet_number || "",
      chamber_registration_number: signer.chamber_registration_number || "",
    });
    setShowForm(false);
  }

  const SignerForm = ({ onSubmit, onCancel }: { onSubmit: (e: React.FormEvent) => void; onCancel: () => void }) => (
    <form onSubmit={onSubmit} className="border border-blue-200 bg-blue-50 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Ad *</label>
          <input name="first_name" value={form.first_name} onChange={handleFormChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Soyad *</label>
          <input name="last_name" value={form.last_name} onChange={handleFormChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Meslek *</label>
        <input name="profession" value={form.profession} onChange={handleFormChange} required
          placeholder="Örn: Elektrik Mühendisi"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Ekipnet No <span className="text-gray-400">(opsiyonel)</span></label>
          <input name="ekipnet_number" value={form.ekipnet_number} onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Oda Kayıt No <span className="text-gray-400">(opsiyonel)</span></label>
          <input name="chamber_registration_number" value={form.chamber_registration_number} onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? "Kaydediliyor..." : editingId ? "Güncelle" : "Ekle"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition">
          İptal
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-3">
      {/* İmzacı Listesi */}
      {signers.length > 0 && (
        <div className="space-y-2">
          {signers.map((signer, index) => (
            <div key={signer.id}>
              {editingId === signer.id ? (
                <SignerForm onSubmit={handleUpdate} onCancel={() => { setEditingId(null); setForm(emptyForm); }} />
              ) : (
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <p className="font-medium text-gray-900 text-sm">
                        {signer.first_name} {signer.last_name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-7">{signer.profession}</p>
                    <div className="flex gap-4 mt-1 ml-7">
                      {signer.ekipnet_number && (
                        <p className="text-xs text-gray-400">Ekipnet: {signer.ekipnet_number}</p>
                      )}
                      {signer.chamber_registration_number && (
                        <p className="text-xs text-gray-400">Oda: {signer.chamber_registration_number}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(signer)}
                      className="text-xs text-blue-600 hover:underline">Düzenle</button>
                    <button onClick={() => handleDelete(signer.id)}
                      className="text-xs text-red-500 hover:underline">Sil</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Yeni İmzacı Formu */}
      {showForm && !editingId && (
        <SignerForm onSubmit={handleAdd} onCancel={() => { setShowForm(false); setForm(emptyForm); }} />
      )}

      {/* Ekle Butonu */}
      {!showForm && !editingId && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl text-sm w-full hover:border-blue-400 hover:text-blue-600 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          İmzacı Ekle
        </button>
      )}

      {signers.length === 0 && !showForm && (
        <p className="text-xs text-gray-400 text-center py-2">Henüz imzacı eklenmedi.</p>
      )}
    </div>
  );
}
