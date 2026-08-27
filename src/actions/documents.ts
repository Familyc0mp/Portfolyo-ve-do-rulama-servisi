"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { DocumentStatus } from "@/types/database";

// ------- Belge listesini getir -------
export async function getDocuments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// ------- Token ile belge + imzacıları getir (doğrulama sayfası) -------
export async function getDocumentByToken(token: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select(
      `
      *,
      signers (
        *
      )
    `
    )
    .eq("token", token)
    .order("display_order", { referencedTable: "signers", ascending: true })
    .single();

  if (error) return null;
  return data;
}

// ------- ID ile belge + imzacıları getir (admin düzenleme) -------
export async function getDocumentById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select(
      `
      *,
      signers (
        *
      )
    `
    )
    .eq("id", id)
    .order("display_order", { referencedTable: "signers", ascending: true })
    .single();

  if (error) return null;
  return data;
}

// ------- Yeni belge oluştur (QR için) -------
export async function createDocument(title: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .insert({ title, status: "PENDING" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/documents");
  return data;
}

// ------- Belge güncelle -------
export async function updateDocument(
  id: string,
  updates: {
    title?: string;
    status?: DocumentStatus;
    pdf_url?: string;
    created_date?: string;
    valid_from?: string;
    valid_until?: string;
    institution_name?: string;
    institution_director?: string;
    notes?: string;
  }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${id}`);
  return data;
}

// ------- Belge durumunu değiştir -------
export async function updateDocumentStatus(id: string, status: DocumentStatus) {
  return updateDocument(id, { status });
}

// ------- Belge sil -------
export async function deleteDocument(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/documents");
}

// ------- PDF yükle -------
export async function uploadPDF(documentId: string, formData: FormData) {
  const supabase = await createAdminClient();
  const file = formData.get("pdf") as File;

  if (!file) throw new Error("PDF dosyası bulunamadı");

  // Dosya adındaki Türkçe ve özel karakterleri güvenli hale getirelim
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${documentId}/${Date.now()}_${sanitizedName}`;

  // Supabase'deki bucket adı "PDFS" veya "pdfs" olabilir, ilk denemeyi yapalım
  let bucketName = "PDFS";
  let { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, { 
      upsert: true,
      contentType: file.type || "application/pdf"
    });

  if (uploadError && uploadError.message.includes("Bucket not found")) {
    bucketName = "pdfs";
    const retry = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, { 
        upsert: true,
        contentType: file.type || "application/pdf"
      });
    uploadError = retry.error;
  }

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error(uploadError.message || "PDF yüklenirken bir hata oluştu");
  }

  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  await updateDocument(documentId, { pdf_url: urlData.publicUrl });
  return urlData.publicUrl;
}
