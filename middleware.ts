import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
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
    // Log para debug - descobrir nome do cookie
    const allCookies = request.cookies.getAll()
    console.log("🔧 Middleware - Rota:", pathname)
    console.log("🔧 Middleware - Cookies disponíveis:", allCookies.map(c => c.name))
    
    // Verificar se há token de autenticação no cookie
    // O Supabase pode usar diferentes nomes de cookie
    const supabaseAuthToken = request.cookies.get('sb-kfsteismyqpekbaqwuez-auth-token') ||
                              request.cookies.get('sb-kfsteismyqpekbaqwuez-auth-token.0') ||
                              request.cookies.get('sb-kfsteismyqpekbaqwuez-auth-token.1')
    
    // Verificar se há qualquer cookie do Supabase
    const hasSupabaseCookie = allCookies.some(cookie => 
      cookie.name.includes('sb-') && cookie.name.includes('auth')
    )
    
    console.log("🔧 Middleware - Cookie específico encontrado:", !!supabaseAuthToken)
    console.log("🔧 Middleware - Qualquer cookie Supabase:", hasSupabaseCookie)
    
    if (!supabaseAuthToken && !hasSupabaseCookie) {
      console.log("❌ Middleware - Redirecionando para login")
      // Redirecionar para login com parâmetro de retorno
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    } else {
      console.log("✅ Middleware - Permitindo acesso")
    }
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
