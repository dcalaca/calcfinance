import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Verificar se o usuário está autenticado e é autorizado
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabaseAuth.auth.getUser()
    
    if (!user || user.email !== 'dcalaca@gmail.com') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Buscar as últimas 10 visitas
    const { data, error } = await supabase
      .from('site_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Erro ao buscar visitas recentes:', error)
      return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Erro na API de visitas recentes:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
