'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Download, Filter, Calendar, Monitor, Globe, Search } from "lucide-react"

interface VisitRecord {
  id: string
  page: string
  referrer: string | null
  user_agent: string
  timestamp: string
  session_id: string
  country: string | null
  city: string | null
  device: string
  browser: string
  created_at: string
}

interface AnalyticsData {
  totalVisits: number
  dailyVisits: number
  popularPages: { page: string; count: number }[]
  deviceStats: { device: string; count: number }[]
  browserStats: { browser: string; count: number }[]
}

export default function AnalyticsTempPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [recentVisits, setRecentVisits] = useState<VisitRecord[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Buscar dados sem autenticação
      const [analyticsResponse, visitsResponse] = await Promise.all([
        fetch('/api/analytics/test-data'),
        fetch('/api/analytics/test-data')
      ])

      if (analyticsResponse.ok && visitsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        const visitsData = await visitsResponse.json()
        
        console.log('📊 Dados recebidos:', analyticsData)
        console.log('📋 Visitas recebidas:', visitsData)
        
        // Processar dados
        const visits = visitsData.data || []
        
        // Calcular estatísticas
        const totalVisits = visits.length
        const today = new Date().toISOString().split('T')[0]
        const dailyVisits = visits.filter((v: VisitRecord) => 
          v.created_at.startsWith(today)
        ).length
        
        // Páginas populares
        const pageCounts: { [key: string]: number } = {}
        visits.forEach((visit: VisitRecord) => {
          pageCounts[visit.page] = (pageCounts[visit.page] || 0) + 1
        })
        const popularPages = Object.entries(pageCounts)
          .map(([page, count]) => ({ page, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
        
        // Estatísticas de dispositivos
        const deviceCounts: { [key: string]: number } = {}
        visits.forEach((visit: VisitRecord) => {
          deviceCounts[visit.device] = (deviceCounts[visit.device] || 0) + 1
        })
        const deviceStats = Object.entries(deviceCounts)
          .map(([device, count]) => ({ device, count }))
          .sort((a, b) => b.count - a.count)
        
        // Estatísticas de navegadores
        const browserCounts: { [key: string]: number } = {}
        visits.forEach((visit: VisitRecord) => {
          browserCounts[visit.browser] = (browserCounts[visit.browser] || 0) + 1
        })
        const browserStats = Object.entries(browserCounts)
          .map(([browser, count]) => ({ browser, count }))
          .sort((a, b) => b.count - a.count)
        
        setAnalytics({
          totalVisits,
          dailyVisits,
          popularPages,
          deviceStats,
          browserStats
        })
        
        setRecentVisits(visits.slice(0, 20))
      } else {
        console.error('❌ Erro ao buscar dados:', analyticsResponse.status, visitsResponse.status)
      }
    } catch (error) {
      console.error('💥 Erro ao buscar analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Carregando dados de analytics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Temporário</h1>
              <p className="text-gray-600 mt-2">
                Dados de acesso ao site (versão sem autenticação para teste)
              </p>
            </div>
            <Button onClick={fetchAnalytics} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar Dados
            </Button>
          </div>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalVisits || 0}</div>
              <p className="text-xs text-muted-foreground">
                Todas as visitas registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.dailyVisits || 0}</div>
              <p className="text-xs text-muted-foreground">
                Visitas de hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispositivos</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.deviceStats.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Tipos de dispositivos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Navegadores</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.browserStats.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Navegadores diferentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Páginas Populares */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Páginas Mais Visitadas</CardTitle>
              <CardDescription>
                As páginas mais acessadas do site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.popularPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm font-medium">{page.page}</span>
                    </div>
                    <Badge variant="secondary">{page.count} visitas</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dispositivos</CardTitle>
              <CardDescription>
                Distribuição por tipo de dispositivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.deviceStats.map((device, index) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{device.device}</Badge>
                    </div>
                    <Badge variant="secondary">{device.count} visitas</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visitas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Visitas Recentes</CardTitle>
            <CardDescription>
              Últimas 20 visitas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVisits.map((visit) => (
                <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{visit.page}</Badge>
                      <Badge variant="secondary">{visit.device}</Badge>
                      <Badge variant="secondary">{visit.browser}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Session: {visit.session_id}</p>
                      <p>Data: {new Date(visit.created_at).toLocaleString('pt-BR')}</p>
                      {visit.country && <p>Local: {visit.country}, {visit.city}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
