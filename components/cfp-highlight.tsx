"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign } from "lucide-react"
import Link from "next/link"

export function CFPHighlight() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* CFP Highlight */}
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-8">
              <div className="p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <h3 className="text-2xl font-bold text-slate-900">CFP - Controle Financeiro Pessoal</h3>
                  </div>
                  <p className="text-lg text-slate-700 mb-6 max-w-3xl mx-auto">
                    Gerencie suas receitas e despesas com gráficos interativos, filtros avançados e orientações inteligentes. 
                    Tudo em uma ferramenta completa e gratuita!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold"
                      asChild
                    >
                      <Link href="/registro">
                        <Calculator className="w-5 h-5 mr-2" />
                        Criar Conta Gratuita
                      </Link>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold"
                      asChild
                    >
                      <Link href="/cfp">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Ver Demonstração
                      </Link>
                    </Button>
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
