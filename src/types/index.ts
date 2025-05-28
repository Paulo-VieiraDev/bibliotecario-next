export type Turma = {
  id: string
  nome: string
  alunos: Aluno[]
}

export type Aluno = {
  id: string
  nome: string
  matricula: string
  turmaId: string
}

export type Livro = {
  id: string
  titulo: string
  autor: string
  isbn: string
  quantidade: number
}

export type Emprestimo = {
  id: string
  livroId: string
  alunoId: string
  dataEmprestimo: Date
  dataDevolucao: Date | null
  status: 'emprestado' | 'devolvido'
} 