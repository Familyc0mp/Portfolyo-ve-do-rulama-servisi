"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getPortfolioContent(section: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_content")
    .select("*")
    .eq("section", section)
    .single();

  if (error) return null;
  return data;
}

export async function getAllPortfolioContent() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_content")
    .select("*");

  if (error) return [];
  return data;
}

export async function updatePortfolioContent(
  section: string,
  content: Record<string, unknown>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_content")
    .upsert({ section, content, updated_at: new Date().toISOString() }, { onConflict: "section" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return data;
}
