import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Buscar notícias do Brasil sobre economia e finanças
    const searchQuery = encodeURIComponent('economia OR financas OR bolsa OR selic OR bitcoin OR dolar OR ibovespa OR brasil');
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`,
      {
        headers: {
          'User-Agent': 'CalcFinance/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transformar dados para o formato do nosso site
    const news = data.articles?.map((article: any) => ({
      id: article.url?.split('/').pop() || Math.random().toString(36),
      title: article.title,
      content: article.description,
      source: article.source.name,
      url: article.url,
      publishedAt: article.publishedAt,
      category: getCategoryFromTitle(article.title),
      isActive: true
    })) || [];

    // Filtrar notícias em português e priorizar fontes brasileiras
    const filteredNews = news.filter(article => {
      const title = article.title.toLowerCase();
      const content = article.content?.toLowerCase() || '';
      const source = article.source.toLowerCase();
      
      // Priorizar fontes brasileiras conhecidas
      const brazilianSources = ['infomoney', 'valor', 'exame', 'cnn brasil', 'folha', 'estadão', 'g1', 'uol', 'globo'];
      const isBrazilianSource = brazilianSources.some(sourceName => source.includes(sourceName));
      
      // Priorizar notícias em português (palavras comuns em português)
      const portugueseWords = ['de', 'da', 'do', 'das', 'dos', 'com', 'para', 'por', 'em', 'na', 'no', 'nas', 'nos', 'que', 'uma', 'um', 'o', 'a', 'os', 'as'];
      const hasPortugueseWords = portugueseWords.some(word => title.includes(word) || content.includes(word));
      
      return isBrazilianSource || hasPortugueseWords;
    }).slice(0, 20); // Limitar a 20 notícias

    return NextResponse.json({ news: filteredNews });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ news: [] });
  }
}

function getCategoryFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('dólar') || titleLower.includes('moeda') || titleLower.includes('câmbio')) {
    return 'Economia';
  } else if (titleLower.includes('bolsa') || titleLower.includes('ibovespa') || titleLower.includes('ações')) {
    return 'Bolsa';
  } else if (titleLower.includes('bitcoin') || titleLower.includes('cripto') || titleLower.includes('ethereum')) {
    return 'Criptomoedas';
  } else if (titleLower.includes('selic') || titleLower.includes('juros') || titleLower.includes('copom')) {
    return 'Juros';
  } else if (titleLower.includes('fii') || titleLower.includes('fundos') || titleLower.includes('imobiliário')) {
    return 'Investimentos';
  }
  
  return 'Economia';
}