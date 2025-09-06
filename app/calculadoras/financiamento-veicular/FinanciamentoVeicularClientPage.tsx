"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinanceCalculations } from "@/hooks/use-finance-calculations"
import { useFinanceAuth } from "@/hooks/use-finance-auth"
import { Calculator, Car, Calendar, DollarSign, List, Eye, CreditCard, Save } from "lucide-react"
import { toast } from "sonner"

export default function FinanciamentoVeicularClientPage() {
  const [valorVeiculo, setValorVeiculo] = useState(0)
  const [entrada, setEntrada] = useState(0)
  const [prazo, setPrazo] = useState(0)
  const [taxa, setTaxa] = useState(0)
  const [tipoTaxa, setTipoTaxa] = useState("mensal")
  const [tipoVeiculo, setTipoVeiculo] = useState("carro")
  const [resultado, setResultado] = useState<any>(null)
  const [parcelas, setParcelas] = useState<any[]>([])

  const { saveCalculation } = useFinanceCalculations()
  const { user } = useFinanceAuth()

  const calcularFinanciamentoVeicular = async () => {
    // Validações
    if (valorVeiculo <= 0 || entrada < 0 || prazo <= 0 || taxa <= 0) {
      toast.error("Preencha todos os campos com valores válidos")
      return
    }

    if (entrada >= valorVeiculo) {
      toast.error("A entrada deve ser menor que o valor do veículo")
      return
    }

    const valorFinanciado = valorVeiculo - entrada
    const taxaMensal = tipoTaxa === "mensal" ? taxa / 100 : taxa / 100 / 12
    const taxaAnual = tipoTaxa === "mensal" ? taxa * 12 : taxa

    // Cálculo do financiamento (sistema PRICE - mais comum para veículos)
    const prestacao = valorFinanciado > 0 && taxaMensal > 0
      ? (valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, prazo))) /
        (Math.pow(1 + taxaMensal, prazo) - 1)
      : 0

    const totalPago = prestacao * prazo + entrada
    const totalJuros = totalPago - valorVeiculo

    // Calcular parcelas detalhadas
    const parcelasDetalhadas = calcularParcelas(valorFinanciado, prazo, taxaAnual)

    const resultadoCalculo = {
      valorVeiculo,
      entrada,
      valorFinanciado,
      prazo,
      taxa,
      tipoTaxa,
      tipoVeiculo,
      prestacao,
      totalPago,
      totalJuros,
      taxaMensal: taxaMensal * 100,
      taxaAnual: taxaAnual,
      taxaEfetiva: (Math.pow(1 + taxaMensal, 12) - 1) * 100
    }

    setResultado(resultadoCalculo)
    setParcelas(parcelasDetalhadas)
    
    // Salvar cálculo automaticamente se o usuário estiver logado
    if (user) {
      try {
        await saveCalculation(
          "financiamento",
          `Financiamento ${infoVeiculo.label} - R$ ${valorVeiculo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
          {
            valorVeiculo,
            entrada,
            valorFinanciado,
            prazo,
            taxa,
            tipoTaxa,
            tipoVeiculo
          },
          resultadoCalculo
        )
        toast.success("Simulação realizada e salva com sucesso!")
      } catch (error) {
        console.error("Erro ao salvar cálculo:", error)
        toast.success("Simulação realizada com sucesso!")
      }
    } else {
      toast.success("Simulação realizada com sucesso!")
    }
  }

  const handleSaveCalculation = async () => {
    if (!user) {
      toast.error("Faça login para salvar seus cálculos")
      return
    }

    if (!resultado) {
      toast.error("Realize um cálculo primeiro")
      return
    }

    try {
      await saveCalculation(
        "financiamento",
        `Financiamento ${infoVeiculo.label} - R$ ${resultado.valorVeiculo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        {
          valorVeiculo: resultado.valorVeiculo,
          entrada: resultado.entrada,
          valorFinanciado: resultado.valorFinanciado,
          prazo: resultado.prazo,
          taxa: resultado.taxa,
          tipoTaxa: resultado.tipoTaxa,
          tipoVeiculo: resultado.tipoVeiculo
        },
        resultado
      )
      toast.success("Cálculo salvo com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar cálculo:", error)
      toast.error("Erro ao salvar cálculo")
    }
  }

  const calcularParcelas = (valorFinanciado: number, prazo: number, taxaAnual: number) => {
    const taxaMensal = taxaAnual / 100 / 12
    const parcelas = []
    
    let saldoDevedor = valorFinanciado
    let totalJurosPagos = 0
    let totalAmortizado = 0

    for (let i = 1; i <= prazo; i++) {
      const juros = saldoDevedor * taxaMensal
      const amortizacao = (valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, prazo))) / (Math.pow(1 + taxaMensal, prazo) - 1) - juros
      const prestacao = amortizacao + juros
      const saldoAnterior = saldoDevedor
      
      saldoDevedor -= amortizacao
      totalJurosPagos += juros
      totalAmortizado += amortizacao

      parcelas.push({
        parcela: i,
        saldoAnterior,
        prestacao,
        juros,
        amortizacao,
        saldoDevedor: Math.max(0, saldoDevedor),
        totalJurosPagos,
        totalAmortizado,
        percentualJuros: (juros / prestacao) * 100,
        percentualAmortizacao: (amortizacao / prestacao) * 100
      })
    }

    return parcelas
  }

  const getTipoVeiculoInfo = (tipo: string) => {
    const tipos = {
      carro: { label: "Carro", prazoMax: 60, entradaMin: 20 },
      moto: { label: "Moto", prazoMax: 36, entradaMin: 30 },
      caminhao: { label: "Caminhão", prazoMax: 84, entradaMin: 15 },
      onibus: { label: "Ônibus", prazoMax: 84, entradaMin: 15 }
    }
    return tipos[tipo as keyof typeof tipos] || tipos.carro
  }

  const infoVeiculo = getTipoVeiculoInfo(tipoVeiculo)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Simulador de Financiamento Veicular</h1>
        <p className="text-muted-foreground">Calcule financiamentos de carros, motos e outros veículos com diferentes taxas e prazos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Dados do Financiamento
            </CardTitle>
            <CardDescription>Preencha os dados para simular seu financiamento veicular</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tipo de Veículo</Label>
              <Select value={tipoVeiculo} onValueChange={setTipoVeiculo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carro">🚗 Carro</SelectItem>
                  <SelectItem value="moto">🏍️ Moto</SelectItem>
                  <SelectItem value="caminhao">🚛 Caminhão</SelectItem>
                  <SelectItem value="onibus">🚌 Ônibus</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Prazo máximo: {infoVeiculo.prazoMax} meses • Entrada mínima: {infoVeiculo.entradaMin}%
              </p>
            </div>

            <div>
              <Label htmlFor="valorVeiculo">Valor do Veículo</Label>
              <CurrencyInput id="valorVeiculo" value={valorVeiculo} onChange={setValorVeiculo} />
            </div>

            <div>
              <Label htmlFor="entrada">Entrada</Label>
              <CurrencyInput id="entrada" value={entrada} onChange={setEntrada} />
              {valorVeiculo > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {((entrada / valorVeiculo) * 100).toFixed(1)}% do valor do veículo
                  {((entrada / valorVeiculo) * 100) < infoVeiculo.entradaMin && (
                    <span className="text-red-500 ml-2">(Mínimo recomendado: {infoVeiculo.entradaMin}%)</span>
                  )}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="prazo">Prazo (meses)</Label>
              <Input
                id="prazo"
                type="number"
                value={prazo || ""}
                onChange={(e) => setPrazo(Number(e.target.value))}
                placeholder={infoVeiculo.prazoMax.toString()}
                max={infoVeiculo.prazoMax}
              />
              {prazo > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {(prazo / 12).toFixed(1)} anos
                  {prazo > infoVeiculo.prazoMax && (
                    <span className="text-red-500 ml-2">(Máximo recomendado: {infoVeiculo.prazoMax} meses)</span>
                  )}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taxa">Taxa de Juros (%)</Label>
                <Input
                  id="taxa"
                  type="number"
                  step="0.01"
                  value={taxa || ""}
                  onChange={(e) => setTaxa(Number(e.target.value))}
                  placeholder={tipoTaxa === "mensal" ? "1.00" : "12.00"}
                />
              </div>
              <div>
                <Label>Período da Taxa</Label>
                <Select value={tipoTaxa} onValueChange={setTipoTaxa}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa típica: {tipoVeiculo === 'carro' ? '0.7-1.2%' : tipoVeiculo === 'moto' ? '1.0-1.7%' : '0.5-1.0%'} ao mês
              {tipoTaxa === "anual" && ` (${tipoVeiculo === 'carro' ? '8-15%' : tipoVeiculo === 'moto' ? '12-20%' : '6-12%'} ao ano)`}
            </p>

            <Button onClick={calcularFinanciamentoVeicular} className="w-full">
              Simular Financiamento
            </Button>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Resultado da Simulação
              </CardTitle>
              {resultado && user && (
                <Button onClick={handleSaveCalculation} variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Cálculo
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {resultado ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Valor Financiado</p>
                    <p className="text-xl font-bold text-blue-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(resultado.valorFinanciado)}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Entrada</p>
                    <p className="text-xl font-bold text-green-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(resultado.entrada)}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Prestação Mensal</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(resultado.prestacao)}
                  </p>
                  <p className="text-sm text-muted-foreground">por {resultado.prazo} meses</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Pago:</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(resultado.totalPago)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de Juros:</span>
                    <span className="font-semibold text-red-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(resultado.totalJuros)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa Mensal:</span>
                    <span className="font-semibold text-blue-600">
                      {resultado.taxaMensal.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa Anual:</span>
                    <span className="font-semibold text-purple-600">
                      {resultado.taxaAnual.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa Efetiva Anual:</span>
                    <span className="font-semibold text-orange-600">
                      {resultado.taxaEfetiva.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <List className="w-4 h-4 mr-2" />
                        Ver Todas as Parcelas
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          Detalhamento Completo - Financiamento Veicular
                        </DialogTitle>
                        <DialogDescription>
                          Visualize todas as {resultado.prazo} parcelas com detalhamento de juros e amortização
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* Resumo */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-orange-50 rounded-lg">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Valor Financiado</p>
                            <p className="font-bold text-orange-600">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(resultado.valorFinanciado)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Total de Juros</p>
                            <p className="font-bold text-red-600">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(resultado.totalJuros)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Total Pago</p>
                            <p className="font-bold text-green-600">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(resultado.totalPago)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Taxa Anual</p>
                            <p className="font-bold text-purple-600">
                              {resultado.taxaAnual.toFixed(2)}%
                            </p>
                          </div>
                        </div>

                        {/* Tabela de Parcelas */}
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-center">Parcela</TableHead>
                                <TableHead className="text-right">Saldo Anterior</TableHead>
                                <TableHead className="text-right">Prestação</TableHead>
                                <TableHead className="text-right">Juros</TableHead>
                                <TableHead className="text-right">Amortização</TableHead>
                                <TableHead className="text-right">Saldo Devedor</TableHead>
                                <TableHead className="text-center">% Juros</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {parcelas.map((parcela) => (
                                <TableRow key={parcela.parcela}>
                                  <TableCell className="text-center font-medium">
                                    {parcela.parcela}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(parcela.saldoAnterior)}
                                  </TableCell>
                                  <TableCell className="text-right font-semibold">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(parcela.prestacao)}
                                  </TableCell>
                                  <TableCell className="text-right text-red-600">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(parcela.juros)}
                                  </TableCell>
                                  <TableCell className="text-right text-green-600">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(parcela.amortizacao)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(parcela.saldoDevedor)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      parcela.percentualJuros > 50 
                                        ? 'bg-red-100 text-red-800' 
                                        : parcela.percentualJuros > 25 
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                      {parcela.percentualJuros.toFixed(1)}%
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Explicação */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-2">Como interpretar a tabela:</h4>
                          <ul className="text-sm space-y-1 text-gray-700">
                            <li><strong>Saldo Anterior:</strong> Valor que você ainda deve antes de pagar a parcela</li>
                            <li><strong>Prestação:</strong> Valor total da parcela (juros + amortização)</li>
                            <li><strong>Juros:</strong> Quanto você paga de juros nesta parcela</li>
                            <li><strong>Amortização:</strong> Quanto efetivamente reduz sua dívida</li>
                            <li><strong>Saldo Devedor:</strong> Quanto você ainda deve após pagar a parcela</li>
                            <li><strong>% Juros:</strong> Percentual de juros na prestação</li>
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Preencha os dados e clique em simular para ver os resultados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seção Educativa */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Dicas para Financiamento Veicular</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3>Antes de Financiar:</h3>
              <ul>
                <li>Pesquise as melhores taxas do mercado</li>
                <li>Compare ofertas de diferentes bancos</li>
                <li>Considere o valor da entrada (maior entrada = menor juros)</li>
                <li>Verifique se cabe no seu orçamento mensal</li>
                <li>Considere o valor de revenda do veículo</li>
              </ul>
            </div>
            <div>
              <h3>Tipos de Veículos:</h3>
              <ul>
                <li><strong>Carros:</strong> Prazo até 60 meses, entrada mínima 20%</li>
                <li><strong>Motos:</strong> Prazo até 36 meses, entrada mínima 30%</li>
                <li><strong>Caminhões:</strong> Prazo até 84 meses, entrada mínima 15%</li>
                <li><strong>Ônibus:</strong> Prazo até 84 meses, entrada mínima 15%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
