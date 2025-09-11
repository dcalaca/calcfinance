"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, PiggyBank, TrendingUp, Home, Coins, Percent, Target, Car } from "lucide-react"
import Link from "next/link"
import { useFinanceAuth } from "@/hooks/use-finance-auth"
import { useRouter } from "next/navigation"

export function CalculadorasPageClient() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const { user, loading } = useFinanceAuth()
  const router = useRouter()

  console.log("🔧 CalculadorasPage - user:", user?.email)
  console.log("🔧 CalculadorasPage - loading:", loading)

  // Remover verificação de autenticação - deixar o middleware cuidar disso
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/login')
  //   }
  // }, [user, loading, router])

  const calculators = [
    {
      id: "juros-compostos",
      name: "Juros Compostos",
      description: "Calcule o crescimento do seu dinheiro ao longo do tempo",
      icon: TrendingUp,
      category: "Investimentos",
      href: "/calculadoras/juros-compostos",
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: "financiamento",
      name: "Financiamento",
      description: "Simule financiamentos imobiliários",
      icon: Home,
      category: "Financiamento",
      href: "/calculadoras/financiamento",
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "financiamento-veicular",
      name: "Financiamento Veicular",
      description: "Calcule parcelas e juros de financiamento de veículos",
      icon: Car,
      category: "Financiamento",
      href: "/calculadoras/financiamento-veicular",
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: "aposentadoria",
      name: "Aposentadoria",
      description: "Planeje sua aposentadoria com segurança",
      icon: Target,
      category: "Planejamento",
      href: "/calculadoras/aposentadoria",
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      id: "investimentos",
      name: "Investimentos",
      description: "Analise diferentes tipos de investimentos",
      icon: PiggyBank,
      category: "Investimentos",
      href: "/calculadoras/investimentos",
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      id: "inflacao",
      name: "Inflação",
      description: "Calcule o impacto da inflação no seu dinheiro",
      icon: Percent,
      category: "Economia",
      href: "/calculadoras/inflacao",
      color: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      id: "conversor-moedas",
      name: "Conversor de Moedas",
      description: "Converta valores entre diferentes moedas",
      icon: Coins,
      category: "Utilitários",
      href: "/calculadoras/conversor-moedas",
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      id: "valor-presente-futuro",
      name: "Valor Presente/Futuro",
      description: "Calcule valores presentes e futuros de investimentos",
      icon: Calculator,
      category: "Investimentos",
      href: "/calculadoras/valor-presente-futuro",
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    }
  ]

  const categories = ["Todos", ...Array.from(new Set(calculators.map(calc => calc.category)))]

  const filteredCalculators = activeCategory === "Todos" 
    ? calculators 
    : calculators.filter(calc => calc.category === activeCategory)

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando calculadoras...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Calculadoras Financeiras</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Ferramentas gratuitas para suas decisões financeiras
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calculator) => {
            const IconComponent = calculator.icon
            return (
              <Card key={calculator.id} className={`${calculator.borderColor} hover:shadow-lg transition-shadow duration-300`}>
                <CardHeader className={`${calculator.bgColor} rounded-t-lg`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${calculator.color} text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className={`${calculator.textColor}`}>
                        {calculator.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {calculator.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="mb-4 text-base">
                    {calculator.description}
                  </CardDescription>
                  <Button asChild className="w-full">
                    <Link href={calculator.href}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Usar Calculadora
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold mb-4">Precisa de Ajuda?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Nossas calculadoras são gratuitas e fáceis de usar. Se tiver dúvidas, 
                consulte nossa seção de educação financeira ou entre em contato.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/educacao">
                    Educação Financeira
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/contato">
                    Fale Conosco
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
