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
import { getProfessores } from "@/services/professores"
import type { Livro } from "@/types"
import type { Aluno } from "@/types"

const emprestimoSchema = z.object({
  livro_id: z.string().min(1, "Selecione o livro"),
  tipo_usuario: z.enum(["aluno", "professor"], { required_error: "Selecione o tipo de usuário" }),
  usuario_id: z.string().min(1, "Selecione o aluno ou professor"),
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
  const [professores, setProfessores] = useState<{ id: string; nome: string }[]>([])

  const form = useForm<EmprestimoFormValues>({
    resolver: zodResolver(emprestimoSchema),
    defaultValues: { tipo_usuario: "aluno" },
  })

  async function loadData() {
    try {
      const [livrosData, alunosData, professoresData] = await Promise.all([
        getLivros(),
        getAlunos(),
        getProfessores(),
      ])
      setLivros(livrosData)
      setAlunos(alunosData)
      setProfessores(professoresData)
    } catch {
      toast.error("Erro ao carregar dados")
    }
  }

  async function onSubmit(data: EmprestimoFormValues) {
    try {
      setLoading(true)
      const { tipo_usuario, usuario_id, ...rest } = data;
      await createEmprestimo({
        ...rest,
        aluno_id: tipo_usuario === "aluno" ? usuario_id : null,
        professor_id: tipo_usuario === "professor" ? usuario_id : null,
        data_emprestimo: new Date().toISOString(),
        status: "emprestado",
      })
      toast.success("Empréstimo registrado com sucesso!")
      onSuccess?.()
    } catch (error) {
      console.error('ERRO SUPABASE DETALHADO:', error);
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(JSON.stringify(error))
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
                <FormLabel className="text-center text-base text-gray-700 dark:text-zinc-200 font-medium flex-1">Selecione o livro</FormLabel>
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
              {form.formState.errors.livro_id?.message && (
                <span className="text-red-500 text-xs mt-1 w-11/12 text-left">Selecione o livro</span>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo_usuario"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col items-center">
              <div className="flex items-center w-11/12 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold mr-2">Tipo</span>
                <FormLabel className="text-center text-base text-gray-700 font-medium flex-1">Selecione o tipo de usuário</FormLabel>
              </div>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-11/12 mx-auto border-gray-300 rounded-md focus:ring-1 focus:ring-zinc-400">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="usuario_id"
          render={({ field }) => {
            const tipo = form.watch("tipo_usuario")
            const errorMsg = form.formState.errors.usuario_id?.message
            return (
              <FormItem className="w-full flex flex-col items-center">
                <div className="flex items-center w-11/12 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold mr-2 ${tipo === "aluno" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>{tipo === "aluno" ? "Aluno" : "Professor"}</span>
                  <FormLabel className="text-base text-gray-700 dark:text-zinc-200 font-medium ml-1">Selecione o {tipo === "aluno" ? "aluno" : "professor"}</FormLabel>
                </div>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    onOpenChange={loadData}
                  >
                    <SelectTrigger className="w-11/12 mx-auto border-gray-300 rounded-md focus:ring-1 focus:ring-zinc-400">
                      <SelectValue placeholder={`Selecione o ${tipo === "aluno" ? "aluno" : "professor"}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {tipo === "aluno"
                        ? alunos.map((aluno) => (
                            <SelectItem key={aluno.id} value={aluno.id}>
                              {aluno.nome}
                            </SelectItem>
                          ))
                        : professores.map((prof) => (
                            <SelectItem key={prof.id} value={prof.id}>
                              {prof.nome}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {errorMsg && (
                  <span className="text-red-500 text-xs mt-1 w-11/12 text-left">
                    {tipo === "aluno" ? "Selecione o aluno" : "Selecione o professor"}
                  </span>
                )}
              </FormItem>
            )
          }}
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