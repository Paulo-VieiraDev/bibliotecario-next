"use client"

import { useAuth } from "@/hooks/use-auth"
import { useNotificacoes } from "@/hooks/use-notificacoes"
import { Bell, Info, AlertTriangle, Award } from "lucide-react"

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

export default function NotificacoesPage() {
  const { user } = useAuth()
  const { notificacoes, loading } = useNotificacoes(user?.id)

  return (
    <div className="w-full min-h-screen py-10 flex flex-col items-start">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 ml-8">Notificações</h1>
      <div className="w-[90%] mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-lg">Carregando...</div>
        ) : notificacoes.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-lg">Nenhuma notificação encontrada.</div>
        ) : (
          notificacoes
            .slice()
            .sort((a, b) => new Date(b.criada_em).getTime() - new Date(a.criada_em).getTime())
            .map((n) => (
              <div
                key={n.id}
                className={`flex items-center gap-4 px-8 py-6 transition-colors ${!n.lida ? "bg-gray-50 dark:bg-zinc-800" : ""}`}
              >
                <div>{getIcon(n.tipo)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate">{n.mensagem}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(n.criada_em)}</div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
} 