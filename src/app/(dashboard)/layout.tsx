"use client"

import { useEffect, useState, useRef } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { ModeToggle } from "@/components/mode-toggle"
import { LogOut, BarChart3, BookMarked, BookOpen, Users, User, School } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getUsuario } from "@/services/usuarios"
import type { Usuario } from "@/services/usuarios"
import { Avatar } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { useNotificacoes } from "@/hooks/use-notificacoes"
import { MobileNotifications } from "@/components/mobile-notifications"

const routes = [
  {
    label: "Relatórios",
    icon: BarChart3,
    href: "/relatorios",
  },
  {
    label: "Empréstimos",
    icon: BookMarked,
    href: "/emprestimos",
  },
  {
    label: "Livros",
    icon: BookOpen,
    href: "/livros",
  },
  {
    label: "Alunos",
    icon: Users,
    href: "/alunos",
  },
  {
    label: "Professores",
    icon: User,
    href: "/professores",
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut, error } = useAuth()
  const pathname = usePathname()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const { notificacoes } = useNotificacoes(usuario?.id)
  const notificacoesRecentes = notificacoes.slice(0, 3)
  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida)
  const [notificacoesOpen, setNotificacoesOpen] = useState(false)
  const notificacoesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      getUsuario(user.id)
        .then(setUsuario)
        .catch((err) => {
          console.error('Erro ao carregar usuário:', err)
          setUsuario(null)
        })
        .finally(() => setLoading(false))
    }
  }, [user])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificacoesRef.current && !notificacoesRef.current.contains(event.target as Node)) {
        setNotificacoesOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Erro: {error.message}</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Cabeçalho fixo no topo */}
        <header className="fixed top-0 left-0 w-full bg-white dark:bg-[#18181b] shadow-[0_2px_12px_0_rgba(0,0,0,0.06)] flex items-center h-20 px-4 md:px-10 z-30 border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300">
          <div className="flex items-center gap-4">
            <Link href="/relatorios" className="flex items-center gap-2 group focus:outline-none">
              <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-cyan-900 rounded-xl shadow-sm mr-2 group-hover:bg-blue-200 dark:group-hover:bg-cyan-800 transition">
                <School size={28} strokeWidth={2.2} className="text-blue-600 dark:text-cyan-300" />
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 dark:text-cyan-200 tracking-tight select-none leading-tight group-hover:underline">Bibliotecário Escolar</h2>
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4 md:space-x-6">
            <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border transition-all duration-200 shadow-sm focus:outline-none
              bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400
              dark:bg-zinc-800 dark:border-zinc-700 dark:text-cyan-200 dark:hover:bg-zinc-700 dark:hover:border-cyan-400">
              <ModeToggle />
            </div>

            {/* Notificações Desktop (original) */}
            <div className="hidden md:block relative group" ref={notificacoesRef}>
              <button
                className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border transition-all duration-200 shadow-sm focus:outline-none
                  bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400
                  dark:bg-zinc-800 dark:border-zinc-700 dark:text-cyan-200 dark:hover:bg-zinc-700 dark:hover:border-cyan-400"
                onClick={() => setNotificacoesOpen(v => !v)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notificacoesNaoLidas.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2 py-0.5 text-white font-bold border-2 border-white dark:border-zinc-800 shadow">
                    {notificacoesNaoLidas.length > 9 ? "9+" : notificacoesNaoLidas.length}
                  </span>
                )}
              </button>
              {notificacoesOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl p-4 text-xs text-gray-700 dark:text-gray-200 z-50 max-h-96 overflow-y-auto transition-all duration-200">
                  <div className="font-semibold mb-2 text-gray-800 dark:text-gray-100 text-base">Notificações</div>
                  <ul className="space-y-2">
                    {notificacoesRecentes.length === 0 && (
                      <li className="text-gray-400 dark:text-gray-500">Nenhuma notificação</li>
                    )}
                    {notificacoesRecentes.map((n) => (
                      <li key={n.id} className="flex items-start gap-2">
                        <span className={`inline-block w-2 h-2 mt-1 rounded-full ${
                          n.tipo === 'atraso' ? 'bg-red-500' :
                          n.tipo === 'lembrete' ? 'bg-yellow-400' :
                          n.tipo === 'parabens' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}></span>
                        {n.mensagem}
                      </li>
                    ))}
                  </ul>
                  {notificacoes.length > 3 && (
                    <div className="mt-2 text-right">
                      <a href="/notificacoes" className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium">Ver todas</a>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="md:hidden">
              <MobileNotifications 
                notificacoes={notificacoes} 
                notificacoesNaoLidas={notificacoesNaoLidas} 
              />
            </div>
          </div>
        </header>

        {/* Layout principal */}
        <div className="flex h-screen pt-20">
          {/* Sidebar lateral em desktop */}
          <aside className="hidden md:flex bg-white dark:bg-[#18181b] border-r border-zinc-200 dark:border-zinc-800 flex-col shadow-xl transition-all duration-300 w-64">
            <div className="p-6 pb-4 flex items-center gap-4 bg-white dark:bg-[#23232a] border-b border-zinc-200 dark:border-zinc-800 mb-2 shadow-none rounded-bl-none">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar
                      src={usuario?.avatar_url}
                      alt={usuario?.nome}
                      fallback={usuario?.nome?.charAt(0).toUpperCase()}
                      className="w-16 h-16 text-2xl bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-cyan-200 border-2 border-blue-400 dark:border-cyan-400 shadow-none ring-0 rounded-full cursor-pointer"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44 mt-2 rounded-xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-2 bg-white/95 dark:bg-zinc-900/95 transition-all duration-200" align="start" forceMount>
                  <DropdownMenuItem onClick={signOut} className="text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="font-bold text-lg text-gray-900 dark:text-white truncate">{usuario?.nome} {usuario?.sobrenome}</div>
                <div className="text-xs text-gray-500 dark:text-zinc-300 truncate">{usuario?.funcao ?? "Usuário"}</div>
              </div>
            </div>
            <nav className="flex-1 space-y-1 px-2 mt-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center gap-3 px-5 py-3 font-semibold text-base rounded-xl transition-all duration-200 relative border-l-4
                    ${pathname === route.href
                      ? "bg-blue-50 dark:bg-zinc-800 text-gray-900 dark:text-white border-blue-500 dark:border-cyan-400 shadow-md"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-100 hover:text-gray-900 dark:hover:text-white border-transparent"}
                  `}
                  style={{ fontWeight: pathname === route.href ? 700 : 500 }}
                >
                  <route.icon className={`w-7 h-7 transition-all duration-200 ${pathname === route.href ? "text-blue-500 dark:text-cyan-300" : "text-blue-400 dark:text-cyan-400 group-hover:text-blue-700 dark:group-hover:text-cyan-200"}`} />
                  <span className="tracking-tight text-base">{route.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Barra de navegação superior para mobile */}
          <nav className="md:hidden fixed top-20 left-0 w-full bg-white dark:bg-[#18181b] border-b border-zinc-200 dark:border-zinc-800 z-20">
            <div className="flex justify-around w-full py-3">
              {routes.map((route) => (
                <Link 
                  key={route.href} 
                  href={route.href}
                  className={`flex flex-col items-center gap-1 ${
                    pathname === route.href 
                      ? "text-blue-600 dark:text-cyan-300" 
                      : "text-zinc-500 dark:text-zinc-300"
                  }`}
                >
                  <route.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{route.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Conteúdo principal */}
          <main className="flex-1 p-4 md:p-8 bg-background overflow-y-auto pt-24 md:pt-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
} 