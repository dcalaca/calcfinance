"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CalculatorsCTA() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calculator className="w-8 h-8 text-blue-600" />
                <CardTitle className="text-3xl font-bold text-slate-900">
                  Calculadoras Mais Populares
                </CardTitle>
              </div>
              <CardDescription className="text-lg text-slate-600">
                Ferramentas práticas para suas decisões financeiras do dia a dia
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="text-center mb-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                    asChild
                  >
                    <Link href="/calculadoras">
                      <Calculator className="w-5 h-5 mr-2" />
                      Usar Calculadoras
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                    asChild
                  >
                    <Link href="/educacao">
                      Educação Gratuita
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-slate-600 mb-4">
                  Acesse calculadoras de juros compostos, financiamentos, aposentadoria, conversor de moedas e muito mais!
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Juros Compostos</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Financiamentos</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Aposentadoria</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Conversor de Moedas</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Inflação</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Investimentos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
