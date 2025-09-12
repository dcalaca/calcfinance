"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { OrcamentoItem } from "@/lib/supabase-types"
import { useFinanceAuth } from "./use-finance-auth"

export interface CFPTransaction {
  id: string
  type: 'receita' | 'despesa'
  category: string
  description: string
  amount: number
  date: Date
  observations?: string
  createdAt: Date
}

// Função para converter Date para string no formato YYYY-MM-DD sem problemas de timezone
const formatDateForDB = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Função para converter string YYYY-MM-DD para Date sem problemas de timezone
const parseDateFromDB = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function useCFPTransactions() {
  const { user, loading: authLoading } = useFinanceAuth()
  const [transactions, setTransactions] = useState<CFPTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar transações do Supabase
  const fetchTransactions = async () => {
    if (!user) return

    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from("calc_orcamento_itens")
        .select("*")
        .eq("user_id", user.id)
        .order("data", { ascending: false })

      if (error) {
        console.error("Erro ao buscar transações:", error)
        setError("Erro ao carregar transações")
        return
      }

      // Converter para o formato da interface
      const formattedTransactions: CFPTransaction[] = (data || []).map((item: OrcamentoItem) => ({
        id: item.id,
        type: item.tipo,
        category: item.categoria,
        description: item.nome,
        amount: Number(item.valor),
        date: parseDateFromDB(item.data),
        observations: item.observacoes,
        createdAt: new Date(item.created_at)
      }))

      setTransactions(formattedTransactions)
    } catch (err) {
      console.error("Erro ao buscar transações:", err)
      setError("Erro ao carregar transações")
    } finally {
      setLoading(false)
    }
  }

  // Adicionar nova transação
  const addTransaction = async (transaction: Omit<CFPTransaction, 'id' | 'createdAt'>) => {
    if (!user) {
      throw new Error("Usuário não logado")
    }

    setLoading(true)
    setError(null)

    try {
      // Criar um orçamento padrão se não existir (usar o primeiro orçamento ativo)
      const { data: orcamentos, error: orcamentoError } = await supabase
        .from("calc_orcamentos")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "ativo")
        .limit(1)

      if (orcamentoError) {
        throw orcamentoError
      }

      let orcamentoId: string

      if (orcamentos && orcamentos.length > 0) {
        orcamentoId = orcamentos[0].id
      } else {
        // Criar um orçamento padrão
        const { data: novoOrcamento, error: createError } = await supabase
          .from("calc_orcamentos")
          .insert({
            user_id: user.id,
            mes_referencia: new Date().toISOString().slice(0, 7) + "-01",
            nome: "CFP - Controle Financeiro Pessoal",
            descricao: "Orçamento criado automaticamente para o CFP",
            status: "ativo"
          })
          .select("id")
          .single()

        if (createError) {
          throw createError
        }

        orcamentoId = novoOrcamento.id
      }

      // Inserir a transação
      const { data, error } = await supabase
        .from("calc_orcamento_itens")
        .insert({
          orcamento_id: orcamentoId,
          user_id: user.id,
          nome: transaction.description,
          valor: transaction.amount,
          categoria: transaction.category,
          tipo: transaction.type,
          data: formatDateForDB(transaction.date),
          observacoes: transaction.observations
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Adicionar à lista local
      const newTransaction: CFPTransaction = {
        id: data.id,
        type: data.tipo,
        category: data.categoria,
        description: data.nome,
        amount: Number(data.valor),
        date: parseDateFromDB(data.data),
        observations: data.observacoes,
        createdAt: new Date(data.created_at)
      }

      setTransactions(prev => [newTransaction, ...prev])
      return newTransaction
    } catch (err) {
      console.error("Erro ao adicionar transação:", err)
      setError("Erro ao adicionar transação")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Deletar transação
  const deleteTransaction = async (id: string) => {
    if (!user) {
      throw new Error("Usuário não logado")
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from("calc_orcamento_itens")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) {
        throw error
      }

      // Remover da lista local
      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error("Erro ao deletar transação:", err)
      setError("Erro ao deletar transação")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Atualizar transação
  const updateTransaction = async (id: string, updates: Partial<CFPTransaction>) => {
    if (!user) {
      throw new Error("Usuário não logado")
    }

    setLoading(true)
    setError(null)

    try {
      const updateData: any = {}
      
      if (updates.description) updateData.nome = updates.description
      if (updates.amount !== undefined) updateData.valor = updates.amount
      if (updates.category) updateData.categoria = updates.category
      if (updates.type) updateData.tipo = updates.type
      if (updates.date) updateData.data = formatDateForDB(updates.date)
      if (updates.observations !== undefined) updateData.observacoes = updates.observations

      const { data, error } = await supabase
        .from("calc_orcamento_itens")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Atualizar na lista local
      setTransactions(prev => prev.map(t => 
        t.id === id 
          ? {
              ...t,
              type: data.tipo,
              category: data.categoria,
              description: data.nome,
              amount: Number(data.valor),
              date: parseDateFromDB(data.data),
              observations: data.observacoes
            }
          : t
      ))

      return data
    } catch (err) {
      console.error("Erro ao atualizar transação:", err)
      setError("Erro ao atualizar transação")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Carregar transações quando o usuário estiver logado
  useEffect(() => {
    if (user && !authLoading) {
      fetchTransactions()
    } else if (!user && !authLoading) {
      setTransactions([])
    }
  }, [user, authLoading])

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refetch: fetchTransactions
  }
}
