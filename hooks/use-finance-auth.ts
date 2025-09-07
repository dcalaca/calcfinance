"use client"

import { useState, useEffect } from "react"
import type { User, AuthResponse } from "@supabase/supabase-js"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export function useFinanceAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [financeUser, setFinanceUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Get initial user
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error getting user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
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
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured")
    }

    try {
      const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Atualizar último login na tabela calc_users
      if (data.user) {
        const { error: updateError } = await supabase
          .from('calc_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id)

        if (updateError) {
          console.warn("Error updating last login:", updateError.message)
        }
      }

      return { data, error: null }
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured")
      return
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
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