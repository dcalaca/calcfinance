import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, TrendingUp, BookOpen, Shield, Users, Zap, DollarSign } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Principal */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
              Transforme sua
              <span className="text-blue-600"> Vida Financeira</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Calculadoras avançadas, notícias em tempo real e educação gratuita para você tomar as melhores decisões
              financeiras
            </p>

            {/* CFP Highlight */}
            <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 max-w-4xl mx-auto">
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/calculadoras">
                  <Calculator className="w-5 h-5 mr-2" />
                  Começar Agora
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent" asChild>
                <Link href="/educacao">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Educação Gratuita
                </Link>
              </Button>
            </div>
          </div>

          {/* Benefícios - Versão Compacta */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-center text-slate-900 mb-6">Por que escolher o FinanceHub?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">100% Gratuito</h3>
                  <p className="text-slate-600 text-xs">Todas as ferramentas gratuitas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Para Toda Família</h3>
                  <p className="text-slate-600 text-xs">Conteúdo para todas as idades</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Sempre Atualizado</h3>
                  <p className="text-slate-600 text-xs">Informações sempre atuais</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
