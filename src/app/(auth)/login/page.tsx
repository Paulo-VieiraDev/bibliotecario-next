"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { School, Mail, Lock, Code2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/relatorios")
    }
  }, [user, authLoading, router])

  // Se estiver carregando ou já estiver logado, mostra loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Se já estiver logado, não renderiza nada (será redirecionado)
  if (user) {
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      })

      if (error) throw error
      
      if (data?.user) {
        router.replace("/relatorios")
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <div className="w-full max-w-md">
        {/* Card do Login */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-100 p-8 space-y-8">
          {/* Cabeçalho */}
          <div className="flex flex-col items-center space-y-2 mb-8">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <School className="w-8 h-8 text-blue-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Bem-vindo(a) de volta!</h1>
            <p className="text-gray-500 text-center">
              Faça login para acessar o sistema da biblioteca
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 bg-white/50 text-gray-900"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 bg-white/50 text-gray-900"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-blue-200 disabled:text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </div>

        {/* Rodapé */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Code2 className="w-4 h-4" />
            <p className="text-sm">
              Desenvolvido por <span className="font-semibold">Paulo Vieira</span>
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Sistema de Biblioteca Escolar &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}