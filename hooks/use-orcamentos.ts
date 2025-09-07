"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Orcamento, OrcamentoItem, OrcamentoComItens } from "@/lib/supabase-types"
import { useFinanceAuth } from "./use-finance-auth"

export function useOrcamentos() {
  const { user, financeUser, loading: authLoading } = useFinanceAuth()
  const [orcamentos, setOrcamentos] = useState<OrcamentoComItens[]>([])
  const [orcamentoAtual, setOrcamentoAtual] = useState<OrcamentoComItens | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔧 use-orcamentos - useEffect executado, user:", user?.email, "financeUser:", financeUser?.email, "authLoading:", authLoading)
    if (user && !authLoading) {
      console.log("🔧 use-orcamentos - Usuário encontrado, buscando orçamentos...")
      fetchOrcamentos()
    } else if (!user && !authLoading) {
      console.log("🔧 use-orcamentos - Nenhum usuário, limpando dados")
      setOrcamentos([])
      setOrcamentoAtual(null)
      setLoading(false)
    } else {
      console.log("🔧 use-orcamentos - Aguardando autenticação...")
    }
  }, [user, financeUser, authLoading])

  const fetchOrcamentos = async () => {
    if (!user) {
      console.log("❌ fetchOrcamentos - Nenhum usuário")
      return
    }

    console.log("🔧 fetchOrcamentos - Iniciando busca...")
    setLoading(true)
    try {
      console.log("🔍 Buscando orçamentos para usuário:", user.email, "ID:", user.id)
      const { data, error } = await supabase
        .from("calc_orcamentos")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "ativo")
        .order("mes_referencia", { ascending: false })

      if (error) {
        console.error("❌ Erro ao buscar orçamentos:", error)
        setLoading(false)
        return
      }

      console.log("✅ Orçamentos encontrados:", data?.length || 0)
      console.log("📋 Dados dos orçamentos:", data)
      setOrcamentos(data || [])
      
      // Definir orçamento atual (mês atual ou mais recente)
      const hoje = new Date()
      const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`
      
      const orcamentoMesAtual = data?.find((o: Orcamento) => o.mes_referencia === mesAtual)
      if (orcamentoMesAtual) {
        setOrcamentoAtual(orcamentoMesAtual)
      } else if (data && data.length > 0) {
        setOrcamentoAtual(data[0]) // Mais recente
      }
    } catch (error) {
      console.error("Erro ao buscar orçamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  const criarOrcamento = async (mesReferencia: string, nome: string, descricao?: string) => {
    if (!user) throw new Error("Usuário não logado")

    try {
      console.log("🔧 Criando orçamento:", { mesReferencia, nome, descricao, userId: user.id })
      
      const { data, error } = await supabase
        .from("calc_orcamentos")
        .insert({
          user_id: user.id,
          mes_referencia: mesReferencia,
          nome,
          descricao,
          receitas: [],
          despesas: [],
          total_receitas: 0,
          total_despesas: 0,
          saldo: 0,
          status: "ativo"
        })
        .select()
        .single()

      if (error) {
        console.error("❌ Erro ao criar orçamento:", error)
        throw error
      }

      console.log("✅ Orçamento criado com sucesso:", data)
      setOrcamentos(prev => [data, ...prev])
      setOrcamentoAtual(data)
      return data
    } catch (error) {
      console.error("❌ Erro ao criar orçamento:", error)
      throw error
    }
  }

  const atualizarOrcamento = async (id: string, updates: Partial<OrcamentoComItens>) => {
    if (!user) throw new Error("Usuário não logado")

    try {
      const { data, error } = await supabase
        .from("calc_orcamentos")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error

      setOrcamentos(prev => prev.map(o => o.id === id ? data : o))
      if (orcamentoAtual?.id === id) {
        setOrcamentoAtual(data)
      }
      return data
    } catch (error) {
      console.error("Erro ao atualizar orçamento:", error)
      throw error
    }
  }

  const adicionarItem = async (orcamentoId: string, item: OrcamentoItem) => {
    if (!user) throw new Error("Usuário não logado")

    try {
      const orcamento = orcamentos.find((o: OrcamentoComItens) => o.id === orcamentoId)
      if (!orcamento) throw new Error("Orçamento não encontrado")

      const novaLista = item.tipo === "receita" 
        ? [...orcamento.receitas, item]
        : [...orcamento.despesas, item]

      const totalReceitas = novaLista.filter(i => i.tipo === "receita").reduce((acc, i) => acc + i.valor, 0)
      const totalDespesas = novaLista.filter(i => i.tipo === "despesa").reduce((acc, i) => acc + i.valor, 0)
      const saldo = totalReceitas - totalDespesas

      const updates = {
        [item.tipo === "receita" ? "receitas" : "despesas"]: novaLista,
        total_receitas: totalReceitas,
        total_despesas: totalDespesas,
        saldo: saldo
      }

      return await atualizarOrcamento(orcamentoId, updates)
    } catch (error) {
      console.error("Erro ao adicionar item:", error)
      throw error
    }
  }

  const removerItem = async (orcamentoId: string, itemId: string, tipo: "receita" | "despesa") => {
    if (!user) throw new Error("Usuário não logado")

    try {
      const orcamento = orcamentos.find((o: OrcamentoComItens) => o.id === orcamentoId)
      if (!orcamento) throw new Error("Orçamento não encontrado")

      const novaLista = (tipo === "receita" ? orcamento.receitas : orcamento.despesas)
        .filter(item => item.id !== itemId)

      const totalReceitas = novaLista.filter(i => i.tipo === "receita").reduce((acc, i) => acc + i.valor, 0)
      const totalDespesas = novaLista.filter(i => i.tipo === "despesa").reduce((acc, i) => acc + i.valor, 0)
      const saldo = totalReceitas - totalDespesas

      const updates = {
        [tipo === "receita" ? "receitas" : "despesas"]: novaLista,
        total_receitas: totalReceitas,
        total_despesas: totalDespesas,
        saldo: saldo
      }

      return await atualizarOrcamento(orcamentoId, updates)
    } catch (error) {
      console.error("Erro ao remover item:", error)
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
