import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User, AuthError } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function initialize() {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          // If the error is about invalid JWT, try to refresh the session
          if (sessionError.message.includes('JWT')) {
            const { error: refreshError } = await supabase.auth.refreshSession()
            if (refreshError) {
              throw refreshError
            }
            // Get the new session after refresh
            const { data: { session: newSession } } = await supabase.auth.getSession()
            if (mounted && newSession?.user) {
              setUser(newSession.user)
              setLoading(false)
              setError(null)
              return
            }
          }
          throw sessionError
        }
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user)
          } else {
            setUser(null)
          }
          setLoading(false)
          setError(null)
        }

        // Setup real-time subscription with error handling
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (mounted) {
            try {
              if (event === 'SIGNED_OUT') {
                setUser(null)
                router.push('/login')
              } else if (session?.user) {
                setUser(session.user)
              } else {
                setUser(null)
              }
              setLoading(false)
              setError(null)
            } catch (err) {
              console.error('Auth state change error:', err)
              setError(err instanceof Error ? err : new Error('Erro ao atualizar estado de autenticação'))
              setUser(null)
              setLoading(false)
            }
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Erro ao carregar sessão'))
          setUser(null)
          setLoading(false)
          // If there's an auth error, redirect to login
          if (err instanceof Error && err.message.includes('JWT')) {
            router.push('/login')
          }
        }
      }
    }

    const cleanup = initialize()

    return () => {
      mounted = false
      cleanup.then(unsubscribe => unsubscribe?.())
    }
  }, [router])

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      router.push('/login')
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err instanceof Error ? err : new Error('Erro ao fazer logout'))
    } finally {
      setLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      setLoading(true)
      const { error: refreshError } = await supabase.auth.refreshSession()
      if (refreshError) throw refreshError
      
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      if (!session) {
        await signOut()
        return
      }
      
      setUser(session.user)
      setError(null)
    } catch (err) {
      console.error('Session refresh error:', err)
      setError(err instanceof Error ? err : new Error('Erro ao atualizar sessão'))
      await signOut()
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signOut,
    refreshSession,
  }
} 