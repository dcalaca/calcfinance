"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinanceCalculations } from "@/hooks/use-finance-calculations"
import { useFinanceAuth } from "@/hooks/use-finance-auth"
import { Calculator, Home, Calendar, DollarSign, List, Eye, Save } from "lucide-react"
import { toast } from "sonner"

export default function FinanciamentoClientPage() {
  const [valorImovel, setValorImovel] = useState(0)
  const [entrada, setEntrada] = useState(0)
  const [prazo, setPrazo] = useState(0)
  const [taxaPrice, setTaxaPrice] = useState(0)
  const [taxaSac, setTaxaSac] = useState(0)
  const [resultado, setResultado] = useState<any>(null)
  const [parcelasSac, setParcelasSac] = useState<any[]>([])
  const [showParcelas, setShowParcelas] = useState(false)

  const { saveCalculation } = useFinanceCalculations()
  const { user } = useFinanceAuth()

  const calcularParcelasSac = (valorFinanciado: number, prazo: number, taxaAnual: number) => {
    const taxaMensal = taxaAnual / 100 / 12
    const amortizacao = valorFinanciado / prazo
    const parcelas = []
    
    let saldoDevedor = valorFinanciado
    let totalJurosPagos = 0
    let totalAmortizado = 0

    for (let i = 1; i <= prazo; i++) {
      const juros = saldoDevedor * taxaMensal
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

  const calcularFinanciamento = () => {
    // Validações
    if (valorImovel <= 0 || entrada < 0 || prazo <= 0 || taxaPrice <= 0 || taxaSac <= 0) {
      toast.error("Preencha todos os campos com valores válidos")
      return
    }

    if (entrada >= valorImovel) {
      toast.error("A entrada deve ser menor que o valor do imóvel")
      return
    }

    const valorFinanciado = valorImovel - entrada

    // Cálculo PRICE (Sistema Francês)
    const taxaPriceMensal = taxaPrice / 100 / 12
    const prestacaoPrice =
      valorFinanciado > 0 && taxaPriceMensal > 0
        ? (valorFinanciado * (taxaPriceMensal * Math.pow(1 + taxaPriceMensal, prazo))) /
          (Math.pow(1 + taxaPriceMensal, prazo) - 1)
        : 0
    const totalPagoPrice = prestacaoPrice * prazo + entrada
    const jurosPrice = totalPagoPrice - valorImovel

    // Cálculo SAC (Sistema de Amortização Constante)
    const taxaSacMensal = taxaSac / 100 / 12
    const amortizacaoSac = valorFinanciado / prazo
    const primeiraPrestacaoSac = amortizacaoSac + valorFinanciado * taxaSacMensal
    const ultimaPrestacaoSac = amortizacaoSac + amortizacaoSac * taxaSacMensal
    const totalJurosSac = (valorFinanciado * taxaSacMensal * (prazo + 1)) / 2
    const totalPagoSac = valorFinanciado + totalJurosSac + entrada

    // Calcular todas as parcelas do SAC
    const parcelas = calcularParcelasSac(valorFinanciado, prazo, taxaSac)

    const resultadoCalculo = {
      valorImovel,
      entrada,
      valorFinanciado,
      prazo,
      price: {
        prestacao: prestacaoPrice,
        totalPago: totalPagoPrice,
        juros: jurosPrice,
        taxa: taxaPrice,
      },
      sac: {
        primeiraPrestacao: primeiraPrestacaoSac,
        ultimaPrestacao: ultimaPrestacaoSac,
        totalPago: totalPagoSac,
        juros: totalJurosSac,
        taxa: taxaSac,
      },
    }

    setResultado(resultadoCalculo)
    setParcelasSac(parcelas)
    
    // Salvar cálculo automaticamente se o usuário estiver logado
    if (user) {
      try {
        await saveCalculation(
          "financiamento",
          `Financiamento - R$ ${valorImovel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
          {
            valorImovel,
            entrada,
            valorFinanciado,
            prazo,
            taxaPrice,
            taxaSac
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
        `Financiamento - R$ ${resultado.valorImovel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        {
          valorImovel: resultado.valorImovel,
          entrada: resultado.entrada,
          valorFinanciado: resultado.valorFinanciado,
          prazo: resultado.prazo,
          taxaPrice: resultado.price.taxa,
          taxaSac: resultado.sac.taxa
        },
        resultado
      )
      toast.success("Cálculo salvo com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar cálculo:", error)
      toast.error("Erro ao salvar cálculo")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Simulador de Financiamento Imobiliário</h1>
        <p className="text-muted-foreground">Compare os sistemas PRICE e SAC para escolher a melhor opção</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Dados do Financiamento
            </CardTitle>
            <CardDescription>Preencha os dados para simular seu financiamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="valorImovel">Valor do Imóvel</Label>
              <CurrencyInput id="valorImovel" value={valorImovel} onChange={setValorImovel} />
            </div>

            <div>
              <Label htmlFor="entrada">Entrada</Label>
              <CurrencyInput id="entrada" value={entrada} onChange={setEntrada} />
              {valorImovel > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {((entrada / valorImovel) * 100).toFixed(1)}% do valor do imóvel
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
                placeholder="360"
              />
              {prazo > 0 && <p className="text-xs text-muted-foreground mt-1">{(prazo / 12).toFixed(1)} anos</p>}
            </div>

            <div>
              <Label htmlFor="taxaPrice">Taxa PRICE (% ao ano)</Label>
              <Input
                id="taxaPrice"
                type="number"
                step="0.01"
                value={taxaPrice || ""}
                onChange={(e) => setTaxaPrice(Number(e.target.value))}
                placeholder="10.00"
              />
            </div>

            <div>
              <Label htmlFor="taxaSac">Taxa SAC (% ao ano)</Label>
              <Input
                id="taxaSac"
                type="number"
                step="0.01"
                value={taxaSac || ""}
                onChange={(e) => setTaxaSac(Number(e.target.value))}
                placeholder="10.00"
              />
            </div>

            <Button onClick={calcularFinanciamento} className="w-full">
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

                <Tabs defaultValue="price" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="price">Sistema PRICE</TabsTrigger>
                    <TabsTrigger value="sac">Sistema SAC</TabsTrigger>
                  </TabsList>

                  <TabsContent value="price" className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Prestação Fixa</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(resultado.price.prestacao)}
                      </p>
                      <p className="text-sm text-muted-foreground">por mês</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Pago:</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(resultado.price.totalPago)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total de Juros:</span>
                        <span className="font-semibold text-red-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(resultado.price.juros)}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sac" className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Prestações Decrescentes</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Primeira</p>
                          <p className="text-lg font-bold text-green-600">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(resultado.sac.primeiraPrestacao)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Última</p>
                          <p className="text-lg font-bold text-blue-600">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(resultado.sac.ultimaPrestacao)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Pago:</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(resultado.sac.totalPago)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total de Juros:</span>
                        <span className="font-semibold text-red-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(resultado.sac.juros)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <List className="w-4 h-4 mr-2" />
                            Ver Todas as Parcelas do SAC
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Eye className="w-5 h-5" />
                              Detalhamento Completo - Sistema SAC
                            </DialogTitle>
                            <DialogDescription>
                              Visualize todas as {prazo} parcelas com detalhamento de juros, amortização e saldo devedor
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            {/* Resumo */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Valor Financiado</p>
                                <p className="font-bold text-blue-600">
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
                                  }).format(resultado.sac.juros)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total Pago</p>
                                <p className="font-bold text-green-600">
                                  {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(resultado.sac.totalPago)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Taxa Anual</p>
                                <p className="font-bold text-purple-600">
                                  {resultado.sac.taxa.toFixed(2)}%
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
                                  {parcelasSac.map((parcela) => (
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
                                <li><strong>% Juros:</strong> Percentual de juros na prestação (vermelho = mais juros, verde = mais amortização)</li>
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Comparação:</h4>
                  <p className="text-sm">
                    {resultado.price.juros < resultado.sac.juros
                      ? `O sistema PRICE resulta em ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(resultado.sac.juros - resultado.price.juros)} menos juros que o SAC.`
                      : `O sistema SAC resulta em ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(resultado.price.juros - resultado.sac.juros)} menos juros que o PRICE.`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Preencha os dados e clique em simular para ver os resultados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seção Educativa */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Entendendo os Sistemas de Financiamento</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3>Sistema PRICE (Francês)</h3>
              <ul>
                <li>Prestações fixas durante todo o financiamento</li>
                <li>No início, paga-se mais juros e menos amortização</li>
                <li>Facilita o planejamento financeiro</li>
                <li>Geralmente resulta em mais juros pagos no total</li>
              </ul>
            </div>
            <div>
              <h3>Sistema SAC</h3>
              <ul>
                <li>Prestações decrescentes ao longo do tempo</li>
                <li>Amortização constante em todas as parcelas</li>
                <li>Prestações iniciais mais altas</li>
                <li>Geralmente resulta em menos juros pagos no total</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
