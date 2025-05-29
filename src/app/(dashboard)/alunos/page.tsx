"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Pencil, Trash2, Plus } from "lucide-react"
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

  // Função para gerar cor pastel simples para badge da turma
  function turmaColor(nome: string) {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800',
      'bg-red-100 text-red-800',
      'bg-cyan-100 text-cyan-800',
    ]
    let hash = 0
    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash)
    }
    const idx = Math.abs(hash) % colors.length
    return colors[idx]
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alunos</h1>
          <p className="text-gray-500 mt-1">Gerencie os alunos cadastrados na biblioteca</p>
        </div>
        <AlunoDialog onSuccess={loadAlunos} turmas={turmas} trigger={
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Aluno
          </Button>
        } />
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableBody>
            {turmas
              .sort((a, b) => a.nome.localeCompare(b.nome))
              .flatMap(turma => {
                const alunosDaTurma = alunos.filter(aluno => aluno.turma_id === turma.id)
                  .sort((a, b) => a.nome.localeCompare(b.nome))
                if (alunosDaTurma.length === 0) return []
                return [
                  <TableRow key={turma.id} className="bg-white">
                    <TableCell colSpan={2} className="py-4">
                      <span className={`inline-flex items-center rounded-full px-4 py-1 text-base font-bold ${turmaColor(turma.nome)}`}>{turma.nome}</span>
                    </TableCell>
                  </TableRow>,
                  ...alunosDaTurma.map(aluno => (
                    <TableRow key={aluno.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium pl-8 py-3">{aluno.nome}</TableCell>
                      <TableCell className="py-3 text-right pr-4">
                        <div className="flex items-center gap-2 justify-end">
                          <AlunoDialog
                            aluno={aluno}
                            onSuccess={loadAlunos}
                            turmas={turmas}
                            trigger={
                              <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
                                <span className="sr-only">Editar</span>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600">
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
                                <AlertDialogAction 
                                  onClick={() => handleDelete(aluno.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ]
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 