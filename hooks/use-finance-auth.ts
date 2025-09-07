"use client"

import { useState, useEffect } from "react"
import type { User, AuthResponse } from "@supabase/supabase-js"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export function useFinanceAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [financeUser, setFinanceUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔧 Hook de autenticação iniciado")
    console.log("🔧 Supabase configurado:", isSupabaseConfigured())
    
    if (!isSupabaseConfigured()) {
      console.log("❌ Supabase não configurado, definindo loading como false")
      setLoading(false)
      return
    }

    // Timeout de segurança para evitar loading infinito
    const timeoutId = setTimeout(() => {
      console.log("⏰ Timeout de segurança - forçando loading para false")
      setLoading(false)
    }, 5000) // 5 segundos

    // Get initial user
    const getUser = async () => {
      try {
        console.log("🔍 Buscando usuário atual...")
        const {
          data: { user },
        } = await supabase.auth.getUser()
        console.log("👤 Usuário encontrado:", user ? "Sim" : "Não")
        setUser(user)
      } catch (error) {
        console.error("❌ Erro ao buscar usuário:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log("🔄 Mudança de estado de autenticação:", event, session?.user ? "Usuário logado" : "Usuário deslogado")
      setUser(session?.user ?? null)
      if (session?.user) {
        // Buscar dados do usuário na tabela calc_users
        const { data: userData } = await supabase
          .from('calc_users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setFinanceUser(userData)
      } else {
        setFinanceUser(null)
      }
      setLoading(false)
    })

    return () => {
      clearTimeout(timeoutId)
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
    
    if (!isSupabaseConfigured()) {
      console.warn("❌ Supabase not configured")
      // Mesmo sem Supabase, limpar estado local
      setUser(null)
      setFinanceUser(null)
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
        // Mesmo com erro, limpar estado local
        setUser(null)
        setFinanceUser(null)
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
        return
      }
      
      console.log("✅ Logout realizado com sucesso!")
      
      // Limpar estado local
      setUser(null)
      setFinanceUser(null)
      
      // Redirecionar para a página inicial
      if (typeof window !== 'undefined') {
        console.log("🔄 Redirecionando para página inicial...")
        window.location.href = '/'
      }
      
    } catch (error) {
      console.error("❌ Erro no logout:", error)
      // Mesmo com erro, limpar estado local
      setUser(null)
      setFinanceUser(null)
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