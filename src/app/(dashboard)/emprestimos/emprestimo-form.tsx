"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { createEmprestimo } from "@/services/emprestimos"
import { getLivros } from "@/services/livros"
import { getAlunos } from "@/services/alunos"
import type { Livro } from "@/types"
import type { Aluno } from "@/types"

const emprestimoSchema = z.object({
  livro_id: z.string().min(1, "Livro é obrigatório"),
  aluno_id: z.string().min(1, "Aluno é obrigatório"),
})

type EmprestimoFormValues = z.infer<typeof emprestimoSchema>

interface EmprestimoFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function EmprestimoForm({ onSuccess, onCancel }: EmprestimoFormProps) {
  const [loading, setLoading] = useState(false)
  const [livros, setLivros] = useState<Livro[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])

  const form = useForm<EmprestimoFormValues>({
    resolver: zodResolver(emprestimoSchema),
  })

  async function loadData() {
    try {
      const [livrosData, alunosData] = await Promise.all([
        getLivros(),
        getAlunos(),
      ])
      setLivros(livrosData)
      setAlunos(alunosData)
    } catch (error) {
      toast.error("Erro ao carregar dados")
    }
  }

  async function onSubmit(data: EmprestimoFormValues) {
    try {
      setLoading(true)
      await createEmprestimo({
        ...data,
        data_emprestimo: new Date().toISOString(),
        status: "emprestado",
      })
      toast.success("Empréstimo registrado com sucesso!")
      onSuccess?.()
    } catch (error) {
      toast.error("Erro ao registrar empréstimo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="livro_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Livro</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                onOpenChange={loadData}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um livro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {livros.map((livro) => (
                    <SelectItem key={livro.id} value={livro.id}>
                      {livro.titulo} - {livro.autor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aluno_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                onOpenChange={loadData}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {alunos.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome} - {aluno.matricula}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar Empréstimo"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 