import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key not configured',
        message: 'Configure NEWS_API_KEY no Vercel Dashboard'
      }, { status: 500 });
    }

    console.log('🔄 Forçando atualização das notícias...');

    // Buscar notícias do Brasil sobre economia e finanças
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=economia+finanças+bolsa+selic+bitcoin+dólar+ibovespa&country=br&language=pt&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`,
      {
        headers: {
          'User-Agent': 'CalcFinance/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log(`✅ Encontradas ${data.articles?.length || 0} notícias`);
    
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

    return NextResponse.json({ 
      success: true,
      message: `Foram encontradas ${news.length} notícias brasileiras`,
      news,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro ao buscar notícias:', error);
    
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      news: [],
      timestamp: new Date().toISOString()
    }, { status: 500 });
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
