"use client"

import { useState, useEffect } from "react"
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
  matricula: z.string().min(1, "Matrícula é obrigatória"),
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
      matricula: aluno?.matricula ?? "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="matricula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="turma_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turma</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {turmas.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome}
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
            {loading ? "Salvando..." : aluno ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 