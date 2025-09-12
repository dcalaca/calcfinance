"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Calendar as CalendarIcon, 
  Filter,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle,
  PiggyBank,
  Lightbulb,
  Loader2
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useFinanceAuth } from "@/hooks/use-finance-auth"
import { useCFPTransactions, type CFPTransaction } from "@/hooks/use-cfp-transactions"
import { useRouter } from "next/navigation"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts"

interface FilterOptions {
  dateFrom: Date | null
  dateTo: Date | null
  type: 'all' | 'receita' | 'despesa'
  category: string
}

const RECEITA_CATEGORIES = [
  'Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros'
]

const DESPESA_CATEGORIES = [
  'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Outros'
]

export default function CPFPage() {
  const { user, loading: authLoading } = useFinanceAuth()
  const { transactions, loading, error, addTransaction, deleteTransaction } = useCFPTransactions()
  const router = useRouter()
  const [filteredTransactions, setFilteredTransactions] = useState<CFPTransaction[]>([])
  
  // Estados do formulário
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'receita' as 'receita' | 'despesa',
    category: '',
    description: '',
    amount: '',
    date: new Date(),
    observations: ''
  })
  
  // Estados dos filtros
  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: null,
    dateTo: null,
    type: 'all',
    category: 'all'
  })

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...transactions]

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type)
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(t => t.date >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => t.date <= filters.dateTo!)
    }

    setFilteredTransactions(filtered)
  }, [transactions, filters])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    try {
      await addTransaction({
        type: formData.type,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        observations: formData.observations
      })

      // Reset form
      setFormData({
        type: 'receita',
        category: '',
        description: '',
        amount: '',
        date: new Date(),
        observations: ''
      })
      setShowForm(false)
    } catch (error) {
      console.error('Erro ao adicionar transação:', error)
      alert('Erro ao adicionar transação. Tente novamente.')
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction(id)
      } catch (error) {
        console.error('Erro ao deletar transação:', error)
        alert('Erro ao deletar transação. Tente novamente.')
      }
    }
  }

  // Cálculos
  const totalReceitas = filteredTransactions
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDespesas = filteredTransactions
    .filter(t => t.type === 'despesa')
    .reduce((sum, t) => sum + t.amount, 0)

  const saldo = totalReceitas - totalDespesas

  // Categorias disponíveis baseadas no tipo
  const availableCategories = formData.type === 'receita' ? RECEITA_CATEGORIES : DESPESA_CATEGORIES

  // Preparar dados para gráficos
  const prepareChartData = () => {
    // Agrupar por mês
    const monthlyData = filteredTransactions.reduce((acc, transaction) => {
      const month = format(transaction.date, 'MMM/yyyy', { locale: ptBR })
      if (!acc[month]) {
        acc[month] = { month, receitas: 0, despesas: 0, saldo: 0 }
      }
      if (transaction.type === 'receita') {
        acc[month].receitas += transaction.amount
      } else {
        acc[month].despesas += transaction.amount
      }
      acc[month].saldo = acc[month].receitas - acc[month].despesas
      return acc
    }, {} as Record<string, any>)

    return Object.values(monthlyData).sort((a, b) => {
      const dateA = new Date(a.month.split('/')[1], a.month.split('/')[0] - 1)
      const dateB = new Date(b.month.split('/')[1], b.month.split('/')[0] - 1)
      return dateA.getTime() - dateB.getTime()
    })
  }

  const prepareCategoryData = () => {
    const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = { name: transaction.category, receitas: 0, despesas: 0 }
      }
      if (transaction.type === 'receita') {
        acc[transaction.category].receitas += transaction.amount
      } else {
        acc[transaction.category].despesas += transaction.amount
      }
      return acc
    }, {} as Record<string, any>)

    return Object.values(categoryTotals)
  }

  const preparePieData = () => {
    const receitas = filteredTransactions
      .filter(t => t.type === 'receita')
      .reduce((acc, t) => {
        if (!acc[t.category]) acc[t.category] = 0
        acc[t.category] += t.amount
        return acc
      }, {} as Record<string, number>)

    const despesas = filteredTransactions
      .filter(t => t.type === 'despesa')
      .reduce((acc, t) => {
        if (!acc[t.category]) acc[t.category] = 0
        acc[t.category] += t.amount
        return acc
      }, {} as Record<string, number>)

    return {
      receitas: Object.entries(receitas).map(([name, value]) => ({ name, value })),
      despesas: Object.entries(despesas).map(([name, value]) => ({ name, value }))
    }
  }

  const chartData = prepareChartData()
  const categoryData = prepareCategoryData()
  const pieData = preparePieData()

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              CFP - Controle Financeiro Pessoal
            </h1>
            <p className="text-slate-600">
              Gerencie suas receitas e despesas com gráficos e análises detalhadas
            </p>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateFrom ? format(filters.dateFrom, 'dd/MM/yyyy') : 'Selecionar'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateFrom || undefined}
                        onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date || null }))}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateTo ? format(filters.dateTo, 'dd/MM/yyyy') : 'Selecionar'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateTo || undefined}
                        onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date || null }))}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Tipo</Label>
                  <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="receita">Receitas</SelectItem>
                      <SelectItem value="despesa">Despesas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Categoria</Label>
                  <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {[...RECEITA_CATEGORIES, ...DESPESA_CATEGORIES].map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráficos */}
          {filteredTransactions.length > 0 && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Análise Visual
                  </CardTitle>
                  <CardDescription>
                    Gráficos interativos baseados nos seus dados filtrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="timeline" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
                      <TabsTrigger value="categories">Categorias</TabsTrigger>
                      <TabsTrigger value="distribution">Distribuição</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="timeline" className="mt-6">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value, name) => [
                                `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                                name === 'receitas' ? 'Receitas' : name === 'despesas' ? 'Despesas' : 'Saldo'
                              ]}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="receitas" 
                              stackId="1" 
                              stroke="#10b981" 
                              fill="#10b981" 
                              fillOpacity={0.6}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="despesas" 
                              stackId="2" 
                              stroke="#ef4444" 
                              fill="#ef4444" 
                              fillOpacity={0.6}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="categories" className="mt-6">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value, name) => [
                                `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                                name === 'receitas' ? 'Receitas' : 'Despesas'
                              ]}
                            />
                            <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
                            <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="distribution" className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold mb-4 text-green-600">Receitas por Categoria</h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={pieData.receitas}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {pieData.receitas.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value) => [
                                    `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                                    'Valor'
                                  ]}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold mb-4 text-red-600">Despesas por Categoria</h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={pieData.despesas}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {pieData.despesas.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value) => [
                                    `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                                    'Valor'
                                  ]}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Botão Adicionar */}
          <div className="mb-8">
            <Button onClick={() => setShowForm(!showForm)} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar {formData.type === 'receita' ? 'Receita' : 'Despesa'}
            </Button>
          </div>

          {/* Formulário */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Adicionar Transação</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any, category: '' }))}>
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
                      <Label>Categoria</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Ex: Salário, Aluguel, etc."
                      />
                    </div>

                    <div>
                      <Label>Valor (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="0,00"
                      />
                    </div>

                    <div>
                      <Label>Data</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(formData.date, 'dd/MM/yyyy')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="md:col-span-2">
                      <Label>Observações (opcional)</Label>
                      <Input
                        value={formData.observations}
                        onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                        placeholder="Observações adicionais..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Adicionar</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Resultado e Orientações */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Resultado e Orientações
              </CardTitle>
            </CardHeader>
            <CardContent>
              {saldo > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">Parabéns! Você está no azul!</h3>
                      <p className="text-green-700">
                        Seu saldo positivo de R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} indica uma boa gestão financeira.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <PiggyBank className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-800">Invista o Excedente</h4>
                      </div>
                      <p className="text-blue-700 text-sm">
                        Considere investir parte do valor em aplicações de renda fixa ou variável para fazer seu dinheiro trabalhar por você.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-800">Reserva de Emergência</h4>
                      </div>
                      <p className="text-purple-700 text-sm">
                        Mantenha uma reserva de emergência equivalente a 6 meses de despesas para imprevistos.
                      </p>
                    </div>
                  </div>
                </div>
              ) : saldo < 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-red-800">Atenção! Você está no vermelho</h3>
                      <p className="text-red-700">
                        Seu saldo negativo de R$ {Math.abs(saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} indica que você está gastando mais do que ganha.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-5 h-5 text-orange-600" />
                        <h4 className="font-semibold text-orange-800">Reduza Gastos</h4>
                      </div>
                      <p className="text-orange-700 text-sm">
                        Analise suas despesas e identifique categorias onde pode economizar. Priorize gastos essenciais.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-semibold text-yellow-800">Aumente Receitas</h4>
                      </div>
                      <p className="text-yellow-700 text-sm">
                        Considere formas de aumentar sua renda: freelances, vendas, ou desenvolvimento de novas habilidades.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Equilíbrio Financeiro</h3>
                    <p className="text-gray-700">
                      Suas receitas e despesas estão equilibradas. Continue monitorando para manter esse controle.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Transações */}
          <Card>
            <CardHeader>
              <CardTitle>Transações ({filteredTransactions.length})</CardTitle>
              <CardDescription>
                {filteredTransactions.length === 0 ? 'Nenhuma transação encontrada' : 'Suas transações filtradas'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Nenhuma transação encontrada</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Adicione sua primeira transação usando o botão acima
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Badge variant={transaction.type === 'receita' ? 'default' : 'destructive'}>
                          {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{transaction.description}</h4>
                          <p className="text-sm text-slate-600">
                            {transaction.category} • {format(transaction.date, 'dd/MM/yyyy')}
                          </p>
                          {transaction.observations && (
                            <p className="text-xs text-slate-500 mt-1">
                              {transaction.observations}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-semibold ${transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'receita' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
