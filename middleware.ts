import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log("🔧 Middleware - Rota:", pathname)
  
  // Rotas que precisam de autenticação
  const protectedRoutes = [
    '/calculadoras',
    '/calculadoras/juros-compostos',
    '/calculadoras/financiamento',
    '/calculadoras/financiamento-veicular',
    '/dashboard',
    '/historico',
    '/meu-orcamento'
  ]
  
  // Verificar se a rota atual precisa de autenticação
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  if (isProtectedRoute) {
    console.log("🔧 Middleware - Rota protegida detectada:", pathname)
    
    // Criar cliente Supabase para verificar autenticação
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
        },
      }
    )
    
    // Verificar se o usuário está autenticado
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        console.log("🔐 Middleware - Usuário encontrado:", user?.email || "Nenhum")
        return !!user
      } catch (error) {
        console.error("❌ Middleware - Erro ao verificar autenticação:", error)
        return false
      }
    }
    
    // Verificar autenticação de forma síncrona usando cookies
    const authToken = request.cookies.get('sb-kfsteismyqpekbaqwuez-auth-token')?.value
    const hasAuthToken = !!authToken
    
    console.log("🔐 Middleware - Token de auth encontrado:", hasAuthToken)
    
    if (!hasAuthToken) {
      console.log("❌ Middleware - Usuário não autenticado, redirecionando para login")
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    console.log("✅ Middleware - Usuário autenticado, permitindo acesso")
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/calculadoras/:path*',
    '/dashboard/:path*',
    '/historico/:path*',
    '/meu-orcamento/:path*'
  ]
}
