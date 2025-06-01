"use client"

import React, { useEffect, useState } from "react"
import { Plus, BookOpen, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLivros, deleteLivro } from "@/services/livros"
import type { Livro } from "@/types"
import { toast } from "sonner"
import { LivroDialog } from "./livro-dialog"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('')

  // Extrai categorias únicas dos livros
  const categorias = Array.from(new Set(livros.map(l => l.categoria).filter(Boolean)))

  useEffect(() => {
    loadLivros()
  }, [])

  async function loadLivros() {
    try {
      const data = await getLivros()
      setLivros(data)
    } catch {
      toast.error("Erro ao carregar livros")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteLivro(id);
      toast.success("Livro excluído com sucesso!");
      loadLivros();
    } catch {
      toast.error("Erro ao excluir livro")
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-white dark:bg-transparent py-12">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 px-2">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-600 w-9 h-9 animate-book" />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Livros</h1>
          </div>
        </div>
        <div className="flex flex-row flex-nowrap gap-2 justify-center sm:justify-between items-center mb-4 px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="px-3 py-2 font-bold transition-all scale-100 hover:scale-105 flex justify-between items-center min-w-0 w-auto"
              >
                {categoriaFiltro ? categoriaFiltro : "Todas as categorias"}
                <svg className="ml-2 w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[180px]">
              <DropdownMenuItem onClick={() => setCategoriaFiltro("")}>Todas as categorias</DropdownMenuItem>
              {categorias.map((cat) => (
                <DropdownMenuItem key={cat} onClick={() => setCategoriaFiltro(cat)}>
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <LivroDialog onSuccess={loadLivros} trigger={
            <Button
              variant="default"
              className="px-3 py-2 text-base font-bold flex items-center gap-2 shadow-lg transition-all scale-100 hover:scale-105 min-w-0 w-auto"
            >
              <Plus className="h-5 w-5" />
              Novo Livro
            </Button>
          } />
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="min-w-full rounded-2xl overflow-hidden border-separate border-spacing-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800">
                <th className="px-5 py-3 text-left font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[180px]">Título</th>
                <th className="px-5 py-3 text-left font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[120px]">Autor</th>
                <th className="px-3 py-3 text-left font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[110px]">Editora</th>
                <th className="px-3 py-3 text-left font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[80px]">Edição</th>
                <th className="px-3 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[80px]">Quantidade</th>
                <th className="px-3 py-3 text-left font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[120px]">Categoria</th>
                <th className="px-3 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[100px]">Ano/Série</th>
                <th className="px-3 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[100px]">Etapa</th>
                <th className="px-3 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100 min-w-[120px]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {livros.filter(livro => !categoriaFiltro || livro.categoria === categoriaFiltro).length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900">
                    Nenhum livro encontrado.
                  </td>
                </tr>
              ) : (
                livros.filter(livro => !categoriaFiltro || livro.categoria === categoriaFiltro).map((livro, idx, arr) => {
                  const isLast = idx === arr.length - 1;
                  return (
                    <tr
                      key={livro.id}
                      className={
                        `border-t border-zinc-200 dark:border-zinc-800 ` +
                        (isLast ? '' : 'border-b-2 border-zinc-300 dark:border-b-2 dark:border-zinc-700 ') +
                        (idx % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50 dark:bg-zinc-950')
                      }
                    >
                      <td className="font-semibold whitespace-nowrap px-5 py-3 align-middle border-r border-zinc-200 dark:border-zinc-800">{livro.titulo}</td>
                      <td className="whitespace-nowrap px-5 py-3 align-middle border-r border-zinc-200 dark:border-zinc-800">{livro.autor}</td>
                      <td className="whitespace-nowrap px-3 py-3 align-middle border-r border-zinc-200 dark:border-zinc-800">{livro.editora}</td>
                      <td className="whitespace-nowrap px-3 py-3 align-middle border-r border-zinc-200 dark:border-zinc-800">{livro.edicao}</td>
                      <td className="whitespace-nowrap px-3 py-3 align-middle text-center border-r border-zinc-200 dark:border-zinc-800">{livro.quantidade}</td>
                      <td className="whitespace-nowrap px-3 py-3 align-middle border-r border-zinc-200 dark:border-zinc-800">{livro.categoria}</td>
                      <td className="whitespace-nowrap px-3 py-3 align-middle text-center border-r border-zinc-200 dark:border-zinc-800">{livro.ano_serie || "-"}</td>
                      <td className="whitespace-nowrap px-3 py-3 align-middle text-center border-r border-zinc-200 dark:border-zinc-800">{livro.etapa || "-"}</td>
                      <td className="whitespace-nowrap px-3 py-3 align-middle text-center">
                        <div className="flex gap-2 justify-center">
                          <LivroDialog
                            livro={livro}
                            onSuccess={loadLivros}
                            trigger={
                              <Button size="icon" variant="ghost" className="text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800" title="Editar">
                                <Pencil className="w-5 h-5" />
                              </Button>
                            }
                          />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800" title="Excluir">
                                <Trash className="w-5 h-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o livro <span className="font-semibold">{livro.titulo}</span>? Esta ação não poderá ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(livro.id)} className="bg-red-600 hover:bg-red-700">
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx global>{`
        @keyframes book {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-book { animation: book 1.2s infinite alternate; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
      `}</style>
    </div>
  )
} 