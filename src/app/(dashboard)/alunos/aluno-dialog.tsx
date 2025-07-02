"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { AlunoForm } from "./aluno-form"
import type { Aluno } from "@/types"

interface AlunoDialogProps {
  aluno?: Aluno
  onSuccess?: () => void
  trigger?: React.ReactNode
  turmas: { id: string; nome: string }[]
}

export function AlunoDialog({ aluno, onSuccess, trigger, turmas }: AlunoDialogProps) {
  const [open, setOpen] = useState(trigger ? false : true)
  useEffect(() => {
    if (!trigger && aluno) setOpen(true)
  }, [aluno, trigger])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {aluno ? "Editar Aluno" : "Novo Aluno"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Formulário de cadastro ou edição de aluno</DialogDescription>
        <AlunoForm
          aluno={aluno}
          onSuccess={() => {
            setOpen(false)
            onSuccess?.()
          }}
          onCancel={() => setOpen(false)}
          turmas={turmas}
        />
      </DialogContent>
    </Dialog>
  )
} 