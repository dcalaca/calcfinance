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
      title: article.title || article.description || 'Título não disponível',
      content: article.description || 'Conteúdo não disponível',
      source: article.source?.name || 'Fonte desconhecida',
      url: article.url || '#',
      publishedAt: article.publishedAt || new Date().toISOString(),
      category: getCategoryFromTitle(article.title || ''),
      isActive: true
    })) || [];

    // Filtrar notícias em português e priorizar fontes brasileiras
    const filteredNews = news.filter(article => {
      const title = article.title.toLowerCase();
      const content = article.content?.toLowerCase() || '';
      const source = article.source.toLowerCase();
      
      // Priorizar fontes brasileiras conhecidas
      const brazilianSources = ['infomoney', 'valor', 'exame', 'cnn brasil', 'folha', 'estadão', 'g1', 'uol', 'globo', 'terra', 'metropoles', 'diario do centro do mundo'];
      const isBrazilianSource = brazilianSources.some(sourceName => source.includes(sourceName));
      
      // Filtrar palavras em inglês, espanhol, turco e outros idiomas
      const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
      const spanishWords = ['el', 'la', 'los', 'las', 'de', 'del', 'en', 'con', 'por', 'para', 'que', 'es', 'son', 'fue', 'será', 'tiene', 'tienen', 'puede', 'pueden', 'va', 'van', 'está', 'están', 'fue', 'fueron', 'mientras', 'mientras', 'denunció', 'situación', 'hijo', 'acusa', 'disneyland', 'parís', 'racismo', 'contra', 'extremo', 'encuentra', 'concentrado', 'selección'];
      const turkishWords = ['trump', 'venezuela', 'tehdit', 'uçaklarınızı', 'düşürürüz', 'abd', 'başkanı', 'donald', 'venezuela', 'savaş', 'uçağının', 'donanma', 'gemisine', 'yakın', 'uçuş', 'gerçekleştirmesine', 'tepki', 'haberturk', 'com', 'tr'];
      const hasEnglishWords = englishWords.some(word => title.includes(` ${word} `) || title.startsWith(`${word} `) || title.endsWith(` ${word}`));
      const hasSpanishWords = spanishWords.some(word => title.includes(` ${word} `) || title.startsWith(`${word} `) || title.endsWith(` ${word}`));
      const hasTurkishWords = turkishWords.some(word => title.includes(word) || content.includes(word));
      
      // Priorizar notícias em português (palavras comuns em português)
      const portugueseWords = ['de', 'da', 'do', 'das', 'dos', 'com', 'para', 'por', 'em', 'na', 'no', 'nas', 'nos', 'que', 'uma', 'um', 'o', 'a', 'os', 'as', 'é', 'são', 'foi', 'será', 'tem', 'têm', 'pode', 'podem', 'vai', 'vão', 'está', 'estão', 'foi', 'foram', 'ter', 'fazer', 'dizer', 'ver', 'saber', 'querer', 'poder', 'dever', 'vir', 'ir', 'dar', 'falar', 'trabalhar', 'viver', 'pensar', 'sentir', 'conhecer', 'saber', 'querer', 'poder', 'dever', 'vir', 'ir', 'dar', 'falar', 'trabalhar', 'viver', 'pensar', 'sentir', 'conhecer'];
      const hasPortugueseWords = portugueseWords.some(word => title.includes(` ${word} `) || title.startsWith(`${word} `) || title.endsWith(` ${word}`));
      
      // Filtrar conteúdo NÃO financeiro de forma agressiva
      const nonFinancialWords = [
        'jogador', 'atleta', 'futebol', 'futebolista', 'seleção', 'brasileira', 'raphinha', 'neymar',
        'celebridade', 'famoso', 'artista', 'ator', 'atriz', 'cantor', 'cantora', 'músico', 'música',
        'novela', 'série', 'filme', 'cinema', 'teatro', 'televisão', 'tv', 'programa', 'reality',
        'caverna', 'encantada', 'sbt', 'disney', 'disneyland', 'paris', 'racismo', 'discriminação',
        'parque', 'diversões', 'funcionário', 'abraço', 'hug', 'ignorado', 'ignorar', 'filho', 'criança',
        'lula', 'bolsonaro', 'presidente', 'governador', 'prefeito', 'deputado', 'senador', 'ministro'
      ];
      
      // Se contém qualquer palavra não financeira, rejeitar
      if (nonFinancialWords.some(word => title.includes(word) || content.includes(word))) {
        return false;
      }
      
      // Se tiver palavras em inglês, espanhol ou turco, rejeitar
      if (hasEnglishWords || hasSpanishWords || hasTurkishWords) return false;
      
      // Aceitar se contém palavras financeiras OU se for de fonte brasileira confiável
      const financialWords = [
        'dólar', 'moeda', 'câmbio', 'bolsa', 'ibovespa', 'ações', 'bitcoin', 'cripto', 'ethereum',
        'selic', 'juros', 'copom', 'fii', 'fundos', 'imobiliário', 'investimento', 'investir',
        'economia', 'econômico', 'financeiro', 'finanças', 'mercado', 'capital', 'renda', 'lucro',
        'prejuízo', 'receita', 'despesa', 'orçamento', 'inflação', 'ipca', 'pib', 'crescimento',
        'empresa', 'corporação', 'sociedade', 'acionista', 'dividendo', 'balanço', 'faturamento',
        'vendas', 'comércio', 'exportação', 'importação', 'balança', 'comercial', 'superávit',
        'déficit', 'dívida', 'crédito', 'financiamento', 'empréstimo', 'pagamento', 'cobrança',
        'fusão', 'aquisição', 'incorporação', 'ipo', 'oferta', 'pública', 'privatização',
        'startup', 'fintech', 'insurtech', 'proptech', 'edtech', 'healthtech', 'agritech',
        'sustentabilidade', 'esg', 'governança', 'compliance', 'regulamentação', 'auditoria',
        'risco', 'gestão', 'administração', 'gerenciamento', 'liderança', 'direção', 'presidência',
        'banco', 'bancário', 'bancos', 'instituição', 'financeira', 'cooperativa', 'crédito',
        'financiamento', 'empréstimo', 'consórcio', 'leasing', 'fundo', 'investimento',
        'aplicação', 'aplicar', 'aplicações', 'rendimento', 'rentabilidade', 'lucratividade',
        'patrimônio', 'patrimonial', 'patrimônio', 'líquido', 'bruto', 'margem', 'margem',
        'operacional', 'líquida', 'bruta', 'ebitda', 'ebit', 'lucro', 'líquido', 'bruto',
        'receita', 'líquida', 'bruta', 'faturamento', 'vendas', 'líquidas', 'brutas',
        'custo', 'mercadorias', 'vendidas', 'cmv', 'produtos', 'vendidos', 'cpv',
        'serviços', 'prestados', 'csp', 'despesas', 'operacionais', 'administrativas',
        'comerciais', 'financeiras', 'receitas', 'financeiras', 'resultado', 'financeiro',
        'operacional', 'antes', 'impostos', 'rait', 'juros', 'impostos', 'depreciação',
        'amortização', 'exaustão', 'provisões', 'provisão', 'devedores', 'duvidosos',
        'impostos', 'contingências', 'férias', '13º', 'salário', 'fgts', 'inss', 'ir',
        'csll', 'pis', 'cofins', 'icms', 'ipi', 'iss', 'icms', 'st', 'substituição',
        'tributária', 'diferença', 'tributária', 'compensação', 'tributária', 'redução',
        'tributária', 'isenção', 'tributária', 'incentivo', 'fiscal', 'subvenção',
        'governamental', 'subsídio', 'governamental', 'financiamento', 'governamental',
        'empréstimo', 'governamental', 'financiamento', 'bancário', 'empréstimo', 'bancário',
        'financiamento', 'privado', 'empréstimo', 'privado', 'financiamento', 'público',
        'empréstimo', 'público', 'financiamento', 'internacional', 'empréstimo', 'internacional',
        'financiamento', 'nacional', 'empréstimo', 'nacional', 'financiamento', 'regional',
        'empréstimo', 'regional', 'financiamento', 'local', 'empréstimo', 'local',
        'financiamento', 'estadual', 'empréstimo', 'estadual', 'financiamento', 'municipal',
        'empréstimo', 'municipal', 'financiamento', 'federal', 'empréstimo', 'federal'
      ];
      
      // Aceitar se contém palavras financeiras OU se for de fonte brasileira confiável OU se contém português
      return financialWords.some(word => title.includes(word) || content.includes(word)) || 
             isBrazilianSource || 
             hasPortugueseWords;
    }).slice(0, 20); // Limitar a 20 notícias

    return NextResponse.json({ news: filteredNews });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ news: [] });
  }
}

function getCategoryFromTitle(title: string): string {
  if (!title) return 'Economia';
  
  const titleLower = title.toLowerCase();
  
  // Filtrar conteúdo não financeiro
  const nonFinancialWords = ['novela', 'série', 'filme', 'show', 'música', 'futebol', 'esporte', 'celebridade', 'famoso', 'artista', 'ator', 'atriz', 'cantor', 'cantora', 'jogador', 'jogadora', 'telenovela', 'reality', 'bbb', 'a fazenda', 'casa', 'encontro', 'casamento', 'divórcio', 'filho', 'filha', 'família', 'raphinha', 'disney', 'disneyland', 'paris', 'racismo', 'discriminação', 'seleção', 'brasileira', 'jogador', 'futebolista', 'atleta', 'esportista', 'craque', 'ídolo', 'estrela', 'astro', 'celebridade', 'famoso', 'artista', 'ator', 'atriz', 'cantor', 'cantora', 'músico', 'música', 'show', 'concerto', 'festival', 'evento', 'espetáculo', 'apresentação', 'performance', 'turnê', 'tour', 'gira', 'digressão', 'excursão', 'viagem', 'passeio', 'turismo', 'férias', 'descanso', 'lazer', 'diversão', 'entretenimento', 'diversão', 'lazer', 'entretenimento', 'diversão', 'lazer', 'entretenimento'];
  
  if (nonFinancialWords.some(word => titleLower.includes(word))) {
    return 'Economia'; // Classificar como Economia genérica para não aparecer
  }
  
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