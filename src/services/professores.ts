import { supabase } from "@/lib/supabase"

export interface Professor {
  id: string
  nome: string
  created_at: string
}

async function verificarTabelaProfessores() {
  try {
    const { data, error } = await supabase
      .from('professores')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Erro ao verificar tabela professores:', error)
      if (error.code === '42P01') {
        // Tabela não existe, vamos criar
        const { error: createError } = await supabase.rpc('criar_tabela_professores')
        if (createError) {
          console.error('Erro ao criar tabela professores:', createError)
          throw createError
        }
        console.log('Tabela professores criada com sucesso')
      } else {
        throw error
      }
    }

    console.log('Tabela professores existe e está acessível')
    return true
  } catch (error) {
    console.error('Erro ao verificar/criar tabela:', error)
    throw error
  }
}

export async function getProfessores() {
  try {
    await verificarTabelaProfessores()

    const { data, error } = await supabase
      .from("professores")
      .select("*")
      .order("nome")

    if (error) throw error
    return data as Professor[]
  } catch (error) {
    console.error('Erro ao buscar professores:', error)
    return [] // Retorna array vazio em caso de erro
  }
}

export async function createProfessor(professor: Omit<Professor, "id" | "created_at">) {
  try {
    await verificarTabelaProfessores()

    const { data, error } = await supabase
      .from("professores")
      .insert({ ...professor, created_at: new Date().toISOString() })
      .select()
      .single()

    if (error) throw error
    return data as Professor
  } catch (error) {
    console.error('Erro ao criar professor:', error)
    throw error
  }
}

export async function updateProfessor(id: string, professor: Partial<Omit<Professor, "id" | "created_at">>) {
  try {
    const { data, error } = await supabase
      .from("professores")
      .update(professor)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Professor
  } catch (error) {
    console.error('Erro ao atualizar professor:', error)
    throw error
  }
}

export async function deleteProfessor(id: string) {
  try {
    const { error } = await supabase
      .from("professores")
      .delete()
      .eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error('Erro ao excluir professor:', error)
    throw error
  }
} 