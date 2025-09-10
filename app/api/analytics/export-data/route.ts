import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Exportando dados de analytics...')

    // Extrair parâmetros de filtro da URL
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const device = searchParams.get('device')
    const browser = searchParams.get('browser')
    const page = searchParams.get('page')
    const country = searchParams.get('country')
    const referrer = searchParams.get('referrer')
    const search = searchParams.get('search')

    // Construir query base
    let query = supabase.from('site_analytics').select('*')

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
    if (referrer && referrer !== 'all') {
      if (referrer === 'direct') {
        query = query.is('referrer', null)
      } else if (referrer === 'other') {
        query = query.not('referrer', 'is', null)
          .not('referrer', 'ilike', '%google.com%')
          .not('referrer', 'ilike', '%facebook.com%')
          .not('referrer', 'ilike', '%instagram.com%')
          .not('referrer', 'ilike', '%linkedin.com%')
          .not('referrer', 'ilike', '%twitter.com%')
          .not('referrer', 'ilike', '%youtube.com%')
      } else {
        query = query.ilike('referrer', `%${referrer}%`)
      }
    }
    if (search) {
      query = query.or(`page.ilike.%${search}%,country.ilike.%${search}%,city.ilike.%${search}%`)
    }

    console.log('🔍 Buscando todos os dados filtrados para exportação...')
    // Buscar TODOS os dados filtrados (sem limite)
    const { data, error } = await query
      .order('created_at', { ascending: false })

    console.log('📊 Dados para exportação encontrados:', data?.length || 0, 'registros')
    console.log('❌ Erro exportação:', error)

    if (error) {
      console.error('💥 Erro ao buscar dados para exportação:', error)
      return NextResponse.json({ error: 'Erro ao buscar dados', details: error.message }, { status: 500 })
    }

    console.log('✅ Retornando dados para exportação:', data)
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Erro na API de exportação:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
