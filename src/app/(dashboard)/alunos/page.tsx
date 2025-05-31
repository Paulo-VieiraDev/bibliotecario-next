"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Pencil, Trash2, Plus, Users } from "lucide-react"
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
import clsx from "clsx"

const TURMA_GRADIENTS = [
  "from-blue-400 via-blue-200 to-blue-100",
  "from-orange-400 via-orange-200 to-orange-100",
  "from-pink-400 via-pink-200 to-pink-100",
  "from-teal-400 via-teal-200 to-teal-100",
  "from-green-400 via-green-200 to-green-100",
  "from-purple-400 via-purple-200 to-purple-100",
]
const TURMA_BADGES = [
  "bg-blue-600",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-green-500",
  "bg-purple-500",
]
const PROFESSOR_GRADIENT = "from-cyan-400 via-cyan-200 to-cyan-100"
const PROFESSOR_BADGE = "bg-cyan-600"

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
  const [novoOpen, setNovoOpen] = useState(false)
  // Professores (local state)
  const [professores, setProfessores] = useState<{ id: string; nome: string }[]>([])
  const [professorDialog, setProfessorDialog] = useState<{ open: boolean; editId?: string }>({ open: false })
  const [professorNome, setProfessorNome] = useState("")

  useEffect(() => {
    loadAlunos()
    loadTurmas()
  }, [])

  async function loadAlunos() {
    try {
      const data = await getAlunos()
      setAlunos(data)
      setLoading(false)
    } catch (error) {
      toast.error("Erro ao carregar alunos")
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

  async function handleDeleteAluno(id: string) {
    try {
      await deleteAluno(id)
      toast.success("Aluno excluído com sucesso!")
      loadAlunos()
    } catch (error) {
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
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-white dark:bg-transparent py-12 px-2">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Users className="w-9 h-9 text-blue-600 drop-shadow" />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Alunos por Turma</h1>
          </div>
          <AlunoDialog
            onSuccess={loadAlunos}
            turmas={turmas}
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
        <div className="flex flex-col gap-8">
          {turmasComAlunos.map((turma, idx) => (
            <div
              key={turma.id}
              className="rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-xl bg-white dark:bg-zinc-900/90 p-0 flex flex-col transition-all"
              style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08), 0 1.5px 0 0 rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-3 px-8 pt-6 pb-2">
                <span
                  className="px-6 py-2 rounded-full text-lg font-bold shadow-lg text-white drop-shadow-lg"
                  style={{
                    background: TURMA_COLORS[idx % TURMA_COLORS.length],
                    boxShadow: '0 2px 12px 0 rgba(255,255,255,0.10)'
                  }}
                >
                  {turma.nome}
                </span>
              </div>
              <div className="flex flex-col gap-3 px-8 pb-8">
                {turma.alunos.length === 0 ? (
                  <div className="text-center text-gray-400 dark:text-zinc-300 py-8 text-lg">Nenhum aluno nesta turma.</div>
                ) : (
                  turma.alunos.map((aluno) => (
                    <div
                      key={aluno.id}
                      className="group flex items-center gap-3 bg-blue-50 dark:bg-zinc-800/80 hover:bg-blue-100 dark:hover:bg-zinc-700/80 rounded-full px-5 py-3 shadow-md transition-all relative min-w-[180px] max-w-full border border-transparent dark:border-zinc-700"
                      style={{ boxShadow: '0 2px 12px 0 rgba(37,99,235,0.08)' }}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-zinc-700 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold text-xl shadow-inner border-2 border-blue-300 dark:border-zinc-500">
                        {getInitial(aluno.nome)}
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-zinc-100 truncate flex-1">{aluno.nome}</span>
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
                        <Button variant="ghost" size="icon" className="hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-300" onClick={() => handleDeleteAluno(aluno.id)}>
                          <span className="sr-only">Excluir</span>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Animações globais */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease; }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.25s cubic-bezier(.4,2,.6,1); }
      `}</style>
    </div>
  )
} 