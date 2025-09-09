import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Recebendo dados de analytics...')
    const body = await request.json()
    console.log('📊 Dados recebidos:', body)
    
    // Capturar IP do visitante
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               request.headers.get('x-forwarded') ||
               '127.0.0.1' // IP local para desenvolvimento
    
    console.log('🌐 IP capturado:', ip)
    console.log('🌐 Headers disponíveis:', Object.fromEntries(request.headers.entries()))
    
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

    // Obter informações de localização baseadas no IP
    let locationData = {
      country: country || null,
      city: city || null,
      region: null,
      timezone: null,
      isp: null,
      latitude: null,
      longitude: null
    }

    // Tentar obter localização via IP (mesmo se já temos do frontend)
    if (ip && ip !== 'unknown') {
      try {
        console.log('🔍 Buscando localização via IP...')
        
        // Para desenvolvimento local, usar dados simulados
        if (ip === '127.0.0.1' || ip === '::1') {
          console.log('🏠 Modo desenvolvimento - usando dados simulados')
          locationData = {
            country: locationData.country || 'Brasil',
            city: locationData.city || 'São Paulo',
            region: locationData.region || 'São Paulo',
            timezone: locationData.timezone || 'America/Sao_Paulo',
            isp: locationData.isp || 'Desenvolvimento Local',
            latitude: locationData.latitude || -23.5505,
            longitude: locationData.longitude || -46.6333
          }
        } else {
          // Para IPs reais, consultar API
          const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,timezone,isp,lat,lon`)
          if (geoResponse.ok) {
            const geoData = await geoResponse.json()
            if (geoData.status === 'success') {
              // Usar dados do IP se não temos do frontend, ou complementar
              locationData = {
                country: locationData.country || geoData.country || null,
                city: locationData.city || geoData.city || null,
                region: locationData.region || geoData.regionName || null,
                timezone: locationData.timezone || geoData.timezone || null,
                isp: locationData.isp || geoData.isp || null,
                latitude: locationData.latitude || geoData.lat || null,
                longitude: locationData.longitude || geoData.lon || null
              }
            }
          }
        }
        
        console.log('📍 Localização obtida:', locationData)
      } catch (geoError) {
        console.log('⚠️ Erro ao obter localização via IP:', geoError)
      }
    }

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
        country: locationData.country,
        city: locationData.city,
        region: locationData.region,
        timezone: locationData.timezone,
        isp: locationData.isp,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        device: device || null,
        browser: browser || null,
        ip_address: ip !== 'unknown' ? ip : null,
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
    console.log('📊 Buscando dados de analytics (sem autenticação)...')

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
