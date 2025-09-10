"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Orcamento, OrcamentoItem, OrcamentoComItens } from "@/lib/supabase-types"
import { useFinanceAuth } from "./use-finance-auth"

// Chaves para cache local
const ORCAMENTOS_CACHE_KEY = 'calcfy_orcamentos_cache'
const ORCAMENTOS_TIMESTAMP_KEY = 'calcfy_orcamentos_timestamp'

// Tempo de cache em milissegundos (5 minutos)
const CACHE_DURATION = 5 * 60 * 1000

interface OrcamentosCache {
  orcamentos: OrcamentoComItens[]
  orcamentoAtual: OrcamentoComItens | null
  timestamp: number
  userId: string
}

export function useOrcamentosRefatorado() {
  const { user, financeUser, loading: authLoading } = useFinanceAuth()
  const [orcamentos, setOrcamentos] = useState<OrcamentoComItens[]>([])
  const [orcamentoAtual, setOrcamentoAtual] = useState<OrcamentoComItens | null>(null)
  const [loading, setLoading] = useState(true)

  // Função para salvar no cache local
  const saveOrcamentosToCache = (orcamentos: OrcamentoComItens[], orcamentoAtual: OrcamentoComItens | null, userId: string) => {
    if (typeof window === 'undefined') return
    
    const cache: OrcamentosCache = {
      orcamentos,
      orcamentoAtual,
      timestamp: Date.now(),
      userId
    }
    
    try {
      localStorage.setItem(ORCAMENTOS_CACHE_KEY, JSON.stringify(cache))
      console.log("💾 Orçamentos salvos no cache local")
    } catch (error) {
      console.warn("⚠️ Erro ao salvar orçamentos no cache local:", error)
    }
  }

  // Função para carregar do cache local
  const loadOrcamentosFromCache = (userId: string): OrcamentosCache | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const cached = localStorage.getItem(ORCAMENTOS_CACHE_KEY)
      if (!cached) return null
      
      const cache: OrcamentosCache = JSON.parse(cached)
      const now = Date.now()
      
      // Verificar se o cache ainda é válido e é do usuário correto
      if (now - cache.timestamp > CACHE_DURATION || cache.userId !== userId) {
        console.log("⏰ Cache de orçamentos expirado ou usuário diferente, removendo...")
        localStorage.removeItem(ORCAMENTOS_CACHE_KEY)
        return null
      }
      
      console.log("✅ Cache de orçamentos válido encontrado, carregando...")
      return cache
    } catch (error) {
      console.warn("⚠️ Erro ao carregar cache de orçamentos:", error)
      return null
    }
  }

  // Função para limpar o cache de orçamentos
  const clearOrcamentosCache = () => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(ORCAMENTOS_CACHE_KEY)
      localStorage.removeItem(ORCAMENTOS_TIMESTAMP_KEY)
      console.log("🗑️ Cache de orçamentos limpo")
    } catch (error) {
      console.warn("⚠️ Erro ao limpar cache de orçamentos:", error)
    }
  }

  useEffect(() => {
    console.log("🔧 use-orcamentos-refatorado - useEffect executado, user:", user?.email, "financeUser:", financeUser?.email, "authLoading:", authLoading)
    if (user && !authLoading) {
      console.log("🔧 use-orcamentos-refatorado - Usuário encontrado, verificando cache...")
      
      // Primeiro, tentar carregar do cache local
      const cachedOrcamentos = loadOrcamentosFromCache(user.id)
      if (cachedOrcamentos) {
        console.log("🚀 Carregando orçamentos do cache local")
        setOrcamentos(cachedOrcamentos.orcamentos)
        setOrcamentoAtual(cachedOrcamentos.orcamentoAtual)
        setLoading(false)
        
        // Validar no servidor em background (sem bloquear a UI)
        fetchOrcamentos()
        return
      }
      
      // Se não há cache, fazer busca completa no servidor
      fetchOrcamentos()
    } else if (!user && !authLoading) {
      console.log("🔧 use-orcamentos-refatorado - Nenhum usuário, limpando dados")
      setOrcamentos([])
      setOrcamentoAtual(null)
      clearOrcamentosCache()
      setLoading(false)
    } else {
      console.log("🔧 use-orcamentos-refatorado - Aguardando autenticação...")
    }
  }, [user, financeUser, authLoading])

  const fetchOrcamentos = async () => {
    if (!user) {
      console.log("❌ fetchOrcamentos - Nenhum usuário")
      return
    }

    console.log("🔧 fetchOrcamentos - Iniciando busca otimizada...")
    setLoading(true)
    
    try {
      // Buscar orçamentos e itens em paralelo para melhor performance
      const [orcamentosResult, itensResult] = await Promise.all([
        supabase
          .from("calc_orcamentos")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "ativo")
          .order("mes_referencia", { ascending: false }),
        
        supabase
          .from("calc_orcamento_itens")
          .select("*")
          .eq("user_id", user.id)
          .order("data", { ascending: false })
      ])

      if (orcamentosResult.error) {
        console.error("❌ Erro ao buscar orçamentos:", orcamentosResult.error)
        setLoading(false)
        return
      }

      if (itensResult.error) {
        console.error("❌ Erro ao buscar itens:", itensResult.error)
        setLoading(false)
        return
      }

      const orcamentosData = orcamentosResult.data || []
      const itensData = itensResult.data || []

      console.log("✅ Orçamentos encontrados:", orcamentosData.length)
      console.log("✅ Itens encontrados:", itensData.length)

      // Combinar orçamentos com seus itens e calcular totais
      const orcamentosComItens: OrcamentoComItens[] = (orcamentosData || []).map((orcamento: OrcamentoComItens) => {
        const receitas = itensData.filter((item: OrcamentoItem) => 
          item.orcamento_id === orcamento.id && item.tipo === "receita"
        )
        const despesas = itensData.filter((item: OrcamentoItem) => 
          item.orcamento_id === orcamento.id && item.tipo === "despesa"
        )

        const totalReceitas = receitas.reduce((total: number, item: OrcamentoItem) => total + Number(item.valor), 0)
        const totalDespesas = despesas.reduce((total: number, item: OrcamentoItem) => total + Number(item.valor), 0)
        const saldo = totalReceitas - totalDespesas

        console.log(`📊 Orçamento ${orcamento.mes_referencia}:`, {
          receitas: receitas.length,
          despesas: despesas.length,
          totalReceitas,
          totalDespesas,
          saldo
        })

        return {
          ...orcamento,
          receitas,
          despesas,
          total_receitas: totalReceitas,
          total_despesas: totalDespesas,
          saldo
        }
      })

      console.log("📋 Dados dos orçamentos com itens:", orcamentosComItens)
      
      // Definir orçamento atual (mês atual ou mais recente)
      const hoje = new Date()
      const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`
      
      const orcamentoMesAtual = orcamentosComItens.find(o => o.mes_referencia === mesAtual)
      const orcamentoAtualNovo = orcamentoMesAtual || (orcamentosComItens.length > 0 ? orcamentosComItens[0] : null)
      
      // Atualizar estado
      setOrcamentos(orcamentosComItens)
      setOrcamentoAtual(orcamentoAtualNovo)
      
      // Salvar no cache local
      saveOrcamentosToCache(orcamentosComItens, orcamentoAtualNovo, user.id)
      
    } catch (error) {
      console.error("Erro ao buscar orçamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  const criarOrcamento = async (mesReferencia: string, nome: string, descricao?: string) => {
    if (!user) throw new Error("Favor entrar ou se cadastrar para usufruir do site")

    try {
      console.log("🔧 Criando orçamento:", { mesReferencia, nome, descricao, userId: user.id })
      
      const { data, error } = await supabase
        .from("calc_orcamentos")
        .insert({
          user_id: user.id,
          mes_referencia: mesReferencia,
          nome,
          descricao,
          status: "ativo"
        })
        .select()
        .single()

      if (error) {
        console.error("❌ Erro ao criar orçamento:", error)
        throw error
      }

      console.log("✅ Orçamento criado com sucesso:", data)
      
      // Criar orçamento com itens vazios
      const novoOrcamento: OrcamentoComItens = {
        ...data,
        receitas: [],
        despesas: [],
        total_receitas: 0,
        total_despesas: 0,
        saldo: 0
      }
      
      setOrcamentos(prev => [novoOrcamento, ...prev])
      setOrcamentoAtual(novoOrcamento)
      
      // Limpar cache para forçar atualização
      clearOrcamentosCache()
      
      return novoOrcamento
    } catch (error) {
      console.error("❌ Erro ao criar orçamento:", error)
      throw error
    }
  }

  const adicionarItem = async (orcamentoId: string, item: Omit<OrcamentoItem, 'id' | 'orcamento_id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error("Favor entrar ou se cadastrar para usufruir do site")

    try {
      console.log("🔧 Adicionando item:", { orcamentoId, item, userId: user.id })
      
      const { data, error } = await supabase
        .from("calc_orcamento_itens")
        .insert({
          orcamento_id: orcamentoId,
          user_id: user.id,
          ...item
        })
        .select()
        .single()

      if (error) {
        console.error("❌ Erro ao adicionar item:", error)
        throw error
      }

      console.log("✅ Item adicionado com sucesso:", data)
      
      // Atualizar estado local
      setOrcamentos(prev => prev.map(orcamento => {
        if (orcamento.id === orcamentoId) {
          const novaLista = item.tipo === "receita" 
            ? [...orcamento.receitas, data]
            : [...orcamento.despesas, data]

          const totalReceitas = novaLista.filter(i => i.tipo === "receita").reduce((acc, i) => acc + Number(i.valor), 0)
          const totalDespesas = novaLista.filter(i => i.tipo === "despesa").reduce((acc, i) => acc + Number(i.valor), 0)
          const saldo = totalReceitas - totalDespesas

          return {
            ...orcamento,
            [item.tipo === "receita" ? "receitas" : "despesas"]: novaLista,
            total_receitas: totalReceitas,
            total_despesas: totalDespesas,
            saldo: saldo
          }
        }
        return orcamento
      }))

      // Limpar cache para forçar atualização
      clearOrcamentosCache()

      return data
    } catch (error) {
      console.error("❌ Erro ao adicionar item:", error)
      throw error
    }
  }

  const removerItem = async (orcamentoId: string, itemId: string, tipo: "receita" | "despesa") => {
    if (!user) throw new Error("Favor entrar ou se cadastrar para usufruir do site")

    try {
      console.log("🔧 Removendo item:", { orcamentoId, itemId, tipo, userId: user.id })
      
      const { error } = await supabase
        .from("calc_orcamento_itens")
        .delete()
        .eq("id", itemId)
        .eq("user_id", user.id)

      if (error) {
        console.error("❌ Erro ao remover item:", error)
        throw error
      }

      console.log("✅ Item removido com sucesso")
      
      // Atualizar estado local
      setOrcamentos(prev => prev.map(orcamento => {
        if (orcamento.id === orcamentoId) {
          const novaLista = (tipo === "receita" ? orcamento.receitas : orcamento.despesas)
            .filter(item => item.id !== itemId)

          const totalReceitas = novaLista.filter(i => i.tipo === "receita").reduce((acc, i) => acc + Number(i.valor), 0)
          const totalDespesas = novaLista.filter(i => i.tipo === "despesa").reduce((acc, i) => acc + Number(i.valor), 0)
          const saldo = totalReceitas - totalDespesas

          return {
            ...orcamento,
            [tipo === "receita" ? "receitas" : "despesas"]: novaLista,
            total_receitas: totalReceitas,
            total_despesas: totalDespesas,
            saldo: saldo
          }
        }
        return orcamento
      }))

      // Limpar cache para forçar atualização
      clearOrcamentosCache()

    } catch (error) {
      console.error("❌ Erro ao remover item:", error)
      throw error
    }
  }

  const atualizarOrcamento = async (id: string, updates: Partial<Orcamento>) => {
    if (!user) throw new Error("Favor entrar ou se cadastrar para usufruir do site")

    try {
      const { data, error } = await supabase
        .from("calc_orcamentos")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error

      setOrcamentos(prev => prev.map(o => o.id === id ? { ...o, ...data } : o))
      if (orcamentoAtual?.id === id) {
        setOrcamentoAtual(prev => prev ? { ...prev, ...data } : null)
      }
      return data
    } catch (error) {
      console.error("Erro ao atualizar orçamento:", error)
      throw error
    }
  }

  const arquivarOrcamento = async (id: string) => {
    return await atualizarOrcamento(id, { status: "arquivado" })
  }

  const excluirOrcamento = async (id: string) => {
    return await atualizarOrcamento(id, { status: "excluido" })
  }

  const toggleFavorite = async (id: string) => {
    const orcamento = orcamentos.find(o => o.id === id)
    if (!orcamento) return

    return await atualizarOrcamento(id, { is_favorite: !orcamento.is_favorite })
  }

  return {
    orcamentos,
    orcamentoAtual,
    loading,
    fetchOrcamentos,
    criarOrcamento,
    atualizarOrcamento,
    adicionarItem,
    removerItem,
    arquivarOrcamento,
    excluirOrcamento,
    toggleFavorite
  }
}
