"use client"

import { useAuth } from "@/hooks/use-auth"
import { useNotificacoes, marcarNotificacaoComoLida } from "@/hooks/use-notificacoes"
import { Bell, Info, AlertTriangle, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import type { Notificacao } from "@/types"
import { cn } from "@/lib/utils"

const tabs = [
  { label: "Todos", value: "todos" },
  { label: "Não lidas", value: "nao-lidas" },
  { label: "Lidas", value: "lidas" },
]

function getIcon(tipo: string) {
  switch (tipo) {
    case "atraso": return <AlertTriangle className="text-red-500 w-6 h-6" />
    case "lembrete": return <Bell className="text-yellow-500 w-6 h-6" />
    case "parabens": return <Award className="text-blue-500 w-6 h-6" />
    default: return <Info className="text-gray-400 w-6 h-6" />
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Hoje, ${time}`;
  if (isYesterday) return `Ontem, ${time}`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + ", " + time;
}

function agruparPorData(notificacoes: Notificacao[]) {
  const grupos: Record<string, Notificacao[]> = {}
  notificacoes.forEach((n) => {
    const data = formatDateGroup(n.criada_em)
    if (!grupos[data]) grupos[data] = []
    grupos[data].push(n)
  })
  return grupos
}

function formatDateGroup(dateStr?: string) {
  if (!dateStr) return "-"
  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()
  if (isToday) return "Hoje"
  if (isYesterday) return "Ontem"
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function NotificacoesPage() {
  const { user } = useAuth()
  const { notificacoes, loading } = useNotificacoes(user?.id)
  const [tab, setTab] = useState("todos")
  const [notificacoesState, setNotificacoesState] = useState<Notificacao[]>([])

  useEffect(() => {
    setNotificacoesState(notificacoes)
  }, [notificacoes])

  const notificacoesFiltradas = notificacoesState.filter(n => {
    if (tab === "lidas") return n.lida
    if (tab === "nao-lidas") return !n.lida
    return true
  })

  async function handleMarcarComoLida(id: number | string) {
    await marcarNotificacaoComoLida(String(id))
    setNotificacoesState(prev =>
      prev.map(n => String(n.id) === String(id) ? { ...n, lida: true } : n)
    )
  }

  const grupos = agruparPorData(
    notificacoesFiltradas.slice().sort((a, b) => new Date(b.criada_em).getTime() - new Date(a.criada_em).getTime())
  )

  return (
    <div className="w-full min-h-screen py-6 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-6 md:mb-8 px-2">
        <Bell className="text-blue-600 w-9 h-9 animate-bell" />
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">Notificações</h1>
      </div>
      <div className="w-full px-2 mb-4 md:mb-6">
        <div className="flex gap-2 justify-center mb-6">
          {tabs.map(t => (
            <Button
              key={t.value}
              variant={tab === t.value ? "default" : "ghost"}
              onClick={() => setTab(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="w-full max-w-md md:max-w-3xl space-y-5 md:space-y-8 px-2">
        {loading ? (
          <div className="p-8 md:p-12 text-center text-gray-400 text-base md:text-lg">Carregando...</div>
        ) : notificacoesFiltradas.length === 0 ? (
          <div className="p-8 md:p-12 text-center text-gray-400 text-base md:text-lg">Nenhuma notificação encontrada.</div>
        ) : (
          Object.entries(grupos).map(([data, notis]) => (
            <div key={data}>
              <div className="text-base md:text-lg font-bold text-gray-700 dark:text-gray-300 mb-1 md:mb-2 ml-1 md:ml-2">{data}</div>
              <div className="space-y-3 md:space-y-4">
                {notis.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-3 py-3 rounded-xl shadow-sm border transition-all",
                      !n.lida
                        ? "border-2 bg-white ring-2 ring-blue-200"
                        : "border border-zinc-200 bg-white/80 opacity-80",
                      n.tipo === "atraso" && !n.lida && "border-red-400 bg-red-50/60",
                      n.tipo === "lembrete" && !n.lida && "border-yellow-400 bg-yellow-50/60",
                      n.tipo === "parabens" && !n.lida && "border-blue-400 bg-blue-50/60"
                    )}
                  >
                    <div className="flex-shrink-0">{getIcon(n.tipo)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base text-gray-900 flex items-center gap-2">
                        {n.mensagem}
                        {!n.lida && (
                          <span className="ml-2 bg-blue-500/10 text-blue-700 text-xs px-2 py-0.5 rounded-full">Novo</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(n.criada_em)}</div>
                    </div>
                    {/* Botão responsivo para marcar como lida */}
                    {!n.lida && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-blue-300 text-blue-700 hover:bg-blue-100 transition w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4"
                        onClick={() => handleMarcarComoLida(n.id)}
                      >
                        Marcar como lida
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <style jsx global>{`
        @keyframes bell {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        .animate-bell { animation: bell 1.2s infinite alternate; }
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
} 