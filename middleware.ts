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
    '/historico'
  ]
  
  // Verificar se a rota atual precisa de autenticação
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  if (isProtectedRoute) {
    // Verificar se há token de autenticação no cookie
    // O Supabase pode usar diferentes nomes de cookie
    const supabaseAuthToken = request.cookies.get('sb-kfsteismyqpekbaqwuez-auth-token') ||
                              request.cookies.get('sb-kfsteismyqpekbaqwuez-auth-token.0') ||
                              request.cookies.get('sb-kfsteismyqpekbaqwuez-auth-token.1')
    
    console.log("🔧 Middleware - Rota protegida:", pathname)
    console.log("🔧 Middleware - Cookie encontrado:", !!supabaseAuthToken)
    console.log("🔧 Middleware - Cookies disponíveis:", request.cookies.getAll().map(c => c.name))
    
    if (!supabaseAuthToken) {
      console.log("❌ Middleware - Redirecionando para login")
      // Redirecionar para login com parâmetro de retorno
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/calculadoras/:path*',
    '/dashboard/:path*',
    '/historico/:path*'
  ]
}
