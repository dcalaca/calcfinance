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
      throw new Error(`NewsAPI error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log(`✅ Encontradas ${data.articles?.length || 0} notícias`);
    
    // Transformar dados para o formato do nosso site
    const news = data.articles?.map((article: any) => ({
      id: article.url?.split('/').pop() || Math.random().toString(36),
      title: article.title || article.description || 'Título não disponível',
      content: article.description || 'Conteúdo não disponível',
      source: article.source?.name || 'Fonte desconhecida',
      url: article.url || '#',
      publishedAt: article.publishedAt || new Date().toISOString(),
      category: getCategoryFromTitle(article.title || ''),
      isActive: true
    })) || [];

    // Filtrar apenas notícias em português e conteúdo financeiro
    const filteredNews = news.filter((article: any) => {
      const title = article.title.toLowerCase();
      const content = article.content?.toLowerCase() || '';
      
      // Filtrar idiomas não desejados (palavras específicas)
      const englishWords = ['stocks', 'firm', 'scored', 'entry', 'america', 'watched', 'financial', 'club', 'tech', 's&p', '500'];
      const spanishWords = ['doña', 'alejandra', 'tiene', 'años', 'deseo', 'ancestral', 'artesanía', 'perdure', 'porfirio', 'escandón', 'cristóbal', 'huichochitlán', 'comunidad', 'otomí', 'norte', 'toluca', 'todavía', 'posible', 'escuchar', 'sonid'];
      const turkishWords = ['trump', 'venezuela', 'tehdit', 'uçaklarınızı', 'düşürürüz', 'abd', 'başkanı', 'donald', 'venezuela', 'savaş', 'uçağının', 'donanma', 'gemisine', 'yakın', 'uçuş', 'gerçekleştirmesine', 'tepki', 'haberturk', 'com', 'tr'];
      
      // Se contém palavras específicas em inglês, espanhol ou turco, rejeitar
      if (englishWords.some(word => title.includes(word) || content.includes(word))) {
        return false;
      }
      if (spanishWords.some(word => title.includes(word) || content.includes(word))) {
        return false;
      }
      if (turkishWords.some(word => title.includes(word) || content.includes(word))) {
        return false;
      }
      
      // Bloquear conteúdo claramente não financeiro
      const nonFinancialWords = [
        'jogador', 'atleta', 'futebol', 'futebolista', 'seleção', 'raphinha', 'neymar',
        'novela', 'série', 'filme', 'cinema', 'teatro', 'tv', 'programa', 'reality',
        'caverna', 'encantada', 'sbt', 'disney', 'disneyland', 'paris', 'racismo',
        'parque', 'diversões', 'funcionário', 'abraço', 'hug', 'ignorado', 'filho'
      ];
      
      // Se contém palavras não financeiras, rejeitar
      if (nonFinancialWords.some(word => title.includes(word) || content.includes(word))) {
        return false;
      }
      
      // Aceitar apenas notícias em português
      return true;
    }).slice(0, 20);

    return NextResponse.json({ 
      success: true,
      message: `Foram encontradas ${filteredNews.length} notícias brasileiras`,
      news: filteredNews,
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
    return 'Câmbio';
  }
  
  if (titleLower.includes('bolsa') || titleLower.includes('ibovespa') || titleLower.includes('ações')) {
    return 'Bolsa';
  }
  
  if (titleLower.includes('bitcoin') || titleLower.includes('cripto') || titleLower.includes('ethereum')) {
    return 'Criptomoedas';
  }
  
  if (titleLower.includes('selic') || titleLower.includes('juros') || titleLower.includes('copom')) {
    return 'Juros';
  }
  
  if (titleLower.includes('fii') || titleLower.includes('fundos') || titleLower.includes('investimento')) {
    return 'Investimentos';
  }
  
  return 'Economia';
}