const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://kfsteismyqpekbaqwuez.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4NTg0MywiZXhwIjoyMDY1MDYxODQzfQ.4pcJS-lSfxwkfp4VoYMFqsgrpSf8qV-LYcVsjdY1nkw';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🚀 Criando tabelas no Supabase...');
  
  try {
    // 1. Criar tabela CALC_users
    console.log('📝 Criando tabela CALC_users...');
    const { error: usersError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS CALC_users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          full_name VARCHAR(255),
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_login TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT true
        );
      `
    });
    
    if (usersError) {
      console.log('⚠️  Aviso CALC_users:', usersError.message);
    } else {
      console.log('✅ Tabela CALC_users criada');
    }
    
    // 2. Criar tabela CALC_calculations
    console.log('📝 Criando tabela CALC_calculations...');
    const { error: calcError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS CALC_calculations (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES CALC_users(id) ON DELETE CASCADE,
          calculation_type VARCHAR(100) NOT NULL,
          input_data JSONB NOT NULL,
          result_data JSONB NOT NULL,
          title VARCHAR(255),
          description TEXT,
          is_favorite BOOLEAN DEFAULT false,
          is_public BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (calcError) {
      console.log('⚠️  Aviso CALC_calculations:', calcError.message);
    } else {
      console.log('✅ Tabela CALC_calculations criada');
    }
    
    // 3. Criar tabela CALC_news
    console.log('📝 Criando tabela CALC_news...');
    const { error: newsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS CALC_news (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          excerpt TEXT,
          content TEXT,
          category VARCHAR(100) NOT NULL,
          source VARCHAR(255) NOT NULL,
          author VARCHAR(255),
          source_url TEXT,
          image_url TEXT,
          published_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_active BOOLEAN DEFAULT true,
          view_count INTEGER DEFAULT 0
        );
      `
    });
    
    if (newsError) {
      console.log('⚠️  Aviso CALC_news:', newsError.message);
    } else {
      console.log('✅ Tabela CALC_news criada');
    }
    
    // 4. Criar tabela CALC_articles
    console.log('📝 Criando tabela CALC_articles...');
    const { error: articlesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS CALC_articles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          excerpt TEXT,
          content TEXT NOT NULL,
          category VARCHAR(100) NOT NULL,
          read_time INTEGER DEFAULT 5,
          author VARCHAR(255) DEFAULT 'CalcFy',
          image_url TEXT,
          tags TEXT[],
          published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_active BOOLEAN DEFAULT true,
          view_count INTEGER DEFAULT 0
        );
      `
    });
    
    if (articlesError) {
      console.log('⚠️  Aviso CALC_articles:', articlesError.message);
    } else {
      console.log('✅ Tabela CALC_articles criada');
    }
    
    // 5. Criar tabela CALC_currency_rates
    console.log('📝 Criando tabela CALC_currency_rates...');
    const { error: currencyError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS CALC_currency_rates (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          from_currency VARCHAR(10) NOT NULL,
          to_currency VARCHAR(10) NOT NULL,
          rate DECIMAL(15,6) NOT NULL,
          variation_percent DECIMAL(8,4),
          source VARCHAR(100) DEFAULT 'AwesomeAPI',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(from_currency, to_currency)
        );
      `
    });
    
    if (currencyError) {
      console.log('⚠️  Aviso CALC_currency_rates:', currencyError.message);
    } else {
      console.log('✅ Tabela CALC_currency_rates criada');
    }
    
    // 6. Inserir dados de exemplo
    console.log('📊 Inserindo dados de exemplo...');
    
    // Inserir notícias de exemplo
    const { error: newsInsertError } = await supabase
      .from('CALC_news')
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
          published_at: new Date().toISOString()
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
          published_at: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    
    if (newsInsertError) {
      console.log('⚠️  Aviso inserção notícias:', newsInsertError.message);
    } else {
      console.log('✅ Dados de exemplo inseridos');
    }
    
    // Inserir cotações de exemplo
    const { error: currencyInsertError } = await supabase
      .from('CALC_currency_rates')
      .insert([
        { from_currency: 'USD', to_currency: 'BRL', rate: 5.85, variation_percent: 0.5 },
        { from_currency: 'EUR', to_currency: 'BRL', rate: 6.42, variation_percent: -0.2 },
        { from_currency: 'BTC', to_currency: 'BRL', rate: 285000.00, variation_percent: 2.5 }
      ]);
    
    if (currencyInsertError) {
      console.log('⚠️  Aviso inserção cotações:', currencyInsertError.message);
    } else {
      console.log('✅ Cotações de exemplo inseridas');
    }
    
    console.log('🎉 Configuração concluída com sucesso!');
    console.log('🔗 Acesse seu painel do Supabase para ver as tabelas criadas');
    
  } catch (error) {
    console.error('❌ Erro durante a criação das tabelas:', error.message);
  }
}

// Executar
createTables();
