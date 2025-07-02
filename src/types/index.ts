export type Turma = {
  id: string
  nome: string
  alunos: Aluno[]
}

export interface Aluno {
  id: string
  created_at: string
  nome: string
  turma_id: string
}

export interface Livro {
  id: string
  created_at: string
  titulo: string
  autor: string
  editora: string
  edicao: string
  quantidade: number
  quantidade_disponivel: number
  vida_util?: number
  categoria: string
  ano?: number
  ano_serie?: string
  etapa?: string
  tipo_didatico?: string
}

export interface Emprestimo {
  id: string
  created_at: string
  livro_id: string
  aluno_id: string | null
  professor_id?: string | null
  data_emprestimo: string
  data_devolucao: string | null
  status: "emprestado" | "devolvido"
}

export interface EmprestimoComDetalhes extends Emprestimo {
  livro: Livro
  aluno?: Aluno
  professor?: Professor
}

export interface Professor {
  id: string
  nome: string
  created_at: string
}

export interface Notificacao {
  id: number
  mensagem: string
  tipo: string
  criada_em: string
  lida: boolean
  usuario_id: string
} 