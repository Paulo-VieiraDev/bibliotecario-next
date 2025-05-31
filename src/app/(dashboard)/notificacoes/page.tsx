"use client"

import { useAuth } from "@/hooks/use-auth"
import { useNotificacoes } from "@/hooks/use-notificacoes"
import { Bell, Info, AlertTriangle, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { Notificacao } from "@/types"


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

const tipos = [
  { label: "Todos", value: "todos" },
  { label: "Alertas", value: "atraso" },
  { label: "Lembretes", value: "lembrete" },
  { label: "Parabéns", value: "parabens" },
]

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
  const [filtro, setFiltro] = useState("todos")
  const [marcando, setMarcando] = useState<string | null>(null)
  const [notificacoesState, setNotificacoes] = useState<Notificacao[]>([])

  useEffect(() => {
    setNotificacoes(notificacoes)
  }, [notificacoes])

  const notificacoesFiltradas = notificacoesState.filter((n: Notificacao) =>
    filtro === "todos" ? true : n.tipo === filtro
  )
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
        <div className="flex justify-center gap-1 md:gap-2 w-full">
          {tipos.map(t => (
            <Button
              key={t.value}
              variant={filtro === t.value ? "default" : "outline"}
              onClick={() => setFiltro(t.value)}
              className="rounded-full px-3 py-0.5 text-xs md:px-5 md:py-1 md:text-base"
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
                    className={`relative flex items-center gap-3 md:gap-4 px-3 py-3 md:px-6 md:py-5 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 transition-all group hover:scale-[1.01] hover:shadow-lg ${!n.lida ? "ring-2 ring-blue-400/40" : "opacity-80"}`}
                  >
                    <div className="flex-shrink-0">{getIcon(n.tipo)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
                        {n.mensagem}
                        {!n.lida && <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">Novo</span>}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(n.criada_em)}</div>
                    </div>
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