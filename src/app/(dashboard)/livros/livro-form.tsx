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
import { etapaDoEnsino } from "@/lib/utils"

const categorias = [
  { value: "Didático", label: "Didático" },
  { value: "Literatura Infantil", label: "Literatura Infantil (6 a 8 anos)" },
  { value: "Infantojuvenil", label: "Infantojuvenil (9 a 12 anos)" },
  { value: "Juvenil", label: "Juvenil (13 a 18 anos)" },
  { value: "Adulto", label: "Adulto" },
  { value: "Técnico", label: "Técnico" },
  { value: "Paradidático", label: "Paradidático" },
  { value: "3º ano", label: "3º ano" },
]

const tiposDidatico = [
  { value: "Aluno", label: "Aluno" },
  { value: "Professor", label: "Professor" },
]

const anosSerie = [
  { value: "6º ano", label: "6º ano" },
  { value: "7º ano", label: "7º ano" },
  { value: "8º ano", label: "8º ano" },
  { value: "9º ano", label: "9º ano" },
  { value: "1º ano", label: "1º ano" },
  { value: "2º ano", label: "2º ano" },
  { value: "3º ano", label: "3º ano" },
]

const livroSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  autor: z.string().min(1, "Autor é obrigatório"),
  editora: z.string().min(1, "Editora é obrigatória"),
  edicao: z.string().min(1, "Edição é obrigatória"),
  quantidade: z.coerce.number().min(1, "Quantidade é obrigatória"),
  quantidade_disponivel: z.coerce.number().min(0),
  vida_util: z.coerce.number().optional(),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  ano_serie: z.string().optional(),
  etapa: z.string().optional(),
  tipo_didatico: z.string().optional(),
}).refine((data) => {
  // Se for livro didático, os campos específicos são obrigatórios
  if (data.categoria === "Didático") {
    return !!data.ano_serie && !!data.etapa && !!data.tipo_didatico
  }
  return true
}, {
  message: "Livros didáticos precisam ter ano/série, etapa e tipo (aluno/professor)",
  path: ["categoria"]
})

type LivroFormValues = z.infer<typeof livroSchema>

interface LivroFormProps {
  livro?: Livro
  onSuccess?: () => void
  onCancel?: () => void
}

export function LivroForm({ livro, onSuccess, onCancel }: LivroFormProps) {
  const [loading, setLoading] = useState(false)
  const [categoria, setCategoria] = useState(livro?.categoria ?? "")
  const [anoSerieSelecionado, setAnoSerieSelecionado] = useState(livro?.ano_serie ?? "")

  const form = useForm<LivroFormValues>({
    resolver: zodResolver(livroSchema),
    defaultValues: {
      titulo: livro?.titulo ?? "",
      autor: livro?.autor ?? "",
      editora: livro?.editora ?? "",
      edicao: livro?.edicao ?? "",
      quantidade: livro?.quantidade ?? 1,
      quantidade_disponivel: livro?.quantidade_disponivel ?? livro?.quantidade ?? 1,
      vida_util: livro?.vida_util ?? undefined,
      categoria: livro?.categoria ?? "",
      ano_serie: livro?.ano_serie ?? "",
      etapa: livro?.etapa ?? "",
      tipo_didatico: livro?.tipo_didatico ?? "",
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
      console.error('Erro ao salvar livro:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao salvar livro")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xs sm:max-w-2xl mx-auto flex flex-col gap-4 sm:gap-6 px-2">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mr-2">Título</span>
                  <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">Título do livro</FormLabel>
                </div>
                <FormControl>
                  <Input {...field} placeholder="Digite o título" className="w-full min-h-[28px] sm:min-h-[36px] px-1 sm:px-2 py-1 sm:py-2 text-xs sm:text-sm rounded sm:rounded-md" value={field.value ?? ""} />
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
                <div className="flex items-center mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold mr-2">Autor</span>
                  <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">Autor</FormLabel>
                </div>
                <FormControl>
                  <Input {...field} placeholder="Digite o autor" className="w-full min-h-[28px] sm:min-h-[36px] px-1 sm:px-2 py-1 sm:py-2 text-xs sm:text-sm rounded sm:rounded-md" value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="editora"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mr-2">Editora</span>
                  <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">Editora</FormLabel>
                </div>
                <FormControl>
                  <Input {...field} placeholder="Digite a editora" className="w-full min-h-[28px] sm:min-h-[36px] px-1 sm:px-2 py-1 sm:py-2 text-xs sm:text-sm rounded sm:rounded-md" value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <FormField
              control={form.control}
              name="edicao"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold mr-2">Edição</span>
                    <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">Edição</FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 1ª edição, 4ª edição" className="w-full min-h-[28px] sm:min-h-[36px] px-1 sm:px-2 py-1 sm:py-2 text-xs sm:text-sm rounded sm:rounded-md" value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantidade"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mr-2">Quantidade</span>
                    <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">Quantidade</FormLabel>
                  </div>
                  <FormControl>
                    <Input type="number" min={1} {...field} className="w-full min-h-[28px] sm:min-h-[36px] px-1 sm:px-2 py-1 sm:py-2 text-xs sm:text-sm rounded sm:rounded-md" value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="vida_util"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold mr-2">Vida útil</span>
                  <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">Vida útil (anos) <span className='text-gray-400'>(opcional)</span></FormLabel>
                </div>
                <FormControl>
                  <Input type="number" min={1} {...field} placeholder="Ex: 3" className="w-full min-h-[28px] sm:min-h-[36px] px-1 sm:px-2 py-1 sm:py-2 text-xs sm:text-sm rounded sm:rounded-md" value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mr-2">Categoria</span>
                  <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">Categoria</FormLabel>
                </div>
                <FormControl>
                  <select
                    {...field}
                    className="w-full min-h-[28px] sm:min-h-[36px] border-gray-300 rounded-md focus:ring-1 focus:ring-pink-400 text-xs sm:text-sm"
                    onChange={e => {
                      field.onChange(e)
                      setCategoria(e.target.value)
                    }}
                  >
                    <option value="">Selecione...</option>
                    {categorias.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campos extras para Didático */}
          {categoria === "Didático" && (
            <div className="flex flex-col gap-4 w-full md:max-h-[60vh] md:overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <FormField
                  control={form.control}
                  name="ano_serie"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mr-2">Ano/Série</span>
                        <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">Ano/Série</FormLabel>
                      </div>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full min-h-[28px] sm:min-h-[36px] border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 text-xs sm:text-sm"
                          value={field.value}
                          onChange={e => {
                            field.onChange(e)
                            setAnoSerieSelecionado(e.target.value)
                          }}
                        >
                          <option value="">Selecione...</option>
                          {anosSerie.map(ano => (
                            <option key={ano.value} value={ano.value}>{ano.label}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold mr-2">Etapa</span>
                    <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">Etapa do ensino</FormLabel>
                  </div>
                  <div className="w-full text-xs sm:text-sm text-gray-700 font-medium border border-indigo-200 rounded-md py-2 bg-indigo-50 px-3 min-h-[28px] sm:min-h-[36px] flex items-center">
                    {etapaDoEnsino(anoSerieSelecionado) || "Selecione o ano/série"}
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="tipo_didatico"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mr-2">Tipo</span>
                      <FormLabel className="text-gray-700 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">Professor ou Aluno?</FormLabel>
                    </div>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full min-h-[28px] sm:min-h-[36px] border-gray-300 rounded-md focus:ring-1 focus:ring-green-400 text-xs sm:text-sm"
                      >
                        <option value="">Selecione...</option>
                        {tiposDidatico.map(tp => (
                          <option key={tp.value} value={tp.value}>{tp.label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2 justify-center w-full pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="rounded-md w-full sm:w-1/2 min-h-[28px] sm:min-h-[36px] text-xs sm:text-sm">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="rounded-md w-full sm:w-1/2 min-h-[28px] sm:min-h-[36px] text-xs sm:text-sm">
              {loading ? "Salvando..." : livro ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 