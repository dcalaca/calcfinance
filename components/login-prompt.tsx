"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User, Lock, Save, X } from "lucide-react"
import Link from "next/link"

interface LoginPromptProps {
  children: React.ReactNode
  title?: string
  description?: string
  onLoginSuccess?: () => void
}

export function LoginPrompt({ 
  children, 
  title = "Salvar Cálculo",
  description = "Faça login para salvar seus cálculos e acessá-los depois",
  onLoginSuccess
}: LoginPromptProps) {
  const [open, setOpen] = useState(false)

  const handleLoginSuccess = () => {
    setOpen(false)
    onLoginSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Save className="h-8 w-8 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium mb-2">
              🚀 Cadastro Super Simples!
            </p>
            <p className="text-green-700 text-sm">
              Apenas <strong>nome</strong> e <strong>email</strong> - sem complicações!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
              <Link href="/registro" onClick={handleLoginSuccess}>
                <User className="h-4 w-4 mr-2" />
                Criar Conta (Gratuito)
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/login" onClick={handleLoginSuccess}>
                <Lock className="h-4 w-4 mr-2" />
                Já tenho conta
              </Link>
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-slate-500 text-center">
              ✨ Conta gratuita • Sem cartão de crédito • Acesso imediato
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
