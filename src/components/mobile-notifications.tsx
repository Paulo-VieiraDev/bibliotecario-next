"use client"

import { useState, useRef, useEffect } from "react"
import { Bell } from "lucide-react"
import type { Notificacao } from "@/types"

interface MobileNotificationsProps {
  notificacoes: Notificacao[]
  notificacoesNaoLidas: Notificacao[]
}

export function MobileNotifications({ notificacoes, notificacoesNaoLidas }: MobileNotificationsProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const recentes = notificacoes.slice(0, 3)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full border transition-all duration-200 shadow-sm focus:outline-none
          bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400
          dark:bg-zinc-800 dark:border-zinc-700 dark:text-cyan-200 dark:hover:bg-zinc-700 dark:hover:border-cyan-400
          relative"
        onClick={() => setOpen(v => !v)}
        aria-label="Abrir notificações"
      >
        <Bell className="w-5 h-5 md:w-6 md:h-6" />
        {notificacoesNaoLidas.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] rounded-full w-4 h-4 flex items-center justify-center text-white font-bold border-2 border-white dark:border-zinc-800 shadow">
            {notificacoesNaoLidas.length > 9 ? "9+" : notificacoesNaoLidas.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-72 max-w-[90vw] bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl p-4 text-xs text-gray-700 dark:text-gray-200 z-50 max-h-96 overflow-y-auto transition-all duration-200">
          <div className="font-semibold mb-2 text-gray-800 dark:text-gray-100 text-base">Notificações</div>
          <ul className="space-y-2">
            {recentes.length === 0 && (
              <li className="text-gray-400 dark:text-gray-500">Nenhuma notificação</li>
            )}
            {recentes.map((n) => (
              <li key={n.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <span className={`inline-block w-2 h-2 mt-1.5 rounded-full ${
                  n.tipo === 'atraso' ? 'bg-red-500' :
                  n.tipo === 'lembrete' ? 'bg-yellow-400' :
                  n.tipo === 'parabens' ? 'bg-blue-500' : 'bg-gray-400'
                }`}></span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-tight">{n.mensagem}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                    {new Date(n.criada_em).toLocaleDateString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
            <a 
              href="/notificacoes" 
              className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium block text-center py-2"
            >
              Ver todas as notificações
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
