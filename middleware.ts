import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
    
    // Verificar todos os cookies disponíveis
    const allCookies = request.cookies.getAll()
    console.log("🍪 Todos os cookies:", allCookies.map(c => c.name))
    
    // Verificar se há cookies do Supabase (qualquer um que comece com 'sb-')
    const supabaseCookies = allCookies.filter(cookie => 
      cookie.name.startsWith('sb-') || 
      cookie.name.includes('supabase') ||
      cookie.name.includes('session')
    )
    
    console.log("🔐 Cookies do Supabase encontrados:", supabaseCookies.map(c => c.name))
    
    // Verificar se há pelo menos um cookie do Supabase
    const hasSupabaseCookie = supabaseCookies.length > 0
    
    if (!hasSupabaseCookie) {
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
