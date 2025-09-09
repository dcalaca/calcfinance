import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log('🧪 Testando campos da tabela site_analytics...')
    
    // Buscar apenas os campos de localização
    const { data, error } = await supabase
      .from('site_analytics')
      .select('id, page, country, city, region, timezone, isp, latitude, longitude, ip_address')
      .order('created_at', { ascending: false })
      .limit(5)

    console.log('📊 Dados encontrados:', data?.length || 0, 'registros')
    console.log('❌ Erro:', error)
    console.log('📋 Campos retornados:', data)

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      data: data || [],
      error: error?.message || null,
      sampleRecord: data?.[0] || null
    })
  } catch (error) {
    console.error('💥 Erro no teste:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 })
  }
}
