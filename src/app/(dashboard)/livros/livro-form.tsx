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
import type { Livro } from "@/types"
import { createLivro, updateLivro } from "@/services/livros"

const livroSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  autor: z.string().min(1, "Autor é obrigatório"),
  isbn: z.string().min(1, "ISBN é obrigatório"),
  quantidade: z.coerce.number().min(1, "Quantidade deve ser maior que 0"),
})

type LivroFormValues = z.infer<typeof livroSchema>

interface LivroFormProps {
  livro?: Livro
  onSuccess?: () => void
  onCancel?: () => void
}

export function LivroForm({ livro, onSuccess, onCancel }: LivroFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<LivroFormValues>({
    resolver: zodResolver(livroSchema),
    defaultValues: {
      titulo: livro?.titulo ?? "",
      autor: livro?.autor ?? "",
      isbn: livro?.isbn ?? "",
      quantidade: livro?.quantidade ?? 1,
    },
  })

  async function onSubmit(data: LivroFormValues) {
    try {
      setLoading(true)
      if (livro) {
        await updateLivro(livro.id, data)
        toast.success("Livro atualizado com sucesso!")
      } else {
        await createLivro(data)
        toast.success("Livro cadastrado com sucesso!")
      }
      onSuccess?.()
    } catch (error) {
      toast.error("Erro ao salvar livro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="autor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Autor</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isbn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISBN</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : livro ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 