"use client"

import React, { useEffect, useState } from "react"
import { Plus, BookOpen, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

export default function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([])
  const [loading, setLoading] = useState(true)

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
          <LivroDialog onSuccess={loadLivros} trigger={
            <Button
              variant="default"
              className="px-6 py-2 text-base font-bold flex items-center gap-2 shadow-lg transition-all scale-100 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Novo Livro
            </Button>
          } />
        </div>
        <div className="overflow-x-auto rounded-2xl shadow border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <Table className="w-full min-w-[950px]">
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-zinc-800 text-base">
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[180px] px-5">Título</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[120px] px-5 border-l border-zinc-200 dark:border-zinc-800">Autor</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[110px] px-3 border-l border-zinc-200 dark:border-zinc-800">Editora</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[80px] px-3 border-l border-zinc-200 dark:border-zinc-800">Edição</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[80px] px-3 border-l border-zinc-200 dark:border-zinc-800">Quantidade</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[120px] px-3 border-l border-zinc-200 dark:border-zinc-800">Categoria</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[100px] px-3 border-l border-zinc-200 dark:border-zinc-800">Ano/Série</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[100px] px-3 border-l border-zinc-200 dark:border-zinc-800">Etapa</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-100 min-w-[120px] px-3 border-l border-zinc-200 dark:border-zinc-800">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {livros.map((livro) => (
                <TableRow key={livro.id} className="hover:bg-blue-50/60 dark:hover:bg-zinc-800/60 transition-all text-base">
                  <TableCell className="font-semibold whitespace-nowrap px-5 py-3 align-middle">{livro.titulo}</TableCell>
                  <TableCell className="whitespace-nowrap px-5 py-3 align-middle border-l border-zinc-100 dark:border-zinc-800">{livro.autor}</TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 align-middle border-l border-zinc-100 dark:border-zinc-800">{livro.editora}</TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 align-middle border-l border-zinc-100 dark:border-zinc-800">{livro.edicao}</TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 align-middle border-l border-zinc-100 dark:border-zinc-800">{livro.quantidade}</TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 align-middle border-l border-zinc-100 dark:border-zinc-800">{livro.categoria}</TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 align-middle border-l border-zinc-100 dark:border-zinc-800">{livro.ano_serie || "-"}</TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 align-middle border-l border-zinc-100 dark:border-zinc-800">{livro.etapa || "-"}</TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 align-middle border-l border-zinc-100 dark:border-zinc-800">
                    <div className="flex gap-2">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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