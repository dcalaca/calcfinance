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
  Lightbulb
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useFinanceAuth } from "@/hooks/use-finance-auth"
import { useRouter } from "next/navigation"

interface Transaction {
  id: string
  type: 'receita' | 'despesa'
  category: string
  description: string
  amount: number
  date: Date
  createdAt: Date
}

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
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  
  // Estados do formulário
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'receita' as 'receita' | 'despesa',
    category: '',
    description: '',
    amount: '',
    date: new Date()
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

  // Carregar transações do localStorage
  useEffect(() => {
    if (user) {
      const savedTransactions = localStorage.getItem(`cpf_transactions_${user.id}`)
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt)
        }))
        setTransactions(parsed)
      }
    }
  }, [user])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: formData.type,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      createdAt: new Date()
    }

    const updatedTransactions = [...transactions, newTransaction]
    setTransactions(updatedTransactions)
    
    if (user) {
      localStorage.setItem(`cpf_transactions_${user.id}`, JSON.stringify(updatedTransactions))
    }

    // Reset form
    setFormData({
      type: 'receita',
      category: '',
      description: '',
      amount: '',
      date: new Date()
    })
    setShowForm(false)
  }

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id)
    setTransactions(updatedTransactions)
    
    if (user) {
      localStorage.setItem(`cpf_transactions_${user.id}`, JSON.stringify(updatedTransactions))
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-semibold ${transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'receita' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTransaction(transaction.id)}
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
