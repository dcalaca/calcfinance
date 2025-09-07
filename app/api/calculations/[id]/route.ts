import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    const { data: calculation, error } = await supabase
      .from('calc_calculations')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Erro ao buscar cálculo:', error)
      return NextResponse.json(
        { error: 'Cálculo não encontrado' },
        { status: 404 }
      )
    }

    if (!calculation) {
      return NextResponse.json(
        { error: 'Cálculo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(calculation)
  } catch (error) {
    console.error('Erro na API de cálculo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
