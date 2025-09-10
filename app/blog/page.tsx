import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog CalcFy - Educação Financeira e Dicas de Investimento",
  description: "Aprenda sobre educação financeira, investimentos e planejamento com nossos artigos especializados. Dicas práticas para melhorar sua vida financeira.",
  keywords: [
    "educação financeira",
    "blog financeiro",
    "dicas de investimento",
    "planejamento financeiro",
    "regra dos 10%",
    "poupança",
    "investimentos"
  ]
}

const articles = [
  {
    id: "regra-dos-10-porcento",
    title: "O Segredo dos 10%: Como Guardar uma Parte do que Você Ganha Pode Mudar Sua Vida Financeira",
    excerpt: "Descubra como a regra dos 10% pode transformar sua relação com o dinheiro e construir um futuro financeiro sólido.",
    author: "Equipe CalcFy",
    date: "2024-01-15",
    readTime: "5 min",
    category: "Educação Financeira",
    image: "/placeholder.jpg",
    featured: true
  },
  {
    id: "juros-compostos-guia-completo",
    title: "Juros Compostos: O Guia Completo para Multiplicar Seu Dinheiro",
    excerpt: "Entenda como os juros compostos funcionam e como usar essa força para construir riqueza ao longo do tempo.",
    author: "Equipe CalcFy",
    date: "2024-01-10",
    readTime: "7 min",
    category: "Investimentos",
    image: "/placeholder.jpg",
    featured: false
  },
  {
    id: "como-comecar-investir",
    title: "Como Começar a Investir: Guia para Iniciantes",
    excerpt: "Passo a passo completo para dar os primeiros passos no mundo dos investimentos, mesmo com pouco dinheiro.",
    author: "Equipe CalcFy",
    date: "2024-01-05",
    readTime: "6 min",
    category: "Investimentos",
    image: "/placeholder.jpg",
    featured: false
  },
  {
    id: "planejamento-aposentadoria",
    title: "Planejamento para Aposentadoria: Nunca é Cedo Demais",
    excerpt: "Aprenda a planejar sua aposentadoria desde cedo e garanta uma velhice tranquila e financeiramente segura.",
    author: "Equipe CalcFy",
    date: "2024-01-01",
    readTime: "8 min",
    category: "Planejamento",
    image: "/placeholder.jpg",
    featured: false
  },
  {
    id: "reserva-de-emergencia",
    title: "Reserva de Emergência: Por que você precisa de uma e como construir a sua",
    excerpt: "Se tem algo que a vida nos ensina é que imprevistos acontecem. Aprenda como construir sua reserva de emergência e ter segurança financeira.",
    author: "Equipe CalcFy",
    date: "2024-01-12",
    readTime: "5 min",
    category: "Planejamento",
    image: "/placeholder.jpg",
    featured: false
  }
]

const categories = [
  "Educação Financeira",
  "Investimentos", 
  "Planejamento",
  "Dicas Práticas"
]

export default function BlogPage() {
  const featuredArticle = articles.find(article => article.featured)
  const regularArticles = articles.filter(article => !article.featured)
  
  // Debug: verificar quantos artigos temos
  console.log('Total de artigos:', articles.length)
  console.log('Artigos regulares:', regularArticles.length)
  console.log('IDs dos artigos:', articles.map(a => a.id))

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Blog CalcFy
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Educação financeira de qualidade para transformar sua relação com o dinheiro
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="px-4 py-2">
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Destaque</h2>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-blue-600">{featuredArticle.category}</Badge>
                  <Badge variant="outline">Destaque</Badge>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {featuredArticle.title}
                </h3>
                <p className="text-slate-600 mb-4">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {featuredArticle.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(featuredArticle.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredArticle.readTime}
                  </div>
                </div>
                <Link 
                  href={`/blog/${featuredArticle.id}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ler Artigo
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* Regular Articles */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Todos os Artigos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.readTime}
                    </div>
                  </div>
                  <Link 
                    href={`/blog/${article.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ler Artigo →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
