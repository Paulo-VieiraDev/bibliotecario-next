import { supabase } from "@/lib/supabase"
import type { Livro } from "@/types"

export async function getLivros() {
  const { data, error } = await supabase
    .from("livros")
    .select("*")
    .order("titulo")

  if (error) throw error
  return data as Livro[]
}

export async function getLivro(id: string) {
  const { data, error } = await supabase
    .from("livros")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as Livro
}

export async function createLivro(livro: Omit<Livro, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("livros")
    .insert([livro])
    .select()
    .single()

  if (error) throw error
  return data as Livro
}

export async function updateLivro(id: string, livro: Partial<Livro>) {
  const { data, error } = await supabase
    .from("livros")
    .update(livro)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Livro
}

export async function deleteLivro(id: string) {
  const { error } = await supabase
    .from("livros")
    .delete()
    .eq("id", id)

  if (error) throw error
} 