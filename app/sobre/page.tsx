import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Target, Users, Award, Heart, Zap } from "lucide-react"

export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Sobre o <span className="text-blue-600">CalcFinance</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Sua plataforma completa para cálculos financeiros, educação e notícias do mercado brasileiro
          </p>
        </div>

        {/* Missão */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Target className="h-8 w-8 text-blue-600" />
              Nossa Missão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-700 leading-relaxed">
              Democratizar o acesso à educação financeira e ferramentas de cálculo, 
              oferecendo uma plataforma gratuita e intuitiva para todos os brasileiros 
              que desejam tomar decisões financeiras mais informadas e conscientes.
            </p>
          </CardContent>
        </Card>

        {/* Valores */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Heart className="h-6 w-6 text-red-500" />
                Nossos Valores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Transparência:</strong> Cálculos claros e explicados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Gratuidade:</strong> Acesso livre para todos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Simplicidade:</strong> Interface intuitiva e fácil</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Precisão:</strong> Cálculos confiáveis e atualizados</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Users className="h-6 w-6 text-green-500" />
                Para Quem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Pessoas físicas:</strong> Planejamento pessoal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Estudantes:</strong> Aprendizado financeiro</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Profissionais:</strong> Ferramentas de trabalho</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Empresários:</strong> Análises de negócio</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Funcionalidades */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Calculator className="h-8 w-8 text-blue-600" />
              Nossas Ferramentas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Juros Compostos</h3>
                <p className="text-sm text-slate-600">Calcule o crescimento do seu dinheiro ao longo do tempo</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Financiamentos</h3>
                <p className="text-sm text-slate-600">Compare sistemas PRICE e SAC para imóveis e veículos</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Notícias</h3>
                <p className="text-sm text-slate-600">Mantenha-se atualizado com o mercado financeiro</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diferenciais */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Award className="h-8 w-8 text-yellow-500" />
              Por Que Escolher o CalcFinance?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Atualização em Tempo Real</h4>
                    <p className="text-slate-600 text-sm">Notícias e dados sempre atualizados</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">100% Gratuito</h4>
                    <p className="text-slate-600 text-sm">Sem taxas ou assinaturas ocultas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Focado no Brasil</h4>
                    <p className="text-slate-600 text-sm">Ferramentas adaptadas para o mercado brasileiro</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Target className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Interface Intuitiva</h4>
                    <p className="text-slate-600 text-sm">Fácil de usar, mesmo para iniciantes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Calculator className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Cálculos Precisos</h4>
                    <p className="text-slate-600 text-sm">Algoritmos testados e confiáveis</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Award className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Educação Financeira</h4>
                    <p className="text-slate-600 text-sm">Aprenda enquanto calcula</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Nossos Números</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-slate-600">Gratuito</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-slate-600">Disponível</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">BR</div>
                <div className="text-slate-600">Focado</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">∞</div>
                <div className="text-slate-600">Possibilidades</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Pronto para Começar?</h3>
            <p className="text-lg mb-6 opacity-90">
              Explore nossas ferramentas e transforme sua relação com o dinheiro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/calculadoras" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
              >
                Ver Calculadoras
              </a>
              <a 
                href="/noticias" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Ler Notícias
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
