"use client"

import React, { useEffect, useState } from "react"
import { BookOpen, Pencil, Trash, Eye, Search } from "lucide-react"
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
import { supabase } from "@/lib/supabase"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { ComboBox } from "@/components/ui/combobox"
import { YearPicker } from "@/components/ui/year-picker"

export default function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('')
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null)
  const [search, setSearch] = useState("")
  const [autorFiltro, setAutorFiltro] = useState<string>('')
  const [editoraFiltro, setEditoraFiltro] = useState<string>('')
  const [anoMinFiltro, setAnoMinFiltro] = useState<number | null>(null)
  const [anoMaxFiltro, setAnoMaxFiltro] = useState<number | null>(null)
  const [disponivelFiltro, setDisponivelFiltro] = useState<boolean>(false)
  const [filtros, setFiltros] = useState({
    anoMin: "",
    anoMax: "",
    autor: "",
    editora: "",
    categorias: [] as string[],
    disponivel: false,
    vidaUtilMin: "",
    vidaUtilMax: "",
  })
  const [sheetOpen, setSheetOpen] = useState(false)

  // Extrai categorias únicas dos livros
  const categorias = Array.from(new Set(livros.map(l => l.categoria).filter(Boolean)))

  // Antes do return, extraia autores e editoras únicos dos livros:
  const autoresUnicos = Array.from(new Set(livros.map(l => l.autor).filter(Boolean))).map(a => ({ id: a, nome: a }))
  const editorasUnicas = Array.from(new Set(livros.map(l => l.editora).filter(Boolean))).map(e => ({ id: e, nome: e }))

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
      // Verificar se há empréstimos ativos para o livro
      const { count, error: countError } = await supabase
        .from('emprestimos')
        .select('*', { count: 'exact', head: true })
        .eq('livro_id', id)
        .eq('status', 'emprestado');
      if (countError) {
        toast.error('Erro ao verificar empréstimos ativos');
        return;
      }
      if ((count ?? 0) > 0) {
        toast.error('Não é possível excluir: este livro possui empréstimos ativos!');
        return;
      }
      // Prosseguir com o soft delete
      await deleteLivro(id);
      toast.success('Livro excluído com sucesso!');
      loadLivros();
    } catch {
      toast.error('Erro ao excluir livro');
    }
  }

  // Filtrar livros por categoria, autor, editora, ano e disponibilidade
  const livrosFiltrados = livros
    .filter(livro => !categoriaFiltro || livro.categoria === categoriaFiltro)
    .filter(livro => !filtros.anoMin || (livro.ano && livro.ano >= Number(filtros.anoMin)))
    .filter(livro => !filtros.anoMax || (livro.ano && livro.ano <= Number(filtros.anoMax)))
    .filter(livro => !filtros.autor || livro.autor.toLowerCase().includes(filtros.autor.toLowerCase()))
    .filter(livro => !filtros.editora || livro.editora.toLowerCase().includes(filtros.editora.toLowerCase()))
    .filter(livro => filtros.categorias.length === 0 || filtros.categorias.includes(livro.categoria))
    .filter(livro => !filtros.disponivel || livro.quantidade_disponivel > 0)
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
        <div className="flex flex-col sm:flex-row gap-2 w-full items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar livro pelo nome..."
              className="pl-8 pr-2 py-1 sm:py-2 min-h-[28px] sm:min-h-[36px] text-xs sm:text-sm rounded sm:rounded-md border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="min-h-[28px] sm:min-h-[36px] text-xs sm:text-sm">Filtros Avançados</Button>
            </SheetTrigger>
            <SheetContent side="right" className="max-w-md w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold mb-2">Filtros Avançados</SheetTitle>
                <SheetDescription className="mb-4 text-base">Refine sua busca de livros usando múltiplos critérios.</SheetDescription>
              </SheetHeader>
              <form className="flex flex-col gap-6 mt-2">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Ano (mínimo)</label>
                    <YearPicker
                      value={filtros.anoMin ? Number(filtros.anoMin) : null}
                      onChange={ano => setFiltros(f => ({ ...f, anoMin: ano ? String(ano) : "" }))}
                      minYear={1980}
                      maxYear={new Date().getFullYear()}
                      placeholder="Ano mínimo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Ano (máximo)</label>
                    <YearPicker
                      value={filtros.anoMax ? Number(filtros.anoMax) : null}
                      onChange={ano => setFiltros(f => ({ ...f, anoMax: ano ? String(ano) : "" }))}
                      minYear={1980}
                      maxYear={new Date().getFullYear()}
                      placeholder="Ano máximo"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Autor</label>
                  <ComboBox
                    items={autoresUnicos}
                    value={filtros.autor}
                    onChange={val => setFiltros(f => ({ ...f, autor: val }))}
                    placeholder="Selecione ou busque um autor"
                    displayValue={item => item.nome}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Editora</label>
                  <ComboBox
                    items={editorasUnicas}
                    value={filtros.editora}
                    onChange={val => setFiltros(f => ({ ...f, editora: val }))}
                    placeholder="Selecione ou busque uma editora"
                    displayValue={item => item.nome}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Categoria</label>
                  <select className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={filtros.categorias[0] || ""} onChange={e => setFiltros(f => ({ ...f, categorias: e.target.value ? [e.target.value] : [] }))}>
                    <option value="">Todas</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="disponivel" checked={filtros.disponivel} onChange={e => setFiltros(f => ({ ...f, disponivel: e.target.checked }))} className="accent-blue-600 w-4 h-4" />
                  <label htmlFor="disponivel" className="text-sm">Apenas com disponibilidade</label>
                </div>
                <div className="flex flex-row gap-2 items-center mt-4 justify-center">
                  <Button type="button" variant="ghost" className="flex-1 max-w-xs py-2 text-base font-semibold border border-zinc-300 dark:border-zinc-700" onClick={() => setFiltros({ anoMin: "", anoMax: "", autor: "", editora: "", categorias: [], disponivel: false, vidaUtilMin: "", vidaUtilMax: "" })}>
                    Resetar
                  </Button>
                  <Button type="button" className="flex-1 max-w-xs py-2 text-base font-semibold" onClick={() => setSheetOpen(false)}>
                    Aplicar
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
          <LivroDialog onSuccess={loadLivros} trigger={
            <Button className="min-h-[28px] sm:min-h-[36px] px-4 sm:px-6 text-xs sm:text-sm font-bold rounded sm:rounded-md w-full sm:w-auto">
              + Novo Livro
            </Button>
          } />
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
                        <button onClick={() => setLivroSelecionado(livro)} className="transition-transform duration-200 hover:scale-12F5 focus:outline-none">
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
                  <span><b>Ano</b>: {livroSelecionado.ano}</span>
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