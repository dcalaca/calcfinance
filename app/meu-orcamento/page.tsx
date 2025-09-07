"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrcamentos } from "@/hooks/use-orcamentos"
import { useFinanceAuth } from "@/hooks/use-finance-auth"
import { useRouter } from "next/navigation"
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
  BarChart3
} from "lucide-react"
import { toast } from "sonner"
import { CurrencyInput } from "@/components/ui/currency-input"

export default function MeuOrcamentoPage() {
  const { user, loading: authLoading } = useFinanceAuth()
  const router = useRouter()
  const {
    orcamentos,
    orcamentoAtual,
    loading,
    criarOrcamento,
    adicionarItem,
    removerItem,
    toggleFavorite
  } = useOrcamentos()

  const [novoItem, setNovoItem] = useState({
    nome: "",
    valor: 0,
    categoria: "",
    tipo: "despesa" as "receita" | "despesa",
    data: new Date().toISOString().split('T')[0],
    observacoes: ""
  })

  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando seus orçamentos...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const categoriasDespesas = [
    "Alimentação", "Moradia", "Transporte", "Saúde", "Educação", 
    "Lazer", "Vestuário", "Contas", "Investimentos", "Outros"
  ]

  const categoriasReceitas = [
    "Salário", "Freelance", "Investimentos", "Aluguel", "Vendas", "Outros"
  ]

  const handleAdicionarItem = async () => {
    if (!orcamentoAtual) {
      toast.error("Nenhum orçamento selecionado")
      return
    }

    if (!novoItem.nome || novoItem.valor <= 0 || !novoItem.categoria) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    try {
      const item = {
        id: Date.now().toString(),
        ...novoItem,
        valor: Number(novoItem.valor)
      }

      await adicionarItem(orcamentoAtual.id, item)
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
      toast.error("Erro ao adicionar item")
    }
  }

  const handleRemoverItem = async (itemId: string, tipo: "receita" | "despesa") => {
    if (!orcamentoAtual) return

    try {
      await removerItem(orcamentoAtual.id, itemId, tipo)
      toast.success("Item removido com sucesso!")
    } catch (error) {
      toast.error("Erro ao remover item")
    }
  }

  const formatarMes = (data: string) => {
    const date = new Date(data)
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meu Orçamento</h1>
        <p className="text-muted-foreground">
          Controle sua vida financeira de forma simples e eficiente
        </p>
      </div>

      {!orcamentoAtual ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhum orçamento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro orçamento para começar a controlar suas finanças
            </p>
            <Button onClick={() => router.push('/calculadoras/orcamento')}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Orçamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumo do Orçamento */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {formatarMes(orcamentoAtual.mes_referencia)}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(orcamentoAtual.id)}
                  >
                    <Star className={`w-4 h-4 ${orcamentoAtual.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                </div>
                <CardDescription>{orcamentoAtual.nome}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Receitas</span>
                  <span className="font-semibold text-green-600">
                    {formatarMoeda(orcamentoAtual.total_receitas)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600">Despesas</span>
                  <span className="font-semibold text-red-600">
                    {formatarMoeda(orcamentoAtual.total_despesas)}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Saldo</span>
                    <span className={`font-bold text-lg ${
                      orcamentoAtual.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatarMoeda(orcamentoAtual.saldo)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botão para adicionar item */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <Button 
                  className="w-full" 
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Itens */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="receitas" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="receitas" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Receitas ({orcamentoAtual.receitas.length})
                </TabsTrigger>
                <TabsTrigger value="despesas" className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Despesas ({orcamentoAtual.despesas.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="receitas" className="space-y-4">
                {orcamentoAtual.receitas.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Nenhuma receita adicionada</p>
                    </CardContent>
                  </Card>
                ) : (
                  orcamentoAtual.receitas.map((item) => (
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
                  ))
                )}
              </TabsContent>

              <TabsContent value="despesas" className="space-y-4">
                {orcamentoAtual.despesas.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <TrendingDown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Nenhuma despesa adicionada</p>
                    </CardContent>
                  </Card>
                ) : (
                  orcamentoAtual.despesas.map((item) => (
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
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Formulário para adicionar item */}
      {mostrarFormulario && orcamentoAtual && (
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
    </div>
  )
}
