"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"

const COLORS = ["#6366f1", "#f59e42", "#10b981", "#ef4444", "#fbbf24", "#3b82f6"]

export default function RelatoriosPage() {
  // States para os cards
  const [totalLivros, setTotalLivros] = useState(0)
  const [totalAlunos, setTotalAlunos] = useState(0)
  const [totalEmprestimos, setTotalEmprestimos] = useState(0)
  const [emprestimosAbertos, setEmprestimosAbertos] = useState(0)

  // States para gráficos
  const [livrosMaisEmprestados, setLivrosMaisEmprestados] = useState<any[]>([])
  const [emprestimosPorTurma, setEmprestimosPorTurma] = useState<any[]>([])
  const [emprestimosPorMes, setEmprestimosPorMes] = useState<any[]>([])
  const [alunosMaisEmprestimos, setAlunosMaisEmprestimos] = useState<any[]>([])

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
      <h1 className="text-2xl font-bold mb-4">Relatórios da Biblioteca</h1>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader><CardTitle>Total de Livros</CardTitle></CardHeader>
              <CardContent><span className="text-3xl font-bold">{totalLivros}</span></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total de Alunos</CardTitle></CardHeader>
              <CardContent><span className="text-3xl font-bold">{totalAlunos}</span></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total de Empréstimos</CardTitle></CardHeader>
              <CardContent><span className="text-3xl font-bold">{totalEmprestimos}</span></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Empréstimos em Aberto</CardTitle></CardHeader>
              <CardContent><span className="text-3xl font-bold">{emprestimosAbertos}</span></CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Livros mais emprestados</h2>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : livrosMaisEmprestados.length === 0 ? (
            renderEmptyState("Nenhum livro emprestado encontrado")
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={livrosMaisEmprestados}>
                <XAxis dataKey="titulo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-4">Empréstimos por turma</h2>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : emprestimosPorTurma.length === 0 ? (
            renderEmptyState("Nenhum empréstimo por turma encontrado")
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={emprestimosPorTurma} dataKey="quantidade" nameKey="turma" cx="50%" cy="50%" outerRadius={100} fill="#3b82f6" label>
                  {emprestimosPorTurma.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="font-semibold mb-4">Evolução dos empréstimos por mês</h2>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : emprestimosPorMes.length === 0 ? (
          renderEmptyState("Nenhum empréstimo registrado nos últimos 12 meses")
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={emprestimosPorMes}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="quantidade" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-4">Alunos com mais empréstimos</h2>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : alunosMaisEmprestimos.length === 0 ? (
          renderEmptyState("Nenhum aluno com empréstimos encontrado")
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Aluno</th>
                  <th className="text-left p-2">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {alunosMaisEmprestimos.map((a: any) => (
                  <tr key={a.nome} className="border-b">
                    <td className="p-2">{a.nome}</td>
                    <td className="p-2">{a.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
