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
import { BookOpen, User as UserIcon } from "lucide-react"

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
    } catch {
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
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao registrar empréstimo")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-6">
        <FormField
          control={form.control}
          name="livro_id"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col items-center">
              <div className="flex items-center w-11/12 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mr-2">Livro</span>
                <FormLabel className="text-center text-base text-gray-700 font-medium flex-1">Selecione o livro</FormLabel>
              </div>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  onOpenChange={loadData}
                >
                  <SelectTrigger className="w-11/12 mx-auto border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400">
                    <SelectValue placeholder="Selecione um livro" />
                  </SelectTrigger>
                  <SelectContent>
                    {livros.map((livro) => (
                      <SelectItem key={livro.id} value={livro.id}>
                        {livro.titulo} - {livro.autor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aluno_id"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col items-center">
              <div className="flex items-center w-11/12 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold mr-2">Aluno</span>
                <FormLabel className="text-center text-base text-gray-700 font-medium flex-1">Selecione o aluno</FormLabel>
              </div>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  onOpenChange={loadData}
                >
                  <SelectTrigger className="w-11/12 mx-auto border-gray-300 rounded-md focus:ring-1 focus:ring-green-400">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos.map((aluno) => (
                      <SelectItem key={aluno.id} value={aluno.id}>
                        {aluno.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 justify-center w-11/12 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-md w-1/2">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="rounded-md w-1/2">
            {loading ? "Registrando..." : "Registrar Empréstimo"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 