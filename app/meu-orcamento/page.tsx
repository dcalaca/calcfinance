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
    data: new Date().toLocaleDateString('pt-CA'), // Formato YYYY-MM-DD sem timezone
    observacoes: ""
  })

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [filtroMes, setFiltroMes] = useState("")
  const [filtroMeses, setFiltroMeses] = useState<string[]>([])
  const [filtroItem, setFiltroItem] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState<"receita" | "despesa" | "todos">("todos")

  // Função ultra-simples para buscar itens
  const fetchItens = async () => {
    console.log("🚀 INICIANDO fetchItens - user:", user?.id)
    
    if (!user) {
      console.log("❌ Nenhum usuário, parando")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      console.log("📡 Fazendo requisição para Supabase...")
      
      const { data, error } = await supabase
        .from("calc_orcamento_itens")
        .select("*")
        .eq("user_id", user.id)

      console.log("📊 Resposta do Supabase:", { data: data?.length, error })

      if (error) {
        console.error("❌ Erro Supabase:", error)
        setError("Erro: " + error.message)
        setLoading(false)
        return
      }

      console.log("✅ Dados recebidos:", data?.length || 0, "itens")
      
      // Simplificar - apenas mostrar os itens sem agrupamento complexo
      const itensSimples = data || []
      
      // Criar um "orçamento" simples com todos os itens
      const receitas = itensSimples.filter((item: any) => item.tipo === "receita")
      const despesas = itensSimples.filter((item: any) => item.tipo === "despesa")
      
      const orcamentoSimples = {
        id: "geral",
        user_id: user.id,
        mes_referencia: "geral",
        nome: "Todos os Itens",
        descricao: "Todos os itens de receitas e despesas",
        receitas,
        despesas,
        total_receitas: (receitas || []).reduce((total: number, item: any) => {
          const valor = item?.valor ? Number(item.valor) : 0
          return total + (isNaN(valor) ? 0 : valor)
        }, 0),
        total_despesas: (despesas || []).reduce((total: number, item: any) => {
          const valor = item?.valor ? Number(item.valor) : 0
          return total + (isNaN(valor) ? 0 : valor)
        }, 0),
        saldo: 0,
        status: "ativo" as const,
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      orcamentoSimples.saldo = orcamentoSimples.total_receitas - orcamentoSimples.total_despesas
      
      console.log("✅ Orçamento criado:", orcamentoSimples)
      setOrcamentos([orcamentoSimples])
      
    } catch (error) {
      console.error("💥 ERRO GERAL:", error)
      setError("Erro: " + (error as Error).message)
    } finally {
      console.log("🏁 FINALIZANDO - setLoading(false)")
      setLoading(false)
    }
  }

  // Carregar dados quando o usuário estiver disponível
  useEffect(() => {
    console.log("🔄 useEffect executado - user:", !!user, "authLoading:", authLoading)
    
    if (user && !authLoading) {
      console.log("✅ Usuário logado, chamando fetchItens...")
      fetchItens()
    } else if (!user && !authLoading) {
      console.log("❌ Usuário não logado, limpando dados...")
      setOrcamentos([])
      setLoading(false)
    } else {
      console.log("⏳ Aguardando... user:", !!user, "authLoading:", authLoading)
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
          <Button onClick={() => fetchItens()}>
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
    console.log("🚀 INICIANDO handleAdicionarItem")
    console.log("👤 User:", user?.id)
    console.log("📝 Novo item:", novoItem)
    
    if (!user) {
      console.log("❌ Usuário não logado")
      toast.error("Favor entrar ou se cadastrar para usufruir do site")
      return
    }

    if (!novoItem.nome || novoItem.valor <= 0 || !novoItem.categoria) {
      console.log("❌ Campos obrigatórios não preenchidos")
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    try {
      console.log("✅ Validações passaram, iniciando processo...")
      // Buscar ou criar um orçamento padrão para o usuário
      let orcamentoId = null
      
      // Primeiro, tentar buscar um orçamento existente
      const { data: orcamentosExistentes, error: buscaError } = await supabase
        .from("calc_orcamentos")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "ativo")
        .limit(1)

      if (buscaError) {
        console.error("Erro ao buscar orçamentos:", buscaError)
      }

      // Determinar o mês baseado na data do item
      const dataItem = novoItem.data // Formato YYYY-MM-DD
      const mesItem = dataItem.slice(0, 7) // YYYY-MM
      
      // Buscar orçamento específico para o mês do item
      const { data: orcamentoMesItem } = await supabase
        .from("calc_orcamentos")
        .select("*")
        .eq("user_id", user.id)
        .eq("mes_referencia", `${mesItem}-01`)
        .single()

      if (orcamentoMesItem) {
        // Usar orçamento específico do mês se existir
        orcamentoId = orcamentoMesItem.id
      } else {
        // Criar um orçamento para o mês do item
        const { data: novoOrcamento, error: orcamentoError } = await supabase
          .from("calc_orcamentos")
          .insert({
            user_id: user.id,
            mes_referencia: `${mesItem}-01`,
            nome: `Orçamento ${mesItem}`,
            status: "ativo"
          })
          .select()
          .single()

        if (orcamentoError) {
          console.error("Erro ao criar orçamento:", orcamentoError)
          toast.error("Erro ao criar orçamento")
          return
        }
        
        orcamentoId = novoOrcamento.id
      }

      // Adicionar item na tabela de itens
      const { data: itemData, error: itemError } = await supabase
        .from("calc_orcamento_itens")
        .insert({
          orcamento_id: orcamentoId,
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
        console.error("Dados enviados:", {
          orcamento_id: orcamentoId,
          user_id: user.id,
          nome: novoItem.nome,
          valor: Number(novoItem.valor),
          categoria: novoItem.categoria,
          tipo: novoItem.tipo,
          data: novoItem.data,
          observacoes: novoItem.observacoes
        })
        toast.error("Erro ao adicionar item")
        return
      }

      // Recarregar dados
      await fetchItens()
      
      setNovoItem({
        nome: "",
        valor: 0,
        categoria: "",
        tipo: "despesa",
        data: new Date().toLocaleDateString('pt-CA'), // Formato YYYY-MM-DD sem timezone
        observacoes: ""
      })
      setMostrarFormulario(false)
      toast.success("Item adicionado com sucesso!")
      
      // Scroll para o topo da página
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
      await fetchItens()
      toast.success("Item removido com sucesso!")
    } catch (error) {
      console.error("Erro ao remover item:", error)
      toast.error("Erro ao remover item")
    }
  }


  const formatarMes = (data: string) => {
    // Verificar se data existe e tem formato válido
    if (!data || typeof data !== 'string') {
      return 'Data inválida'
    }
    
    // Se for "geral", retornar "Geral"
    if (data === 'geral') {
      return 'Geral'
    }
    
    // Dividir a data em partes para evitar problemas de timezone
    const partes = data.split('-')
    if (partes.length !== 3) {
      return 'Data inválida'
    }
    
    const [ano, mes, dia] = partes.map(Number)
    
    // Verificar se os números são válidos
    if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
      return 'Data inválida'
    }
    
    // Criar data local (mês é 0-indexado, então subtrair 1)
    const date = new Date(ano, mes - 1, dia)
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return `${mes.toString().padStart(2, '0')}/${ano.toString()}`
    }
    
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  const formatarMesAbreviado = (data: string) => {
    // Verificar se data existe e tem formato válido
    if (!data || typeof data !== 'string') {
      return 'Data inválida'
    }
    
    // Se for "geral", retornar "Geral"
    if (data === 'geral') {
      return 'Geral'
    }
    
    // Dividir a data em partes para evitar problemas de timezone
    const partes = data.split('-')
    if (partes.length !== 3) {
      return 'Data inválida'
    }
    
    const [ano, mes, dia] = partes.map(Number)
    
    // Verificar se os números são válidos
    if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
      return 'Data inválida'
    }
    
    // Criar data local (mês é 0-indexado, então subtrair 1)
    const date = new Date(ano, mes - 1, dia)
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return `${mes.toString().padStart(2, '0')}/${ano.toString().slice(-2)}`
    }
    
    return date.toLocaleDateString('pt-BR', { 
      year: '2-digit', 
      month: 'short' 
    })
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
    // Buscar todas as receitas de todos os orçamentos
    const todasReceitas = orcamentos.flatMap(o => o.receitas.map(item => ({ ...item, mes_referencia: o.mes_referencia })))
    
    return todasReceitas.filter(item => {
      // Filtro por mês baseado na data do item
      if (filtroMes) {
        const mesItem = item.data ? item.data.slice(0, 7) + '-01' : null
        if (mesItem !== filtroMes) return false
      }
      
      // Filtro por múltiplos meses
      if (filtroMeses.length > 0) {
        const mesItem = item.data ? item.data.slice(0, 7) + '-01' : null
        if (!mesItem || !filtroMeses.includes(mesItem)) return false
      }
      
      // Filtro por nome do item
      if (filtroItem && !item.nome.toLowerCase().includes(filtroItem.toLowerCase())) return false
      
      // Filtro por tipo
      if (tipoFiltro !== "todos" && item.tipo !== tipoFiltro) return false
      
      return true
    })
  })()

  // Despesas filtradas
  const despesasFiltradas = (() => {
    // Buscar todas as despesas de todos os orçamentos
    const todasDespesas = orcamentos.flatMap(o => o.despesas.map(item => ({ ...item, mes_referencia: o.mes_referencia })))
    
    return todasDespesas.filter(item => {
      // Filtro por mês baseado na data do item
      if (filtroMes) {
        const mesItem = item.data ? item.data.slice(0, 7) + '-01' : null
        if (mesItem !== filtroMes) return false
      }
      
      // Filtro por múltiplos meses
      if (filtroMeses.length > 0) {
        const mesItem = item.data ? item.data.slice(0, 7) + '-01' : null
        if (!mesItem || !filtroMeses.includes(mesItem)) return false
      }
      
      // Filtro por nome do item
      if (filtroItem && !item.nome.toLowerCase().includes(filtroItem.toLowerCase())) return false
      
      // Filtro por tipo
      if (tipoFiltro !== "todos" && item.tipo !== tipoFiltro) return false
      
      return true
    })
  })()

  // Debug logs removidos para melhor performance

  // Dados para o gráfico mensal - agrupar por mês e somar valores
  const dadosGrafico = (() => {
    if (filtroMes) {
      // Se há filtro de mês único, mostrar apenas os dados filtrados
      return [{
        mes: formatarMesAbreviado(filtroMes),
        receitas: receitasFiltradas.reduce((total, item) => total + (item?.valor || 0), 0),
        despesas: despesasFiltradas.reduce((total, item) => total + (item?.valor || 0), 0),
        saldo: 0
      }].map(item => ({
        ...item,
        saldo: item.receitas - item.despesas
      }))
    } else if (filtroMeses.length > 0) {
      // Se há filtro de múltiplos meses, mostrar apenas os meses selecionados
      return filtroMeses.map(mes => {
        const receitasMes = receitasFiltradas.filter(item => 
          item.data && item.data.slice(0, 7) + '-01' === mes
        ).reduce((total, item) => total + (item?.valor || 0), 0)
        
        const despesasMes = despesasFiltradas.filter(item => 
          item.data && item.data.slice(0, 7) + '-01' === mes
        ).reduce((total, item) => total + (item?.valor || 0), 0)
        
        return {
          mes: formatarMesAbreviado(mes),
          receitas: receitasMes,
          despesas: despesasMes,
          saldo: receitasMes - despesasMes
        }
      }).sort((a, b) => {
        const mesA = filtroMeses.find(m => formatarMesAbreviado(m) === a.mes) || ''
        const mesB = filtroMeses.find(m => formatarMesAbreviado(m) === b.mes) || ''
        return new Date(mesA).getTime() - new Date(mesB).getTime()
      })
    } else {
      // Se não há filtro, mostrar todos os meses baseado nos itens individuais
      const mesesUnicos = new Set<string>()
      
      // Coletar todos os meses dos itens
      orcamentos.forEach(orcamento => {
        if (orcamento.receitas) {
          orcamento.receitas.forEach((item: any) => {
            if (item.data) {
              const mesItem = item.data.slice(0, 7) + '-01'
              mesesUnicos.add(mesItem)
            }
          })
        }
        if (orcamento.despesas) {
          orcamento.despesas.forEach((item: any) => {
            if (item.data) {
              const mesItem = item.data.slice(0, 7) + '-01'
              mesesUnicos.add(mesItem)
            }
          })
        }
      })
      
      // Processar cada mês único
      const dados = Array.from(mesesUnicos).map(mes => {
        const receitasMes = orcamentos.flatMap(o => o.receitas || [])
          .filter(item => item.data && item.data.slice(0, 7) + '-01' === mes)
          .reduce((total, item) => total + (item?.valor || 0), 0)
        
        const despesasMes = orcamentos.flatMap(o => o.despesas || [])
          .filter(item => item.data && item.data.slice(0, 7) + '-01' === mes)
          .reduce((total, item) => total + (item?.valor || 0), 0)
        
        return {
          mes: formatarMesAbreviado(mes),
          receitas: receitasMes,
          despesas: despesasMes,
          saldo: receitasMes - despesasMes
        }
      })
      
      // Ordenar por data
      return dados.sort((a, b) => {
        const mesA = orcamentos.find(o => formatarMesAbreviado(o.mes_referencia) === a.mes)?.mes_referencia || ''
        const mesB = orcamentos.find(o => formatarMesAbreviado(o.mes_referencia) === b.mes)?.mes_referencia || ''
        return new Date(mesA).getTime() - new Date(mesB).getTime()
      })
    }
  })()

  // Converter para array e ordenar
  const dadosGraficoArray = dadosGrafico

  // Debug logs removidos para melhor performance

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // Calcular sobra mensal para projeção de investimento
  const totalReceitas = (receitasFiltradas || []).reduce((total, item) => {
    const valor = item?.valor ? Number(item.valor) : 0
    return total + (isNaN(valor) ? 0 : valor)
  }, 0)
  const totalDespesas = (despesasFiltradas || []).reduce((total, item) => {
    const valor = item?.valor ? Number(item.valor) : 0
    return total + (isNaN(valor) ? 0 : valor)
  }, 0)
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
            onChange={(e) => {
              setFiltroMes(e.target.value)
              setFiltroMeses([]) // Limpar filtro múltiplo
            }}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="">Todos os meses</option>
            {(() => {
              // Buscar meses únicos dos itens
              const mesesUnicos = new Set<string>()
              
              // Adicionar meses dos orçamentos existentes
              orcamentos.forEach(orcamento => {
                if (orcamento.mes_referencia && orcamento.mes_referencia !== 'geral') {
                  mesesUnicos.add(orcamento.mes_referencia)
                }
              })
              
              // Adicionar meses dos itens individuais
              orcamentos.forEach(orcamento => {
                if (orcamento.receitas) {
                  orcamento.receitas.forEach((item: any) => {
                    if (item.data) {
                      const mesItem = item.data.slice(0, 7) + '-01' // YYYY-MM-01
                      mesesUnicos.add(mesItem)
                    }
                  })
                }
                if (orcamento.despesas) {
                  orcamento.despesas.forEach((item: any) => {
                    if (item.data) {
                      const mesItem = item.data.slice(0, 7) + '-01' // YYYY-MM-01
                      mesesUnicos.add(mesItem)
                    }
                  })
                }
              })
              
              // Converter para array e ordenar
              const mesesArray = Array.from(mesesUnicos).sort((a, b) => {
                return new Date(a).getTime() - new Date(b).getTime()
              })
              
              return mesesArray.map(mes => (
                <option key={mes} value={mes}>
                  {formatarMes(mes)}
                </option>
              ))
            })()}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Múltiplos meses:</label>
          <div className="flex flex-wrap gap-2 max-w-md">
            {(() => {
              // Buscar meses únicos dos itens
              const mesesUnicos = new Set<string>()
              
              orcamentos.forEach(orcamento => {
                if (orcamento.receitas) {
                  orcamento.receitas.forEach((item: any) => {
                    if (item.data) {
                      const mesItem = item.data.slice(0, 7) + '-01'
                      mesesUnicos.add(mesItem)
                    }
                  })
                }
                if (orcamento.despesas) {
                  orcamento.despesas.forEach((item: any) => {
                    if (item.data) {
                      const mesItem = item.data.slice(0, 7) + '-01'
                      mesesUnicos.add(mesItem)
                    }
                  })
                }
              })
              
              const mesesArray = Array.from(mesesUnicos).sort((a, b) => {
                return new Date(a).getTime() - new Date(b).getTime()
              })
              
              return mesesArray.map(mes => (
                <label key={mes} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={filtroMeses.includes(mes)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFiltroMeses([...filtroMeses, mes])
                        setFiltroMes("") // Limpar filtro único
                      } else {
                        setFiltroMeses(filtroMeses.filter(m => m !== mes))
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-xs">{formatarMesAbreviado(mes)}</span>
                </label>
              ))
            })()}
          </div>
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

      {/* Botão para adicionar item - MOVIDO PARA O TOPO */}
      <div className="mb-6">
        <Button 
          className="w-full md:w-auto" 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {mostrarFormulario ? "Ocultar Formulário" : "Adicionar Item"}
        </Button>
      </div>

      {/* Formulário para adicionar item - MOVIDO PARA O TOPO */}
      {mostrarFormulario && (
        <Card className="mb-6">
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

      {receitasFiltradas.length === 0 && despesasFiltradas.length === 0 && filtroMes ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhum item encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não há itens para o mês selecionado. Adicione um item para começar.
            </p>
            <Button onClick={() => setMostrarFormulario(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-screen">
          {/* Resumo do Orçamento */}
          <div className="lg:col-span-4 xl:col-span-3">
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
                      {filtroMes ? formatarMes(filtroMes) : "Orçamento Geral"}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {filtroMes ? `Orçamento ${formatarMes(filtroMes)}` : "Orçamento Geral Acumulado"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Receitas</span>
                    <span className="font-semibold text-green-600">
                      {formatarMoeda((receitasFiltradas || []).reduce((total, item) => {
                        const valor = item?.valor ? Number(item.valor) : 0
                        return total + (isNaN(valor) ? 0 : valor)
                      }, 0))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600">Despesas</span>
                    <span className="font-semibold text-red-600">
                      {formatarMoeda((despesasFiltradas || []).reduce((total, item) => {
                        const valor = item?.valor ? Number(item.valor) : 0
                        return total + (isNaN(valor) ? 0 : valor)
                      }, 0))}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Saldo</span>
                      <span className={`font-bold text-lg ${
                        ((receitasFiltradas || []).reduce((total, item) => {
                          const valor = item?.valor ? Number(item.valor) : 0
                          return total + (isNaN(valor) ? 0 : valor)
                        }, 0) - (despesasFiltradas || []).reduce((total, item) => {
                          const valor = item?.valor ? Number(item.valor) : 0
                          return total + (isNaN(valor) ? 0 : valor)
                        }, 0)) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatarMoeda((receitasFiltradas || []).reduce((total, item) => {
                          const valor = item?.valor ? Number(item.valor) : 0
                          return total + (isNaN(valor) ? 0 : valor)
                        }, 0) - (despesasFiltradas || []).reduce((total, item) => {
                          const valor = item?.valor ? Number(item.valor) : 0
                          return total + (isNaN(valor) ? 0 : valor)
                        }, 0))}
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

          </div>

          {/* Lista de Itens */}
          <div className="lg:col-span-8 xl:col-span-9">
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
                                    {item.data && (() => {
                                      const [ano, mes, dia] = item.data.split('-').map(Number)
                                      return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR')
                                    })()}
                                  </span>
                                  {!filtroMes && (() => {
                                    const orcamento = orcamentos.find(o => o.id === item.orcamento_id)
                                    
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
                                    {item.data && (() => {
                                      const [ano, mes, dia] = item.data.split('-').map(Number)
                                      return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR')
                                    })()}
                                  </span>
                                  {!filtroMes && (() => {
                                    const orcamento = orcamentos.find(o => o.id === item.orcamento_id)
                                    
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



      </div>
    </div>
  )
}
