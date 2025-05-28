"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LivroForm } from "./livro-form"
import type { Livro } from "@/types"

interface LivroDialogProps {
  livro?: Livro
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function LivroDialog({ livro, onSuccess, trigger }: LivroDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            {livro ? "Editar Livro" : "Novo Livro"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {livro ? "Editar Livro" : "Novo Livro"}
          </DialogTitle>
        </DialogHeader>
        <LivroForm
          livro={livro}
          onSuccess={() => {
            setOpen(false)
            onSuccess?.()
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 