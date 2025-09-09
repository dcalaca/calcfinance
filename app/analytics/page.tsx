"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Eye, Users, TrendingUp, Globe, Shield, AlertTriangle, Filter, Calendar as CalendarIcon, Download, Search, Clock, MapPin, Smartphone, Laptop, Tablet, Monitor, User } from "lucide-react"
import { useFinanceAuth } from "@/hooks/use-finance-auth"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AnalyticsData {
  totalVisits: number
  todayVisits: number
  topPages: Array<{ page: string; visits: number }>
  filteredVisits: number
  uniqueSessions: number
  avgSessionDuration: number
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
  country: string | null
  city: string | null
  region: string | null
  timezone: string | null
  isp: string | null
  latitude: number | null
  longitude: number | null
  ip_address: string | null
  created_at: string
}

interface FilterOptions {
  dateFrom: Date | null
  dateTo: Date | null
  device: string
  browser: string
  page: string
  country: string
  searchTerm: string
}

export default function AnalyticsPage() {
  const { user, loading: userLoading } = useFinanceAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [recentVisits, setRecentVisits] = useState<VisitRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<VisitRecord | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: null,
    dateTo: null,
    device: 'all',
    browser: 'all',
    page: 'all',
    country: 'all',
    searchTerm: ''
  })

  // Verificar se o usuário tem permissão (apenas dcalaca@gmail.com)
  const isAuthorized = user?.email === 'dcalaca@gmail.com'

  // Função para obter ícone do dispositivo
  const getDeviceIcon = (device: string | null) => {
    if (!device) return <Monitor className="h-4 w-4" />
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      case 'desktop':
        return <Laptop className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Construir parâmetros de filtro
      const params = new URLSearchParams()
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString())
      if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString())
      if (filters.device !== 'all') params.append('device', filters.device)
      if (filters.browser !== 'all') params.append('browser', filters.browser)
      if (filters.page !== 'all') params.append('page', filters.page)
      if (filters.country !== 'all') params.append('country', filters.country)
      if (filters.searchTerm) params.append('search', filters.searchTerm)
      
      // Buscar estatísticas gerais com filtros
      const response = await fetch(`/api/analytics/track-visit?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }

      // Buscar visitas recentes com filtros
      const visitsResponse = await fetch(`/api/analytics/recent-visits?${params.toString()}`)
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

  const clearFilters = () => {
    setFilters({
      dateFrom: null,
      dateTo: null,
      device: 'all',
      browser: 'all',
      page: 'all',
      country: 'all',
      searchTerm: ''
    })
  }

  const exportData = () => {
    const csvContent = [
      ['Data', 'Página', 'Dispositivo', 'Navegador', 'País', 'Cidade', 'Referrer', 'Session ID'],
      ...recentVisits.map(visit => [
        format(new Date(visit.created_at), 'dd/MM/yyyy HH:mm:ss'),
        visit.page,
        visit.device || 'N/A',
        visit.browser || 'N/A',
        visit.country || 'N/A',
        visit.city || 'N/A',
        visit.referrer || 'N/A',
        visit.session_id
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.dateFrom) count++
    if (filters.dateTo) count++
    if (filters.device !== 'all') count++
    if (filters.browser !== 'all') count++
    if (filters.page !== 'all') count++
    if (filters.country !== 'all') count++
    if (filters.searchTerm) count++
    return count
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

  // Se não estiver logado, mostrar mensagem para fazer login
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Analytics do Site</h1>
            <p className="text-muted-foreground mb-6">
              Faça login para visualizar os dados de analytics
            </p>
          </div>
          
          <Card className="p-6">
            <CardContent>
              <div className="flex items-center gap-3 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-blue-800">Login Necessário</p>
                  <p className="text-sm text-blue-700">
                    Você precisa estar logado para visualizar os dados de analytics.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/login">
                    <User className="w-4 h-4 mr-2" />
                    Fazer Login
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

      {/* Controles */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={fetchAnalytics} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Dados
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>

          <Button variant="outline" onClick={exportData} disabled={recentVisits.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {getActiveFiltersCount() > 0 && (
          <Button variant="ghost" onClick={clearFilters} size="sm">
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Painel de Filtros */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Análise
            </CardTitle>
            <CardDescription>
              Filtre os dados por período, dispositivo, navegador e outros critérios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtro de Data */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Inicial</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, 'dd/MM/yyyy') : 'Selecionar data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom || undefined}
                      onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date || null }))}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data Final</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, 'dd/MM/yyyy') : 'Selecionar data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo || undefined}
                      onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date || null }))}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Filtro de Dispositivo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Dispositivo</label>
                <Select value={filters.device} onValueChange={(value) => setFilters(prev => ({ ...prev, device: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de Navegador */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Navegador</label>
                <Select value={filters.browser} onValueChange={(value) => setFilters(prev => ({ ...prev, browser: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Chrome">Chrome</SelectItem>
                    <SelectItem value="Firefox">Firefox</SelectItem>
                    <SelectItem value="Safari">Safari</SelectItem>
                    <SelectItem value="Edge">Edge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de Página */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Página</label>
                <Select value={filters.page} onValueChange={(value) => setFilters(prev => ({ ...prev, page: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="/">Página Inicial</SelectItem>
                    <SelectItem value="/meu-orcamento">Meu Orçamento</SelectItem>
                    <SelectItem value="/calculadoras">Calculadoras</SelectItem>
                    <SelectItem value="/noticias">Notícias</SelectItem>
                    <SelectItem value="/educacao">Educação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Busca por Termo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por página, país, cidade..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={fetchAnalytics} disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Gerais */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getActiveFiltersCount() > 0 ? 'Visitas Filtradas' : 'Total de Visitas'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.filteredVisits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {getActiveFiltersCount() > 0 ? 'Com filtros aplicados' : 'Desde o início'}
              </p>
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
              <CardTitle className="text-sm font-medium">Sessões Únicas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.uniqueSessions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Usuários únicos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Páginas Populares</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.topPages.length}</div>
              <p className="text-xs text-muted-foreground">Páginas únicas</p>
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
                <Dialog key={visit.id}>
                  <DialogTrigger asChild>
                    <div 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedVisit(visit)}
                    >
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
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Detalhes da Visita
                      </DialogTitle>
                      <DialogDescription>
                        Informações completas sobre esta visita ao site
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedVisit && (
                      <div className="space-y-6">
                        {/* Informações Básicas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Página Acessada
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                                {selectedVisit.page}
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Data e Hora
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">
                                {format(new Date(selectedVisit.created_at), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(selectedVisit.created_at), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                              </p>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Dispositivo e Navegador */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                {getDeviceIcon(selectedVisit.device)}
                                Dispositivo
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Badge variant="outline" className="text-sm">
                                {selectedVisit.device || 'Desconhecido'}
                              </Badge>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Monitor className="h-4 w-4" />
                                Navegador
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Badge variant="outline" className="text-sm">
                                {selectedVisit.browser || 'Desconhecido'}
                              </Badge>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Localização */}
                        {(selectedVisit.country || selectedVisit.city || selectedVisit.region) && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Localização
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {selectedVisit.country && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">País:</span>
                                    <Badge variant="secondary">{selectedVisit.country}</Badge>
                                  </div>
                                )}
                                {selectedVisit.region && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Região:</span>
                                    <Badge variant="outline">{selectedVisit.region}</Badge>
                                  </div>
                                )}
                                {selectedVisit.city && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Cidade:</span>
                                    <Badge variant="secondary">{selectedVisit.city}</Badge>
                                  </div>
                                )}
                                {selectedVisit.timezone && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Fuso Horário:</span>
                                    <Badge variant="outline">{selectedVisit.timezone}</Badge>
                                  </div>
                                )}
                                {(selectedVisit.latitude && selectedVisit.longitude) && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Coordenadas:</span>
                                    <Badge variant="outline">
                                      {selectedVisit.latitude.toFixed(4)}, {selectedVisit.longitude.toFixed(4)}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* IP e ISP */}
                        {(selectedVisit.ip_address || selectedVisit.isp) && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Rede e Conectividade
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {selectedVisit.ip_address && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">IP:</span>
                                    <Badge variant="outline" className="font-mono text-xs">
                                      {selectedVisit.ip_address}
                                    </Badge>
                                  </div>
                                )}
                                {selectedVisit.isp && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">ISP:</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {selectedVisit.isp}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Session ID */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Session ID</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                              {selectedVisit.session_id}
                            </p>
                          </CardContent>
                        </Card>

                        {/* Referrer */}
                        {selectedVisit.referrer && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium">Página de Origem</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                                {selectedVisit.referrer}
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        {/* User Agent */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">User Agent</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                              {selectedVisit.user_agent}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
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
