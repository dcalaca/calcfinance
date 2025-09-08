import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
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
