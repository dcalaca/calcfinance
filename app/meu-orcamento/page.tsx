"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFinanceAuth } from "@/hooks/use-finance-auth"
import { supabase } from "@/lib/supabase"
import type { OrcamentoComItens } from "@/lib/supabase-types"
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Star,
  Archive,
  Trash2,
  Edit,
  PieChart,
  BarChart3,
  User
} from "lucide-react"
import { toast } from "sonner"
import { CurrencyInput } from "@/components/ui/currency-input"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { InvestmentProjection } from "@/components/investment-projection"
import Link from "next/link"

export default function MeuOrcamentoPage() {
  const { user, loading: authLoading } = useFinanceAuth()
  
  // Estados simplificados
  const [orcamentos, setOrcamentos] = useState<OrcamentoComItens[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [novoItem, setNovoItem] = useState({
    nome: "",
    valor: 0,
    categoria: "",
    tipo: "despesa" as "receita" | "despesa",
    data: new Date().toISOString().split('T')[0],
    observacoes: ""
  })

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [filtroMes, setFiltroMes] = useState("")
  const [filtroItem, setFiltroItem] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState<"receita" | "despesa" | "todos">("todos")

  // Função simples para buscar orçamentos
  const fetchOrcamentos = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      console.log("🔍 Buscando orçamentos para usuário:", user.id)
      
      // Buscar orçamentos
      const { data: orcamentosData, error: orcamentosError } = await supabase
        .from("calc_orcamentos")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "ativo")
        .order("mes_referencia", { ascending: false })
        .limit(10)

      if (orcamentosError) {
        console.error("❌ Erro ao buscar orçamentos:", orcamentosError)
        setError("Erro ao carregar orçamentos")
        return
      }

      if (!orcamentosData || orcamentosData.length === 0) {
        console.log("📊 Nenhum orçamento encontrado")
        setOrcamentos([])
        return
      }

      // Buscar itens para os orçamentos
      const orcamentoIds = orcamentosData.map((o: any) => o.id)
      const { data: itensData, error: itensError } = await supabase
        .from("calc_orcamento_itens")
        .select("*")
        .eq("user_id", user.id)
        .in("orcamento_id", orcamentoIds)
        .order("data", { ascending: false })

      if (itensError) {
        console.error("❌ Erro ao buscar itens:", itensError)
        setError("Erro ao carregar itens dos orçamentos")
        return
      }

      // Combinar dados
      const orcamentosComItens: OrcamentoComItens[] = orcamentosData.map((orcamento: any) => {
        const itens = itensData?.filter((item: any) => item.orcamento_id === orcamento.id) || []
        const receitas = itens.filter((item: any) => item.tipo === "receita")
        const despesas = itens.filter((item: any) => item.tipo === "despesa")

        const totalReceitas = receitas.reduce((total: number, item: any) => total + Number(item.valor), 0)
        const totalDespesas = despesas.reduce((total: number, item: any) => total + Number(item.valor), 0)
        const saldo = totalReceitas - totalDespesas

        return {
          ...orcamento,
          receitas,
          despesas,
          total_receitas: totalReceitas,
          total_despesas: totalDespesas,
          saldo
        }
      })

      console.log("✅ Orçamentos carregados:", orcamentosComItens.length)
      setOrcamentos(orcamentosComItens)
      
    } catch (error) {
      console.error("❌ Erro geral:", error)
      setError("Erro inesperado ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados quando o usuário estiver disponível
  useEffect(() => {
    if (user && !authLoading) {
      fetchOrcamentos()
    } else if (!user && !authLoading) {
      setOrcamentos([])
      setLoading(false)
    }
  }, [user, authLoading])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando seus orçamentos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Erro ao Carregar</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => fetchOrcamentos()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  // Se não estiver logado, mostrar mensagem amigável
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Meu Orçamento</h1>
            <p className="text-muted-foreground">
              Controle sua vida financeira de forma simples e eficiente
            </p>
          </div>
          
          <Card className="p-8">
            <CardContent>
              <div className="mb-6">
                <DollarSign className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
                <p className="text-muted-foreground mb-6">
                  Para usar o sistema de orçamento, você precisa estar logado.
                </p>
              </div>
              
              <div className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/login">
                    <User className="w-4 h-4 mr-2" />
                    Entrar na Conta
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/registro">
                    <User className="w-4 h-4 mr-2" />
                    Criar Conta
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Remover verificação de usuário - deixar o middleware cuidar disso
  // if (!user) {
  //   return null
  // }

  const categoriasDespesas = [
    "Alimentação", "Moradia", "Transporte", "Saúde", "Educação", 
    "Lazer", "Vestuário", "Contas", "Investimentos", "Outros"
  ]

  const categoriasReceitas = [
    "Salário", "Freelance", "Investimentos", "Aluguel", "Vendas", "Outros"
  ]

  const handleAdicionarItem = async () => {
    if (!user) {
      toast.error("Favor entrar ou se cadastrar para usufruir do site")
      return
    }

    if (!novoItem.nome || novoItem.valor <= 0 || !novoItem.categoria) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    try {
      // Determinar o orçamento baseado na data do item
      const dataItem = new Date(novoItem.data + 'T00:00:00')
      const mesReferencia = `${dataItem.getFullYear()}-${String(dataItem.getMonth() + 1).padStart(2, '0')}-01`
      
      // Buscar orçamento existente para o mês
      let orcamentoParaUsar = orcamentos.find(o => o.mes_referencia === mesReferencia)
      
      if (!orcamentoParaUsar) {
        // Criar novo orçamento automaticamente
        const nomeOrcamento = dataItem.toLocaleDateString('pt-BR', { 
          year: 'numeric', 
          month: 'long' 
        })
        
        const { data: novoOrcamento, error: orcamentoError } = await supabase
          .from("calc_orcamentos")
          .insert({
            user_id: user.id,
            mes_referencia: mesReferencia,
            nome: nomeOrcamento,
            descricao: `Orçamento ${nomeOrcamento}`,
            status: "ativo"
          })
          .select()
          .single()

        if (orcamentoError) {
          console.error("Erro ao criar orçamento:", orcamentoError)
          toast.error("Erro ao criar orçamento")
          return
        }

        orcamentoParaUsar = {
          ...novoOrcamento,
          receitas: [],
          despesas: [],
          total_receitas: 0,
          total_despesas: 0,
          saldo: 0
        }
      }

      // Adicionar item
      const { data: itemData, error: itemError } = await supabase
        .from("calc_orcamento_itens")
        .insert({
          orcamento_id: orcamentoParaUsar.id,
          user_id: user.id,
          nome: novoItem.nome,
          valor: Number(novoItem.valor),
          categoria: novoItem.categoria,
          tipo: novoItem.tipo,
          data: novoItem.data,
          observacoes: novoItem.observacoes
        })
        .select()
        .single()

      if (itemError) {
        console.error("Erro ao adicionar item:", itemError)
        toast.error("Erro ao adicionar item")
        return
      }

      // Recarregar dados
      await fetchOrcamentos()
      
      setNovoItem({
        nome: "",
        valor: 0,
        categoria: "",
        tipo: "despesa",
        data: new Date().toISOString().split('T')[0],
        observacoes: ""
      })
      setMostrarFormulario(false)
      toast.success("Item adicionado com sucesso!")
    } catch (error) {
      console.error("Erro ao adicionar item:", error)
      toast.error("Erro ao adicionar item")
    }
  }

  const handleRemoverItem = async (itemId: string, tipo: "receita" | "despesa") => {
    if (!user) {
      toast.error("Usuário não logado")
      return
    }

    try {
      const { error } = await supabase
        .from("calc_orcamento_itens")
        .delete()
        .eq("id", itemId)
        .eq("user_id", user.id)

      if (error) {
        console.error("Erro ao remover item:", error)
        toast.error("Erro ao remover item")
        return
      }

      // Recarregar dados
      await fetchOrcamentos()
      toast.success("Item removido com sucesso!")
    } catch (error) {
      console.error("Erro ao remover item:", error)
      toast.error("Erro ao remover item")
    }
  }


  const formatarMes = (data: string) => {
    // Dividir a data em partes para evitar problemas de timezone
    const [ano, mes, dia] = data.split('-').map(Number)
    
    // Criar data local (mês é 0-indexado, então subtrair 1)
    const date = new Date(ano, mes - 1, dia)
    
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  const formatarMesAbreviado = (data: string) => {
    // Dividir a data em partes para evitar problemas de timezone
    const [ano, mes, dia] = data.split('-').map(Number)
    
    // Criar data local (mês é 0-indexado, então subtrair 1)
    const date = new Date(ano, mes - 1, dia)
    
    return date.toLocaleDateString('pt-BR', { 
      year: '2-digit', 
      month: 'short' 
    })
  }


  const handleCriarOrcamentosFaltantes = async () => {
    try {
      // Buscar todos os itens que têm orcamento_id mas o orçamento não existe
      const itensOrfaos = receitasFiltradas.concat(despesasFiltradas).filter(item => {
        const orcamento = orcamentos.find(o => o.id === item.orcamento_id)
        return !orcamento
      })
      
      if (itensOrfaos.length === 0) {
        toast.info("Nenhum item órfão encontrado")
        return
      }
      
      // Agrupar por data para criar orçamentos
      const itensPorData = itensOrfaos.reduce((acc, item) => {
        const dataItem = new Date(item.data + 'T00:00:00')
        const mesReferencia = `${dataItem.getFullYear()}-${String(dataItem.getMonth() + 1).padStart(2, '0')}-01`
        
        if (!acc[mesReferencia]) {
          acc[mesReferencia] = []
        }
        acc[mesReferencia].push(item)
        return acc
      }, {} as Record<string, any[]>)
      
      // Criar orçamentos para cada mês
      for (const [mesReferencia, itens] of Object.entries(itensPorData)) {
        const dataItem = new Date(mesReferencia)
        const nomeOrcamento = dataItem.toLocaleDateString('pt-BR', { 
          year: 'numeric', 
          month: 'long' 
        })
        
        await criarOrcamento(
          mesReferencia, 
          nomeOrcamento, 
          `Orçamento ${nomeOrcamento}`
        )
      }
      
      // Recarregar dados
      await fetchOrcamentos()
      toast.success("Orçamentos criados com sucesso!")
      
    } catch (error) {
      console.error("Erro ao criar orçamentos:", error)
      toast.error("Erro ao criar orçamentos")
    }
  }

  // Funções de filtro simplificadas
  const orcamentosFiltrados = orcamentos.filter(orcamento => {
    if (filtroMes && !orcamento.mes_referencia.includes(filtroMes)) return false
    return true
  })

  // Orçamento atual baseado no filtro de mês
  const orcamentoAtualFiltrado = filtroMes 
    ? orcamentos.find(o => o.mes_referencia === filtroMes) || null
    : null

  // Receitas filtradas
  const receitasFiltradas = (() => {
    if (filtroMes && orcamentoAtualFiltrado) {
      return orcamentoAtualFiltrado.receitas.filter(item => {
        if (filtroItem && !item.nome.toLowerCase().includes(filtroItem.toLowerCase())) return false
        if (tipoFiltro !== "todos" && item.tipo !== tipoFiltro) return false
        return true
      })
    } else {
      return orcamentos.flatMap(o => o.receitas.map(item => ({ ...item, mes_referencia: o.mes_referencia }))).filter(item => {
        if (filtroItem && !item.nome.toLowerCase().includes(filtroItem.toLowerCase())) return false
        if (tipoFiltro !== "todos" && item.tipo !== tipoFiltro) return false
        return true
      })
    }
  })()

  // Despesas filtradas
  const despesasFiltradas = (() => {
    if (filtroMes && orcamentoAtualFiltrado) {
      return orcamentoAtualFiltrado.despesas.filter(item => {
        if (filtroItem && !item.nome.toLowerCase().includes(filtroItem.toLowerCase())) return false
        if (tipoFiltro !== "todos" && item.tipo !== tipoFiltro) return false
        return true
      })
    } else {
      return orcamentos.flatMap(o => o.despesas.map(item => ({ ...item, mes_referencia: o.mes_referencia }))).filter(item => {
        if (filtroItem && !item.nome.toLowerCase().includes(filtroItem.toLowerCase())) return false
        if (tipoFiltro !== "todos" && item.tipo !== tipoFiltro) return false
        return true
      })
    }
  })()

  // Debug logs removidos para melhor performance

  // Dados para o gráfico mensal - agrupar por mês e somar valores
  const dadosGrafico = orcamentos.reduce((acc, orcamento) => {
    const mesKey = orcamento.mes_referencia
    const mesFormatado = formatarMesAbreviado(orcamento.mes_referencia)
    
    if (!acc[mesKey]) {
      acc[mesKey] = {
        mes: mesFormatado,
        receitas: 0,
        despesas: 0,
        saldo: 0
      }
    }
    
    // Somar receitas e despesas de todos os orçamentos do mesmo mês
    acc[mesKey].receitas += orcamento.receitas.reduce((total, item) => total + item.valor, 0)
    acc[mesKey].despesas += orcamento.despesas.reduce((total, item) => total + item.valor, 0)
    acc[mesKey].saldo = acc[mesKey].receitas - acc[mesKey].despesas
    
    return acc
  }, {} as Record<string, { mes: string; receitas: number; despesas: number; saldo: number }>)

  // Converter para array e ordenar
  const dadosGraficoArray = Object.values(dadosGrafico).sort((a, b) => {
    const orcamentoA = orcamentos.find(o => formatarMesAbreviado(o.mes_referencia) === a.mes)
    const orcamentoB = orcamentos.find(o => formatarMesAbreviado(o.mes_referencia) === b.mes)
    
    if (!orcamentoA || !orcamentoB) return 0
    
    return new Date(orcamentoA.mes_referencia).getTime() - new Date(orcamentoB.mes_referencia).getTime()
  })

  // Debug logs removidos para melhor performance

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // Calcular sobra mensal para projeção de investimento
  const totalReceitas = receitasFiltradas.reduce((total, item) => total + item.valor, 0)
  const totalDespesas = despesasFiltradas.reduce((total, item) => total + item.valor, 0)
  const sobraMensal = totalReceitas - totalDespesas

  const temSobra = sobraMensal > 0

  return (
    <div className="w-full max-w-none py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meu Orçamento</h1>
          <p className="text-muted-foreground">
            Controle sua vida financeira de forma simples e eficiente
          </p>
          {/* Debug info removido para melhor performance */}
        </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Mês:</label>
          <select 
            value={filtroMes} 
            onChange={(e) => setFiltroMes(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="">Todos os meses</option>
            {orcamentos
              .filter((orcamento, index, self) => 
                index === self.findIndex(o => o.mes_referencia === orcamento.mes_referencia) &&
                (orcamento.receitas.length > 0 || orcamento.despesas.length > 0)
              )
              .map(orcamento => (
                <option key={orcamento.id} value={orcamento.mes_referencia}>
                  {formatarMes(orcamento.mes_referencia)}
                </option>
              ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Tipo:</label>
          <select 
            value={tipoFiltro} 
            onChange={(e) => setTipoFiltro(e.target.value as "receita" | "despesa" | "todos")}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="todos">Todos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Item:</label>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filtroItem}
            onChange={(e) => setFiltroItem(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm w-48"
          />
        </div>
      </div>

      {!orcamentoAtualFiltrado && filtroMes ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhum orçamento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro orçamento para começar a controlar suas finanças
            </p>
            <Button onClick={() => setMostrarFormulario(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Orçamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">
          {/* Resumo do Orçamento */}
          <div className="lg:col-span-2 xl:col-span-2">
            {orcamentos.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum orçamento encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Crie seu primeiro orçamento para começar a controlar suas finanças
                  </p>
                  <Button onClick={() => setMostrarFormulario(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Orçamento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {filtroMes && orcamentoAtualFiltrado ? formatarMes(orcamentoAtualFiltrado.mes_referencia) : "Orçamento Geral"}
                    </CardTitle>
                    {orcamentoAtualFiltrado && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(orcamentoAtualFiltrado.id)}
                      >
                        <Star className={`w-4 h-4 ${orcamentoAtualFiltrado.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                    )}
                  </div>
                  <CardDescription>
                    {filtroMes && orcamentoAtualFiltrado ? `Orçamento ${formatarMes(orcamentoAtualFiltrado.mes_referencia)}` : "Orçamento Geral Acumulado"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Receitas</span>
                    <span className="font-semibold text-green-600">
                      {formatarMoeda(receitasFiltradas.reduce((total, item) => total + item.valor, 0))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600">Despesas</span>
                    <span className="font-semibold text-red-600">
                      {formatarMoeda(despesasFiltradas.reduce((total, item) => total + item.valor, 0))}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Saldo</span>
                      <span className={`font-bold text-lg ${
                        (receitasFiltradas.reduce((total, item) => total + item.valor, 0) - despesasFiltradas.reduce((total, item) => total + item.valor, 0)) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatarMoeda(receitasFiltradas.reduce((total, item) => total + item.valor, 0) - despesasFiltradas.reduce((total, item) => total + item.valor, 0))}
                      </span>
                    </div>
                    
                    {/* Mensagem motivacional para sobra */}
                    {temSobra ? (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              🎉 Parabéns! Você tem sobra de {formatarMoeda(sobraMensal)}
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                              Veja abaixo como investir esse valor pode multiplicar seu patrimônio!
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-sm font-medium text-orange-800">
                              💡 Dica: Tente economizar para ter sobra no orçamento
                            </p>
                            <p className="text-xs text-orange-700 mt-1">
                              Com sobra mensal, você pode investir e multiplicar seu patrimônio!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gráfico mensal - só exibir se há dados reais */}
            {dadosGraficoArray.length > 0 && dadosGraficoArray.some(d => d.receitas > 0 || d.despesas > 0) && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Evolução Mensal
                  </CardTitle>
                  <CardDescription>
                    Receitas vs Despesas por mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dadosGraficoArray}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="mes" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                        domain={[0, 'dataMax']}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          formatarMoeda(value), 
                          name === 'receitas' ? 'Receitas' : name === 'despesas' ? 'Despesas' : 'Saldo'
                        ]}
                        labelFormatter={(label) => `Mês: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="receitas" fill="#22c55e" name="Receitas" />
                      <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Projeção de Investimento - só mostra se há sobra */}
            {temSobra && (
              <InvestmentProjection 
                monthlySurplus={sobraMensal} 
              />
            )}

            {/* Botão para adicionar item */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <Button 
                  className="w-full" 
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  disabled={!orcamentoAtualFiltrado && !!filtroMes}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Itens */}
          <div className="lg:col-span-3 xl:col-span-4">
                <Tabs defaultValue="receitas" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="receitas" className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Receitas ({receitasFiltradas.length})
                    </TabsTrigger>
                    <TabsTrigger value="despesas" className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" />
                      Despesas ({despesasFiltradas.length})
                    </TabsTrigger>
                  </TabsList>

              <TabsContent value="receitas" className="space-y-4">
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                  {receitasFiltradas.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {filtroItem ? "Nenhuma receita encontrada" : "Nenhuma receita adicionada"}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {receitasFiltradas.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{item.nome}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary">{item.categoria}</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {item.data && new Date(item.data).toLocaleDateString('pt-BR')}
                                  </span>
                                  {!filtroMes && (() => {
                                    const orcamento = orcamentos.find(o => o.id === item.orcamento_id)
                                    
                                    if (!orcamento) {
                                      return (
                                        <Badge variant="destructive" className="text-xs">
                                          Orçamento não encontrado
                                        </Badge>
                                      )
                                    }
                                    
                                    return orcamento?.mes_referencia && (
                                      <Badge variant="outline" className="text-xs">
                                        {formatarMes(orcamento.mes_referencia)}
                                      </Badge>
                                    )
                                  })()}
                                </div>
                                {item.observacoes && (
                                  <p className="text-sm text-muted-foreground mt-1">{item.observacoes}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-green-600">
                                  {formatarMoeda(item.valor)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoverItem(item.id, "receita")}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="despesas" className="space-y-4">
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                  {despesasFiltradas.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <TrendingDown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {filtroItem ? "Nenhuma despesa encontrada" : "Nenhuma despesa adicionada"}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {despesasFiltradas.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{item.nome}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary">{item.categoria}</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {item.data && new Date(item.data).toLocaleDateString('pt-BR')}
                                  </span>
                                  {!filtroMes && (() => {
                                    const orcamento = orcamentos.find(o => o.id === item.orcamento_id)
                                    
                                    if (!orcamento) {
                                      return (
                                        <Badge variant="destructive" className="text-xs">
                                          Orçamento não encontrado
                                        </Badge>
                                      )
                                    }
                                    
                                    return orcamento?.mes_referencia && (
                                      <Badge variant="outline" className="text-xs">
                                        {formatarMes(orcamento.mes_referencia)}
                                      </Badge>
                                    )
                                  })()}
                                </div>
                                {item.observacoes && (
                                  <p className="text-sm text-muted-foreground mt-1">{item.observacoes}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-red-600">
                                  {formatarMoeda(item.valor)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoverItem(item.id, "despesa")}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Formulário para adicionar item */}
      {mostrarFormulario && (orcamentoAtualFiltrado || !filtroMes) && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Adicionar Item</CardTitle>
            <CardDescription>
              Adicione uma nova receita ou despesa ao seu orçamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo *</Label>
                <Select
                  value={novoItem.tipo}
                  onValueChange={(value: "receita" | "despesa") => setNovoItem({ ...novoItem, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  value={novoItem.categoria}
                  onValueChange={(value) => setNovoItem({ ...novoItem, categoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {novoItem.tipo === "receita" 
                      ? categoriasReceitas.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))
                      : categoriasDespesas.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={novoItem.nome}
                  onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                  placeholder="Ex: Salário, Aluguel, Supermercado"
                />
              </div>
              <div>
                <Label htmlFor="valor">Valor *</Label>
                <CurrencyInput
                  value={novoItem.valor}
                  onChange={(value) => setNovoItem({ ...novoItem, valor: value })}
                  placeholder="0,00"
                />
              </div>
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={novoItem.data}
                  onChange={(e) => setNovoItem({ ...novoItem, data: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={novoItem.observacoes}
                  onChange={(e) => setNovoItem({ ...novoItem, observacoes: e.target.value })}
                  placeholder="Observações opcionais"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdicionarItem}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
              <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão para criar orçamentos faltantes */}
      {receitasFiltradas.concat(despesasFiltradas).some(item => !orcamentos.find(o => o.id === item.orcamento_id)) && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-600">⚠️ Orçamentos Faltantes</h3>
                <p className="text-sm text-muted-foreground">
                  Alguns itens não têm orçamento associado. Clique para criar automaticamente.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleCriarOrcamentosFaltantes}
                className="text-orange-600 border-orange-600 hover:bg-orange-50"
              >
                Criar Orçamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      </div>
    </div>
  )
}
