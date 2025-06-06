"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Pencil, Trash2, Plus, Users, School, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAlunos, deleteAluno } from "@/services/alunos"
import { getTurmas } from "@/services/turmas"
import type { Aluno } from "@/types"
import { toast } from "sonner"
import { AlunoDialog } from "./aluno-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const TURMA_COLORS = [
  "#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F",
  "#EDC948", "#B07AA1", "#FF9DA7", "#9C755F", "#BAB0AC",
  "#86BCB6", "#D37295", "#FABFD2", "#B6992D", "#499894",
  "#E17C05", "#F1CE63", "#D4A6C8", "#7A7A7A", "#A0CBE8"
]

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [turmas, setTurmas] = useState<{ id: string; nome: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [alunoEdit, setAlunoEdit] = useState<Aluno | null>(null)
  const [alunoDelete, setAlunoDelete] = useState<Aluno | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

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

  async function handleDeleteAlunoConfirmado(id: string) {
    try {
      setDeleteLoading(true)
      await deleteAluno(id)
      toast.success("Aluno excluído com sucesso!")
      loadAlunos()
    } catch {
      toast.error("Erro ao excluir aluno")
    } finally {
      setDeleteLoading(false)
      setAlunoDelete(null)
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
      {alunoEdit && (
        <AlunoDialog
          aluno={alunoEdit}
          turmas={turmas}
          onSuccess={() => {
            setAlunoEdit(null)
            loadAlunos()
          }}
          trigger={null}
        />
      )}
      <Dialog open={!!alunoDelete} onOpenChange={open => !open && setAlunoDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-2">Deseja realmente excluir o aluno <b>{alunoDelete?.nome}</b>?</div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setAlunoDelete(null)} disabled={deleteLoading}>Cancelar</Button>
            <Button variant="destructive" onClick={() => alunoDelete && handleDeleteAlunoConfirmado(alunoDelete.id)} disabled={deleteLoading}>
              {deleteLoading ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Turmas */}
      <div className="space-y-6">
        {turmasComAlunos.map((turma, idx) => (
          <div key={turma.id} className="bg-gray-50 dark:bg-zinc-900 rounded-xl shadow-md p-6 mb-6">
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
                      className="hidden md:flex w-10 h-10 items-center justify-center rounded-full font-bold text-lg shadow"
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
                    <div className="flex items-center justify-between">
                      <span> {/* info do aluno */} </span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setAlunoEdit(aluno)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setAlunoDelete(aluno)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
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