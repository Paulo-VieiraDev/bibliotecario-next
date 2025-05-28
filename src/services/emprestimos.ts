import { supabase } from "@/lib/supabase"
import type { Emprestimo, EmprestimoComDetalhes } from "@/types"

export async function getEmprestimos() {
  const { data, error } = await supabase
    .from("emprestimos")
    .select(`
      *,
      livro:livros(*),
      aluno:alunos(*)
    `)
    .order("data_emprestimo", { ascending: false })

  if (error) throw error
  return data as EmprestimoComDetalhes[]
}

export async function getEmprestimo(id: string) {
  const { data, error } = await supabase
    .from("emprestimos")
    .select(`
      *,
      livro:livros(*),
      aluno:alunos(*)
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data as EmprestimoComDetalhes
}

export async function createEmprestimo(
  emprestimo: Omit<Emprestimo, "id" | "created_at" | "data_devolucao">
) {
  const { data, error } = await supabase
    .from("emprestimos")
    .insert(emprestimo)
    .select()
    .single()

  if (error) throw error
  return data as Emprestimo
}

export async function devolverLivro(id: string) {
  const { data, error } = await supabase
    .from("emprestimos")
    .update({
      data_devolucao: new Date().toISOString(),
      status: "devolvido",
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Emprestimo
} 