import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key not configured',
        message: 'Configure NEWS_API_KEY no arquivo .env.local'
      }, { status: 500 });
    }

    console.log('🔑 Testando API Key...');
    console.log('API Key (primeiros 10 chars):', apiKey.substring(0, 10) + '...');

    // Teste simples com uma busca básica
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=bitcoin brasil&language=pt&pageSize=5&apiKey=${apiKey}`,
      {
        headers: {
          'User-Agent': 'CalcFinance/1.0'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        success: false,
        error: `NewsAPI error: ${response.status} - ${response.statusText}`,
        details: errorText,
        apiKey: apiKey.substring(0, 10) + '...'
      }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true,
      message: `API Key funcionando! Encontradas ${data.articles?.length || 0} notícias`,
      totalResults: data.totalResults,
      articlesCount: data.articles?.length || 0,
      apiKey: apiKey.substring(0, 10) + '...',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      apiKey: process.env.NEWS_API_KEY ? process.env.NEWS_API_KEY.substring(0, 10) + '...' : 'Não configurada',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
