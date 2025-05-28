"use client"

import { useEffect, useState } from "react"
import { ArrowLeftRight } from "lucide-react"
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
    } catch (error) {
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
    } catch (error) {
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
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Empréstimos</h1>
        <EmprestimoDialog onSuccess={loadEmprestimos} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Livro</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Data do Empréstimo</TableHead>
              <TableHead>Data da Devolução</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emprestimos.map((emprestimo) => (
              <TableRow key={emprestimo.id}>
                <TableCell>
                  {emprestimo.livro.titulo} - {emprestimo.livro.autor}
                </TableCell>
                <TableCell>
                  {emprestimo.aluno.nome} - {emprestimo.aluno.matricula}
                </TableCell>
                <TableCell>
                  {new Date(emprestimo.data_emprestimo).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {emprestimo.data_devolucao
                    ? new Date(emprestimo.data_devolucao).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      emprestimo.status === "emprestado"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {emprestimo.status === "emprestado" ? "Emprestado" : "Devolvido"}
                  </span>
                </TableCell>
                <TableCell>
                  {emprestimo.status === "emprestado" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <ArrowLeftRight className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Devolver Livro</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja registrar a devolução deste
                            livro?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDevolver(emprestimo.id)}
                          >
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
  )
} 