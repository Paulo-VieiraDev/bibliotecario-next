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
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import type { Aluno } from "@/types"
import { createAluno, updateAluno } from "@/services/alunos"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getTurmas } from "@/services/turmas"

const alunoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  turma_id: z.string().min(1, "Turma é obrigatória"),
})

type AlunoFormValues = z.infer<typeof alunoSchema>

interface AlunoFormProps {
  aluno?: Aluno
  onSuccess?: () => void
  onCancel?: () => void
  turmas: { id: string; nome: string }[]
}

export function AlunoForm({ aluno, onSuccess, onCancel, turmas }: AlunoFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<AlunoFormValues>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      nome: aluno?.nome ?? "",
      turma_id: aluno?.turma_id ?? "",
    },
  })

  async function onSubmit(data: AlunoFormValues) {
    try {
      setLoading(true)
      if (aluno) {
        await updateAluno(aluno.id, data)
        toast.success("Aluno atualizado com sucesso!")
      } else {
        await createAluno(data)
        toast.success("Aluno cadastrado com sucesso!")
      }
      onSuccess?.()
    } catch (error) {
      toast.error("Erro ao salvar aluno")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col items-center">
              <div className="flex items-center w-11/12 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mr-2">Nome</span>
                <FormLabel className="text-center text-base text-gray-700 font-medium flex-1">Digite o nome</FormLabel>
              </div>
              <FormControl>
                <Input {...field} className="w-11/12 mx-auto" />
              </FormControl>
              <FormMessage className="w-11/12 text-left mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="turma_id"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col items-center">
              <div className="flex items-center w-11/12 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mr-2">Turma</span>
                <FormLabel className="text-center text-base text-gray-700 font-medium flex-1">Selecione a turma</FormLabel>
              </div>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-11/12 mx-auto border-gray-300 rounded-md focus:ring-1 focus:ring-purple-400">
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {turmas.map((turma) => (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="w-11/12 text-left mt-1" />
            </FormItem>
          )}
        />
        <div className="flex gap-3 justify-center w-11/12 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-md w-1/2">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="rounded-md w-1/2">
            {loading ? "Salvando..." : aluno ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 