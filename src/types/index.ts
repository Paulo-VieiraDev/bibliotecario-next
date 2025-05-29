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
  vida_util?: number
  categoria: string
  ano_serie?: string
  etapa?: string
  tipo_didatico?: string
}

export interface Emprestimo {
  id: string
  created_at: string
  livro_id: string
  aluno_id: string
  data_emprestimo: string
  data_devolucao: string | null
  status: "emprestado" | "devolvido"
}

export interface EmprestimoComDetalhes extends Emprestimo {
  livro: Livro
  aluno: Aluno
} 