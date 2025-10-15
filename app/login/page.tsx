"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useFinanceAuth } from "@/hooks/use-finance-auth"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

function LoginFormContent() {
  console.log("🚀 LoginFormContent iniciado")
  
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { user, loading, signIn } = useFinanceAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  // Debug simples
  console.log("🔍 Estado:", { user: !!user, loading, isRedirecting })

  // Sem redirecionamento automático - apenas manual após login
  useEffect(() => {
    if (user && !loading) {
      console.log("✅ Usuário já está logado, mas não redirecionando automaticamente")
      console.log("💡 Clique em 'Entrar' para ir para o dashboard")
    }
  }, [user, loading])
  
  // Debug da renderização do botão
  useEffect(() => {
    console.log("🔍 Renderização do botão:", { user: !!user, userEmail: user?.email })
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🔐 Formulário submetido!")
    setIsSubmitting(true)

    if (!formData.email || !formData.password) {
      toast.error("Por favor, preencha todos os campos")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("🔐 Tentando fazer login com:", formData.email)
      
      const { data, error } = await signIn(formData.email, formData.password)
      
      if (error) {
        console.error("❌ Erro no login:", error)
        toast.error("Email ou senha incorretos")
      } else if (data?.user) {
        console.log("✅ Login realizado com sucesso!")
        toast.success("Login realizado com sucesso!")
        
        // Não redirecionar automaticamente - mostrar botão
        console.log("🎉 Login bem-sucedido! Use o botão abaixo para ir ao dashboard")
      }
    } catch (error) {
      console.error("💥 Erro inesperado:", error)
      toast.error("Erro inesperado. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Carregando...</h1>
          <p className="text-slate-600">Aguarde um momento</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image 
            src="/logo.png" 
            alt="FinanceHub" 
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
              
              {/* Botão de redirecionamento quando logado */}
              {user && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => {
                    console.log("🚀 Redirecionamento manual para:", redirectTo)
                    window.location.href = redirectTo
                  }}
                >
                  🚀 Ir para Dashboard
                </Button>
              )}
              
              {/* Debug do botão removido - causava erro de build */}
            </form>

            {/* Botão de teste sempre visível */}
            <div className="mt-4">
              <Button 
                type="button" 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  console.log("🧪 TESTE - Estado atual:", { user: !!user, userEmail: user?.email })
                  if (user) {
                    console.log("🚀 Usuário logado, redirecionando...")
                    window.location.href = redirectTo
                  } else {
                    console.log("❌ Usuário não logado")
                  }
                }}
              >
                🧪 TESTE: Ir para Dashboard
              </Button>
            </div>

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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Carregando...</h1>
          <p className="text-slate-600">Aguarde um momento</p>
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