"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { ModeToggle } from "@/components/mode-toggle"
import { LogOut, BarChart3, BookMarked, BookOpen, Users, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getUsuario } from "@/services/usuarios"
import type { Usuario } from "@/services/usuarios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
        <header className="fixed top-0 left-0 w-full bg-white shadow flex items-center h-16 px-8 z-20 rounded-br-3xl border-b">
          <h2 className="text-2xl font-extrabold text-primary tracking-tight">Biblioteca Escolar</h2>
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={usuario?.avatar_url} alt={usuario?.nome} />
                    <AvatarFallback>
                      {usuario?.nome?.[0]}{usuario?.sobrenome?.[0]}
                    </AvatarFallback>
                  </Avatar>
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
          <aside className="w-64 bg-white border-r flex flex-col shadow-lg rounded-br-3xl">
            <div className="p-8 pb-4 font-extrabold text-2xl tracking-tight flex items-center gap-3 select-none">
              <BarChart3 className="w-8 h-8 text-primary" /> Biblioteca
            </div>
            <nav className="flex-1 space-y-1 px-2 mt-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center gap-3 px-5 py-3 font-semibold text-base rounded-xl transition-all duration-150
                    ${pathname === route.href ? "bg-primary text-white shadow-md" : "hover:bg-primary/10 text-primary hover:text-primary"}
                  `}
                  style={{ fontWeight: pathname === route.href ? 700 : 500 }}
                >
                  <route.icon className={`w-6 h-6 ${pathname === route.href ? "text-white" : "text-primary"}`} />
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