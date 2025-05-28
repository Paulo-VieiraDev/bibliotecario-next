"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { ModeToggle } from "@/components/mode-toggle"
import { LogOut, BarChart3, BookMarked, BookOpen, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  const { signOut } = useAuth()
  const pathname = usePathname()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Topbar fixa no topo */}
        <header className="fixed top-0 left-0 w-full bg-white shadow flex items-center h-16 px-8 z-20 rounded-br-3xl border-b">
          <h2 className="text-2xl font-extrabold text-primary tracking-tight">Biblioteca Escolar</h2>
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <button
              className="bg-primary hover:bg-secondary text-white rounded-full p-2 shadow transition"
              onClick={signOut}
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Espaço para a topbar fixa */}
        <div className="flex pt-16 min-h-screen">
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