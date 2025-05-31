"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getProfessores, createProfessor, updateProfessor, deleteProfessor } from "@/services/professores"
import { toast } from "sonner"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogTrigger, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Users } from "lucide-react"

function getInitial(nome: string) {
  return nome?.trim()?.charAt(0)?.toUpperCase() || "?"
}

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<{ id: string; nome: string }[]>([])
  const [professorDialog, setProfessorDialog] = useState<{ open: boolean; editId?: string }>({ open: false })
  const [professorNome, setProfessorNome] = useState("")
  const [erroNome, setErroNome] = useState("")

  // Carregar professores ao iniciar
  useEffect(() => {
    loadProfessores()
  }, [])

  async function loadProfessores() {
    try {
      const data = await getProfessores()
      setProfessores(data)
    } catch {
      toast.error("Erro ao carregar professores")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!professorNome.trim()) {
      setErroNome("Nome é obrigatório")
      return
    }
    setErroNome("")

    try {
      if (professorDialog.editId) {
        // Atualizar professor
        await updateProfessor(professorDialog.editId, { nome: professorNome })
        toast.success("Professor atualizado com sucesso!")
      } else {
        // Criar novo professor
        await createProfessor({ nome: professorNome })
        toast.success("Professor cadastrado com sucesso!")
      }

      // Recarregar lista de professores
      await loadProfessores()

      // Fechar dialog e limpar formulário
      setProfessorDialog({ open: false })
      setProfessorNome("")
    } catch {
      toast.error("Erro ao salvar professor")
    }
  }

  async function handleDeleteProfessor(id: string) {
    try {
      await deleteProfessor(id)
      toast.success("Professor excluído com sucesso!")
      await loadProfessores()
    } catch {
      toast.error("Erro ao excluir professor")
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-white dark:bg-transparent py-12 px-2">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="w-full flex flex-col items-center">
          {/* Cabeçalho */}
          <div className="flex items-center gap-2 mb-4 px-2 w-full justify-center relative">
            <User className="w-7 h-7 md:w-9 md:h-9 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-blue-400">Professores</h1>
            <div className="flex-1" />
            <Button variant="default"
              className="px-6 py-2 text-base font-bold flex items-center gap-2 shadow-lg transition-all scale-100 hover:scale-105"
              onClick={() => setProfessorDialog({ open: true })}
            >
              + Novo Professor
            </Button>
          </div>

          {/* Lista de professores */}
          <div className="w-full max-w-md md:max-w-2xl bg-blue-50 dark:bg-[#18181b] rounded-2xl border border-blue-200 dark:border-blue-900 p-2 md:p-6 flex flex-col gap-2 md:gap-4">
            {professores.map((prof) => (
              <div
                key={prof.id}
                className="flex items-center gap-2 md:gap-4 bg-white/70 dark:bg-blue-950/60 rounded-xl px-2 py-2 md:px-4 md:py-3 shadow-sm"
              >
                <div className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 text-base md:text-xl">
                  {prof.nome.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 text-sm md:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">{prof.nome}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1 md:p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  onClick={() => setProfessorDialog({ open: true, editId: prof.id })}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-1 md:p-2 text-blue-600 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não poderá ser desfeita. O professor será removido do sistema.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDeleteProfessor(prof.id)}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>
        <Dialog open={professorDialog.open} onOpenChange={open => setProfessorDialog(v => ({ ...v, open }))}>
          <DialogContent aria-describedby="professor-dialog-description">
            <DialogHeader>
              <DialogTitle>{professorDialog.editId ? "Editar Professor" : "Novo Professor"}</DialogTitle>
              <div id="professor-dialog-description" className="sr-only">
                {professorDialog.editId ? "Formulário para editar um professor existente" : "Formulário para adicionar um novo professor"}
              </div>
            </DialogHeader>
            <form className="w-full flex flex-col items-center gap-6" onSubmit={handleSubmit}>
              <div className="w-full flex flex-col items-center">
                <div className="flex items-center w-11/12 mb-1 gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">Professor</span>
                  <label className={erroNome ? "text-base font-medium ml-1 text-red-500" : "text-base text-gray-700 dark:text-zinc-200 font-medium ml-1"}>Digite o nome</label>
                </div>
                <input
                  className="w-11/12 mx-auto border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 outline-none bg-white dark:bg-zinc-900 transition-all"
                  placeholder="Nome do professor"
                  value={professorNome}
                  onChange={e => { setProfessorNome(e.target.value); if (erroNome) setErroNome(""); }}
                  autoFocus
                />
                {erroNome && <span className="text-red-500 text-xs mt-1 w-11/12 text-left">{erroNome}</span>}
              </div>
              <div className="flex gap-3 justify-center w-11/12 pt-2">
                <Button type="button" variant="outline" onClick={() => setProfessorDialog({ open: false })} className="rounded-md w-1/2">
                  Cancelar
                </Button>
                <Button type="submit" variant="default" className="rounded-md w-1/2">
                  {professorDialog.editId ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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