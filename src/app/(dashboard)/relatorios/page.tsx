"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"

const COLORS = ["#6366f1", "#f59e42", "#10b981", "#ef4444", "#fbbf24", "#3b82f6"]

interface LivroEmprestado {
  titulo: string
  quantidade: number
}

interface EmprestimoPorTurma {
  turma: string
  quantidade: number
}

interface EmprestimoPorMes {
  mes: string
  quantidade: number
}

interface AlunoEmprestimo {
  nome: string
  quantidade: number
}

export default function RelatoriosPage() {
  // States para os cards
  const [totalLivros, setTotalLivros] = useState(0)
  const [totalAlunos, setTotalAlunos] = useState(0)
  const [totalEmprestimos, setTotalEmprestimos] = useState(0)
  const [emprestimosAbertos, setEmprestimosAbertos] = useState(0)

  // States para gráficos
  const [livrosMaisEmprestados, setLivrosMaisEmprestados] = useState<LivroEmprestado[]>([])
  const [emprestimosPorTurma, setEmprestimosPorTurma] = useState<EmprestimoPorTurma[]>([])
  const [emprestimosPorMes, setEmprestimosPorMes] = useState<EmprestimoPorMes[]>([])
  const [alunosMaisEmprestimos, setAlunosMaisEmprestimos] = useState<AlunoEmprestimo[]>([])

  // Loading states
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Cards
        const [livrosCount, alunosCount, emprestimosCount, emprestimosAbertosCount] = await Promise.all([
          supabase.from("livros").select("id", { count: "exact", head: true }),
          supabase.from("alunos").select("id", { count: "exact", head: true }),
          supabase.from("emprestimos").select("id", { count: "exact", head: true }),
          supabase.from("emprestimos").select("id", { count: "exact", head: true }).eq("status", "emprestado")
        ])

        setTotalLivros(livrosCount.count || 0)
        setTotalAlunos(alunosCount.count || 0)
        setTotalEmprestimos(emprestimosCount.count || 0)
        setEmprestimosAbertos(emprestimosAbertosCount.count || 0)

        // Gráficos
        const [livrosData, turmasData, mesesData, alunosData] = await Promise.all([
          supabase.rpc("livros_mais_emprestados"),
          supabase.rpc("emprestimos_por_turma"),
          supabase.rpc("emprestimos_por_mes"),
          supabase.rpc("alunos_mais_emprestimos")
        ])

        setLivrosMaisEmprestados(livrosData.data || [])
        setEmprestimosPorTurma(turmasData.data || [])
        setEmprestimosPorMes(mesesData.data || [])
        setAlunosMaisEmprestimos(alunosData.data || [])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
      <p>{message}</p>
    </div>
  )

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-800">Relatórios da Biblioteca</h1>
        <p className="text-gray-500 mt-1">Acompanhe as estatísticas e métricas da biblioteca</p>
      </div>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="bg-white shadow-sm">
              <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="bg-white shadow-sm border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Total de Livros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{totalLivros}</div>
                <p className="text-xs text-gray-500 mt-1">Livros cadastrados</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Total de Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{totalAlunos}</div>
                <p className="text-xs text-gray-500 mt-1">Alunos cadastrados</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Total de Empréstimos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{totalEmprestimos}</div>
                <p className="text-xs text-gray-500 mt-1">Empréstimos realizados</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border-yellow-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">Empréstimos em Aberto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{emprestimosAbertos}</div>
                <p className="text-xs text-gray-500 mt-1">Livros não devolvidos</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Livros mais emprestados</h2>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : livrosMaisEmprestados.length === 0 ? (
            renderEmptyState("Nenhum livro emprestado encontrado")
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={livrosMaisEmprestados}>
                <XAxis dataKey="titulo" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="quantidade" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Empréstimos por turma</h2>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : emprestimosPorTurma.length === 0 ? (
            renderEmptyState("Nenhum empréstimo por turma encontrado")
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={emprestimosPorTurma} 
                  dataKey="quantidade" 
                  nameKey="turma" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  fill="#3b82f6" 
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {emprestimosPorTurma.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Evolução dos empréstimos por mês</h2>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : emprestimosPorMes.length === 0 ? (
            renderEmptyState("Nenhum empréstimo registrado nos últimos 12 meses")
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emprestimosPorMes}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="quantidade" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Alunos com mais empréstimos</h2>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : alunosMaisEmprestimos.length === 0 ? (
            renderEmptyState("Nenhum aluno com empréstimos encontrado")
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-semibold text-gray-700">Aluno</th>
                    <th className="text-left p-2 font-semibold text-gray-700">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosMaisEmprestimos.map((a: AlunoEmprestimo) => (
                    <tr key={a.nome} className="border-b hover:bg-gray-50">
                      <td className="p-2">{a.nome}</td>
                      <td className="p-2">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {a.quantidade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
