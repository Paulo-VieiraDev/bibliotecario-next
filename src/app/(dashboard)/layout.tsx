"use client"

import { useEffect, useState, useRef } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { ModeToggle } from "@/components/mode-toggle"
import { LogOut, BarChart3, BookMarked, BookOpen, Users, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getUsuario } from "@/services/usuarios"
import type { Usuario } from "@/services/usuarios"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotificacoes } from "@/hooks/use-notificacoes"

const routes = [
  {
    label: "Dashboard",
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
        {/* Topbar fixa no topo */}
        <header className="fixed top-0 left-0 w-full bg-white dark:bg-zinc-900 shadow flex items-center h-16 px-8 z-20 rounded-br-3xl border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-extrabold text-primary dark:text-gray-100 tracking-tight">Biblioteca Escolar</h2>
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar 
                    className="h-8 w-8"
                    src={usuario?.avatar_url}
                    alt={usuario?.nome}
                    fallback={usuario?.nome?.charAt(0).toUpperCase()}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{usuario?.nome} {usuario?.sobrenome}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {usuario?.funcao}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Layout principal */}
        <div className="flex h-screen pt-16">
          {/* Sidebar começa abaixo da topbar */}
          <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shadow-lg rounded-br-3xl">
            <div className="p-6 pb-4 flex items-center gap-4 rounded-xl bg-white/90 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 mb-4 shadow">
              <Avatar
                src={usuario?.avatar_url}
                alt={usuario?.nome}
                fallback={usuario?.nome?.charAt(0).toUpperCase()}
                className="w-14 h-14 text-2xl bg-gray-100 text-gray-700"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">{usuario?.nome} {usuario?.sobrenome}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{usuario?.funcao ?? "Usuário"}</div>
              </div>
              <div className="relative group" ref={notificacoesRef}>
                <button
                  className="bg-gray-700 hover:bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors focus:outline-none shadow-md"
                  onClick={() => setNotificacoesOpen(v => !v)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notificacoesNaoLidas.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2 py-0.5 text-white font-bold border-2 border-white dark:border-zinc-800 shadow">{notificacoesNaoLidas.length > 9 ? "9+" : notificacoesNaoLidas.length}</span>
                  )}
                </button>
                {notificacoesOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-4 text-xs text-gray-700 dark:text-gray-200 z-50 max-h-80 overflow-y-auto">
                    <div className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Notificações</div>
                    <ul className="space-y-1">
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
            </div>
            <nav className="flex-1 space-y-1 px-2 mt-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center gap-3 px-5 py-3 font-semibold text-base rounded-xl transition-all duration-150
                    ${pathname === route.href
                      ? "bg-zinc-100 dark:bg-zinc-700 text-primary dark:text-white shadow-md"
                      : "hover:bg-primary/10 text-primary dark:text-gray-300 dark:hover:bg-zinc-800"}
                  `}
                  style={{ fontWeight: pathname === route.href ? 700 : 500 }}
                >
                  <route.icon className={`w-6 h-6 ${pathname === route.href ? "text-primary dark:text-white" : "text-primary dark:text-gray-300"}`} />
                  {route.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 mt-auto text-xs text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} Biblioteca
            </div>
          </aside>

          {/* Conteúdo principal */}
          <main className="flex-1 p-4 md:p-8 bg-background overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
} 