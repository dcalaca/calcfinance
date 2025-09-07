import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // TEMPORARIAMENTE DESABILITADO PARA TESTE
  console.log("🔧 Middleware - Rota:", pathname)
  console.log("🔧 Middleware - Middleware executado!")
  
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
    console.log("✅ Middleware - Permitindo acesso (desabilitado temporariamente)")
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
