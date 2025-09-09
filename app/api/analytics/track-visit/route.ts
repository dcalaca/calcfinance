import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Recebendo dados de analytics...')
    const body = await request.json()
    console.log('📊 Dados recebidos:', body)
    
    const { 
      page, 
      referrer, 
      userAgent, 
      timestamp,
      sessionId,
      country,
      city,
      device,
      browser
    } = body

    console.log('💾 Inserindo dados no Supabase...')
    console.log('🔗 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('🔑 Supabase Key configurada:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Inserir dados de acesso no Supabase (sem autenticação necessária)
    const { data, error } = await supabase
      .from('site_analytics')
      .insert({
        page: page || '/',
        referrer: referrer || null,
        user_agent: userAgent || null,
        timestamp: timestamp || new Date().toISOString(),
        session_id: sessionId || null,
        country: country || null,
        city: city || null,
        device: device || null,
        browser: browser || null,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('❌ Erro ao salvar analytics:', error)
      return NextResponse.json({ error: 'Erro ao salvar dados', details: error.message }, { status: 500 })
    }

    console.log('✅ Dados salvos com sucesso:', data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('💥 Erro na API de analytics:', error)
    return NextResponse.json({ error: 'Erro interno', details: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔐 Verificando autenticação...')
    
    // Verificar se o usuário está autenticado e é autorizado
    const cookieStore = cookies()
    console.log('🍪 Cookies disponíveis:', cookieStore.getAll().map(c => c.name))
    
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name)?.value
            console.log(`🍪 Cookie ${name}:`, cookie ? 'presente' : 'ausente')
            return cookie
          },
        },
      }
    )
    
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser()
    console.log('👤 Usuário encontrado:', user?.email || 'Nenhum')
    console.log('❌ Erro de auth:', authError)
    
    if (!user || user.email !== 'dcalaca@gmail.com') {
      console.log('🚫 Acesso negado - usuário não autorizado')
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }
    
    console.log('✅ Usuário autorizado:', user.email)

    // Extrair parâmetros de filtro da URL
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const device = searchParams.get('device')
    const browser = searchParams.get('browser')
    const page = searchParams.get('page')
    const country = searchParams.get('country')
    const search = searchParams.get('search')

    // Construir query base
    let query = supabase.from('site_analytics').select('*', { count: 'exact' })

    // Aplicar filtros
    if (dateFrom) {
      query = query.gte('created_at', new Date(dateFrom).toISOString())
    }
    if (dateTo) {
      query = query.lte('created_at', new Date(dateTo).toISOString())
    }
    if (device && device !== 'all') {
      query = query.eq('device', device)
    }
    if (browser && browser !== 'all') {
      query = query.eq('browser', browser)
    }
    if (page && page !== 'all') {
      query = query.eq('page', page)
    }
    if (country && country !== 'all') {
      query = query.eq('country', country)
    }
    if (search) {
      query = query.or(`page.ilike.%${search}%,country.ilike.%${search}%,city.ilike.%${search}%`)
    }

    console.log('🔍 Buscando dados filtrados...')
    // Buscar dados filtrados
    const { data: filteredVisits, error: filteredError } = await query
    console.log('📊 Dados filtrados:', filteredVisits?.length || 0, 'registros')
    console.log('❌ Erro filtrados:', filteredError)

    console.log('🔍 Buscando visitas de hoje...')
    // Buscar visitas de hoje (sem filtros de data)
    const { data: todayVisits, error: todayError } = await supabase
      .from('site_analytics')
      .select('*', { count: 'exact' })
      .gte('created_at', new Date().toISOString().split('T')[0])
    console.log('📊 Visitas hoje:', todayVisits?.length || 0, 'registros')
    console.log('❌ Erro hoje:', todayError)

    console.log('🔍 Buscando páginas populares...')
    // Buscar páginas mais visitadas (últimos 7 dias)
    const { data: topPages, error: pagesError } = await supabase
      .from('site_analytics')
      .select('page')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    console.log('📊 Páginas populares:', topPages?.length || 0, 'registros')
    console.log('❌ Erro páginas:', pagesError)

    if (filteredError || todayError || pagesError) {
      console.error('💥 Erro ao buscar dados:', { filteredError, todayError, pagesError })
      throw new Error('Erro ao buscar dados')
    }

    // Contar páginas mais visitadas
    const pageCounts = topPages?.reduce((acc: any, visit: any) => {
      acc[visit.page] = (acc[visit.page] || 0) + 1
      return acc
    }, {}) || {}

    const topPagesList = Object.entries(pageCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([page, count]) => ({ page, visits: count }))

    // Calcular sessões únicas
    const uniqueSessions = new Set(filteredVisits?.map((visit: any) => visit.session_id)).size

    return NextResponse.json({
      totalVisits: filteredVisits?.length || 0,
      filteredVisits: filteredVisits?.length || 0,
      todayVisits: todayVisits?.length || 0,
      uniqueSessions,
      topPages: topPagesList,
      avgSessionDuration: 0 // TODO: Implementar cálculo de duração de sessão
    })
  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
  }
}
