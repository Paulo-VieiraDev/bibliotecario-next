import { supabase } from "@/lib/supabase"

export interface Usuario {
  id: string
  nome: string
  sobrenome: string
  funcao: string
  avatar_url?: string
  created_at: string
}

async function verificarTabelaUsuarios() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Erro ao verificar tabela usuarios:', error)
      if (error.code === '42P01') {
        console.error('A tabela usuarios não existe!')
        throw new Error('A tabela usuarios não existe. Execute o SQL de criação da tabela no Supabase.')
      }
      throw error
    }

    console.log('Tabela usuarios existe e está acessível')
    return true
  } catch (error) {
    console.error('Erro ao verificar tabela:', error)
    throw error
  }
}

export async function getUsuario(id: string) {
  try {
    // Verificar se a tabela existe
    await verificarTabelaUsuarios()

    // Primeiro, vamos verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error('Erro de autenticação:', authError)
      throw new Error('Erro de autenticação: ' + authError.message)
    }
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Tentar buscar o usuário
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error('Erro ao buscar usuário:', error)
      
      // Se o erro for porque o usuário não existe, vamos criar um novo
      if (error.code === 'PGRST116') {
        console.log('Usuário não encontrado, criando novo...')
        
        // Criar novo usuário com dados básicos
        const novoUsuario = {
          id: user.id,
          nome: user.email?.split('@')[0] || 'Usuário',
          sobrenome: '',
          funcao: 'Bibliotecário',
          created_at: new Date().toISOString()
        }

        console.log('Dados do novo usuário:', novoUsuario)

        const { data: createdUser, error: createError } = await supabase
          .from("usuarios")
          .insert(novoUsuario)
          .select()
          .single()

        if (createError) {
          console.error('Erro ao criar usuário:', createError)
          throw new Error('Erro ao criar usuário: ' + createError.message)
        }

        console.log('Usuário criado com sucesso:', createdUser)
        return createdUser as Usuario
      }

      throw new Error('Erro ao buscar usuário: ' + error.message)
    }

    console.log('Usuário encontrado:', data)
    return data as Usuario
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro detalhado:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    } else {
      console.error('Erro desconhecido:', error)
    }
    throw error
  }
}

export async function updateUsuario(
  id: string,
  usuario: Partial<Omit<Usuario, "id" | "created_at">>
) {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .update(usuario)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw new Error('Erro ao atualizar usuário: ' + error.message)
    }

    return data as Usuario
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro detalhado:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    } else {
      console.error('Erro desconhecido:', error)
    }
    throw error
  }
} 