export type Turma = {
  id: string
  nome: string
  alunos: Aluno[]
}

export interface Aluno {
  id: string
  created_at: string
  nome: string
  matricula: string
  turma_id: string
}

export interface Livro {
  id: string
  created_at: string
  titulo: string
  autor: string
  editora: string
  ano: number
  quantidade: number
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