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

  // Filtrar receitas e despesas
  const receitasFiltradas = orcamentos
    .flatMap(orcamento => orcamento.receitas || [])
    .filter(item => {
      const passaFiltroMes = !filtroMes || item.data?.startsWith(filtroMes.slice(0, 7))
      const passaFiltroTipo = tipoFiltro === 'todos' || tipoFiltro === 'receita'
      const passaFiltroItem = !filtroItem || item.nome?.toLowerCase().includes(filtroItem.toLowerCase())
      return passaFiltroMes && passaFiltroTipo && passaFiltroItem
    })

  const despesasFiltradas = orcamentos
    .flatMap(orcamento => orcamento.despesas || [])
    .filter(item => {
      const passaFiltroMes = !filtroMes || item.data?.startsWith(filtroMes.slice(0, 7))
      const passaFiltroTipo = tipoFiltro === 'todos' || tipoFiltro === 'despesa'
      const passaFiltroItem = !filtroItem || item.nome?.toLowerCase().includes(filtroItem.toLowerCase())
      return passaFiltroMes && passaFiltroTipo && passaFiltroItem
    })

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
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

  const handleAdicionarItem = async () => {
    if (!novoItem.nome || !novoItem.valor || !novoItem.categoria || !novoItem.tipo) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      // Garantir que a data esteja no formato correto (yyyy-mm-dd)
      let dataFormatada = novoItem.data || new Date().toISOString().split('T')[0]
      
      // Se a data estiver no formato brasileiro (dd/mm/yyyy), converter para ISO
      if (dataFormatada.includes('/')) {
        const [dia, mes, ano] = dataFormatada.split('/')
        dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
      }

      const { data, error } = await supabase
        .from('calc_orcamento_itens')
        .insert([{
          nome: novoItem.nome,
          valor: novoItem.valor,
          categoria: novoItem.categoria,
          tipo: novoItem.tipo,
          data: dataFormatada,
          observacoes: novoItem.observacoes || '',
          user_id: user?.id
        }])
        .select()

      if (error) throw error

      // Atualizar estado local
      setOrcamentos(prev => {
        const updated = [...prev]
        const orcamentoIndex = updated.findIndex(o => o.mes_referencia === (filtroMes || 'geral'))
        
        if (orcamentoIndex >= 0) {
          const orcamento = updated[orcamentoIndex]
          if (novoItem.tipo === 'receita') {
            orcamento.receitas = [...(orcamento.receitas || []), data[0]]
          } else {
            orcamento.despesas = [...(orcamento.despesas || []), data[0]]
          }
        } else {
          // Criar novo orçamento se não existir
          const receitas = novoItem.tipo === 'receita' ? [data[0]] : []
          const despesas = novoItem.tipo === 'despesa' ? [data[0]] : []
          const totalReceitas = receitas.reduce((sum, item) => sum + (item.valor || 0), 0)
          const totalDespesas = despesas.reduce((sum, item) => sum + (item.valor || 0), 0)
          
          const novoOrcamento: OrcamentoComItens = {
            id: Date.now().toString(),
            nome: `Orçamento ${filtroMes || 'Geral'}`,
            mes_referencia: filtroMes || 'geral',
            receitas,
            despesas,
            total_receitas: totalReceitas,
            total_despesas: totalDespesas,
            saldo: totalReceitas - totalDespesas,
            user_id: user?.id || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'ativo',
            is_favorite: false
          }
          updated.push(novoOrcamento)
        }
        
        return updated
      })

      // Limpar formulário
      setNovoItem({
        nome: '',
        valor: 0,
        categoria: '',
        tipo: 'receita',
        data: new Date().toISOString().split('T')[0],
        observacoes: ''
      })
      
      setMostrarFormulario(false)
      
    } catch (error) {
      console.error('Erro ao adicionar item:', error)
      alert('Erro ao adicionar item. Tente novamente.')
    }
  }

  const handleRemoverItem = async (itemId: string, tipo: 'receita' | 'despesa') => {
    if (!confirm('Tem certeza que deseja remover este item?')) return

    try {
      const { error } = await supabase
        .from('calc_orcamento_itens')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      // Atualizar estado local
      setOrcamentos(prev => {
        return prev.map(orcamento => {
          if (tipo === 'receita') {
            orcamento.receitas = (orcamento.receitas || []).filter(item => item.id !== itemId)
          } else {
            orcamento.despesas = (orcamento.despesas || []).filter(item => item.id !== itemId)
          }
          return orcamento
        })
      })
      
    } catch (error) {
      console.error('Erro ao remover item:', error)
      alert('Erro ao remover item. Tente novamente.')
    }
  }

  return (
    <div className="w-full max-w-none py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meu Orçamento</h1>
          <p className="text-muted-foreground">
            Controle sua vida financeira de forma simples e eficiente
          </p>
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
                
                return Array.from(mesesUnicos).sort().map(mes => (
                  <option key={mes} value={mes}>
                    {formatarMesAbreviado(mes)}
                  </option>
                ))
              })()}
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
            <label className="text-sm font-medium">Buscar:</label>
            <Input
              type="text"
              placeholder="Nome do item..."
              value={filtroItem}
              onChange={(e) => setFiltroItem(e.target.value)}
              className="w-48"
            />
          </div>
        </div>

        {/* Botão Adicionar Item */}
        <div className="flex justify-start mb-6">
          <Button 
            className="w-full md:w-auto" 
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {mostrarFormulario ? "Ocultar Formulário" : "Adicionar Item"}
          </Button>
        </div>

        {/* Formulário para adicionar item */}
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
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select 
                    value={novoItem.tipo} 
                    onValueChange={(value: "receita" | "despesa") => setNovoItem({ ...novoItem, tipo: value, categoria: '' })}
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
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select 
                    value={novoItem.categoria} 
                    onValueChange={(value) => setNovoItem({ ...novoItem, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {novoItem.tipo === 'receita' ? (
                        <>
                          <SelectItem value="Salário">Salário</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                          <SelectItem value="Investimentos">Investimentos</SelectItem>
                          <SelectItem value="Vendas">Vendas</SelectItem>
                          <SelectItem value="Bônus">Bônus</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Alimentação">Alimentação</SelectItem>
                          <SelectItem value="Transporte">Transporte</SelectItem>
                          <SelectItem value="Moradia">Moradia</SelectItem>
                          <SelectItem value="Saúde">Saúde</SelectItem>
                          <SelectItem value="Educação">Educação</SelectItem>
                          <SelectItem value="Lazer">Lazer</SelectItem>
                          <SelectItem value="Roupas">Roupas</SelectItem>
                          <SelectItem value="Contas">Contas</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={novoItem.nome}
                    onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                    placeholder="Ex: Salário, Aluguel, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    type="text"
                    value={novoItem.valor ? formatarMoeda(novoItem.valor) : ''}
                    onChange={(e) => {
                      const valor = e.target.value.replace(/[^\d,]/g, '').replace(',', '.')
                      setNovoItem({ ...novoItem, valor: valor ? Number(valor) : 0 })
                    }}
                    placeholder="R$ 0,00"
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
                <Button onClick={handleAdicionarItem} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
                <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Receitas e Despesas */}
        <div className="space-y-6">
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
    </div>
  )
}