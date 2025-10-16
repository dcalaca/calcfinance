"use client"

import type React from "react"
import { useState, Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

function LoginFormContent() {
  const { user, loading, timeoutReached, signIn } = useAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirecionar usuário logado apenas uma vez
  useEffect(() => {
    if (user && !loading && !hasRedirected) {
      console.log("🔄 Usuário logado detectado, redirecionando para dashboard...")
      setHasRedirected(true)
      
      // Tentar múltiplas formas de redirecionamento
      try {
        router.push('/dashboard')
        console.log("✅ router.push() chamado")
        
        // Fallback: usar window.location se router não funcionar
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            console.log("⚠️ router.push() não funcionou, usando window.location")
            window.location.href = '/dashboard'
          }
        }, 1000)
      } catch (error) {
        console.error("❌ Erro no router.push():", error)
        window.location.href = '/dashboard'
      }
    }
  }, [user, loading, hasRedirected, router])

  // Se usuário já está logado, mostrar loading de redirecionamento
  if (user && !hasRedirected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/calcfy-logo.svg"
              alt="CalcFy"
              width={120}
              height={48}
              className="mx-auto mb-4 h-12 w-auto"
              priority
            />
            <h1 className="text-2xl font-bold text-slate-900">Redirecionando...</h1>
            <p className="text-slate-600">Você já está logado</p>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar erro se timeout foi atingido
  if (timeoutReached) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/calcfy-logo.svg"
              alt="CalcFy"
              width={120}
              height={48}
              className="mx-auto mb-4 h-12 w-auto"
              priority
            />
            <h1 className="text-2xl font-bold text-red-600">Erro de Conexão</h1>
            <p className="text-slate-600 mb-4">Não foi possível verificar sua autenticação</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar loading enquanto verifica
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/calcfy-logo.svg"
              alt="CalcFy"
              width={120}
              height={48}
              className="mx-auto mb-4 h-12 w-auto"
              priority
            />
            <h1 className="text-2xl font-bold text-slate-900">Verificando...</h1>
            <p className="text-slate-600">Aguarde um momento</p>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.email || !formData.password) {
      toast.error("Por favor, preencha todos os campos")
      setIsSubmitting(false)
      return
    }

    try {
      const { data, error } = await signIn(formData.email, formData.password)
      
      if (error) {
        toast.error("Email ou senha incorretos")
      } else if (data?.user) {
        toast.success("Login realizado com sucesso!")
        
        // Aguardar um pouco para garantir que o estado de auth seja atualizado
        setTimeout(() => {
          console.log("🔄 Tentando redirecionar após login...")
          router.push('/dashboard')
          
          // Fallback se router não funcionar
          setTimeout(() => {
            if (window.location.pathname === '/login') {
              console.log("⚠️ router.push() não funcionou após login, usando window.location")
              window.location.href = '/dashboard'
            }
          }, 1000)
        }, 500)
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/calcfy-logo.svg"
            alt="CalcFy"
            width={120}
            height={48}
            className="mx-auto mb-4 h-12 w-auto"
            priority
          />
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h1>
          <p className="text-slate-600">Entre em sua conta para continuar</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Digite suas credenciais para acessar sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/esqueci-senha" className="text-sm text-blue-600 hover:text-blue-800">
                  Esqueci minha senha
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Não tem uma conta?{" "}
                  <Link href="/registro" className="text-blue-600 hover:text-blue-800 font-medium">
                    Cadastre-se gratuitamente
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoginForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/calcfy-logo.svg"
              alt="CalcFy"
              width={120}
              height={48}
              className="mx-auto mb-4 h-12 w-auto"
              priority
            />
            <h1 className="text-2xl font-bold text-slate-900">Carregando...</h1>
            <p className="text-slate-600">Aguarde um momento</p>
          </div>
        </div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  )
}

export default function LoginPage() {
  return <LoginForm />
}