import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testando autenticação...')
    
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
        },
      }
    )
    
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser()
    console.log('👤 Usuário encontrado:', user?.email || 'Nenhum')
    console.log('❌ Erro de auth:', authError)
    
    return NextResponse.json({
      user: user?.email || null,
      error: authError?.message || null,
      cookies: cookieStore.getAll().map(c => c.name)
    })
  } catch (error) {
    console.error('💥 Erro no teste:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 })
  }
}
