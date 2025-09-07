"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Calculator, TrendingUp, Home, Car, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { AuthGuard } from '@/components/auth-guard'

interface Calculation {
  id: string
  calculation_type: string
  title: string
  input_data: Record<string, any>
  result_data: Record<string, any>
  created_at: string
}

export default function CalculationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [calculation, setCalculation] = useState<Calculation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCalculation = async () => {
      try {
        console.log('🔍 Buscando cálculo:', params.id)
        const response = await fetch(`/api/calculations/${params.id}`)
        
        console.log('📡 Resposta da API:', response.status, response.statusText)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('❌ Erro da API:', errorData)
          setError(`Erro ${response.status}: ${errorData.error || 'Cálculo não encontrado'}`)
          return
        }
        
        const data = await response.json()
        console.log('✅ Dados recebidos:', data)
        setCalculation(data)
      } catch (error) {
        console.error('💥 Erro ao buscar cálculo:', error)
        setError('Erro ao carregar cálculo')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCalculation()
    }
  }, [params.id])

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600">Carregando cálculo...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (error || !calculation) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Cálculo não encontrado</h1>
            <p className="text-slate-600 mb-6">{error || 'O cálculo solicitado não existe'}</p>
            <Button asChild>
              <Link href="/dashboard">Voltar ao Dashboard</Link>
            </Button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const getCalculationIcon = (type: string) => {
    switch (type) {
      case 'juros-compostos':
        return <TrendingUp className="h-6 w-6" />
      case 'financiamento':
        return <Home className="h-6 w-6" />
      case 'financiamento-veicular':
        return <Car className="h-6 w-6" />
      default:
        return <Calculator className="h-6 w-6" />
    }
  }

  const getCalculationTitle = (type: string) => {
    switch (type) {
      case 'juros-compostos':
        return 'Juros Compostos'
      case 'financiamento':
        return 'Financiamento Imobiliário'
      case 'financiamento-veicular':
        return 'Financiamento Veicular'
      default:
        return 'Cálculo Financeiro'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                {getCalculationIcon(calculation.calculation_type)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {getCalculationTitle(calculation.calculation_type)}
                </h1>
                <p className="text-slate-600">
                  Cálculo realizado em {formatDate(calculation.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Dados de Entrada */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Dados de Entrada
              </CardTitle>
              <CardDescription>
                Parâmetros utilizados no cálculo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(calculation.input_data).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-900 font-semibold">
                      {typeof value === 'number' && key.includes('valor') 
                        ? formatCurrency(value)
                        : typeof value === 'number' && key.includes('taxa')
                        ? `${value}%`
                        : typeof value === 'number' && key.includes('prazo')
                        ? `${value} meses`
                        : String(value)
                      }
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resultados
              </CardTitle>
              <CardDescription>
                Resultados do cálculo realizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(calculation.result_data).map(([key, value]) => (
                  <div key={key} className="p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border">
                    <div className="text-sm text-slate-600 mb-1 capitalize">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                      {typeof value === 'number' && key.includes('valor')
                        ? formatCurrency(value)
                        : typeof value === 'number' && key.includes('taxa')
                        ? `${value}%`
                        : typeof value === 'number' && key.includes('prazo')
                        ? `${value} meses`
                        : typeof value === 'number'
                        ? formatCurrency(value)
                        : String(value)
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Amortização (se disponível) */}
          {calculation.result_data.tabela_amortizacao && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Tabela de Amortização</CardTitle>
                <CardDescription>
                  Detalhamento das parcelas do financiamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium text-slate-700">Parcela</th>
                        <th className="text-right p-2 font-medium text-slate-700">Valor</th>
                        <th className="text-right p-2 font-medium text-slate-700">Juros</th>
                        <th className="text-right p-2 font-medium text-slate-700">Amortização</th>
                        <th className="text-right p-2 font-medium text-slate-700">Saldo Devedor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculation.result_data.tabela_amortizacao.map((parcela: any, index: number) => (
                        <tr key={index} className="border-b hover:bg-slate-50">
                          <td className="p-2 text-slate-900">{parcela.parcela}</td>
                          <td className="p-2 text-right text-slate-900">{formatCurrency(parcela.valor)}</td>
                          <td className="p-2 text-right text-red-600">{formatCurrency(parcela.juros)}</td>
                          <td className="p-2 text-right text-green-600">{formatCurrency(parcela.amortizacao)}</td>
                          <td className="p-2 text-right text-slate-900">{formatCurrency(parcela.saldo_devedor)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/calculadoras">
                <Calculator className="h-4 w-4 mr-2" />
                Nova Calculadora
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
