import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowLeft } from "lucide-react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "O Segredo dos 10%: Como Guardar uma Parte do que Você Ganha Pode Mudar Sua Vida Financeira | CalcFy",
  description: "Descubra como a regra dos 10% pode transformar sua relação com o dinheiro e construir um futuro financeiro sólido. Guia completo com exemplos práticos.",
  keywords: [
    "regra dos 10%",
    "poupança",
    "educação financeira",
    "investimentos",
    "homem mais rico da babilônia",
    "juros compostos",
    "planejamento financeiro"
  ],
  openGraph: {
    title: "O Segredo dos 10%: Como Guardar uma Parte do que Você Ganha Pode Mudar Sua Vida Financeira",
    description: "Descubra como a regra dos 10% pode transformar sua relação com o dinheiro e construir um futuro financeiro sólido.",
    type: "article",
    publishedTime: "2024-01-15T00:00:00.000Z",
    authors: ["Equipe CalcFy"],
    tags: ["educação financeira", "poupança", "investimentos"]
  }
}

export default function RegraDos10PorcentoPage() {
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
              <Badge className="bg-blue-600">Educação Financeira</Badge>
              <Badge variant="outline">Destaque</Badge>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              O Segredo dos 10%: Como Guardar uma Parte do que Você Ganha Pode Mudar Sua Vida Financeira
            </h1>
            
            <div className="flex items-center gap-6 text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Equipe CalcFy</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>15 de Janeiro de 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>5 min de leitura</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <Image
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Regra dos 10% - Educação Financeira - Poupança e disciplina financeira"
              width={800}
              height={400}
              className="w-full h-64 lg:h-80 object-cover rounded-lg"
            />
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
              <p className="text-lg font-semibold text-blue-800 mb-2">
                Você já ouviu falar na regra de guardar 10% de tudo o que ganha?
              </p>
              <p className="text-blue-700">
                Essa ideia simples, mas poderosa, é considerada um dos maiores segredos da educação financeira e aparece em diversos livros clássicos, como O Homem Mais Rico da Babilônia.
              </p>
            </div>

            <p className="text-lg text-slate-700 mb-6">
              A lógica é clara: antes de gastar com contas, lazer ou qualquer outra coisa, se pague primeiro. Ou seja, separe pelo menos 10% de sua renda mensal para você — para o seu futuro.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Por que 10% faz tanta diferença?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    🎯 Disciplina e hábito
                  </h3>
                  <p className="text-slate-600">
                    Guardar 10% cria uma rotina de poupança automática. Com o tempo, você nem sente falta desse valor.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    💰 Construção de patrimônio
                  </h3>
                  <p className="text-slate-600">
                    Esses pequenos depósitos formam uma reserva que cresce de forma consistente, especialmente quando aplicados em investimentos que rendem juros compostos.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    🛡️ Segurança financeira
                  </h3>
                  <p className="text-slate-600">
                    Imprevistos acontecem: desemprego, emergências médicas ou oportunidades inesperadas. Ter um fundo de segurança evita dívidas e dá tranquilidade.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    🧠 Mentalidade de riqueza
                  </h3>
                  <p className="text-slate-600">
                    Ao separar sempre uma parte do que ganha, você muda sua relação com o dinheiro, passando de gastador para investidor.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Exemplo prático
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <p className="text-slate-700 mb-4">
                Imagine que você ganha <strong>R$ 3.000 por mês</strong>. Guardando 10% (R$ 300), em um ano terá <strong>R$ 3.600</strong>.
              </p>
              <p className="text-slate-700 mb-4">
                Se esse valor for investido com rendimento médio de 0,7% ao mês (um número realista em alguns investimentos), em 10 anos você terá mais de <strong>R$ 50 mil acumulados</strong> — apenas com disciplina.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              O verdadeiro segredo
            </h2>

            <p className="text-lg text-slate-700 mb-6">
              Não importa quanto você ganha, mas o hábito de separar sempre uma parte para você. Quem aplica a regra dos 10% descobre que viver com 90% do salário é totalmente possível, e o futuro agradece.
            </p>

            <p className="text-lg text-slate-700 mb-8">
              É como plantar uma árvore: quanto antes você começar, mais cedo terá sombra e frutos para colher.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
              <p className="text-lg font-semibold text-yellow-800">
                ✅ Dica final: Comece hoje, nem que seja com 1% do que ganha. O importante é criar o hábito e aumentar gradualmente até chegar (ou ultrapassar) os 10%. Seu "eu do futuro" vai agradecer.
              </p>
            </div>

            {/* Call to Action */}
            <div className="bg-blue-600 text-white rounded-lg p-8 text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para começar a aplicar a regra dos 10%?
              </h3>
              <p className="text-blue-100 mb-6">
                Use nossas calculadoras para planejar seus investimentos e ver o poder dos juros compostos na prática.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/calculadoras/juros-compostos">
                    Calculadora de Juros Compostos
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" asChild>
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
