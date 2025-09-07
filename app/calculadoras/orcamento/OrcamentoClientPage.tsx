"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { useFinanceCalculations } from "@/hooks/use-finance-calculations"
import { DollarSign, Plus, Trash2, PieChartIcon, BarChart3, Save } from "lucide-react"
import { toast } from "sonner"
import { useFinanceAuth } from "@/hooks/use-finance-auth"

interface ItemOrcamento {
  id: string
  nome: string
  valor: number
  categoria: string
  tipo: "receita" | "despesa"
}

export default function OrcamentoClientPage() {
  const [itens, setItens] = useState<ItemOrcamento[]>([])
  const [novoItem, setNovoItem] = useState({
    nome: "",
    valor: 0,
    categoria: "",
    tipo: "despesa" as "receita" | "despesa",
  })
  const [resultado, setResultado] = useState<any>(null)

  const { saveCalculation, calculations } = useFinanceCalculations()
  const { user } = useFinanceAuth()

  // Carregar orçamento salvo quando a página carrega
  useEffect(() => {
    if (user && calculations.length > 0) {
      // Buscar o orçamento mais recente
      const orcamentoRecente = calculations
        .filter(calc => calc.type === "orcamento")
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

      if (orcamentoRecente && orcamentoRecente.input_data?.itens) {
        console.log("📋 Carregando orçamento salvo:", orcamentoRecente.input_data.itens)
        setItens(orcamentoRecente.input_data.itens)
        
        // Calcular resultado automaticamente
        const receitas = orcamentoRecente.input_data.itens.filter((item: any) => item.tipo === "receita")
        const despesas = orcamentoRecente.input_data.itens.filter((item: any) => item.tipo === "despesa")
        const totalReceitas = receitas.reduce((acc: number, item: any) => acc + item.valor, 0)
        const totalDespesas = despesas.reduce((acc: number, item: any) => acc + item.valor, 0)
        const saldo = totalReceitas - totalDespesas

        setResultado({
          totalReceitas,
          totalDespesas,
          saldo,
          receitas,
          despesas
        })
      }
    }
  }, [user, calculations])

  const categoriasDespesas = [
    "Alimentação",
    "Moradia",
    "Transporte",
    "Saúde",
    "Educação",
    "Lazer",
    "Vestuário",
    "Outros",
  ]

  const categoriasReceitas = ["Salário", "Freelance", "Investimentos", "Aluguel", "Outros"]

  const adicionarItem = async () => {
    if (!novoItem.nome || novoItem.valor <= 0 || !novoItem.categoria) {
      toast.error("Preencha todos os campos corretamente")
      return
    }

    const item: ItemOrcamento = {
      id: Date.now().toString(),
      nome: novoItem.nome,
      valor: novoItem.valor,
      categoria: novoItem.categoria,
      tipo: novoItem.tipo,
    }

    const novosItens = [...itens, item]
    setItens(novosItens)
    setNovoItem({ nome: "", valor: 0, categoria: "", tipo: "despesa" })
    toast.success("Item adicionado com sucesso!")

    // Salvar automaticamente se o usuário estiver logado
    if (user) {
      try {
        // Calcular resultado temporário para salvar
        const receitas = novosItens.filter(item => item.tipo === "receita")
        const despesas = novosItens.filter(item => item.tipo === "despesa")
        const totalReceitas = receitas.reduce((acc, item) => acc + item.valor, 0)
        const totalDespesas = despesas.reduce((acc, item) => acc + item.valor, 0)
        const saldo = totalReceitas - totalDespesas

        const resultadoTemp = {
          totalReceitas,
          totalDespesas,
          saldo,
          receitas,
          despesas
        }

        await saveCalculation(
          "orcamento",
          `Orçamento - ${new Date().toLocaleDateString("pt-BR")}`,
          { itens: novosItens },
          resultadoTemp
        )
        console.log("✅ Orçamento salvo automaticamente")
      } catch (error) {
        console.error("❌ Erro ao salvar orçamento automaticamente:", error)
      }
    }
  }

  const removerItem = async (id: string) => {
    const novosItens = itens.filter((item) => item.id !== id)
    setItens(novosItens)
    toast.success("Item removido com sucesso!")

    // Salvar automaticamente se o usuário estiver logado
    if (user && novosItens.length > 0) {
      try {
        // Calcular resultado temporário para salvar
        const receitas = novosItens.filter(item => item.tipo === "receita")
        const despesas = novosItens.filter(item => item.tipo === "despesa")
        const totalReceitas = receitas.reduce((acc, item) => acc + item.valor, 0)
        const totalDespesas = despesas.reduce((acc, item) => acc + item.valor, 0)
        const saldo = totalReceitas - totalDespesas

        const resultadoTemp = {
          totalReceitas,
          totalDespesas,
          saldo,
          receitas,
          despesas
        }

        await saveCalculation(
          "orcamento",
          `Orçamento - ${new Date().toLocaleDateString("pt-BR")}`,
          { itens: novosItens },
          resultadoTemp
        )
        console.log("✅ Orçamento atualizado automaticamente")
      } catch (error) {
        console.error("❌ Erro ao atualizar orçamento automaticamente:", error)
      }
    }
  }

  const calcularOrcamento = () => {
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item ao orçamento")
      return
    }

    const receitas = itens.filter((item) => item.tipo === "receita")
    const despesas = itens.filter((item) => item.tipo === "despesa")

    const totalReceitas = receitas.reduce((sum, item) => sum + item.valor, 0)
    const totalDespesas = despesas.reduce((sum, item) => sum + item.valor, 0)
    const saldo = totalReceitas - totalDespesas

    // Agrupar por categoria
    const despesasPorCategoria = despesas.reduce(
      (acc, item) => {
        acc[item.categoria] = (acc[item.categoria] || 0) + item.valor
        return acc
      },
      {} as Record<string, number>,
    )

    const receitasPorCategoria = receitas.reduce(
      (acc, item) => {
        acc[item.categoria] = (acc[item.categoria] || 0) + item.valor
        return acc
      },
      {} as Record<string, number>,
    )

    // Dados para gráficos
    const dadosPizza = Object.entries(despesasPorCategoria).map(([categoria, valor]) => ({
      name: categoria,
      value: valor,
      percentage: ((valor / totalDespesas) * 100).toFixed(1),
    }))

    const dadosBarras = [
      { categoria: "Receitas", valor: totalReceitas, cor: "#10b981" },
      { categoria: "Despesas", valor: totalDespesas, cor: "#ef4444" },
      { categoria: "Saldo", valor: saldo, cor: saldo >= 0 ? "#10b981" : "#ef4444" },
    ]

    const resultadoCalculo = {
      totalReceitas,
      totalDespesas,
      saldo,
      despesasPorCategoria,
      receitasPorCategoria,
      dadosPizza,
      dadosBarras,
      itens: itens.length,
    }

    setResultado(resultadoCalculo)
    toast.success("Orçamento calculado com sucesso!")
  }

  const salvarOrcamento = async () => {
    if (!user) {
      toast.error("Faça login para salvar seu orçamento")
      return
    }

    if (!resultado) {
      toast.error("Calcule o orçamento primeiro")
      return
    }

    try {
      await saveCalculation(
        "orcamento",
        `Orçamento - ${new Date().toLocaleDateString("pt-BR")}`,
        { itens },
        resultado
      )
      toast.success("Orçamento salvo com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar orçamento")
    }
  }

  const cores = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Calculadora de Orçamento Mensal</h1>
        <p className="text-muted-foreground">
          Organize suas finanças mensais e acompanhe receitas e despesas com gráficos detalhados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Adicionar Item
            </CardTitle>
            <CardDescription>Adicione receitas e despesas ao seu orçamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo</Label>
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
                <Label>Categoria</Label>
                <Select
                  value={novoItem.categoria}
                  onValueChange={(value) => setNovoItem({ ...novoItem, categoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {(novoItem.tipo === "receita" ? categoriasReceitas : categoriasDespesas).map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="nome">Nome/Descrição</Label>
              <Input
                id="nome"
                value={novoItem.nome}
                onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                placeholder="Ex: Salário, Aluguel, Supermercado..."
              />
            </div>

            <div>
              <Label htmlFor="valor">Valor</Label>
              <CurrencyInput
                id="valor"
                value={novoItem.valor}
                onChange={(value) => setNovoItem({ ...novoItem, valor: value })}
                placeholder="R$ 0,00"
              />
            </div>

            <Button onClick={adicionarItem} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Itens */}
        <Card>
          <CardHeader>
            <CardTitle>Itens do Orçamento ({itens.length})</CardTitle>
            <CardDescription>Lista de receitas e despesas adicionadas</CardDescription>
          </CardHeader>
          <CardContent>
            {itens.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum item adicionado ainda</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {itens.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      item.tipo === "receita" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.categoria} • {item.tipo}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${item.tipo === "receita" ? "text-green-600" : "text-red-600"}`}>
                        {item.tipo === "receita" ? "+" : "-"}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.valor)}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removerItem(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {itens.length > 0 && (
              <div className="mt-4 space-y-2">
                <Button onClick={calcularOrcamento} className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Calcular Orçamento
                </Button>
                {user && resultado && (
                  <Button onClick={salvarOrcamento} variant="outline" className="w-full bg-transparent">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Orçamento
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="mt-8 space-y-8">
          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Total de Receitas</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(resultado.totalReceitas)}
                  </p>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Total de Despesas</h3>
                  <p className="text-3xl font-bold text-red-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(resultado.totalDespesas)}
                  </p>
                </div>
                <div className={`text-center p-6 rounded-lg ${resultado.saldo >= 0 ? "bg-blue-50" : "bg-orange-50"}`}>
                  <h3
                    className={`text-lg font-semibold mb-2 ${resultado.saldo >= 0 ? "text-blue-800" : "text-orange-800"}`}
                  >
                    Saldo {resultado.saldo >= 0 ? "Positivo" : "Negativo"}
                  </h3>
                  <p className={`text-3xl font-bold ${resultado.saldo >= 0 ? "text-blue-600" : "text-orange-600"}`}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Math.abs(resultado.saldo))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gráfico de Pizza - Despesas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Despesas por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resultado.dadosPizza.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={resultado.dadosPizza}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                        >
                          {resultado.dadosPizza.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(value),
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhuma despesa cadastrada</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico de Barras - Comparativo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Comparativo Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resultado.dadosBarras}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="categoria" />
                      <YAxis
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            notation: "compact",
                          }).format(value)
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(value),
                        ]}
                      />
                      <Bar dataKey="valor" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análise */}
          <Card>
            <CardHeader>
              <CardTitle>Análise do Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resultado.saldo >= 0 ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Orçamento Equilibrado</h4>
                    <p className="text-green-700">
                      Parabéns! Suas receitas são maiores que suas despesas. Você tem um saldo positivo de{" "}
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(resultado.saldo)}.
                      Continue assim e considere investir esse valor excedente.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Orçamento Desequilibrado</h4>
                    <p className="text-red-700">
                      Atenção! Suas despesas são maiores que suas receitas. Você tem um déficit de{" "}
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        Math.abs(resultado.saldo),
                      )}
                      . Revise seus gastos e considere reduzir despesas ou aumentar receitas.
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Dicas para Economizar</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Revise gastos com alimentação e lazer</li>
                      <li>• Compare preços antes de comprar</li>
                      <li>• Evite compras por impulso</li>
                      <li>• Negocie contas fixas (internet, telefone)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Próximos Passos</h4>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• Crie uma reserva de emergência</li>
                      <li>• Invista o dinheiro que sobra</li>
                      <li>• Acompanhe mensalmente seu orçamento</li>
                      <li>• Defina metas financeiras</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
