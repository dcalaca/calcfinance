"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, BarChart3, Star } from "lucide-react"
import Link from "next/link"

export function BudgetHighlight() {
  return (
    <section className="py-8 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Conteúdo Principal */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-200 font-semibold text-sm uppercase tracking-wide">
                      DESTAQUE
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white">
                      Meu Orçamento Pessoal
                    </h2>
                  </div>
                  
                  <p className="text-white/90 text-lg mb-6 max-w-2xl">
                    Controle completo das suas finanças com gráficos interativos, 
                    categorização automática e análise mensal detalhada
                  </p>
                  
                  <Button 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 py-4 text-lg"
                    asChild
                  >
                    <Link href="/meu-orcamento">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Acessar Meu Orçamento
                    </Link>
                  </Button>
                </div>
                
                {/* Recursos em Destaque */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
                    <h3 className="text-white font-semibold text-sm">Projeções de Investimento</h3>
                    <p className="text-white/80 text-xs">Veja seu futuro financeiro</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <BarChart3 className="w-8 h-8 text-white mx-auto mb-2" />
                    <h3 className="text-white font-semibold text-sm">Análise Detalhada</h3>
                    <p className="text-white/80 text-xs">Gráficos e relatórios</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
