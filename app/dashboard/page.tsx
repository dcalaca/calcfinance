"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFinanceAuth } from "@/hooks/use-finance-auth"
import { Calculator, TrendingUp, Clock, Trash2, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Calculation {
  id: string
  calculation_type: string
  title: string
  input_data: Record<string, any>
  result_data: Record<string, any>
  created_at: string
}

export default function DashboardPage() {
  const { user, financeUser, loading: authLoading } = useFinanceAuth()
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [calcLoading, setCalcLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchCalculations()
    }
  }, [user])

  const fetchCalculations = async () => {
    if (!user) return

    setCalcLoading(true)
    try {
      const { data, error } = await supabase
        .from("calc_calculations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Erro ao buscar cálculos:", error)
      } else {
        setCalculations(data || [])
      }
    } catch (error) {
      console.error("Erro ao buscar cálculos:", error)
    } finally {
      setCalcLoading(false)
    }
  }

  const handleDeleteCalculation = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cálculo?")) {
      try {
        const { error } = await supabase
          .from("calc_calculations")
          .delete()
          .eq("id", id)
          .eq("user_id", user?.id)

        if (!error) {
          setCalculations(prev => prev.filter(calc => calc.id !== id))
        }
      } catch (error) {
        console.error("Erro ao excluir cálculo:", error)
      }
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getCalculationTypeLabel = (type: string) => {
    const labels = {
      juros_compostos: "Juros Compostos",
      conversor_moedas: "Conversor de Moedas",
      financiamento: "Financiamento",
      aposentadoria: "Aposentadoria",
      inflacao: "Inflação",
      orcamento: "Orçamento",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getCalculationTypeColor = (type: string) => {
    const colors = {
      juros_compostos: "bg-blue-100 text-blue-800",
      conversor_moedas: "bg-orange-100 text-orange-800",
      financiamento: "bg-green-100 text-green-800",
      aposentadoria: "bg-purple-100 text-purple-800",
      inflacao: "bg-red-100 text-red-800",
      orcamento: "bg-indigo-100 text-indigo-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  // Removido - já está definido acima

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Olá, {financeUser?.full_name || "Usuário"}! 👋</h1>
            <p className="text-slate-600">Bem-vindo ao seu painel de controle financeiro</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total de Cálculos</p>
                    <p className="text-2xl font-bold text-slate-900">{calculations.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Este Mês</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {
                        calculations.filter((calc) => new Date(calc.created_at).getMonth() === new Date().getMonth())
                          .length
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Última Atividade</p>
                    <p className="text-2xl font-bold text-slate-900">{calculations.length > 0 ? "Hoje" : "Nunca"}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesse rapidamente suas calculadoras favoritas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/calculadoras/juros-compostos">
                    <Calculator className="w-6 h-6 mb-2" />
                    Juros Compostos
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/calculadoras/conversor-moedas">
                    <TrendingUp className="w-6 h-6 mb-2" />
                    Conversor
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/calculadoras/financiamento">
                    <Calculator className="w-6 h-6 mb-2" />
                    Financiamento
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/calculadoras/orcamento">
                    <Calculator className="w-6 h-6 mb-2" />
                    Orçamento
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Calculations */}
          <Card>
            <CardHeader>
              <CardTitle>Cálculos Recentes</CardTitle>
              <CardDescription>Seus últimos cálculos salvos</CardDescription>
            </CardHeader>
            <CardContent>
              {calcLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-slate-600">Carregando seus cálculos...</p>
                </div>
              ) : calculations.length === 0 ? (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">Você ainda não fez nenhum cálculo</p>
                  <Button asChild>
                    <Link href="/calculadoras/juros-compostos">Fazer Primeiro Cálculo</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {calculations.slice(0, 5).map((calculation) => (
                    <div
                      key={calculation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Badge className={getCalculationTypeColor(calculation.calculation_type)}>
                          {getCalculationTypeLabel(calculation.calculation_type)}
                        </Badge>
                        <div>
                          <h4 className="font-medium text-slate-900">{calculation.title}</h4>
                          <p className="text-sm text-slate-600">
                            {new Date(calculation.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/calculos/${calculation.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCalculation(calculation.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {calculations.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" asChild>
                        <Link href="/historico">Ver Todos os Cálculos</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
