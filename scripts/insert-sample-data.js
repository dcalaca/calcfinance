const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://kfsteismyqpekbaqwuez.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODU4NDMsImV4cCI6MjA2NTA2MTg0M30.nuHieAbGz65Lm5KlNamxO_HS_SFy0DGm6tIIbty7Z8A';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertSampleData() {
  console.log('📊 Inserindo dados de exemplo...');
  
  try {
    // Inserir notícias de exemplo
    console.log('📰 Inserindo notícias...');
    const { error: newsError } = await supabase
      .from('calc_news')
      .insert([
        {
          title: 'Dólar fecha em alta de 0,5% cotado a R$ 5,85',
          excerpt: 'Moeda americana sobe com expectativas sobre decisões do Fed e cenário político brasileiro',
          content: 'O dólar americano fechou em alta de 0,5% nesta sessão, cotado a R$ 5,85. A valorização reflete as expectativas dos investidores sobre as próximas decisões do Federal Reserve americano e incertezas no cenário político brasileiro.',
          category: 'Economia',
          source: 'InfoMoney',
          author: 'Redação InfoMoney',
          source_url: 'https://www.infomoney.com.br',
          image_url: '/placeholder.svg?height=300&width=400&text=economia',
          published_at: new Date().toISOString(),
          is_active: true
        },
        {
          title: 'Ibovespa sobe 1,2% puxado por ações de bancos',
          excerpt: 'Principal índice da bolsa brasileira fecha aos 129.850 pontos com volume de R$ 18 bilhões',
          content: 'O Ibovespa encerrou a sessão desta quarta-feira em alta de 1,2%, aos 129.850 pontos, com volume financeiro de R$ 18 bilhões. O movimento foi puxado principalmente pelas ações do setor bancário.',
          category: 'Bolsa',
          source: 'Valor Econômico',
          author: 'Redação Valor',
          source_url: 'https://valor.globo.com',
          image_url: '/placeholder.svg?height=300&width=400&text=bolsa',
          published_at: new Date(Date.now() - 3600000).toISOString(),
          is_active: true
        },
        {
          title: 'Bitcoin supera US$ 44.000 e acumula alta de 15% na semana',
          excerpt: 'Criptomoeda é impulsionada por otimismo sobre ETFs e adoção institucional',
          content: 'O Bitcoin superou a marca de US$ 44.000 nesta quinta-feira, acumulando alta de 15% na semana. A valorização é atribuída ao crescente otimismo sobre a aprovação de novos ETFs de Bitcoin.',
          category: 'Criptomoedas',
          source: 'CoinTelegraph Brasil',
          author: 'João Silva',
          source_url: 'https://cointelegraph.com.br',
          image_url: '/placeholder.svg?height=300&width=400&text=bitcoin',
          published_at: new Date(Date.now() - 1800000).toISOString(),
          is_active: true
        }
      ]);

    if (newsError) {
      console.log('⚠️  Erro ao inserir notícias:', newsError.message);
    } else {
      console.log('✅ Notícias inseridas com sucesso!');
    }

    // Inserir artigos educacionais
    console.log('📚 Inserindo artigos...');
    const { error: articlesError } = await supabase
      .from('calc_articles')
      .insert([
        {
          title: 'O que é CDI e como funciona no mercado brasileiro',
          excerpt: 'Entenda o que é o CDI, uma referência fundamental no mercado brasileiro. Conhecê-lo ajuda a comparar investimentos e tomar decisões mais informadas.',
          content: 'O CDI (Certificado de Depósito Interbancário) é uma das principais referências de rentabilidade no mercado financeiro brasileiro. É a taxa média praticada nas operações de empréstimo entre bancos, registrada diariamente pela B3.',
          category: 'Conceitos Básicos',
          read_time: 5,
          author: 'FinanceHub',
          tags: ['CDI', 'renda fixa', 'investimentos'],
          image_url: '/placeholder.svg?height=300&width=400&text=CDI',
          published_at: new Date().toISOString(),
          is_active: true
        },
        {
          title: 'Entendendo a diferença entre renda fixa e variável',
          excerpt: 'Descubra as principais características, vantagens e riscos de cada tipo de investimento.',
          content: 'Uma das primeiras decisões que todo investidor precisa tomar é como dividir seu dinheiro entre renda fixa e renda variável. A renda fixa oferece previsibilidade, enquanto a renda variável tem potencial de maior retorno mas também maior risco.',
          category: 'Conceitos Básicos',
          read_time: 6,
          author: 'FinanceHub',
          tags: ['renda fixa', 'renda variável', 'investimentos'],
          image_url: '/placeholder.svg?height=300&width=400&text=renda-fixa-variavel',
          published_at: new Date().toISOString(),
          is_active: true
        }
      ]);

    if (articlesError) {
      console.log('⚠️  Erro ao inserir artigos:', articlesError.message);
    } else {
      console.log('✅ Artigos inseridos com sucesso!');
    }

    // Inserir cotações de exemplo
    console.log('💱 Inserindo cotações...');
    const { error: currencyError } = await supabase
      .from('calc_currency_rates')
      .insert([
        { from_currency: 'USD', to_currency: 'BRL', rate: 5.85, variation_percent: 0.5, source: 'AwesomeAPI' },
        { from_currency: 'EUR', to_currency: 'BRL', rate: 6.42, variation_percent: -0.2, source: 'AwesomeAPI' },
        { from_currency: 'GBP', to_currency: 'BRL', rate: 7.28, variation_percent: 0.8, source: 'AwesomeAPI' },
        { from_currency: 'BTC', to_currency: 'BRL', rate: 285000.00, variation_percent: 2.5, source: 'CoinGecko' }
      ]);

    if (currencyError) {
      console.log('⚠️  Erro ao inserir cotações:', currencyError.message);
    } else {
      console.log('✅ Cotações inseridas com sucesso!');
    }

    console.log('🎉 Dados de exemplo inseridos com sucesso!');
    console.log('🔗 Acesse http://localhost:3002 para ver os dados');

  } catch (error) {
    console.error('❌ Erro durante a inserção:', error.message);
  }
}

// Executar
insertSampleData();
