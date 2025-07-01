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
  try {
    console.log('Tentando criar livro:', livro)
    
    // Verificar se todos os campos obrigatórios estão presentes
    const camposObrigatorios = ['titulo', 'autor', 'editora', 'edicao', 'quantidade', 'categoria']
    const camposFaltantes = camposObrigatorios.filter(campo => !livro[campo as keyof typeof livro])
    
    if (camposFaltantes.length > 0) {
      throw new Error(`Campos obrigatórios faltando: ${camposFaltantes.join(', ')}`)
    }

    // Se for livro didático, verificar campos específicos
    if (livro.categoria === 'Didático') {
      if (!livro.ano_serie || !livro.etapa || !livro.tipo_didatico) {
        throw new Error('Livros didáticos precisam ter ano/série, etapa e tipo (aluno/professor)')
      }
    }

    const { data, error } = await supabase
      .from("livros")
      .insert([{
        ...livro,
        quantidade_disponivel: livro.quantidade // Inicialmente, todos os livros estão disponíveis
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar livro:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw new Error(`Erro ao criar livro: ${error.message}`)
    }

    console.log('Livro criado com sucesso:', data)
    return data as Livro
  } catch (error) {
    console.error('Erro ao criar livro:', error)
    throw error
  }
}

export async function updateLivro(id: string, livro: Partial<Livro>) {
  // Se a quantidade for alterada, recalcule quantidade_disponivel
  const livroAtualizado = { ...livro };
  if (livro.quantidade !== undefined) {
    // Buscar quantos empréstimos ativos existem para esse livro
    const { count: emprestados, error: errorEmprestimos } = await supabase
      .from('emprestimos')
      .select('*', { count: 'exact', head: true })
      .eq('livro_id', id)
      .eq('status', 'emprestado');
    if (errorEmprestimos) throw errorEmprestimos;
    livroAtualizado.quantidade_disponivel = (livro.quantidade as number) - (emprestados || 0);
  }
  const { data, error } = await supabase
    .from("livros")
    .update(livroAtualizado)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Livro
}

export async function deleteLivro(id: string) {
  void id;
  // Instead of deleting, we'll just return success
  // This prevents actual deletion in the database
  return Promise.resolve();
} 