import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log('🧪 Testando busca de dados sem autenticação...')
    
    // Buscar dados sem autenticação
    const { data, error } = await supabase
      .from('site_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    console.log('📊 Dados encontrados:', data?.length || 0, 'registros')
    console.log('❌ Erro:', error)

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      data: data || [],
      error: error?.message || null
    })
  } catch (error) {
    console.error('💥 Erro no teste:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
