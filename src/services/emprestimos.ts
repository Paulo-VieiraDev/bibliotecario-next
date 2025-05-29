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

async function verificarDisponibilidadeLivro(livroId: string) {
  // Buscar o livro
  const { data: livro, error: livroError } = await supabase
    .from("livros")
    .select("quantidade")
    .eq("id", livroId)
    .single()

  if (livroError) throw livroError
  if (!livro) throw new Error("Livro não encontrado")

  // Contar quantos exemplares estão emprestados
  const { count, error: countError } = await supabase
    .from("emprestimos")
    .select("*", { count: "exact", head: true })
    .eq("livro_id", livroId)
    .eq("status", "emprestado")

  if (countError) throw countError

  // Verificar se há exemplares disponíveis
  const exemplaresDisponiveis = livro.quantidade - (count || 0)
  if (exemplaresDisponiveis <= 0) {
    throw new Error("Não há exemplares disponíveis deste livro")
  }

  return true
}

export async function createEmprestimo(
  emprestimo: Omit<Emprestimo, "id" | "created_at" | "data_devolucao">
) {
  try {
    // Verificar disponibilidade do livro
    await verificarDisponibilidadeLivro(emprestimo.livro_id)

    // Criar o empréstimo
    const { data, error } = await supabase
      .from("emprestimos")
      .insert(emprestimo)
      .select()
      .single()

    if (error) throw error
    return data as Emprestimo
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao criar empréstimo: ${error.message}`)
    }
    throw error
  }
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