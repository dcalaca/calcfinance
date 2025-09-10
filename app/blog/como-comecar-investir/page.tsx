import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowLeft, DollarSign, TrendingUp, Shield, Target, BookOpen, AlertCircle } from "lucide-react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Como Começar a Investir: Guia Completo para Iniciantes | CalcFy",
  description: "Passo a passo completo para dar os primeiros passos no mundo dos investimentos, mesmo com pouco dinheiro. Aprenda desde o básico até estratégias avançadas.",
  keywords: [
    "como começar a investir",
    "investimentos para iniciantes",
    "primeiros passos investimentos",
    "investir com pouco dinheiro",
    "educação financeira",
    "renda fixa",
    "renda variável",
    "tesouro direto"
  ],
  openGraph: {
    title: "Como Começar a Investir: Guia Completo para Iniciantes",
    description: "Passo a passo completo para dar os primeiros passos no mundo dos investimentos, mesmo com pouco dinheiro.",
    type: "article",
    publishedTime: "2024-01-05T00:00:00.000Z",
    authors: ["Equipe CalcFy"],
    tags: ["investimentos", "educação financeira", "iniciantes"]
  }
}

export default function ComoComecarInvestirPage() {
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
              <Badge className="bg-purple-600">Investimentos</Badge>
              <Badge variant="outline">Guia Completo</Badge>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Como Começar a Investir: Guia para Iniciantes
            </h1>
            
            <div className="flex items-center gap-6 text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Equipe CalcFy</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>5 de Janeiro de 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>6 min de leitura</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <Image
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Como Começar a Investir - Guia para Iniciantes - Investimentos e crescimento financeiro"
              width={800}
              height={400}
              className="w-full h-64 lg:h-80 object-cover rounded-lg"
            />
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8">
              <p className="text-lg font-semibold text-purple-800 mb-2">
                Você não precisa ser rico para começar a investir.
              </p>
              <p className="text-purple-700">
                Com apenas R$ 50 por mês, você já pode dar os primeiros passos no mundo dos investimentos e começar a construir seu patrimônio.
              </p>
            </div>

            <p className="text-lg text-slate-700 mb-6">
              Muitas pessoas pensam que investir é coisa de rico ou que é muito complicado. Mas a verdade é que <strong>qualquer pessoa pode começar a investir</strong>, independentemente do valor disponível. O importante é começar!
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Por que investir é importante?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-slate-900">
                      Crescimento do Dinheiro
                    </h3>
                  </div>
                  <p className="text-slate-600">
                    O dinheiro parado na poupança perde valor com a inflação. Investindo, você faz seu dinheiro trabalhar para você.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-slate-900">
                      Alcançar Metas
                    </h3>
                  </div>
                  <p className="text-slate-600">
                    Casa própria, aposentadoria, viagem dos sonhos. Investir te ajuda a realizar seus objetivos financeiros.
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
                    Ter investimentos te dá tranquilidade para enfrentar imprevistos e emergências.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                    <h3 className="text-xl font-semibold text-slate-900">
                      Independência Financeira
                    </h3>
                  </div>
                  <p className="text-slate-600">
                    Com o tempo, seus investimentos podem gerar renda passiva suficiente para viver sem depender do salário.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Passo a Passo para Começar a Investir
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
                        Organize suas Finanças
                      </h3>
                      <ul className="space-y-2 text-slate-600">
                        <li>• <strong>Controle seus gastos:</strong> Saiba para onde vai seu dinheiro</li>
                        <li>• <strong>Monte uma reserva de emergência:</strong> 3-6 meses de gastos</li>
                        <li>• <strong>Elimine dívidas:</strong> Especialmente as de juros altos</li>
                        <li>• <strong>Defina quanto pode investir:</strong> Mesmo que seja R$ 50/mês</li>
                      </ul>
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
                        Defina seus Objetivos
                      </h3>
                      <ul className="space-y-2 text-slate-600">
                        <li>• <strong>Curto prazo (1-2 anos):</strong> Viagem, móveis, curso</li>
                        <li>• <strong>Médio prazo (3-10 anos):</strong> Casa própria, carro</li>
                        <li>• <strong>Longo prazo (10+ anos):</strong> Aposentadoria, independência financeira</li>
                        <li>• <strong>Valor e prazo:</strong> Quanto precisa e quando</li>
                      </ul>
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
                        Conheça seu Perfil de Investidor
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">Conservador</h4>
                          <p className="text-green-700 text-sm">Prefere segurança, aceita baixa rentabilidade</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-yellow-800 mb-2">Moderado</h4>
                          <p className="text-yellow-700 text-sm">Equilibra risco e retorno</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-red-800 mb-2">Agressivo</h4>
                          <p className="text-red-700 text-sm">Aceita riscos por maior rentabilidade</p>
                        </div>
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
                        Escolha uma Corretora
                      </h3>
                      <ul className="space-y-2 text-slate-600">
                        <li>• <strong>Corretoras gratuitas:</strong> Clear, Rico, XP, BTG Pactual</li>
                        <li>• <strong>Verifique as taxas:</strong> Corretagem, custódia, emolumentos</li>
                        <li>• <strong>Interface amigável:</strong> App e site fáceis de usar</li>
                        <li>• <strong>Suporte:</strong> Atendimento quando precisar</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      5
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">
                        Comece com Investimentos Simples
                      </h3>
                      <ul className="space-y-2 text-slate-600">
                        <li>• <strong>Renda Fixa:</strong> Tesouro Direto, CDB, LCI/LCA</li>
                        <li>• <strong>Fundos:</strong> Fundos de renda fixa ou multimercado</li>
                        <li>• <strong>Evite:</strong> Ações individuais no início</li>
                        <li>• <strong>Diversifique:</strong> Não coloque tudo em um lugar só</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Melhores Investimentos para Iniciantes
            </h2>

            <div className="space-y-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    🏛️ Tesouro Direto
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✅ Vantagens</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Segurança máxima (garantia do governo)</li>
                        <li>• A partir de R$ 30</li>
                        <li>• Sem taxa de corretagem</li>
                        <li>• Liquidez diária</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">💡 Tipos</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• <strong>SELIC:</strong> Renda fixa + inflação</li>
                        <li>• <strong>IPCA+:</strong> Renda fixa + inflação</li>
                        <li>• <strong>Pré-fixado:</strong> Taxa fixa</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    🏦 CDB (Certificado de Depósito Bancário)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✅ Vantagens</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Garantia do FGC (até R$ 250 mil)</li>
                        <li>• A partir de R$ 100</li>
                        <li>• Rentabilidade maior que poupança</li>
                        <li>• Diversas opções de prazo</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2">⚠️ Cuidados</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Verificar a solidez do banco</li>
                        <li>• Comparar rentabilidades</li>
                        <li>• Entender o prazo de resgate</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    📈 Fundos de Investimento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✅ Vantagens</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Gestão profissional</li>
                        <li>• Diversificação automática</li>
                        <li>• A partir de R$ 100</li>
                        <li>• Liquidez diária</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">💡 Tipos para Iniciantes</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• <strong>Renda Fixa:</strong> Baixo risco</li>
                        <li>• <strong>Multimercado:</strong> Risco moderado</li>
                        <li>• <strong>Índice:</strong> Seguem índices</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Erros Comuns que Iniciantes Cometem
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">❌ Investir sem reserva de emergência</h4>
                    <p className="text-red-700">Sempre tenha uma reserva antes de investir. Caso contrário, você pode precisar resgatar os investimentos em momentos ruins.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">❌ Querer ganhar dinheiro rápido</h4>
                    <p className="text-red-700">Investir é para o longo prazo. Quem busca ganhos rápidos geralmente perde dinheiro.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">❌ Não diversificar</h4>
                    <p className="text-red-700">Colocar todo dinheiro em um só investimento é arriscado. Diversifique sempre.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">❌ Não estudar antes de investir</h4>
                    <p className="text-red-700">Conheça o que está comprando. Não invista em algo que não entende.</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8">
              Dicas de Ouro para Iniciantes
            </h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">💡 Dicas Essenciais</h3>
              <ul className="space-y-3 text-yellow-700">
                <li>• <strong>Comece pequeno:</strong> R$ 50-100 por mês já é suficiente para começar</li>
                <li>• <strong>Seja consistente:</strong> Invista todo mês, mesmo que seja pouco</li>
                <li>• <strong>Tenha paciência:</strong> Resultados vêm com o tempo</li>
                <li>• <strong>Estude sempre:</strong> Educação financeira é fundamental</li>
                <li>• <strong>Não invista dinheiro que precisa:</strong> Só invista o que pode "perder"</li>
                <li>• <strong>Reinvista os rendimentos:</strong> Deixe o juros compostos trabalharem</li>
                <li>• <strong>Monitore seus investimentos:</strong> Acompanhe regularmente</li>
                <li>• <strong>Não se desespere com quedas:</strong> Mercados sobem e descem</li>
              </ul>
            </div>

            <div className="bg-blue-600 text-white rounded-lg p-8 text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para começar a investir?
              </h3>
              <p className="text-blue-100 mb-6">
                Use nossas calculadoras para simular seus investimentos e encontrar a melhor estratégia para seus objetivos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/calculadoras/investimentos">
                    Calculadora de Investimentos
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" asChild>
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
