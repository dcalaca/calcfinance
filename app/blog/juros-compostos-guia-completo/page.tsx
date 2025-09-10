import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowLeft, Calculator, TrendingUp, Target, DollarSign, Zap, BookOpen } from "lucide-react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Juros Compostos: O Guia Completo para Multiplicar Seu Dinheiro | CalcFy",
  description: "Entenda como os juros compostos funcionam e como usar essa força para construir riqueza ao longo do tempo. Guia completo com exemplos práticos e calculadoras.",
  keywords: [
    "juros compostos",
    "como funcionam juros compostos",
    "multiplicar dinheiro",
    "construir riqueza",
    "investimentos",
    "educação financeira",
    "fórmula juros compostos",
    "exemplo juros compostos"
  ],
  openGraph: {
    title: "Juros Compostos: O Guia Completo para Multiplicar Seu Dinheiro",
    description: "Entenda como os juros compostos funcionam e como usar essa força para construir riqueza ao longo do tempo.",
    type: "article",
    publishedTime: "2024-01-10T00:00:00.000Z",
    authors: ["Equipe CalcFy"],
    tags: ["juros compostos", "investimentos", "educação financeira"]
  }
}

export default function JurosCompostosGuiaCompletoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-green-600">Investimentos</Badge>
              <Badge variant="outline">Guia Completo</Badge>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Juros Compostos: O Guia Completo para Multiplicar Seu Dinheiro
            </h1>
            
            <div className="flex items-center gap-6 text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Equipe CalcFy</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>10 de Janeiro de 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>7 min de leitura</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Juros Compostos - Guia Completo para Multiplicar Dinheiro - Crescimento exponencial de investimentos"
              width={800}
              height={400}
              className="w-full h-64 lg:h-80 object-cover rounded-lg"
            />
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
              <p className="text-lg font-semibold text-green-800 mb-2">
                Albert Einstein disse que os juros compostos são "a oitava maravilha do mundo".
              </p>
              <p className="text-green-700">
                E ele estava certo. Entender e dominar os juros compostos é a chave para construir riqueza ao longo do tempo.
              </p>
            </div>

            <p className="text-lg text-slate-700 mb-6">
              Os juros compostos são o fenômeno que faz seu dinheiro crescer de forma exponencial. É quando você ganha juros sobre juros, criando um efeito "bola de neve" que pode transformar pequenos investimentos em grandes fortunas ao longo do tempo.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              O que são Juros Compostos?
            </h2>

            <p className="text-slate-700 mb-6">
              <strong>Juros compostos</strong> são os juros calculados sobre o valor principal mais os juros acumulados de períodos anteriores. Diferente dos juros simples, que são calculados apenas sobre o valor inicial, os juros compostos crescem exponencialmente.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Fórmula dos Juros Compostos</h3>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-center text-lg font-mono text-blue-800">
                  <strong>M = C × (1 + i)^t</strong>
                </p>
              </div>
              <div className="mt-4 space-y-2 text-blue-800">
                <p><strong>M</strong> = Montante final</p>
                <p><strong>C</strong> = Capital inicial</p>
                <p><strong>i</strong> = Taxa de juros (em decimal)</p>
                <p><strong>t</strong> = Tempo (em períodos)</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Juros Simples vs Juros Compostos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
                    Juros Simples
                  </h3>
                  <div className="space-y-3">
                    <p className="text-slate-600">
                      <strong>Fórmula:</strong> J = C × i × t
                    </p>
                    <p className="text-slate-600">
                      <strong>Característica:</strong> Juros calculados apenas sobre o capital inicial
                    </p>
                    <p className="text-slate-600">
                      <strong>Crescimento:</strong> Linear
                    </p>
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-red-700 text-sm">
                        <strong>Exemplo:</strong> R$ 1.000 a 10% ao ano por 10 anos = R$ 1.000 + R$ 1.000 = R$ 2.000
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
                    Juros Compostos
                  </h3>
                  <div className="space-y-3">
                    <p className="text-slate-600">
                      <strong>Fórmula:</strong> M = C × (1 + i)^t
                    </p>
                    <p className="text-slate-600">
                      <strong>Característica:</strong> Juros calculados sobre capital + juros acumulados
                    </p>
                    <p className="text-slate-600">
                      <strong>Crescimento:</strong> Exponencial
                    </p>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-green-700 text-sm">
                        <strong>Exemplo:</strong> R$ 1.000 a 10% ao ano por 10 anos = R$ 2.594
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Exemplo Prático: A Diferença é Enorme!
            </h2>

            <div className="bg-slate-100 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Cenário: R$ 1.000 investidos por 20 anos a 10% ao ano</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Juros Simples</h4>
                  <p className="text-red-700 text-2xl font-bold">R$ 3.000</p>
                  <p className="text-red-600 text-sm">Ganho: R$ 2.000</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Juros Compostos</h4>
                  <p className="text-green-700 text-2xl font-bold">R$ 6.728</p>
                  <p className="text-green-600 text-sm">Ganho: R$ 5.728</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800 font-semibold">
                  💡 Diferença: R$ 3.728 a mais com juros compostos!
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Os 3 Pilares dos Juros Compostos
            </h2>

            <div className="space-y-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      1. Capital Inicial
                    </h3>
                  </div>
                  <p className="text-slate-600 mb-3">
                    Quanto mais você investir inicialmente, maior será o efeito dos juros compostos.
                  </p>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-blue-700 text-sm">
                      <strong>Dica:</strong> Mesmo com pouco dinheiro, comece! R$ 100 hoje é melhor que R$ 1.000 daqui a 10 anos.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      2. Taxa de Retorno
                    </h3>
                  </div>
                  <p className="text-slate-600 mb-3">
                    Pequenas diferenças na taxa de retorno fazem uma diferença enorme no longo prazo.
                  </p>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-green-700 text-sm">
                      <strong>Exemplo:</strong> 8% vs 10% ao ano em 30 anos: R$ 10.063 vs R$ 17.449 (diferença de 73%!)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      3. Tempo
                    </h3>
                  </div>
                  <p className="text-slate-600 mb-3">
                    O tempo é o fator mais poderoso dos juros compostos. Quanto mais tempo, maior o efeito.
                  </p>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-purple-700 text-sm">
                      <strong>Regra:</strong> Começar 10 anos antes pode significar o dobro do dinheiro no final.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Exemplos Reais de Juros Compostos
            </h2>

            <div className="space-y-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    📈 Exemplo 1: Investimento Mensal
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700 mb-3">
                      <strong>Cenário:</strong> R$ 500 por mês durante 30 anos a 0,7% ao mês (8,5% ao ano)
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">R$ 1.080.000</p>
                        <p className="text-sm text-slate-600">Valor Final</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">R$ 180.000</p>
                        <p className="text-sm text-slate-600">Total Investido</p>
                      </div>
                    </div>
                    <p className="text-center mt-3 text-slate-700">
                      <strong>Ganho com juros compostos: R$ 900.000!</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    🏠 Exemplo 2: Aposentadoria
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700 mb-3">
                      <strong>Cenário:</strong> R$ 1.000 por mês dos 25 aos 65 anos (40 anos) a 0,6% ao mês (7,5% ao ano)
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">R$ 3.200.000</p>
                        <p className="text-sm text-slate-600">Valor Final</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">R$ 480.000</p>
                        <p className="text-sm text-slate-600">Total Investido</p>
                      </div>
                    </div>
                    <p className="text-center mt-3 text-slate-700">
                      <strong>Ganho com juros compostos: R$ 2.720.000!</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Como Aproveitar ao Máximo os Juros Compostos
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h4 className="font-semibold text-green-800 mb-2">✅ Comece Cedo</h4>
                <p className="text-green-700">Mesmo com pouco dinheiro, comece o quanto antes. O tempo é seu maior aliado.</p>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h4 className="font-semibold text-blue-800 mb-2">✅ Seja Consistente</h4>
                <p className="text-blue-700">Invista regularmente, mesmo que seja um valor pequeno. A consistência é fundamental.</p>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                <h4 className="font-semibold text-purple-800 mb-2">✅ Reinvesta os Rendimentos</h4>
                <p className="text-purple-700">Não gaste os juros recebidos. Deixe-os trabalhando para você.</p>
              </div>
              
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                <h4 className="font-semibold text-orange-800 mb-2">✅ Busque Boas Taxas</h4>
                <p className="text-orange-700">Pequenas diferenças na taxa fazem grande diferença no longo prazo.</p>
              </div>
              
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <h4 className="font-semibold text-red-800 mb-2">✅ Evite Resgates Prematuros</h4>
                <p className="text-red-700">Cada resgate interrompe o efeito dos juros compostos. Tenha disciplina.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Calculadora de Juros Compostos
            </h2>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">
                Simule seus Investimentos
              </h3>
              <p className="text-blue-100 mb-6">
                Use nossa calculadora para ver o poder dos juros compostos com seus próprios números.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/calculadoras/juros-compostos">
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculadora de Juros Compostos
                </Link>
              </Button>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Erros que Quebram o Efeito dos Juros Compostos
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">❌ Resgatar Dinheiro Constantemente</h4>
                <p className="text-red-700">Cada resgate interrompe o crescimento exponencial. Tenha uma reserva de emergência separada.</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">❌ Não Reinvestir os Rendimentos</h4>
                <p className="text-red-700">Gastar os juros recebidos quebra o efeito dos juros compostos. Reinvista sempre.</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">❌ Investir em Aplicações de Baixa Rentabilidade</h4>
                <p className="text-red-700">Poupança e renda fixa com baixa taxa limitam o crescimento. Busque boas oportunidades.</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">❌ Não Ser Paciente</h4>
                <p className="text-red-700">Juros compostos precisam de tempo para mostrar seu poder. Seja paciente e consistente.</p>
              </div>
            </div>

            <div className="bg-green-600 text-white rounded-lg p-8 text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para Multiplicar seu Dinheiro?
              </h3>
              <p className="text-green-100 mb-6">
                Use nossas calculadoras para simular diferentes cenários e encontrar a melhor estratégia para seus objetivos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/calculadoras/juros-compostos">
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculadora de Juros Compostos
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600" asChild>
                  <Link href="/calculadoras/investimentos">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Calculadora de Investimentos
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600" asChild>
                  <Link href="/calculadoras">
                    Ver Todas as Calculadoras
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
