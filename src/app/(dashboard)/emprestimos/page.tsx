"use client"

import { useEffect, useState } from "react"
import { ArrowLeftRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { getEmprestimos, devolverLivro } from "@/services/emprestimos"
import { EmprestimoDialog } from "./emprestimo-dialog"
import { getAlunos } from "@/services/alunos"
import { getProfessores } from "@/services/professores"
import { getLivros } from "@/services/livros"
import type { Aluno } from "@/types"
import type { Professor } from "@/types"
import type { Livro } from "@/types"
import type { Emprestimo } from "@/types"

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [professores, setProfessores] = useState<Professor[]>([])
  const [livros, setLivros] = useState<Livro[]>([])
  const [loading, setLoading] = useState(true)
  const [tipoFiltro, setTipoFiltro] = useState<'aluno' | 'professor'>('aluno');

  async function loadEmprestimos() {
    try {
      const emprestimosData = await getEmprestimos()
      const alunosData = await getAlunos()
      const professoresData = await getProfessores()
      const livrosData = await getLivros()
      setEmprestimos(emprestimosData)
      setAlunos(alunosData)
      setProfessores(professoresData)
      setLivros(livrosData)
    } catch {
      toast.error("Erro ao carregar empréstimos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmprestimos()
  }, [])

  async function handleDevolver(id: string) {
    try {
      await devolverLivro(id)
      toast.success("Livro devolvido com sucesso!")
      loadEmprestimos()
    } catch {
      toast.error("Erro ao devolver livro")
    }
  }

  const emprestimosComNomes = emprestimos.map(e => {
    const aluno = alunos.find(a => a.id === e.aluno_id);
    const professor = professores.find(p => p.id === e.professor_id);
    const livro = livros.find(l => l.id === e.livro_id);
    return {
      ...e,
      aluno_nome: aluno ? aluno.nome : "",
      professor_nome: professor ? professor.nome : "",
      livro_nome: livro ? livro.titulo : "",
      livro_autor: livro ? livro.autor : "",
    };
  });

  const emprestimosFiltrados = emprestimosComNomes.filter(e =>
    tipoFiltro === 'aluno' ? !!e.aluno_id : !!e.professor_id
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-white dark:bg-transparent py-12">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 px-2">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="text-blue-600 w-9 h-9 animate-arrow" />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Empréstimos</h1>
          </div>
          <EmprestimoDialog onSuccess={loadEmprestimos} trigger={
            <Button variant="default" className="px-6 py-2 text-base font-bold flex items-center gap-2 shadow-lg transition-all scale-100 hover:scale-105">
              <Plus className="h-5 w-5" />
              Novo Empréstimo
            </Button>
          } />
        </div>
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${tipoFiltro === 'aluno' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTipoFiltro('aluno')}
          >
            Alunos
          </button>
          <button
            className={`px-4 py-2 rounded ${tipoFiltro === 'professor' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTipoFiltro('professor')}
          >
            Professores
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left font-bold">Livro</th>
                <th className="px-4 py-3 text-left font-bold">
                  {tipoFiltro === 'aluno' ? 'Aluno' : 'Professor'}
                </th>
                <th className="px-4 py-3 text-left font-bold">Data do Empréstimo</th>
                <th className="px-4 py-3 text-left font-bold">Data da Devolução</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
                <th className="px-4 py-3 text-left font-bold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {emprestimosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    Nenhum empréstimo encontrado.
                  </td>
                </tr>
              ) : (
                emprestimosFiltrados.map(emp => (
                  <tr key={emp.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-bold">{emp.livro_nome}</div>
                      <div className="text-xs text-gray-400">{emp.livro_autor}</div>
                    </td>
                    <td className="px-4 py-3">
                      {tipoFiltro === 'aluno' ? emp.aluno_nome : emp.professor_nome}
                    </td>
                    <td className="px-4 py-3">
                      {emp.data_emprestimo
                        ? new Date(emp.data_emprestimo).toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {emp.data_devolucao
                        ? new Date(emp.data_devolucao).toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {emp.status === 'emprestado' ? (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">Emprestado</span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">Devolvido</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {emp.status === "emprestado" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full hover:bg-blue-100 dark:hover:bg-zinc-700 transition-colors"
                            >
                              <ArrowLeftRight className="h-5 w-5 text-blue-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Devolver Livro</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja registrar a devolução deste livro?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDevolver(emp.id)}>
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx global>{`
        @keyframes arrow {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        .animate-arrow { animation: arrow 1.2s infinite alternate; }
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
      `}</style>
    </div>
  )
} 