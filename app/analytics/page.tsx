"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Eye, Users, TrendingUp, Globe, Shield, AlertTriangle } from "lucide-react"
import { useUser } from "@/hooks/use-finance-auth"
import Link from "next/link"

interface AnalyticsData {
  totalVisits: number
  todayVisits: number
  topPages: Array<{ page: string; visits: number }>
}

interface VisitRecord {
  id: string
  page: string
  referrer: string | null
  user_agent: string
  timestamp: string
  session_id: string
  device: string | null
  browser: string | null
  created_at: string
}

export default function AnalyticsPage() {
  const { user, loading: userLoading } = useUser()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [recentVisits, setRecentVisits] = useState<VisitRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Verificar se o usuário tem permissão (apenas dcalaca@gmail.com)
  const isAuthorized = user?.email === 'dcalaca@gmail.com'

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Buscar estatísticas gerais
      const response = await fetch('/api/analytics/track-visit')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }

      // Buscar visitas recentes (últimas 10)
      const visitsResponse = await fetch('/api/analytics/recent-visits')
      if (visitsResponse.ok) {
        const visitsData = await visitsResponse.json()
        setRecentVisits(visitsData)
      }
    } catch (error) {
      console.error('Erro ao buscar analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthorized) {
      fetchAnalytics()
      
      // Atualizar a cada 10 segundos
      const interval = setInterval(fetchAnalytics, 10000)
      return () => clearInterval(interval)
    }
  }, [isAuthorized])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getDeviceIcon = (device: string | null) => {
    if (device === 'mobile') return '📱'
    if (device === 'desktop') return '💻'
    return '❓'
  }

  // Tela de carregamento
  if (userLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  // Tela de acesso negado
  if (!isAuthorized) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-red-600">Acesso Restrito</h1>
            <p className="text-muted-foreground mb-6">
              Esta página é restrita apenas para administradores do sistema.
            </p>
          </div>
          
          <Card className="p-6">
            <CardContent>
              <div className="flex items-center gap-3 mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <div className="text-left">
                  <p className="font-medium text-orange-800">Acesso Negado</p>
                  <p className="text-sm text-orange-700">
                    Você não tem permissão para visualizar os dados de analytics.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/dashboard">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Voltar ao Dashboard
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <Globe className="w-4 h-4 mr-2" />
                    Ir para o Início
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold">Analytics do Site</h1>
        </div>
        <p className="text-muted-foreground">
          Acompanhe em tempo real os acessos ao seu site
        </p>
        <div className="mt-2 text-sm text-green-600 font-medium">
          🔒 Acesso autorizado para: {user?.email}
        </div>
      </div>

      {/* Botão de atualização */}
      <div className="mb-6">
        <Button onClick={fetchAnalytics} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalVisits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Desde o início</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas Hoje</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.todayVisits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Páginas Populares</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.topPages.length}</div>
              <p className="text-xs text-muted-foreground">Páginas únicas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Ativo</div>
              <p className="text-xs text-muted-foreground">Rastreamento funcionando</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Páginas Mais Visitadas */}
      {analytics && analytics.topPages.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Páginas Mais Visitadas (Últimos 7 dias)</CardTitle>
            <CardDescription>Ranking das páginas mais acessadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{page.page}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{page.visits}</div>
                    <div className="text-xs text-muted-foreground">visitas</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visitas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Visitas Recentes</CardTitle>
          <CardDescription>Últimas 10 visitas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : recentVisits.length > 0 ? (
            <div className="space-y-3">
              {recentVisits.map((visit) => (
                <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getDeviceIcon(visit.device)}</span>
                    <div>
                      <div className="font-medium">{visit.page}</div>
                      <div className="text-sm text-muted-foreground">
                        {visit.browser} • {visit.device}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatDate(visit.created_at)}</div>
                    <div className="text-xs text-muted-foreground">
                      {visit.session_id.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma visita registrada ainda</p>
              <p className="text-sm text-muted-foreground mt-2">
                Acesse outras páginas do site para ver os dados aqui
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
