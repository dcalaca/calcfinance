export const dynamic = "force-dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface NewsItem {
  title: string
  link: string
  contentSnippet: string
  pubDate: string
  source: string
}

async function getNewsFromAPI(): Promise<NewsItem[]> {
  try {
    // Usar URL absoluta baseada no ambiente
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 7200 }, // Revalida a cada 2 horas
      headers: {
        "User-Agent": "FinanceHub/1.0",
      },
    })

    if (!response.ok) {
      console.error(`API retornou status ${response.status}`)
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    const news = data.news || []
    
    // Transformar para o formato esperado
    return news.map((item: any) => ({
      title: item.title,
      link: item.url,
      contentSnippet: item.content,
      pubDate: item.publishedAt,
      source: item.source,
    }))
  } catch (error) {
    console.error("Erro ao buscar notícias da API:", error)
    return []
  }
}

function categorizeNews(title: string, content: string): string {
  const text = (title + " " + content).toLowerCase()

  if (
    text.includes("bitcoin") ||
    text.includes("crypto") ||
    text.includes("ethereum") ||
    text.includes("moeda digital") ||
    text.includes("criptomoeda")
  ) {
    return "Criptomoedas"
  }
  if (text.includes("bolsa") || text.includes("ibovespa") || text.includes("ação") || text.includes("ações")) {
    return "Bolsa"
  }
  if (text.includes("juros") || text.includes("selic") || text.includes("taxa")) {
    return "Juros"
  }
  if (text.includes("investimento") || text.includes("poupança") || text.includes("financiamento")) {
    return "Finanças Pessoais"
  }
  return "Economia"
}

function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: ptBR,
    })
  } catch {
    return "Agora mesmo"
  }
}

export default async function NoticiasPage() {
  const rawNews = await getNewsFromAPI()

  // Transformar dados do RSS para o formato esperado
  const news = rawNews.map((item, index) => ({
    id: `news-${index}`,
    title: item.title || "Título não disponível",
    excerpt: item.contentSnippet || "Resumo não disponível",
    category: categorizeNews(item.title || "", item.contentSnippet || ""),
    author: "Redação",
    source: item.source || "Fonte",
    source_url: item.link || "#",
    published_at: item.pubDate || new Date().toISOString(),
    created_at: new Date().toISOString(),
  }))

  const getCategoryColor = (category: string) => {
    const colors = {
      Juros: "bg-blue-100 text-blue-800",
      Criptomoedas: "bg-orange-100 text-orange-800",
      Bolsa: "bg-green-100 text-green-800",
      Economia: "bg-purple-100 text-purple-800",
      "Finanças Pessoais": "bg-pink-100 text-pink-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Notícias Financeiras</h1>
          <p className="text-xl text-slate-600">Mantenha-se atualizado com as principais notícias do mercado</p>
        </div>

        {/* Grid de Notícias */}
        {news.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Carregando notícias...</h3>
            <p className="text-slate-500">As notícias estão sendo atualizadas em tempo real</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                  <div className="flex items-center text-sm text-slate-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimeAgo(article.published_at)}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="line-clamp-3 mb-4">{article.excerpt}</CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{article.source}</span>
                  <Link
                    href={article.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Ler mais
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Informações sobre as fontes */}
        <div className="mt-16 bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Nossas Fontes Confiáveis</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <strong>Fontes Ativas:</strong>
              <br />• InfoMoney
              <br />• Valor Investe
              <br />• Exame
              <br />• CNN Brasil Business
            </div>
            <div>
              <strong>Atualização:</strong>
              <br />• Dados em tempo real
              <br />• Fallback inteligente
              <br />• Links diretos para fontes
              <br />• Categorização automática
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
