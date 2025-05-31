"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash2, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getProfessores, createProfessor, updateProfessor } from "@/services/professores"
import { toast } from "sonner"

function getInitial(nome: string) {
  return nome?.trim()?.charAt(0)?.toUpperCase() || "?"
}

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<{ id: string; nome: string }[]>([])
  const [professorDialog, setProfessorDialog] = useState<{ open: boolean; editId?: string }>({ open: false })
  const [professorNome, setProfessorNome] = useState("")
  const [erroNome, setErroNome] = useState("")
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
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

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-white dark:bg-transparent py-12 px-2">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <User className="w-9 h-9 text-cyan-600 drop-shadow" />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Professores</h1>
          </div>
          <Button
            onClick={() => { setProfessorDialog({ open: true }); setProfessorNome(""); }}
            variant="default"
            className="px-6 py-2 text-base font-bold flex items-center gap-2 shadow-lg transition-all scale-100 hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Novo Professor
          </Button>
        </div>
        <div className="rounded-3xl border border-cyan-200 dark:border-cyan-700 shadow-xl bg-white/90 dark:bg-zinc-900/90 p-0 flex flex-col transition-all min-h-[220px]"
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08), 0 1.5px 0 0 rgba(255,255,255,0.04)' }}
        >
          <div className="flex flex-col gap-3 px-8 pb-8 pt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : professores.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-zinc-300 py-12 text-lg">Nenhum professor cadastrado.</div>
            ) : (
              professores.map((prof) => (
                <div
                  key={prof.id}
                  className="group flex items-center gap-3 bg-cyan-50 dark:bg-zinc-800/80 hover:bg-cyan-100 dark:hover:bg-zinc-700/80 rounded-full px-5 py-3 shadow-md transition-all relative min-w-[180px] max-w-full border border-transparent dark:border-cyan-700"
                  style={{ boxShadow: '0 2px 12px 0 rgba(0,180,216,0.08)' }}
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-200 dark:bg-zinc-700 flex items-center justify-center text-cyan-700 dark:text-cyan-200 font-bold text-xl shadow-inner border-2 border-cyan-300 dark:border-cyan-500">
                    {getInitial(prof.nome)}
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-zinc-100 truncate flex-1">{prof.nome}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                    <Button variant="ghost" size="icon" className="hover:bg-cyan-200 dark:hover:bg-zinc-600 hover:text-cyan-700 dark:hover:text-cyan-200" onClick={() => { setProfessorDialog({ open: true, editId: prof.id }); setProfessorNome(prof.nome); }}>
                      <span className="sr-only">Editar</span>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-300" onClick={() => setProfessores(professores.filter(p => p.id !== prof.id))}>
                      <span className="sr-only">Excluir</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
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