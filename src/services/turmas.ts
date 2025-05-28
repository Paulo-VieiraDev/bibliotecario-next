import { supabase } from "@/lib/supabase"

export async function getTurmas() {
  const { data, error } = await supabase.from("turmas").select("*").order("nome")
  if (error) throw error
  return data as { id: string; nome: string }[]
} 