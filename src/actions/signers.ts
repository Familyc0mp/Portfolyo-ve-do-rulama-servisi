"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createSigner(
  documentId: string,
  signer: {
    first_name: string;
    last_name: string;
    profession: string;
    ekipnet_number?: string;
    chamber_registration_number?: string;
    display_order?: number;
  }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("signers")
    .insert({ ...signer, document_id: documentId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/documents/${documentId}`);
  return data;
}

export async function updateSigner(
  signerId: string,
  documentId: string,
  updates: {
    first_name?: string;
    last_name?: string;
    profession?: string;
    ekipnet_number?: string;
    chamber_registration_number?: string;
    display_order?: number;
  }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("signers")
    .update(updates)
    .eq("id", signerId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/documents/${documentId}`);
  return data;
}

export async function deleteSigner(signerId: string, documentId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("signers")
    .delete()
    .eq("id", signerId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/documents/${documentId}`);
}

export async function reorderSigners(
  documentId: string,
  signerIds: string[]
) {
  const supabase = await createClient();
  const updates = signerIds.map((id, index) => ({
    id,
    display_order: index,
    document_id: documentId,
  }));

  const { error } = await supabase.from("signers").upsert(updates);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/documents/${documentId}`);
}
