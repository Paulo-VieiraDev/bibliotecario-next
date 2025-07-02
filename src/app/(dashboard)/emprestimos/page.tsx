"use client"

import { useEffect, useState } from "react"
import { ArrowLeftRight, Plus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { getEmprestimos, devolverLivro } from "@/services/emprestimos"
import { EmprestimoDialog } from "./emprestimo-dialog"
import { getAlunos } from "@/services/alunos"
import { getProfessores } from "@/services/professores"
import { getLivros } from "@/services/livros"
import type { Aluno } from "@/types"
import type { Professor } from "@/types"
import type { Livro } from "@/types"
import type { Emprestimo } from "@/types"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ComboBox } from "@/components/ui/combobox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function DatePickerFiltro({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const date = value ? new Date(value) : undefined;
  return (
    <div>
      <label className="block text-xs font-medium mb-1">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span className="text-zinc-400">Selecione a data</span>}
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={d => {
              setOpen(false);
              onChange(d ? d.toISOString().slice(0, 10) : "");
            }}
            locale={ptBR}
            initialFocus
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [professores, setProfessores] = useState<Professor[]>([])
  const [livros, setLivros] = useState<Livro[]>([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    livro: "",
    usuario: "",
    status: "",
    dataEmprestimoMin: "",
    dataEmprestimoMax: "",
    dataDevolucaoMin: "",
    dataDevolucaoMax: "",
  });
  const [sheetOpen, setSheetOpen] = useState(false);

  async function loadEmprestimos() {
    try {
      const emprestimosData = await getEmprestimos()
      const alunosData = await getAlunos()
      const professoresData = await getProfessores()
      const livrosData = await getLivros()
      setEmprestimos(emprestimosData)
      setAlunos(alunosData)
      setProfessores(professoresData)
      setLivros(livrosData)
    } catch {
      toast.error("Erro ao carregar empréstimos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmprestimos()
  }, [])

  async function handleDevolver(id: string) {
    try {
      await devolverLivro(id)
      toast.success("Livro devolvido com sucesso!")
      loadEmprestimos()
    } catch {
      toast.error("Erro ao devolver livro")
    }
  }

  async function handleRenovar(emp: Emprestimo) {
    try {
      const novaData = new Date();
      novaData.setDate(novaData.getDate() + 14);
      // Atualize no Supabase
      await fetch(`/api/renovar-emprestimo?id=${emp.id}&novaData=${novaData.toISOString()}`, { method: 'POST' });
      toast.success("Empréstimo renovado por mais 2 semanas!");
      loadEmprestimos();
    } catch {
      toast.error("Erro ao renovar empréstimo");
    }
  }

  const emprestimosComNomes = emprestimos.map(e => {
    const aluno = alunos.find(a => a.id === e.aluno_id);
    const professor = professores.find(p => p.id === e.professor_id);
    const livro = livros.find(l => l.id === e.livro_id);
    return {
      ...e,
      aluno_nome: (e as any).aluno_nome || (aluno ? aluno.nome : ""),
      professor_nome: (e as any).professor_nome || (professor ? professor.nome : ""),
      livro_nome: (e as any).livro_nome || (livro ? livro.titulo : ""),
      livro_autor: livro ? livro.autor : "",
    };
  });

  const livrosUnicos = livros.map(l => ({ id: l.id, nome: l.titulo }));
  const usuariosUnicos = [
    ...alunos.map(a => ({ id: a.id, nome: a.nome + " (Aluno)" })),
    ...professores.map(p => ({ id: p.id, nome: p.nome + " (Professor)" })),
  ];

  const emprestimosFiltrados = emprestimosComNomes
    .filter(e => !filtros.livro || e.livro_id === filtros.livro)
    .filter(e => !filtros.usuario || e.aluno_id === filtros.usuario || e.professor_id === filtros.usuario)
    .filter(e => {
      if (!filtros.status) return true;
      if (filtros.status === 'atrasado') {
        return e.status === 'emprestado' && e.data_devolucao && new Date(e.data_devolucao) < new Date();
      }
      return e.status === filtros.status;
    })
    .filter(e => !filtros.dataEmprestimoMin || (e.data_emprestimo && new Date(e.data_emprestimo) >= new Date(filtros.dataEmprestimoMin)))
    .filter(e => !filtros.dataEmprestimoMax || (e.data_emprestimo && new Date(e.data_emprestimo) <= new Date(filtros.dataEmprestimoMax + 'T23:59:59')))
    .filter(e => !filtros.dataDevolucaoMin || (e.data_devolucao && new Date(e.data_devolucao) >= new Date(filtros.dataDevolucaoMin)))
    .filter(e => !filtros.dataDevolucaoMax || (e.data_devolucao && new Date(e.data_devolucao) <= new Date(filtros.dataDevolucaoMax + 'T23:59:59')));

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
            <ArrowLeftRight className="text-blue-600 w-9 h-9 animate-arrow" />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Empréstimos</h1>
          </div>
          <div className="flex gap-2">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="min-h-[28px] sm:min-h-[36px] text-xs sm:text-sm">Filtros Avançados</Button>
              </SheetTrigger>
              <SheetContent side="right" className="max-w-md w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col h-full">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold mb-2">Filtros Avançados</SheetTitle>
                  <SheetDescription className="mb-4 text-base">Refine sua busca de empréstimos usando múltiplos critérios.</SheetDescription>
                </SheetHeader>
                <form className="flex flex-col gap-6 mt-2 flex-1 overflow-y-auto">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Livro</label>
                    <ComboBox
                      items={livrosUnicos}
                      value={filtros.livro}
                      onChange={val => setFiltros(f => ({ ...f, livro: val }))}
                      placeholder="Selecione ou busque um livro"
                      displayValue={item => item.nome}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Usuário</label>
                    <ComboBox
                      items={usuariosUnicos}
                      value={filtros.usuario}
                      onChange={val => setFiltros(f => ({ ...f, usuario: val }))}
                      placeholder="Selecione ou busque um usuário"
                      displayValue={item => item.nome}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Status</label>
                    <select className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={filtros.status} onChange={e => setFiltros(f => ({ ...f, status: e.target.value }))}>
                      <option value="">Todos</option>
                      <option value="emprestado">Emprestado</option>
                      <option value="devolvido">Devolvido</option>
                      <option value="atrasado">Atrasado</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <DatePickerFiltro label="Empréstimo (de)" value={filtros.dataEmprestimoMin} onChange={val => setFiltros(f => ({ ...f, dataEmprestimoMin: val }))} />
                    <DatePickerFiltro label="Empréstimo (até)" value={filtros.dataEmprestimoMax} onChange={val => setFiltros(f => ({ ...f, dataEmprestimoMax: val }))} />
                    <DatePickerFiltro label="Devolução (de)" value={filtros.dataDevolucaoMin} onChange={val => setFiltros(f => ({ ...f, dataDevolucaoMin: val }))} />
                    <DatePickerFiltro label="Devolução (até)" value={filtros.dataDevolucaoMax} onChange={val => setFiltros(f => ({ ...f, dataDevolucaoMax: val }))} />
                  </div>
                  <div className="flex flex-row gap-2 items-center mt-4 justify-center">
                    <Button type="button" variant="ghost" className="flex-1 max-w-xs py-2 text-base font-semibold border border-zinc-300 dark:border-zinc-700" onClick={() => setFiltros({ livro: "", usuario: "", status: "", dataEmprestimoMin: "", dataEmprestimoMax: "", dataDevolucaoMin: "", dataDevolucaoMax: "" })}>
                      Resetar
                    </Button>
                    <Button type="button" className="flex-1 max-w-xs py-2 text-base font-semibold" onClick={() => setSheetOpen(false)}>
                      Aplicar
                    </Button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>
            <EmprestimoDialog onSuccess={loadEmprestimos} trigger={
              <Button variant="default" className="px-6 py-2 text-base font-bold flex items-center gap-2 shadow-lg transition-all scale-100 hover:scale-105">
                <Plus className="h-5 w-5" />
                Novo Empréstimo
              </Button>
            } />
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="min-w-full rounded-2xl overflow-hidden border-separate border-spacing-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800">
                <th className="px-4 py-3 text-left font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800">Livro</th>
                <th className="px-4 py-3 text-left font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800">
                  Usuário
                </th>
                <th className="px-4 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800">Data do Empréstimo</th>
                <th className="px-4 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800">Data da Devolução</th>
                <th className="px-4 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800">Status</th>
                <th className="px-4 py-3 text-center font-bold text-zinc-700 dark:text-zinc-100">Ações</th>
              </tr>
            </thead>
            <tbody>
              {emprestimosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900">
                    Nenhum empréstimo encontrado.
                  </td>
                </tr>
              ) : (
                emprestimosFiltrados.map((emp, idx) => {
                  const isLast = idx === emprestimosFiltrados.length - 1;
                  const podeRenovar = emp.status === 'emprestado' && emp.data_devolucao && (
                    (new Date(emp.data_devolucao) < new Date()) ||
                    ((new Date(emp.data_devolucao).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 3)
                  );
                  return (
                    <tr
                      key={emp.id}
                      className={
                        `border-t border-zinc-200 dark:border-zinc-800 ` +
                        (isLast ? '' : 'border-b-2 border-zinc-300 dark:border-b-2 dark:border-zinc-700 ') +
                        (idx % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50 dark:bg-zinc-950')
                      }
                    >
                      <td className="px-4 py-3 align-top border-r border-zinc-200 dark:border-zinc-800">
                        <div className="font-bold text-zinc-800 dark:text-zinc-100">{emp.livro_nome || 'Livro removido'}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-zinc-700 dark:text-zinc-200 border-r border-zinc-200 dark:border-zinc-800">
                        <div className="font-bold text-zinc-800 dark:text-zinc-100">{emp.aluno_nome || emp.professor_nome || 'Usuário removido'}</div>
                        <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                          {emp.aluno_nome ? 'Aluno' : (emp.professor_nome ? 'Professor' : '')}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-center text-zinc-700 dark:text-zinc-200 border-r border-zinc-200 dark:border-zinc-800">
                        {emp.data_emprestimo
                          ? new Date(emp.data_emprestimo).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td className="px-4 py-3 align-top text-center border-r border-zinc-200 dark:border-zinc-800">
                        {emp.data_devolucao ? (
                          <span className={emp.status === 'emprestado' && new Date(emp.data_devolucao) < new Date() ? 'text-red-800 dark:text-red-200 font-bold' : 'text-zinc-700 dark:text-zinc-200'}>
                            {new Date(emp.data_devolucao).toLocaleDateString('pt-BR')}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 align-top text-center border-r border-zinc-200 dark:border-zinc-800">
                        {emp.status === 'emprestado' && emp.data_devolucao && new Date(emp.data_devolucao) < new Date() ? (
                          <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-xs font-bold">Atrasado</span>
                        ) : emp.status === 'emprestado' ? (
                          <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-xs font-bold">Emprestado</span>
                        ) : (
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-bold">Devolvido</span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top text-center">
                        {emp.status === "emprestado" && (
                          <div className="flex gap-2 justify-center">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-full hover:bg-blue-100 dark:hover:bg-zinc-700 transition-colors"
                                >
                                  <ArrowLeftRight className="h-5 w-5 text-blue-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Devolver Livro</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja registrar a devolução deste livro?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDevolver(emp.id)}>
                                    Confirmar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            {podeRenovar && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                                    title="Renovar empréstimo"
                                  >
                                    <RotateCcw className="h-5 w-5 text-green-600" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Renovar Empréstimo</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Deseja renovar este empréstimo por mais 2 semanas?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRenovar(emp)}>
                                      Confirmar Renovação
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        )}
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
        @keyframes arrow {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        .animate-arrow { animation: arrow 1.2s infinite alternate; }
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
      `}</style>
    </div>
  )
} 