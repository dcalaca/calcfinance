"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFinanceAuth } from "@/hooks/use-finance-auth"
import { supabase } from "@/lib/supabase"
import type { OrcamentoComItens } from "@/lib/supabase-types"
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Star,
  Archive,
  Trash2,
  Edit,
  PieChart,
  BarChart3,
  User
} from "lucide-react"
import { toast } from "sonner"
import { CurrencyInput } from "@/components/ui/currency-input"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { InvestmentProjection } from "@/components/investment-projection"
import Link from "next/link"

export default function MeuOrcamentoPage() {
  const { user, loading: authLoading } = useFinanceAuth()
  
  // Estados simplificados
  const [orcamentos, setOrcamentos] = useState<OrcamentoComItens[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [novoItem, setNovoItem] = useState({
    nome: "",
    valor: 0,
    categoria: "",
    tipo: "despesa" as "receita" | "despesa",
    data: new Date().toLocaleDateString('pt-CA'), // Formato YYYY-MM-DD sem timezone
    observacoes: ""
  })

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [filtroMes, setFiltroMes] = useState("")
  const [filtroMeses, setFiltroMeses] = useState<string[]>([])
  const [filtroItem, setFiltroItem] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState<"receita" | "despesa" | "todos">("todos")

  // Função ultra-simples para buscar itens
  const fetchItens = async () => {
    console.log("🚀 INICIANDO fetchItens - user:", user?.id)
    
    if (!user) {
      console.log("❌ Nenhum usuário, parando")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      console.log("📡 Fazendo requisição para Supabase...")
      
      const { data, error } = await supabase
        .from("calc_orcamento_itens")
        .select("*")
        .eq("user_id", user.id)

      console.log("📊 Resposta do Supabase:", { data: data?.length, error })

      if (error) {
        console.error("❌ Erro Supabase:", error)
        setError("Erro: " + error.message)
        setLoading(false)
        return
      }

      console.log("✅ Dados recebidos:", data?.length || 0, "itens")
      
      // Simplificar - apenas mostrar os itens sem agrupamento complexo
      const itensSimples = data || []
      
      // Criar um "orçamento" simples com todos os itens
      const receitas = itensSimples.filter((item: any) => item.tipo === "receita")
      const despesas = itensSimples.filter((item: any) => item.tipo === "despesa")
      
      const orcamentoSimples = {
        id: "geral",
        user_id: user.id,
        mes_referencia: "geral",
        nome: "Todos os Itens",
        descricao: "Todos os itens de receitas e despesas",
        receitas,
        despesas,
        total_receitas: (receitas || []).reduce((total: number, item: any) => {
          const valor = item?.valor ? Number(item.valor) : 0
          return total + (isNaN(valor) ? 0 : valor)
        }, 0),
        total_despesas: (despesas || []).reduce((total: number, item: any) => {
          const valor = item?.valor ? Number(item.valor) : 0
          return total + (isNaN(valor) ? 0 : valor)
        }, 0),
        saldo: 0,
        status: "ativo" as const,
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      orcamentoSimples.saldo = orcamentoSimples.total_receitas - orcamentoSimples.total_despesas
      
      console.log("✅ Orçamento criado:", orcamentoSimples)
      setOrcamentos([orcamentoSimples])
      
    } catch (error) {
      console.error("💥 ERRO GERAL:", error)
      setError("Erro: " + (error as Error).message)
    } finally {
      console.log("🏁 FINALIZANDO - setLoading(false)")
      setLoading(false)
    }
  }

  // Carregar dados quando o usuário estiver disponível
  useEffect(() => {
    console.log("🔄 useEffect executado - user:", !!user, "authLoading:", authLoading)
    
    if (user && !authLoading) {
      console.log("✅ Usuário logado, chamando fetchItens...")
      fetchItens()
    } else if (!user && !authLoading) {
      console.log("❌ Usuário não logado, limpando dados...")
      setOrcamentos([])
      setLoading(false)
    } else {
      console.log("⏳ Aguardando... user:", !!user, "authLoading:", authLoading)
    }
  }, [user, authLoading])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando seus orçamentos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Erro ao Carregar</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => fetchItens()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  // Se não estiver logado, mostrar mensagem amigável
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Meu Orçamento</h1>
            <p className="text-muted-foreground">
              Controle sua vida financeira de forma simples e eficiente
            </p>
          </div>
          
          <Card className="p-8">
            <CardContent>
              <div className="mb-6">
                <DollarSign className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
                <p className="text-muted-foreground mb-6">
                  Para usar o sistema de orçamento, você precisa estar logado.
                </p>
              </div>
              
              <div className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/login">
                    <User className="w-4 h-4 mr-2" />
                    Entrar na Conta
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/registro">
                    <User className="w-4 h-4 mr-2" />
                    Criar Conta
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-none py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meu Orçamento</h1>
          <p className="text-muted-foreground">
            Controle sua vida financeira de forma simples e eficiente
          </p>
        </div>

        {/* Conteúdo principal será adicionado aqui */}
        <div className="space-y-6">
              <Card>
                <CardContent className="p-8 text-center">
              <DollarSign className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold mb-2">Sistema de Orçamento</h2>
                  <p className="text-muted-foreground mb-4">
                Funcionalidade será restaurada em breve...
                        </p>
                      </CardContent>
                    </Card>
        </div>
      </div>
    </div>
  )
}