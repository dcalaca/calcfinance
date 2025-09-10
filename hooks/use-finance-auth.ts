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

  useEffect(() => {
    console.log("🔧 Hook de autenticação iniciado")
    console.log("🔧 Supabase configurado:", isSupabaseConfigured())
    
    if (!isSupabaseConfigured()) {
      console.log("❌ Supabase não configurado, definindo loading como false")
      setLoading(false)
      return
    }

    // Primeiro, tentar carregar do cache local
    const cachedAuth = loadFromCache()
    if (cachedAuth) {
      console.log("🚀 Carregando do cache local:", cachedAuth.user?.email || "Nenhum")
      setUser(cachedAuth.user)
      setFinanceUser(cachedAuth.financeUser)
      setLoading(false)
      
      // Validar no servidor em background (sem bloquear a UI)
      validateWithServer()
      return
    }

    // Se não há cache, fazer validação completa no servidor
    validateWithServer()
  }, [])

  // Função para validar com o servidor (sem bloquear a UI)
  const validateWithServer = async () => {
    try {
      console.log("🔍 Validando autenticação com servidor...")
      const { data: { user } } = await supabase.auth.getUser()
      console.log("🔍 Usuário do servidor:", user?.email || "Nenhum")
      
      if (user) {
        // Buscar dados completos do usuário na tabela calc_users
        const { data: userProfile, error: profileError } = await supabase
          .from('calc_users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        const financeUserData = profileError ? user : { ...user, ...userProfile }
        
        // Atualizar estado e cache
        setUser(user)
        setFinanceUser(financeUserData)
        saveToCache(user, financeUserData)
        
        console.log("✅ Validação do servidor concluída")
      } else {
        // Usuário não está logado no servidor
        setUser(null)
        setFinanceUser(null)
        clearCache()
        console.log("❌ Usuário não encontrado no servidor")
      }
    } catch (error) {
      console.error("❌ Erro na validação do servidor:", error)
      // Em caso de erro, manter o cache local se existir
    }
  }

  // Listen for auth changes
  useEffect(() => {
    if (!isSupabaseConfigured()) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log("🔄 Mudança de estado de autenticação:", event, session?.user ? "Usuário logado" : "Usuário deslogado")
      console.log("👤 Usuário da sessão:", session?.user?.email)
      
      // Se for um evento de SIGNED_OUT, garantir que o estado seja limpo
      if (event === 'SIGNED_OUT') {
        console.log("🚪 Evento SIGNED_OUT detectado, limpando estado...")
        setUser(null)
        setFinanceUser(null)
        clearCache()
        setLoading(false)
        return
      }
      
      setUser(session?.user ?? null)
      
      if (session?.user) {
        console.log("✅ Usuário definido:", session.user.email)
        
        // Buscar dados completos do usuário na tabela calc_users
        const { data: userProfile, error: profileError } = await supabase
          .from('calc_users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        const financeUserData = profileError ? session.user : { ...session.user, ...userProfile }
        
        setFinanceUser(financeUserData)
        saveToCache(session.user, financeUserData)
      } else {
        console.log("❌ Nenhum usuário na sessão")
        setFinanceUser(null)
        clearCache()
      }
      
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
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

    try {
      console.log("🚀 Chamando supabase.auth.signInWithPassword...")
      const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("📊 Resposta do Supabase:", { data: data?.user?.id, error })

      if (error) {
        console.error("❌ Erro do Supabase:", error)
        throw error
      }

      console.log("✅ Login bem-sucedido! Atualizando último login...")

      // Atualizar último login na tabela calc_users
      if (data.user) {
        const { error: updateError } = await supabase
          .from('calc_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id)

        if (updateError) {
          console.warn("⚠️ Erro ao atualizar último login:", updateError.message)
        } else {
          console.log("✅ Último login atualizado com sucesso!")
        }
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