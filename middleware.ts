import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // TEMPORARIAMENTE DESABILITADO PARA DEBUG
  console.log("🔧 Middleware - Rota:", pathname)
  console.log("🔧 Middleware - Cookies disponíveis:", request.cookies.getAll().map(c => c.name))
  
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
    console.log("🔧 Middleware - Rota protegida detectada:", pathname)
    
    // Verificar se há token de autenticação no cookie
    // O Supabase pode usar diferentes nomes de cookie
    const supabaseAuthToken = request.cookies.get('sb-kfsteismyqpekbaqwuez-auth-token') ||
                              request.cookies.get('sb-kfsteismyqpekbaqwuez-auth-token.0') ||
                              request.cookies.get('sb-kfsteismyqpekbaqwuez-auth-token.1')
    
    console.log("🔧 Middleware - Cookie encontrado:", !!supabaseAuthToken)
    
    // TEMPORARIAMENTE PERMITINDO ACESSO PARA DEBUG
    if (!supabaseAuthToken) {
      console.log("⚠️ Middleware - Cookie não encontrado, mas permitindo acesso para debug")
      // return NextResponse.redirect(loginUrl)
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
