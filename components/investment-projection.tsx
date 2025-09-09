"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, Calendar, Target } from "lucide-react"

interface InvestmentProjectionProps {
  monthlySurplus: number
  annualReturn?: number
}

interface ProjectionData {
  years: number
  totalInvested: number
  totalValue: number
  totalGains: number
  monthlyAmount: number
}

export function InvestmentProjection({ monthlySurplus, annualReturn = 12 }: InvestmentProjectionProps) {
  const [projections, setProjections] = useState<ProjectionData[]>([])
  const [customReturn, setCustomReturn] = useState(annualReturn)

  useEffect(() => {
    if (monthlySurplus <= 0) {
      setProjections([])
      return
    }

    const calculateProjection = (years: number): ProjectionData => {
      const monthlyRate = customReturn / 100 / 12
      const totalMonths = years * 12
      
      // Fórmula de valor futuro de uma anuidade
      const futureValue = monthlySurplus * 
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
      
      const totalInvested = monthlySurplus * totalMonths
      const totalGains = futureValue - totalInvested
      
      return {
        years,
        totalInvested,
        totalValue: futureValue,
        totalGains,
        monthlyAmount: monthlySurplus
      }
    }

    const newProjections = [
      calculateProjection(1),
      calculateProjection(5),
      calculateProjection(10)
    ]

    setProjections(newProjections)
  }, [monthlySurplus, customReturn])

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (monthlySurplus <= 0) {
    return null
  }

  return (
    <Card className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <TrendingUp className="w-6 h-6" />
          Projeção de Investimento
        </CardTitle>
        <CardDescription className="text-blue-600">
          Simule quanto você teria investindo sua sobra mensal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-medium">Sobra Mensal:</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(monthlySurplus)}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Rentabilidade Anual:</span>
            </div>
            <Select value={customReturn.toString()} onValueChange={(value) => setCustomReturn(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6% (CDB)</SelectItem>
                <SelectItem value="8">8% (LCI/LCA)</SelectItem>
                <SelectItem value="10">10% (Fundos)</SelectItem>
                <SelectItem value="12">12% (Ações)</SelectItem>
                <SelectItem value="15">15% (Ações)</SelectItem>
                <SelectItem value="18">18% (Ações)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {projections.map((projection) => (
              <Card key={projection.years} className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {projection.years} {projection.years === 1 ? 'Ano' : 'Anos'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600 flex-shrink-0">Total Investido:</span>
                      <span className="font-semibold text-gray-800 text-sm text-right ml-2">
                        {formatCurrency(projection.totalInvested)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600 flex-shrink-0">Valor Final:</span>
                      <span className="font-bold text-green-600 text-base text-right ml-2">
                        {formatCurrency(projection.totalValue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600 flex-shrink-0">Ganhos:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs ml-2">
                        {formatCurrency(projection.totalGains)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="text-center">
                      <span className="text-xs text-gray-500">
                        {formatCurrency(projection.monthlyAmount)}/mês
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  💡 Dica de Investimento
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Com {formatCurrency(monthlySurplus)} por mês, você pode construir um patrimônio significativo. 
                  Considere investir em fundos de renda fixa, CDBs ou ações de empresas sólidas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
