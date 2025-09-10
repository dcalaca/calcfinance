import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowLeft, Shield, AlertTriangle, Target, DollarSign, TrendingUp, Zap } from "lucide-react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Reserva de Emergência: Por que você precisa de uma e como construir a sua | CalcFy",
  description: "Se tem algo que a vida nos ensina é que imprevistos acontecem. Aprenda como construir sua reserva de emergência e ter segurança financeira.",
  keywords: [
    "reserva de emergência",
    "como fazer reserva de emergência",
    "segurança financeira",
    "tesouro selic",
    "CDB liquidez diária",
    "educação financeira",
    "planejamento financeiro"
  ],
  openGraph: {
    title: "Reserva de Emergência: Por que você precisa de uma e como construir a sua",
    description: "Se tem algo que a vida nos ensina é que imprevistos acontecem. Aprenda como construir sua reserva de emergência e ter segurança financeira.",
    type: "article",
    publishedTime: "2024-01-12T00:00:00.000Z",
    authors: ["Equipe CalcFy"],
    tags: ["reserva de emergência", "segurança financeira", "planejamento"]
  }
}

export default function ReservaDeEmergenciaPage() {
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
              <Badge className="bg-orange-600">Planejamento</Badge>
              <Badge variant="outline">Segurança Financeira</Badge>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Reserva de Emergência: Por que você precisa de uma e como construir a sua
            </h1>
            
            <div className="flex items-center gap-6 text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Equipe CalcFy</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>12 de Janeiro de 2024</span>
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
              src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Reserva de Emergência - Segurança Financeira - Proteção contra imprevistos"
              width={800}
              height={400}
              className="w-full h-64 lg:h-80 object-cover rounded-lg"
            />
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-8">
              <p className="text-lg font-semibold text-orange-800 mb-2">
                Se tem algo que a vida nos ensina é que imprevistos acontecem.
              </p>
              <p className="text-orange-700">
                Perda de emprego, problemas de saúde, consertos inesperados no carro ou até oportunidades que exigem dinheiro rápido. Nessas horas, quem tem uma reserva de emergência respira aliviado.
              </p>
            </div>

            <p className="text-lg text-slate-700 mb-6">
              Mas afinal, o que é essa reserva, qual deve ser o valor ideal e onde investir esse dinheiro? Vamos esclarecer tudo agora.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              O que é a reserva de emergência?
            </h2>

            <p className="text-slate-700 mb-6">
              A <strong>reserva de emergência</strong> é um valor guardado exclusivamente para situações imprevistas. Diferente de uma poupança para viajar ou comprar algo, essa reserva não tem destino específico além de garantir segurança e estabilidade financeira.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">💡 Como funciona</h3>
              <p className="text-blue-800 mb-3">
                Ela funciona como um <strong>"colchão de proteção"</strong>: em vez de recorrer ao cartão de crédito ou empréstimos (com juros altos), você utiliza o dinheiro que já separou.
              </p>
              <p className="text-blue-800">
                <strong>Vantagens:</strong> Evita dívidas, reduz stress, oferece tranquilidade e liberdade de escolhas.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Quanto devo ter na minha reserva?
            </h2>

            <p className="text-slate-700 mb-6">
              Especialistas recomendam acumular entre <strong>6 e 12 meses</strong> das suas despesas mensais.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-green-900 mb-4">📊 Exemplo Prático</h3>
              <p className="text-green-800 mb-3">
                Se suas despesas fixas (aluguel, contas, alimentação, transporte etc.) somam <strong>R$ 2.500 por mês</strong>, sua reserva deve ficar entre:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">R$ 15.000</p>
                  <p className="text-green-700">6 meses de despesas</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">R$ 30.000</p>
                  <p className="text-green-700">12 meses de despesas</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
              O valor ideal varia conforme sua realidade:
            </h3>

            <div className="space-y-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                    <h4 className="text-lg font-semibold text-slate-900">
                      Profissionais autônomos ou com renda instável
                    </h4>
                  </div>
                  <p className="text-slate-600">
                    <strong>Recomendação:</strong> Mais próximo de 12 meses de despesas
                  </p>
                  <p className="text-slate-600 text-sm mt-2">
                    Renda variável exige maior proteção contra períodos de baixa receita.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-6 w-6 text-green-600" />
                    <h4 className="text-lg font-semibold text-slate-900">
                      Profissionais CLT estáveis
                    </h4>
                  </div>
                  <p className="text-slate-600">
                    <strong>Recomendação:</strong> 6 meses pode ser suficiente
                  </p>
                  <p className="text-slate-600 text-sm mt-2">
                    Renda fixa e estável permite reserva menor, mas ainda essencial.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Onde guardar a reserva de emergência?
            </h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
              <p className="text-lg font-semibold text-yellow-800 mb-2">
                ⚠️ Importante: O segredo não é buscar altos rendimentos, e sim segurança e liquidez (acesso rápido ao dinheiro).
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    🏛️ Tesouro Selic (Tesouro Direto)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✅ Vantagens</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Título público de baixo risco</li>
                        <li>• Atrelado à taxa básica de juros (Selic)</li>
                        <li>• Pode ser resgatado rapidamente</li>
                        <li>• Garantia do governo</li>
                        <li>• A partir de R$ 30</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">💡 Como funciona</h4>
                      <p className="text-sm text-slate-600">
                        Investe em títulos do governo que acompanham a taxa Selic. 
                        Resgate em D+1 (próximo dia útil).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    🏦 CDBs de liquidez diária
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✅ Vantagens</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Pagam um percentual do CDI</li>
                        <li>• Similar à taxa Selic</li>
                        <li>• Saque a qualquer momento</li>
                        <li>• Sem perder rendimento</li>
                        <li>• Garantia do FGC (até R$ 250 mil)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">💡 Como funciona</h4>
                      <p className="text-sm text-slate-600">
                        Certificado de Depósito Bancário com liquidez diária. 
                        Rendimento baseado no CDI.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    📈 Fundos DI com taxa zero
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✅ Vantagens</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Investem em títulos públicos</li>
                        <li>• Acompanham a Selic</li>
                        <li>• Boa opção para quem não quer complicação</li>
                        <li>• Liquidez diária</li>
                        <li>• Gestão profissional</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">💡 Como funciona</h4>
                      <p className="text-sm text-slate-600">
                        Fundo de investimento que aplica em títulos de renda fixa. 
                        Sem taxa de administração.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ O que EVITAR</h3>
              <p className="text-red-700">
                <strong>Poupança não é a melhor escolha.</strong> Apesar da liquidez, rende menos que as opções acima. 
                Em tempos de Selic baixa, a poupança pode render menos que a inflação.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Como começar sua reserva?
            </h2>

            <div className="space-y-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">
                        Defina sua meta
                      </h3>
                      <p className="text-slate-600 mb-3">
                        Calcule suas despesas mensais e multiplique por 6 ou 12 meses.
                      </p>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-blue-700 text-sm">
                          <strong>Exemplo:</strong> R$ 15 mil para 6 meses de despesas
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">
                        Comece pequeno
                      </h3>
                      <p className="text-slate-600 mb-3">
                        Guarde todo mês 10% do salário ou o valor que for possível.
                      </p>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-blue-700 text-sm">
                          <strong>Dica:</strong> Mesmo R$ 100 por mês já é um começo!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">
                        Automatize
                      </h3>
                      <p className="text-slate-600 mb-3">
                        Configure uma transferência automática para sua conta de investimentos.
                      </p>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-blue-700 text-sm">
                          <strong>Benefício:</strong> Você não esquece e não gasta o dinheiro
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">
                        Não use para outros fins
                      </h3>
                      <p className="text-slate-600 mb-3">
                        Lembre-se, esse dinheiro é só para emergências reais.
                      </p>
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-red-700 text-sm">
                          <strong>Não é para:</strong> Viagem, compras, investimentos de risco
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Quando usar a reserva de emergência?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-green-800 mb-3 text-center">
                    ✅ Use para
                  </h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Perda de emprego</li>
                    <li>• Emergências médicas</li>
                    <li>• Consertos urgentes (carro, casa)</li>
                    <li>• Despesas inesperadas essenciais</li>
                    <li>• Oportunidades que exigem dinheiro rápido</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-red-800 mb-3 text-center">
                    ❌ NÃO use para
                  </h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Viagens de férias</li>
                    <li>• Compras desnecessárias</li>
                    <li>• Investimentos de risco</li>
                    <li>• Presentes caros</li>
                    <li>• Gastos que podem esperar</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Conclusão
            </h2>

            <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
              <p className="text-lg font-semibold text-green-800 mb-3">
                A reserva de emergência não é luxo, é necessidade.
              </p>
              <p className="text-green-700 mb-3">
                Ela traz tranquilidade, segurança e liberdade de escolhas. Sem ela, qualquer imprevisto pode virar uma bola de neve de dívidas.
              </p>
              <p className="text-green-700">
                Comece hoje, mesmo que seja com pouco. O importante é construir passo a passo até alcançar o valor ideal. O futuro agradece.
              </p>
            </div>

            <div className="bg-blue-600 text-white rounded-lg p-8 text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para construir sua reserva de emergência?
              </h3>
              <p className="text-blue-100 mb-6">
                Use nossas calculadoras para planejar sua reserva e simular diferentes cenários de investimento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/calculadoras/investimentos">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Calculadora de Investimentos
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/calculadoras/juros-compostos">
                    <DollarSign className="h-5 w-5 mr-2" />
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
