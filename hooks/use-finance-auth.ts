"use client"

import { useState, useEffect } from "react"
import type { User, AuthResponse } from "@supabase/supabase-js"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

// Chaves para localStorage
const AUTH_CACHE_KEY = 'calcfy_auth_cache'
const AUTH_TIMESTAMP_KEY = 'calcfy_auth_timestamp'

// Tempo de cache em milissegundos (30 minutos)
const CACHE_DURATION = 30 * 60 * 1000

interface AuthCache {
  user: User | null
  financeUser: any
  timestamp: number
}

export function useFinanceAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [financeUser, setFinanceUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Função para salvar no cache local
  const saveToCache = (user: User | null, financeUser: any) => {
    if (typeof window === 'undefined') return
    
    const cache: AuthCache = {
      user,
      financeUser,
      timestamp: Date.now()
    }
    
    try {
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cache))
      console.log("💾 Estado de autenticação salvo no cache local")
    } catch (error) {
      console.warn("⚠️ Erro ao salvar no cache local:", error)
    }
  }

  // Função para carregar do cache local
  const loadFromCache = (): AuthCache | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const cached = localStorage.getItem(AUTH_CACHE_KEY)
      if (!cached) return null
      
      const cache: AuthCache = JSON.parse(cached)
      const now = Date.now()
      
      // Verificar se o cache ainda é válido
      if (now - cache.timestamp > CACHE_DURATION) {
        console.log("⏰ Cache expirado, removendo...")
        localStorage.removeItem(AUTH_CACHE_KEY)
        return null
      }
      
      console.log("✅ Cache válido encontrado, carregando...")
      return cache
    } catch (error) {
      console.warn("⚠️ Erro ao carregar cache local:", error)
      return null
    }
  }

  // Função para limpar o cache
  const clearCache = () => {
    if (typeof window === 'undefined') return
    
    try {
      // Limpar todos os itens relacionados à autenticação
      localStorage.removeItem(AUTH_CACHE_KEY)
      localStorage.removeItem(AUTH_TIMESTAMP_KEY)
      
      // Limpar outros possíveis caches de autenticação
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('auth') || key.includes('user') || key.includes('session'))) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      console.log("🗑️ Cache local limpo completamente")
    } catch (error) {
      console.warn("⚠️ Erro ao limpar cache local:", error)
    }
  }

  // Verificação simples de autenticação - SEM LOOPS
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Verificação única e simples
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setFinanceUser(user)
      } catch (error) {
        console.error("Erro na verificação:", error)
        setUser(null)
        setFinanceUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Escutar mudanças de auth (apenas para login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setUser(session?.user ?? null)
        setFinanceUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured")
    }

    try {
      const { data, error }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      // Criar perfil do usuário na tabela calc_users
      if (data.user) {
        const { error: profileError } = await supabase
          .from('calc_users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              created_at: new Date().toISOString(),
            },
          ])

        if (profileError) {
          console.warn("Error creating user profile:", profileError.message)
        }
      }

      return { data, error: null }
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log("🔐 Iniciando processo de login...")
    console.log("📧 Email:", email)
    console.log("🔑 Supabase configurado:", isSupabaseConfigured())
    
    if (!isSupabaseConfigured()) {
      console.error("❌ Supabase não está configurado!")
      throw new Error("Supabase not configured")
    }

    // Validação básica
    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios")
    }

    if (!email.includes('@')) {
      throw new Error("Email inválido")
    }

    try {
      console.log("🚀 Chamando supabase.auth.signInWithPassword...")
      const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      console.log("📊 Resposta do Supabase:", { 
        hasData: !!data, 
        hasUser: !!data?.user, 
        hasError: !!error,
        errorMessage: error?.message 
      })

      if (error) {
        console.error("❌ Erro do Supabase:", error)
        throw error
      }

      if (!data?.user) {
        console.error("❌ Login retornou sem usuário")
        throw new Error("Erro interno: usuário não encontrado")
      }

      console.log("✅ Login bem-sucedido! Atualizando último login...")

      // Atualizar último login na tabela calc_users (opcional, não bloquear se falhar)
      try {
        const { error: updateError } = await supabase
          .from('calc_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id)

        if (updateError) {
          console.warn("⚠️ Erro ao atualizar último login:", updateError.message)
        } else {
          console.log("✅ Último login atualizado com sucesso!")
        }
      } catch (updateError) {
        console.warn("⚠️ Erro ao atualizar último login (não crítico):", updateError)
      }

      console.log("🎉 Login completado com sucesso!")
      return { data, error: null }
    } catch (error) {
      console.error("💥 Erro durante o login:", error)
      throw error
    }
  }

  const signOut = async () => {
    console.log("🚪 Iniciando processo de logout...")
    console.log("🔧 Usuário atual antes do logout:", user?.email)
    
    // PRIMEIRO: Limpar estado local IMEDIATAMENTE para evitar relogin
    setUser(null)
    setFinanceUser(null)
    clearCache()
    
    if (!isSupabaseConfigured()) {
      console.warn("❌ Supabase not configured")
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
      return
    }

    try {
      console.log("🔓 Chamando supabase.auth.signOut()...")
      
      // Adicionar timeout para evitar travamento
      const signOutPromise = supabase.auth.signOut()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
      
      const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any
      
      if (error) {
        console.error("❌ Erro no logout:", error)
        // Estado já foi limpo acima, apenas redirecionar
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
        return
      }
      
      console.log("✅ Logout realizado com sucesso!")
      
      // Redirecionar para a página inicial
      if (typeof window !== 'undefined') {
        console.log("🔄 Redirecionando para página inicial...")
        window.location.href = '/'
      }
      
    } catch (error) {
      console.error("❌ Erro no logout:", error)
      // Estado já foi limpo acima, apenas redirecionar
      if (typeof window !== 'undefined') {
        console.log("🔄 Redirecionando mesmo com erro...")
        window.location.href = '/'
      }
    }
  }

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured")
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error("Error resetting password:", error)
      throw error
    }
  }

  return {
    user,
    financeUser,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isConfigured: isSupabaseConfigured(),
  }
}