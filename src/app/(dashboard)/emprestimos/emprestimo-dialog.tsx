"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EmprestimoForm } from "./emprestimo-form"

interface EmprestimoDialogProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function EmprestimoDialog({ onSuccess, trigger }: EmprestimoDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Empréstimo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent aria-describedby="emprestimo-dialog-description">
        <DialogHeader>
          <DialogTitle>Novo Empréstimo</DialogTitle>
          <div id="emprestimo-dialog-description" className="sr-only">
            Formulário para registrar um novo empréstimo de livro
          </div>
        </DialogHeader>
        <EmprestimoForm
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