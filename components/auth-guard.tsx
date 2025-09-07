"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFinanceAuth } from '@/hooks/use-finance-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Lock, User } from 'lucide-react'
import Link from 'next/link'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useFinanceAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      setIsChecking(false)
    }
  }, [loading])

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full mx-4">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
              <CardDescription className="text-lg">
                Você precisa estar logado para usar as calculadoras
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                Crie sua conta gratuita e tenha acesso a todas as ferramentas financeiras
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href="/login">
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/registro">
                    Criar Conta
                  </Link>
                </Button>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-slate-500">
                  ✨ Conta gratuita • Sem cartão de crédito • Acesso imediato
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
