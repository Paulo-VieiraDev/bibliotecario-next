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
  emprestimo: Omit<Emprestimo, "id" | "created_at">
) {
  try {
    // Buscar nome do livro
    let livro_nome = null;
    if (emprestimo.livro_id) {
      const { data: livro } = await supabase
        .from("livros")
        .select("titulo")
        .eq("id", emprestimo.livro_id)
        .single();
      livro_nome = livro?.titulo ?? null;
    }

    // Buscar nome do aluno
    let aluno_nome = null;
    if (emprestimo.aluno_id) {
      const { data: aluno } = await supabase
        .from("alunos")
        .select("nome")
        .eq("id", emprestimo.aluno_id)
        .single();
      aluno_nome = aluno?.nome ?? null;
    }

    // Buscar nome do professor
    let professor_nome = null;
    if (emprestimo.professor_id) {
      const { data: professor } = await supabase
        .from("professores")
        .select("nome")
        .eq("id", emprestimo.professor_id)
        .single();
      professor_nome = professor?.nome ?? null;
    }

    // Verificar disponibilidade do livro
    await verificarDisponibilidadeLivro(emprestimo.livro_id)

    // Criar o empréstimo com os nomes salvos
    const { data, error } = await supabase
      .from("emprestimos")
      .insert({
        ...emprestimo,
        livro_nome,
        aluno_nome,
        professor_nome,
      })
      .select()
      .single()

    if (error) throw error

    // Buscar o valor atual de quantidade_disponivel
    const { data: livroAtual, error: livroError } = await supabase
      .from("livros")
      .select("quantidade_disponivel")
      .eq("id", emprestimo.livro_id)
      .single();

    if (livroError) throw livroError;
    if (livroAtual && typeof livroAtual.quantidade_disponivel === 'number') {
      await supabase
        .from("livros")
        .update({ quantidade_disponivel: livroAtual.quantidade_disponivel - 1 })
        .eq("id", emprestimo.livro_id);
    }

    return data as Emprestimo
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao criar empréstimo: ${error.message}`)
    }
    throw error
  }
}

export async function devolverLivro(id: string) {
  // Atualiza o status do empréstimo
  const { data, error } = await supabase
    .from("emprestimos")
    .update({
      data_devolucao: new Date().toISOString(),
      status: "devolvido",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Atualiza a quantidade_disponivel do livro
  if (data?.livro_id) {
    // Busca o valor atual
    const { data: livroAtual, error: livroError } = await supabase
      .from("livros")
      .select("quantidade_disponivel")
      .eq("id", data.livro_id)
      .single();

    if (livroError) throw livroError;

    if (livroAtual && typeof livroAtual.quantidade_disponivel === 'number') {
      await supabase
        .from("livros")
        .update({ quantidade_disponivel: livroAtual.quantidade_disponivel + 1 })
        .eq("id", data.livro_id);
    }
  }

  return data as Emprestimo;
} 