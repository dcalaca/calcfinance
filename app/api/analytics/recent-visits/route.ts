import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('🔐 Verificando autenticação (visitas recentes)...')
    
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
          set(name: string, value: string, options: any) {
            console.log(`🍪 Setando cookie ${name}`)
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: any) {
            console.log(`🍪 Removendo cookie ${name}`)
            cookieStore.delete(name)
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
    if (search) {
      query = query.or(`page.ilike.%${search}%,country.ilike.%${search}%,city.ilike.%${search}%`)
    }

    console.log('🔍 Buscando visitas recentes...')
    // Buscar as últimas 20 visitas (aumentado para mostrar mais dados filtrados)
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(20)

    console.log('📊 Visitas recentes encontradas:', data?.length || 0, 'registros')
    console.log('❌ Erro visitas recentes:', error)

    if (error) {
      console.error('💥 Erro ao buscar visitas recentes:', error)
      return NextResponse.json({ error: 'Erro ao buscar dados', details: error.message }, { status: 500 })
    }

    console.log('✅ Retornando visitas recentes:', data)
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Erro na API de visitas recentes:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
