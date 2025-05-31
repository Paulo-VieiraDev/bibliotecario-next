"use client"

import { useEffect, useState } from "react"
import { ArrowLeftRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { getEmprestimos, devolverLivro } from "@/services/emprestimos"
import type { EmprestimoComDetalhes } from "@/types"
import { EmprestimoDialog } from "./emprestimo-dialog"

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<EmprestimoComDetalhes[]>([])
  const [loading, setLoading] = useState(true)

  async function loadEmprestimos() {
    try {
      const data = await getEmprestimos()
      setEmprestimos(data)
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
        <div className="overflow-x-auto rounded-2xl shadow border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <Table className="w-full min-w-[950px]">
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-zinc-800 text-base">
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[180px] px-5">Livro</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[120px] px-5 border-l border-zinc-200 dark:border-zinc-800">Aluno</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[110px] px-3 text-center border-l border-zinc-200 dark:border-zinc-800">Data do Empréstimo</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[120px] px-3 text-center border-l border-zinc-200 dark:border-zinc-800">Data da Devolução</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[100px] px-3 text-center border-l border-zinc-200 dark:border-zinc-800">Status</TableHead>
                <TableHead className="w-[90px] font-bold text-gray-700 dark:text-gray-100 text-center px-2 border-l border-zinc-200 dark:border-zinc-800">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emprestimos.map((emprestimo) => (
                <TableRow key={emprestimo.id} className="hover:bg-blue-50/60 dark:hover:bg-zinc-800/60 transition-all text-base">
                  <TableCell className="font-semibold whitespace-nowrap px-5 py-3 align-middle">{emprestimo.livro.titulo}
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal">{emprestimo.livro.autor}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-5 py-3 align-middle border-l border-zinc-100 dark:border-zinc-800">
                    {emprestimo.aluno?.nome || emprestimo.professor?.nome || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 align-middle text-center border-l border-zinc-100 dark:border-zinc-800">{new Date(emprestimo.data_emprestimo).toLocaleDateString()}</TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 align-middle text-center border-l border-zinc-100 dark:border-zinc-800">{emprestimo.data_devolucao ? new Date(emprestimo.data_devolucao).toLocaleDateString() : "-"}</TableCell>
                  <TableCell className="px-3 py-3 align-middle text-center border-l border-zinc-100 dark:border-zinc-800">
                    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold shadow-sm min-w-[28px] min-h-[28px] ${
                      emprestimo.status === "emprestado"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`} style={{margin: '0 auto'}}>
                      {emprestimo.status === "emprestado" ? "Emprestado" : "Devolvido"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center px-2 py-3 align-middle border-l border-zinc-100 dark:border-zinc-800">
                    {emprestimo.status === "emprestado" && (
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
                            <AlertDialogAction onClick={() => handleDevolver(emprestimo.id)}>
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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