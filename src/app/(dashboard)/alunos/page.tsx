"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAlunos, deleteAluno } from "@/services/alunos"
import { getTurmas } from "@/services/turmas"
import type { Aluno } from "@/types"
import { toast } from "sonner"
import { AlunoDialog } from "./aluno-dialog"
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

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [turmas, setTurmas] = useState<{ id: string; nome: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlunos()
    loadTurmas()
  }, [])

  async function loadAlunos() {
    try {
      const data = await getAlunos()
      setAlunos(data)
    } catch (error) {
      toast.error("Erro ao carregar alunos")
    } finally {
      setLoading(false)
    }
  }

  async function loadTurmas() {
    try {
      const data = await getTurmas()
      setTurmas(data)
    } catch (error) {
      toast.error("Erro ao carregar turmas")
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAluno(id)
      toast.success("Aluno excluído com sucesso!")
      loadAlunos()
    } catch (error) {
      toast.error("Erro ao excluir aluno")
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
        <h1 className="text-2xl font-bold">Alunos</h1>
        <AlunoDialog onSuccess={loadAlunos} turmas={turmas} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alunos.map((aluno) => (
              <TableRow key={aluno.id}>
                <TableCell>{aluno.nome}</TableCell>
                <TableCell>{aluno.matricula}</TableCell>
                <TableCell>{turmas.find(t => t.id === aluno.turma_id)?.nome || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlunoDialog
                      aluno={aluno}
                      onSuccess={loadAlunos}
                      turmas={turmas}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Editar</span>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Excluir</span>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Aluno</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(aluno.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 