"use client"

import React, { useEffect, useState } from "react"
import { BookOpen, Pencil, Trash, Eye } from "lucide-react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('')
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null)
  const [search, setSearch] = useState("")

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

  // Filtrar livros por categoria e nome
  const livrosFiltrados = livros
    .filter(livro => !categoriaFiltro || livro.categoria === categoriaFiltro)
    .filter(livro => livro.titulo.toLowerCase().includes(search.toLowerCase()));

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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 mb-4 w-full">
          {/* Barra de pesquisa */}
          <input
            type="text"
            placeholder="Pesquisar livro pelo nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            {/* Filtro de categoria */}
            <select
              value={categoriaFiltro}
              onChange={e => setCategoriaFiltro(e.target.value)}
              className="border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 w-1/2 sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-400 transition-colors"
            >
              <option value="">Todas as categorias</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {/* Botão Novo Livro */}
            <LivroDialog onSuccess={loadLivros} trigger={
              <Button
                variant="default"
                className="px-6 py-2 text-base font-bold flex items-center gap-2 shadow-lg transition-all scale-100 hover:scale-105 whitespace-nowrap w-1/2 sm:w-auto"
              >
                + Novo Livro
              </Button>
            } />
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="min-w-full rounded-2xl overflow-hidden border-separate border-spacing-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800">
                <th className="px-2 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 w-8"></th>
                <th className="px-5 py-3 text-left font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[180px]">Título</th>
                <th className="px-3 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[80px]">Quantidade</th>
                <th className="px-3 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[80px]">Disponíveis</th>
                <th className="px-3 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800 min-w-[100px]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {livrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900">
                    Nenhum livro encontrado.
                  </td>
                </tr>
              ) : (
                livrosFiltrados.map((livro, idx, arr) => {
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
                      <td className="px-2 py-3 text-center align-middle border-r border-zinc-200 dark:border-zinc-800">
                        <button onClick={() => setLivroSelecionado(livro)} className="transition-transform duration-200 hover:scale-125 focus:outline-none">
                          <Eye className="w-5 h-5 text-zinc-600 hover:text-zinc-900" />
                        </button>
                      </td>
                      <td className="font-semibold whitespace-nowrap px-5 py-3 align-middle border-r border-zinc-200 dark:border-zinc-800">
                        {livro.titulo}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 align-middle text-center border-r border-zinc-200 dark:border-zinc-800">{livro.quantidade}</td>
                      <td className="whitespace-nowrap px-3 py-3 align-middle text-center border-r border-zinc-200 dark:border-zinc-800">{livro.quantidade_disponivel ?? '-'}</td>
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
      <Dialog open={!!livroSelecionado} onOpenChange={() => setLivroSelecionado(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Livro</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Veja abaixo todos os detalhes do livro selecionado.
          </DialogDescription>
          {livroSelecionado && (
            <div className="w-[90%] mx-auto bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 shadow flex flex-col gap-8">
              {/* Informações principais */}
              <div className="flex flex-col items-center mb-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold mb-1">Info</span>
                <h4 className="text-zinc-500 dark:text-zinc-300 font-semibold text-lg mb-2 text-center">Informações principais</h4>
                <div className="grid grid-cols-1 gap-y-1 text-center">
                  <span><b>Título</b>: {livroSelecionado.titulo}</span>
                  <span><b>Autor</b>: {livroSelecionado.autor}</span>
                  <span><b>Editora</b>: {livroSelecionado.editora}</span>
                  <span><b>Edição</b>: {livroSelecionado.edicao}</span>
                </div>
              </div>
              <hr />
              {/* Estoque */}
              <div className="flex flex-col items-center mb-2">
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200 text-xs font-semibold mb-1">Estoque</span>
                <h4 className="text-zinc-500 dark:text-zinc-300 font-semibold text-lg mb-2 text-center">Estoque</h4>
                <div className="grid grid-cols-1 gap-y-1 text-center">
                  <span><b>Quantidade</b>: {livroSelecionado.quantidade}</span>
                  <span><b>Disponíveis</b>: {livroSelecionado.quantidade_disponivel}</span>
                  <span><b>Vida útil</b>: {livroSelecionado.vida_util}</span>
                </div>
              </div>
              <hr />
              {/* Classificação */}
              <div className="flex flex-col items-center">
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-xs font-semibold mb-1">Classificação</span>
                <h4 className="text-zinc-500 dark:text-zinc-300 font-semibold text-lg mb-2 text-center">Classificação</h4>
                <div className="grid grid-cols-1 gap-y-1 text-center">
                  <span><b>Categoria</b>: {livroSelecionado.categoria}</span>
                  <span><b>Ano/Série</b>: {livroSelecionado.ano_serie}</span>
                  <span><b>Etapa</b>: {livroSelecionado.etapa}</span>
                  <span><b>Tipo Didático</b>: {livroSelecionado.tipo_didatico}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 