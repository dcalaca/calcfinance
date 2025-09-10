import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome_completo, email, assunto, mensagem } = body

    // Validação básica
    if (!nome_completo || !email || !assunto || !mensagem) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Obter IP e User Agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Inserir mensagem no banco
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          nome_completo: nome_completo.trim(),
          email: email.trim().toLowerCase(),
          assunto: assunto.trim(),
          mensagem: mensagem.trim(),
          ip_address: ip,
          user_agent: userAgent,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao salvar mensagem de contato:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    console.log('✅ Mensagem de contato salva:', {
      id: data[0]?.id,
      nome: nome_completo,
      email: email,
      assunto: assunto
    })

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      id: data[0]?.id
    })

  } catch (error) {
    console.error('Erro no endpoint de contato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET para listar mensagens (apenas para admins)
export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar mensagens
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Erro ao buscar mensagens:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar mensagens' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messages: messages || []
    })

  } catch (error) {
    console.error('Erro no GET de contato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
