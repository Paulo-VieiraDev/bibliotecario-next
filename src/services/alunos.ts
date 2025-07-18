import { supabase } from "@/lib/supabase"
import type { Aluno, EmprestimoComDetalhes } from "@/types"

export async function getAlunos() {
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .eq('deletado', false)
    .order('nome');
  if (error) throw error;
  return data as Aluno[];
}

export async function getAluno(id: string) {
  const { data, error } = await supabase
    .from("alunos")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as Aluno
}

export async function createAluno(aluno: Omit<Aluno, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("alunos")
    .insert(aluno)
    .select()
    .single()

  if (error) throw error
  return data as Aluno
}

export async function updateAluno(
  id: string,
  aluno: Partial<Omit<Aluno, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("alunos")
    .update(aluno)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Aluno
}

export async function deleteAluno(id: string) {
  const { error } = await supabase
    .from('alunos')
    .update({ deletado: true })
    .eq('id', id);
  if (error) throw error;
  return Promise.resolve();
}

export async function getEmprestimos() {
  const { data, error } = await supabase
    .from("emprestimos")
    .select(`
      *,
      livro:livros(*),
      aluno:alunos(*),
      professor:professores(*)
    `)
    .order("data_emprestimo", { ascending: false })

  if (error) throw error
  return data as EmprestimoComDetalhes[]
} 