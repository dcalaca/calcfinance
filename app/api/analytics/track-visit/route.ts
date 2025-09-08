import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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

    // Inserir dados de acesso no Supabase
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
      console.error('Erro ao salvar analytics:', error)
      return NextResponse.json({ error: 'Erro ao salvar dados' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Erro na API de analytics:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Verificar se o usuário está autenticado e é autorizado
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabaseAuth.auth.getUser()
    
    if (!user || user.email !== 'dcalaca@gmail.com') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Buscar estatísticas gerais
    const { data: totalVisits, error: totalError } = await supabase
      .from('site_analytics')
      .select('*', { count: 'exact' })

    const { data: todayVisits, error: todayError } = await supabase
      .from('site_analytics')
      .select('*', { count: 'exact' })
      .gte('created_at', new Date().toISOString().split('T')[0])

    const { data: topPages, error: pagesError } = await supabase
      .from('site_analytics')
      .select('page')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    if (totalError || todayError || pagesError) {
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

    return NextResponse.json({
      totalVisits: totalVisits?.length || 0,
      todayVisits: todayVisits?.length || 0,
      topPages: topPagesList
    })
  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
  }
}
