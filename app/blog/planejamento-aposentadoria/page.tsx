import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowLeft, Calculator, TrendingUp, Shield, Target } from "lucide-react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Planejamento para Aposentadoria: Nunca é Cedo Demais | CalcFy",
  description: "Aprenda a planejar sua aposentadoria desde cedo e garanta uma velhice tranquila e financeiramente segura. Guia completo com estratégias e calculadoras.",
  keywords: [
    "planejamento aposentadoria",
    "aposentadoria",
    "previdência privada",
    "investimentos aposentadoria",
    "INSS",
    "educação financeira",
    "juros compostos aposentadoria"
  ],
  openGraph: {
    title: "Planejamento para Aposentadoria: Nunca é Cedo Demais",
    description: "Aprenda a planejar sua aposentadoria desde cedo e garanta uma velhice tranquila e financeiramente segura.",
    type: "article",
    publishedTime: "2024-01-01T00:00:00.000Z",
    authors: ["Equipe CalcFy"],
    tags: ["aposentadoria", "planejamento financeiro", "investimentos"]
  }
}

export default function PlanejamentoAposentadoriaPage() {
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
              <Badge className="bg-green-600">Planejamento</Badge>
              <Badge variant="outline">Educação Financeira</Badge>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Planejamento para Aposentadoria: Nunca é Cedo Demais
            </h1>
            
            <div className="flex items-center gap-6 text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Equipe CalcFy</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>1 de Janeiro de 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>8 min de leitura</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <Image
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Planejamento para Aposentadoria - Educação Financeira - Planejamento de longo prazo"
              width={800}
              height={400}
              className="w-full h-64 lg:h-80 object-cover rounded-lg"
            />
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
              <p className="text-lg font-semibold text-green-800 mb-2">
                A aposentadoria não é apenas uma data no calendário — é o resultado de décadas de planejamento inteligente.
              </p>
              <p className="text-green-700">
                Quanto antes você começar a se preparar, mais tranquila e confortável será sua velhice.
              </p>
            </div>

            <p className="text-lg text-slate-700 mb-6">
              Muitas pessoas adiam o planejamento da aposentadoria pensando que ainda têm tempo. Mas a verdade é que <strong>o tempo é seu maior aliado</strong> quando se trata de construir uma reserva para o futuro.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Por que começar cedo faz toda diferença?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Calculator className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-slate-900">
                      Juros Compostos
                    </h3>
                  </div>
                  <p className="text-slate-600">
                    Quem começa aos 25 anos precisa guardar muito menos por mês do que quem começa aos 40 para ter o mesmo resultado.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-slate-900">
                      Crescimento Exponencial
                    </h3>
                  </div>
                  <p className="text-slate-600">
                    R$ 500 por mês investidos por 40 anos podem se tornar mais de R$ 2 milhões com juros compostos.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-6 w-6 text-purple-600" />
                    <h3 className="text-xl font-semibold text-slate-900">
                      Segurança Financeira
                    </h3>
                  </div>
                  <p className="text-slate-600">
                    Ter uma reserva sólida garante independência e tranquilidade na terceira idade.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-6 w-6 text-orange-600" />
                    <h3 className="text-xl font-semibold text-slate-900">
                      Metas Realistas
                    </h3>
                  </div>
                  <p className="text-slate-600">
                    Começar cedo permite ajustar o plano conforme sua situação financeira muda.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Como calcular quanto você precisa para aposentar?
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Fórmula da Aposentadoria</h3>
              <div className="space-y-3">
                <p className="text-blue-800">
                  <strong>1. Estime seus gastos mensais na aposentadoria:</strong><br />
                  Considere 70-80% do seu salário atual
                </p>
                <p className="text-blue-800">
                  <strong>2. Calcule o valor total necessário:</strong><br />
                  Gastos mensais × 12 × anos de aposentadoria
                </p>
                <p className="text-blue-800">
                  <strong>3. Ajuste pela inflação:</strong><br />
                  Valor total × (1 + inflação)^anos até aposentar
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
              Exemplo Prático
            </h3>

            <div className="bg-slate-100 rounded-lg p-6 mb-8">
              <p className="text-slate-700 mb-4">
                <strong>João, 30 anos, quer se aposentar aos 65:</strong>
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• Salário atual: R$ 5.000</li>
                <li>• Gastos na aposentadoria: R$ 4.000/mês (80%)</li>
                <li>• Anos de aposentadoria: 20 anos</li>
                <li>• Inflação estimada: 4% ao ano</li>
                <li>• <strong>Valor necessário: R$ 2,8 milhões</strong></li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Estratégias de Investimento para Aposentadoria
            </h2>

            <div className="space-y-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    🏛️ Previdência Privada (PGBL/VGBL)
                  </h3>
                  <p className="text-slate-600 mb-3">
                    <strong>Vantagens:</strong> Incentivo fiscal, diversificação, gestão profissional
                  </p>
                  <p className="text-slate-600">
                    <strong>Ideal para:</strong> Quem quer dedução no IR e não quer se preocupar com gestão
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    📈 Fundos de Investimento
                  </h3>
                  <p className="text-slate-600 mb-3">
                    <strong>Vantagens:</strong> Liquidez, diversificação, rentabilidade potencial
                  </p>
                  <p className="text-slate-600">
                    <strong>Ideal para:</strong> Quem tem conhecimento ou assessoria para escolher bons fundos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    🏠 Imóveis para Aluguel
                  </h3>
                  <p className="text-slate-600 mb-3">
                    <strong>Vantagens:</strong> Renda passiva, proteção contra inflação, patrimônio tangível
                  </p>
                  <p className="text-slate-600">
                    <strong>Ideal para:</strong> Quem tem capital inicial e paciência para gestão
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    💰 Tesouro Direto
                  </h3>
                  <p className="text-slate-600 mb-3">
                    <strong>Vantagens:</strong> Segurança, liquidez, rendimento previsível
                  </p>
                  <p className="text-slate-600">
                    <strong>Ideal para:</strong> Perfil conservador ou como base da carteira
                  </p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Dicas Práticas para Começar Hoje
            </h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">✅ Checklist de Aposentadoria</h3>
              <ul className="space-y-2 text-yellow-700">
                <li>• <strong>Defina sua meta:</strong> Quanto você quer ter na aposentadoria?</li>
                <li>• <strong>Calcule o valor mensal:</strong> Quanto precisa guardar por mês?</li>
                <li>• <strong>Escolha os investimentos:</strong> Diversifique sua carteira</li>
                <li>• <strong>Automatize os aportes:</strong> Configure débito automático</li>
                <li>• <strong>Revise anualmente:</strong> Ajuste conforme necessário</li>
                <li>• <strong>Mantenha disciplina:</strong> Não mexa no dinheiro da aposentadoria</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Erros Comuns que Você Deve Evitar
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">❌ Deixar para depois</h4>
                <p className="text-red-700">Cada ano que passa, você precisa guardar mais para compensar o tempo perdido.</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">❌ Não considerar a inflação</h4>
                <p className="text-red-700">R$ 1.000 hoje não valerá o mesmo em 30 anos. Sempre ajuste pela inflação.</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">❌ Colocar todos os ovos na mesma cesta</h4>
                <p className="text-red-700">Diversifique seus investimentos para reduzir riscos.</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">❌ Usar o dinheiro da aposentadoria para outras coisas</h4>
                <p className="text-red-700">Crie uma reserva separada para emergências e não toque no dinheiro da aposentadoria.</p>
              </div>
            </div>

            <div className="bg-green-600 text-white rounded-lg p-8 text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para planejar sua aposentadoria?
              </h3>
              <p className="text-green-100 mb-6">
                Use nossa calculadora de aposentadoria para simular diferentes cenários e encontrar a melhor estratégia para você.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/calculadoras/aposentadoria">
                    Calculadora de Aposentadoria
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600" asChild>
                  <Link href="/calculadoras/juros-compostos">
                    Calculadora de Juros Compostos
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
