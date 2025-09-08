"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Orcamento, OrcamentoItem, OrcamentoComItens } from "@/lib/supabase-types"
import { useFinanceAuth } from "./use-finance-auth"

export function useOrcamentosRefatorado() {
  const { user, financeUser, loading: authLoading } = useFinanceAuth()
  const [orcamentos, setOrcamentos] = useState<OrcamentoComItens[]>([])
  const [orcamentoAtual, setOrcamentoAtual] = useState<OrcamentoComItens | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔧 use-orcamentos-refatorado - useEffect executado, user:", user?.email, "financeUser:", financeUser?.email, "authLoading:", authLoading)
    if (user && !authLoading) {
      console.log("🔧 use-orcamentos-refatorado - Usuário encontrado, buscando orçamentos...")
      fetchOrcamentos()
    } else if (!user && !authLoading) {
      console.log("🔧 use-orcamentos-refatorado - Nenhum usuário, limpando dados")
      setOrcamentos([])
      setOrcamentoAtual(null)
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

    console.log("🔧 fetchOrcamentos - Iniciando busca LIMPA do Supabase...")
    setLoading(true)
    
    // Limpar estado antes de buscar
    setOrcamentos([])
    setOrcamentoAtual(null)
    
    try {
      // Buscar orçamentos com cache desabilitado
      const { data: orcamentosData, error: orcamentosError } = await supabase
        .from("calc_orcamentos")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "ativo")
        .order("mes_referencia", { ascending: false })

      if (orcamentosError) {
        console.error("❌ Erro ao buscar orçamentos:", orcamentosError)
        setLoading(false)
        return
      }

      console.log("✅ Orçamentos encontrados:", orcamentosData?.length || 0)
      console.log("📋 Dados dos orçamentos:", orcamentosData)

      // Buscar itens de todos os orçamentos
      const orcamentoIds = orcamentosData?.map((o: OrcamentoComItens) => o.id) || []
      let itensData: OrcamentoItem[] = []

      console.log("🔍 Orçamento IDs para buscar itens:", orcamentoIds)

      if (orcamentoIds.length > 0) {
        const { data: itens, error: itensError } = await supabase
          .from("calc_orcamento_itens")
          .select("*")
          .in("orcamento_id", orcamentoIds)
          .order("data", { ascending: false })

        if (itensError) {
          console.error("❌ Erro ao buscar itens:", itensError)
          console.error("❌ Detalhes do erro:", itensError.message)
        } else {
          itensData = itens || []
          console.log("📋 Dados dos itens:", itens)
        }
      } else {
        console.log("⚠️ Nenhum orçamento encontrado, não buscando itens")
      }

      console.log("✅ Itens encontrados:", itensData.length)

      // Combinar orçamentos com seus itens e calcular totais
      const orcamentosComItens: OrcamentoComItens[] = (orcamentosData || []).map((orcamento: OrcamentoComItens) => {
        const receitas = itensData.filter(item => 
          item.orcamento_id === orcamento.id && item.tipo === "receita"
        )
        const despesas = itensData.filter(item => 
          item.orcamento_id === orcamento.id && item.tipo === "despesa"
        )

        const totalReceitas = receitas.reduce((total, item) => total + Number(item.valor), 0)
        const totalDespesas = despesas.reduce((total, item) => total + Number(item.valor), 0)
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
      setOrcamentos(orcamentosComItens)
      
      // Definir orçamento atual (mês atual ou mais recente)
      const hoje = new Date()
      const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`
      
      const orcamentoMesAtual = orcamentosComItens.find(o => o.mes_referencia === mesAtual)
      if (orcamentoMesAtual) {
        setOrcamentoAtual(orcamentoMesAtual)
      } else if (orcamentosComItens.length > 0) {
        setOrcamentoAtual(orcamentosComItens[0]) // Mais recente
      }
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
