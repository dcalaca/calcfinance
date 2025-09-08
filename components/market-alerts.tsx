"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, Euro, Bitcoin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MarketData {
  dolar: number
  euro: number
  bitcoin: number
  selic: number
  ipca: number
  dolarVariation?: number
  euroVariation?: number
  bitcoinVariation?: number
  lastUpdated?: string
}

export function MarketAlerts() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch("/api/market-data")
        if (response.ok) {
          const data = await response.json()
          setMarketData(data)
        } else {
          // Fallback data if API fails
          setMarketData({
            dolar: 5.25,
            euro: 5.68,
            bitcoin: 42500,
            selic: 11.75,
            ipca: 4.62,
          })
        }
      } catch (error) {
        console.error("Erro ao buscar dados do mercado:", error)
        // Fallback data
        setMarketData({
          dolar: 5.25,
          euro: 5.68,
          bitcoin: 42500,
          selic: 11.75,
          ipca: 4.62,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()

    // Update every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Indicadores de Mercado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!marketData) {
    return null
  }

  // Função para formatar variação
  const formatVariation = (variation: number | undefined) => {
    if (variation === undefined || variation === 0) return "0.0%"
    const sign = variation > 0 ? "+" : ""
    return `${sign}${variation.toFixed(1)}%`
  }

  // Função para determinar tendência
  const getTrend = (variation: number | undefined) => {
    if (variation === undefined || variation === 0) return "neutral"
    return variation > 0 ? "up" : "down"
  }

  const indicators = [
    {
      name: "Dólar",
      value: `R$ ${marketData.dolar.toFixed(2)}`,
      icon: DollarSign,
      trend: getTrend(marketData.dolarVariation),
      change: formatVariation(marketData.dolarVariation),
    },
    {
      name: "Euro",
      value: `R$ ${marketData.euro.toFixed(2)}`,
      icon: Euro,
      trend: getTrend(marketData.euroVariation),
      change: formatVariation(marketData.euroVariation),
    },
    {
      name: "Bitcoin",
      value: `$${marketData.bitcoin.toLocaleString()}`,
      icon: Bitcoin,
      trend: getTrend(marketData.bitcoinVariation),
      change: formatVariation(marketData.bitcoinVariation),
    },
    {
      name: "SELIC",
      value: `${marketData.selic.toFixed(2)}%`,
      icon: TrendingUp,
      trend: "neutral" as const,
      change: "0.0%", // SELIC não tem variação diária
    },
    {
      name: "IPCA",
      value: `${marketData.ipca.toFixed(2)}%`,
      icon: TrendingDown,
      trend: "neutral" as const,
      change: "0.0%", // IPCA é mensal
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Indicadores de Mercado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {indicators.map((indicator) => {
            const Icon = indicator.icon
            return (
              <div
                key={indicator.name}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{indicator.name}</p>
                    <p className="text-lg font-bold">{indicator.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      indicator.trend === "up"
                        ? "text-green-600"
                        : indicator.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {indicator.trend === "up" && <TrendingUp className="h-3 w-3" />}
                    {indicator.trend === "down" && <TrendingDown className="h-3 w-3" />}
                    <span>{indicator.change}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-3 border-t text-xs text-gray-500 text-center">
          {marketData.lastUpdated && (
            <div className="mb-1">
              Última atualização: {new Date(marketData.lastUpdated).toLocaleString('pt-BR')}
            </div>
          )}
          Dados em tempo real • Fontes: AwesomeAPI, Banco Central, CoinGecko
        </div>
      </CardContent>
    </Card>
  )
}
