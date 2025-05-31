"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Pencil, Trash2, Plus, Users, School, UserX, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAlunos, deleteAluno } from "@/services/alunos"
import { getTurmas } from "@/services/turmas"
import type { Aluno } from "@/types"
import { toast } from "sonner"
import { AlunoDialog } from "./aluno-dialog"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogTrigger, AlertDialogAction } from "@/components/ui/alert-dialog"

const TURMA_COLORS = [
  "#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F",
  "#EDC948", "#B07AA1", "#FF9DA7", "#9C755F", "#BAB0AC",
  "#86BCB6", "#D37295", "#FABFD2", "#B6992D", "#499894",
  "#E17C05", "#F1CE63", "#D4A6C8", "#7A7A7A", "#A0CBE8"
]

function getInitial(nome: string) {
  return nome?.trim()?.charAt(0)?.toUpperCase() || "?"
}

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
      setLoading(false)
    } catch {
      toast.error("Erro ao carregar alunos")
      setLoading(false)
    }
  }

  async function loadTurmas() {
    try {
      const data = await getTurmas()
      setTurmas(data)
    } catch {
      toast.error("Erro ao carregar turmas")
    }
  }

  async function handleDeleteAluno(id: string) {
    try {
      await deleteAluno(id)
      toast.success("Aluno excluído com sucesso!")
      loadAlunos()
    } catch {
      toast.error("Erro ao excluir aluno")
    }
  }

  // Agrupar alunos por turma
  const turmasComAlunos = turmas.map((turma) => ({
    ...turma,
    alunos: alunos.filter((a) => a.turma_id === turma.id),
  }))

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 mb-4 px-2 w-full justify-center relative">
        <Users className="w-7 h-7 md:w-9 md:h-9 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-blue-400">Alunos</h1>
        <div className="flex-1" />
        <AlunoDialog
          turmas={turmas}
          onSuccess={loadAlunos}
          trigger={
            <Button
              variant="default"
              className="px-6 py-2 text-base font-bold flex items-center gap-2 shadow-lg transition-all scale-100 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Novo Aluno
            </Button>
          }
        />
      </div>

      {/* Turmas */}
      <div className="space-y-6">
        {turmasComAlunos.map((turma, idx) => (
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-white text-sm"
                style={{ background: TURMA_COLORS[idx % TURMA_COLORS.length] }}
              >
                <School className="w-4 h-4" /> {turma.nome}
              </span>
              <div className="text-xs text-gray-400 dark:text-gray-300">Fundamental</div>
            </div>
            <div className="space-y-2">
              {turma.alunos.length === 0 ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <UserX className="w-5 h-5" />
                  Nenhum aluno nesta turma.
                </div>
              ) : (
                turma.alunos.map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center gap-4 bg-blue-50 hover:bg-blue-100 transition rounded-lg px-4 py-3 mb-2 shadow-sm group"
                    style={{
                      background: `${TURMA_COLORS[idx % TURMA_COLORS.length]}11`,
                      borderLeft: `4px solid ${TURMA_COLORS[idx % TURMA_COLORS.length]}`,
                    }}
                  >
                    <span
                      className="w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg shadow"
                      style={{
                        background: TURMA_COLORS[idx % TURMA_COLORS.length],
                        color: "#fff",
                      }}
                    >
                      {aluno.nome[0].toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 dark:text-gray-100 text-lg tracking-tight flex items-center gap-2">
                        {aluno.nome}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                      <AlunoDialog
                        aluno={aluno}
                        onSuccess={loadAlunos}
                        turmas={turmas}
                        trigger={
                          <Button variant="ghost" size="icon" className="hover:bg-blue-200 dark:hover:bg-zinc-600 hover:text-blue-700 dark:hover:text-blue-200">
                            <span className="sr-only">Editar</span>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-300"
                          >
                            <span className="sr-only">Excluir</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o aluno <span className="font-semibold">{aluno.nome}</span>? Esta ação não poderá ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAluno(aluno.id)} className="bg-red-600 hover:bg-red-700">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function avatarColor(nome: string) {
  const colors = ["#2563eb", "#f59e42", "#ef4444", "#10b981", "#a855f7"];
  return colors[nome.charCodeAt(0) % colors.length];
} 