import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key not configured'
      }, { status: 500 });
    }

    console.log('🔍 Debugando busca de notícias...');

    // Teste 1: Busca simples
    const simpleResponse = await fetch(
      `https://newsapi.org/v2/everything?q=bitcoin&language=pt&pageSize=5&apiKey=${apiKey}`,
      {
        headers: {
          'User-Agent': 'CalcFinance/1.0'
        }
      }
    );

    const simpleData = await simpleResponse.json();

    // Teste 2: Busca com OR
    const orResponse = await fetch(
      `https://newsapi.org/v2/everything?q=economia OR financas&language=pt&pageSize=5&apiKey=${apiKey}`,
      {
        headers: {
          'User-Agent': 'CalcFinance/1.0'
        }
      }
    );

    const orData = await orResponse.json();

    // Teste 3: Busca sem language
    const noLangResponse = await fetch(
      `https://newsapi.org/v2/everything?q=bitcoin&pageSize=5&apiKey=${apiKey}`,
      {
        headers: {
          'User-Agent': 'CalcFinance/1.0'
        }
      }
    );

    const noLangData = await noLangResponse.json();

    return NextResponse.json({ 
      success: true,
      tests: {
        simple: {
          status: simpleResponse.status,
          totalResults: simpleData.totalResults,
          articlesCount: simpleData.articles?.length || 0,
          firstTitle: simpleData.articles?.[0]?.title || 'Nenhuma'
        },
        or: {
          status: orResponse.status,
          totalResults: orData.totalResults,
          articlesCount: orData.articles?.length || 0,
          firstTitle: orData.articles?.[0]?.title || 'Nenhuma'
        },
        noLanguage: {
          status: noLangResponse.status,
          totalResults: noLangData.totalResults,
          articlesCount: noLangData.articles?.length || 0,
          firstTitle: noLangData.articles?.[0]?.title || 'Nenhuma'
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro no debug:', error);
    
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
