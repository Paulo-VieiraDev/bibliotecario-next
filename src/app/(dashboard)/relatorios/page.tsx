"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import { Medal, Award, Star, Calendar, BarChart2, Trophy } from "lucide-react"

const COLORS = [
  "#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F",
  "#EDC948", "#B07AA1", "#FF9DA7", "#9C755F", "#BAB0AC",
  "#86BCB6", "#D37295", "#FABFD2", "#B6992D", "#499894",
  "#E17C05", "#F1CE63", "#D4A6C8", "#7A7A7A", "#A0CBE8"
]

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

  function ResumoEmprestimosMes({ meses }: { meses: { mes: string; quantidade: number }[] }) {
    if (!meses || meses.length === 0) return null;
    const atual = meses[meses.length - 1];
    const anterior = meses.length > 1 ? meses[meses.length - 2] : atual;
    const percentChange = anterior && anterior !== atual ? (anterior.quantidade === 0 ? 100 : Math.round(((atual.quantidade - anterior.quantidade) / anterior.quantidade) * 100)) : 0;
    const mediaMensal = Math.round(meses.reduce((sum, m) => sum + m.quantidade, 0) / meses.length);
    const mesRecorde = meses.reduce((max, m) => m.quantidade > max.quantidade ? m : max, meses[0]);
    function formatMesAno(mes: string) {
      const [ano, m] = mes.split('-');
      const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return `${mesesNomes[parseInt(m, 10) - 1]}/${ano}`;
    }
    return (
      <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center w-full">
        {/* Card: Mês anterior */}
        <div className="flex flex-col items-center justify-center rounded-xl border bg-green-50 dark:bg-green-900/40 p-6 flex-1 min-w-[160px] min-h-[160px] max-w-xs mx-auto transition-transform duration-200 hover:scale-105">
          <Calendar className="w-7 h-7 mb-2 text-green-600 dark:text-green-300" strokeWidth={2.2} />
          <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1 text-center">Mês anterior</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 text-center">{formatMesAno(anterior.mes)}</div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-0.5 text-center">{anterior.quantidade}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 text-center">empréstimos</div>
          <span className={`px-2 py-0.5 rounded-full font-bold text-xs mt-1 text-center
            ${percentChange > 0 ? 'bg-green-200/80 dark:bg-green-700/80 text-green-900 dark:text-green-100' : percentChange < 0 ? 'bg-red-200/80 dark:bg-red-700/80 text-red-900 dark:text-red-100' : 'bg-blue-200/80 dark:bg-blue-700/80 text-blue-900 dark:text-blue-100'}
          `}>
            {percentChange > 0 && '+'}{percentChange}%
          </span>
        </div>
        {/* Card: Mês recorde */}
        <div className="flex flex-col items-center justify-center rounded-xl border bg-yellow-50 dark:bg-yellow-900/40 p-6 flex-1 min-w-[160px] min-h-[160px] max-w-xs mx-auto transition-transform duration-200 hover:scale-105">
          <Trophy className="w-7 h-7 mb-2 text-yellow-500" strokeWidth={2.2} />
          <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1 text-center">Mês recorde</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 text-center">{formatMesAno(mesRecorde.mes)}</div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-0.5 text-center">{mesRecorde.quantidade}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 text-center">empréstimos</div>
        </div>
        {/* Card: Média mensal */}
        <div className="flex flex-col items-center justify-center rounded-xl border bg-purple-50 dark:bg-purple-900/40 p-6 flex-1 min-w-[160px] min-h-[160px] max-w-xs mx-auto transition-transform duration-200 hover:scale-105">
          <BarChart2 className="w-7 h-7 mb-2 text-purple-500" strokeWidth={2.2} />
          <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1 text-center">Média mensal</div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-0.5 text-center">{mediaMensal}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 text-center">empréstimos</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Relatórios da Biblioteca</h1>
        <p className="text-gray-500 dark:text-gray-300 mt-1">Acompanhe as estatísticas e métricas da biblioteca</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="bg-white dark:bg-zinc-900 shadow-sm">
              <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))
        ) : (
          <>
            {/* Card: Total de Livros */}
            <div className="flex flex-col items-center justify-center rounded-2xl border shadow p-8 bg-blue-50 dark:bg-blue-900/40 border-blue-100 dark:border-blue-800 transition-all duration-200 hover:shadow-lg hover:scale-[1.03] min-h-[180px] md:min-h-[220px] h-auto flex-1 min-w-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mb-2" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2v2m0-2h6a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6z" /></svg>
              <div className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Total de Livros</div>
              <div className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-0.5">{totalLivros}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Livros cadastrados</div>
            </div>
            {/* Card: Total de Alunos */}
            <div className="flex flex-col items-center justify-center rounded-2xl border shadow p-8 bg-green-50 dark:bg-green-900/40 border-green-100 dark:border-green-800 transition-all duration-200 hover:shadow-lg hover:scale-[1.03] min-h-[180px] md:min-h-[220px] h-auto flex-1 min-w-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mb-2" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <div className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Total de Alunos</div>
              <div className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-0.5">{totalAlunos}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Alunos cadastrados</div>
            </div>
            {/* Card: Total de Empréstimos */}
            <div className="flex flex-col items-center justify-center rounded-2xl border shadow p-8 bg-purple-50 dark:bg-purple-900/40 border-purple-100 dark:border-purple-800 transition-all duration-200 hover:shadow-lg hover:scale-[1.03] min-h-[180px] md:min-h-[220px] h-auto flex-1 min-w-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mb-2" fill="none" viewBox="0 0 24 24" stroke="#a21caf" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9" /></svg>
              <div className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Total de Empréstimos</div>
              <div className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-0.5">{totalEmprestimos}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Empréstimos realizados</div>
            </div>
            {/* Card: Empréstimos em Aberto */}
            <div className="flex flex-col items-center justify-center rounded-2xl border shadow p-8 bg-yellow-50 dark:bg-yellow-900/40 border-yellow-100 dark:border-yellow-800 transition-all duration-200 hover:shadow-lg hover:scale-[1.03] min-h-[180px] md:min-h-[220px] h-auto flex-1 min-w-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mb-2" fill="none" viewBox="0 0 24 24" stroke="#eab308" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Empréstimos em Aberto</div>
              <div className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-0.5">{emprestimosAbertos}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Livros não devolvidos</div>
            </div>
          </>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-zinc-900 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-4">Livros mais emprestados</h2>
          {isLoading ? (
            <Skeleton className="h-[340px] w-full" />
          ) : livrosMaisEmprestados.length === 0 ? (
            renderEmptyState("Nenhum livro emprestado encontrado")
          ) : (
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={livrosMaisEmprestados.slice(0, 5)}
                layout="vertical"
                barCategoryGap={32}
                margin={{ left: 24, right: 24, top: 16, bottom: 16 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="titulo"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--foreground)', fontWeight: 700, fontSize: 16 }}
                  width={180}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(100,100,255,0.08)' }}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    color: 'var(--card-foreground)',
                    border: '1px solid #333',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.3)'
                  }}
                  labelStyle={{ color: 'var(--card-foreground)', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--card-foreground)' }}
                  formatter={(value) => [`${value} empréstimos`, '']}
                />
                <Bar
                  dataKey="quantidade"
                  radius={[16, 16, 16, 16]}
                  minPointSize={6}
                  isAnimationActive={true}
                >
                  {livrosMaisEmprestados.slice(0, 5).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="bg-white dark:bg-zinc-900 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-4">Empréstimos por turma</h2>
          {isLoading ? (
            <Skeleton className="h-[380px] w-full" />
          ) : emprestimosPorTurma.length === 0 ? (
            renderEmptyState("Nenhum empréstimo por turma encontrado")
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <Pie
                  data={emprestimosPorTurma.filter(t => t.turma).sort((a, b) => (a.turma || '').localeCompare(b.turma || ''))}
                  dataKey="quantidade"
                  nameKey="turma"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  innerRadius={65}
                  label={({ name, percent }) =>
                    percent > 0.01 ? `${name} (${(percent * 100).toFixed(0)}%)` : ""
                  }
                  labelLine={false}
                >
                  {emprestimosPorTurma.filter(t => t.turma).sort((a, b) => (a.turma || '').localeCompare(b.turma || '')).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    color: 'var(--card-foreground)',
                    border: '1px solid #333',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.3)'
                  }}
                  labelStyle={{ color: 'var(--card-foreground)', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--card-foreground)' }}
                  formatter={(value, name) => [`${value} empréstimos`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Resumo dos empréstimos mensais - restaurar visual anterior, cards grandes centralizados, sem gráfico */}
        <Card className="bg-white dark:bg-zinc-900 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-6 text-left">Resumo dos empréstimos mensais</h2>
          {isLoading ? (
            <Skeleton className="h-[380px] w-full" />
          ) : (
            <ResumoEmprestimosMes meses={emprestimosPorMes} />
          )}
        </Card>

        <Card className="bg-white dark:bg-zinc-900 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-4">Alunos com mais empréstimos</h2>
          {isLoading ? (
            <Skeleton className="h-[380px] w-full" />
          ) : alunosMaisEmprestimos.length === 0 ? (
            renderEmptyState("Nenhum aluno com empréstimos encontrado")
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2 font-semibold text-gray-700 dark:text-zinc-100">Aluno</th>
                    <th className="text-center p-2 font-semibold text-gray-700 dark:text-zinc-100">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosMaisEmprestimos.slice(0, 5).map((a, i) => (
                    <tr
                      key={a.nome}
                      className="border-b last:border-0 hover:bg-blue-50 dark:hover:bg-zinc-800 transition"
                    >
                      <td className="p-2 font-bold flex items-center gap-2">
                        {i === 0 && <Medal className="w-5 h-5 text-yellow-500" />}
                        {i === 1 && <Award className="w-5 h-5 text-gray-400" />}
                        {i === 2 && <Star className="w-5 h-5 text-yellow-400" />}
                        {a.nome}
                      </td>
                      <td className="p-2 text-center">
                        <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-base font-semibold
                          ${i === 0 ? "bg-blue-600 text-white" : i === 1 ? "bg-blue-400 text-white" : i === 2 ? "bg-yellow-400 text-white" : "bg-blue-100 text-blue-800"}
                          ${a.quantidade === 0 ? "bg-gray-200 text-gray-500" : ""}
                        `}>
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
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
      `}</style>
    </div>
  )
}
