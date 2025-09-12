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
          </div>

          {/* Card Principal */}
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-8">
              {/* Call to Action Buttons */}
              <div className="text-center mb-12">
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                    asChild
                  >
                    <Link href="/calculadoras">
                      <Calculator className="w-5 h-5 mr-2" />
                      Começar Agora
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                    asChild
                  >
                    <Link href="/educacao">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Educação Gratuita
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Why Choose Section */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Por que escolher o CalcFy?
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  A plataforma completa para controle financeiro pessoal com ferramentas gratuitas e educação de qualidade
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* 100% Gratuito */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">100% Gratuito</h3>
                  <p className="text-slate-600">Todas as ferramentas gratuitas</p>
                </div>

                {/* Para Toda Família */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Para Toda Família</h3>
                  <p className="text-slate-600">Conteúdo para todas as idades</p>
                </div>

                {/* Sempre Atualizado */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Sempre Atualizado</h3>
                  <p className="text-slate-600">Informações sempre atuais</p>
                </div>
              </div>

              {/* CFP Highlight */}
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
