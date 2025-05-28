"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, BookOpen, Users, BookMarked, BarChart3, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const routes = [
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
    label: "Empréstimos",
    icon: BookMarked,
    href: "/emprestimos",
  },
  {
    label: "Relatórios",
    icon: BarChart3,
    href: "/relatorios",
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="h-full relative">
      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h1 className="text-xl font-bold">Biblioteca</h1>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                      pathname === route.href ? "bg-accent" : "transparent"
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <div className="flex flex-col h-full border-r bg-background">
          <div className="p-6">
            <h1 className="text-xl font-bold">Biblioteca</h1>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                    pathname === route.href ? "bg-accent" : "transparent"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="h-full md:pl-64">
        <div className="h-full p-8">{children}</div>
      </main>
    </div>
  )
} 