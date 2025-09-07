import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Buscando cálculo com ID:', params.id)
    
    const { data: calculation, error } = await supabase
      .from('calc_calculations')
      .select('*')
      .eq('id', params.id)
      .single()

    console.log('📊 Resultado da busca:', { calculation, error })

    if (error) {
      console.error('❌ Erro ao buscar cálculo:', error)
      return NextResponse.json(
        { error: 'Cálculo não encontrado', details: error.message },
        { status: 404 }
      )
    }

    if (!calculation) {
      console.log('⚠️ Cálculo não encontrado no banco')
      return NextResponse.json(
        { error: 'Cálculo não encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Cálculo encontrado:', calculation.id)
    return NextResponse.json(calculation)
  } catch (error) {
    console.error('💥 Erro na API de cálculo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
