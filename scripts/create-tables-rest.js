const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Configuração do Supabase
const supabaseUrl = 'https://kfsteismyqpekbaqwuez.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4NTg0MywiZXhwIjoyMDY1MDYxODQzfQ.4pcJS-lSfxwkfp4VoYMFqsgrpSf8qV-LYcVsjdY1nkw';

async function createTables() {
  console.log('🚀 Criando tabelas no Supabase via API REST...');
  
  try {
    // 1. Criar tabela CALC_users
    console.log('📝 Criando tabela CALC_users...');
    const usersResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
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
      })
    });
    
    if (usersResponse.ok) {
      console.log('✅ Tabela CALC_users criada');
    } else {
      const error = await usersResponse.text();
      console.log('⚠️  Aviso CALC_users:', error);
    }
    
    // 2. Criar tabela CALC_calculations
    console.log('📝 Criando tabela CALC_calculations...');
    const calcResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
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
      })
    });
    
    if (calcResponse.ok) {
      console.log('✅ Tabela CALC_calculations criada');
    } else {
      const error = await calcResponse.text();
      console.log('⚠️  Aviso CALC_calculations:', error);
    }
    
    // 3. Criar tabela CALC_news
    console.log('📝 Criando tabela CALC_news...');
    const newsResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
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
      })
    });
    
    if (newsResponse.ok) {
      console.log('✅ Tabela CALC_news criada');
    } else {
      const error = await newsResponse.text();
      console.log('⚠️  Aviso CALC_news:', error);
    }
    
    // 4. Criar tabela CALC_articles
    console.log('📝 Criando tabela CALC_articles...');
    const articlesResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        sql: `
          CREATE TABLE IF NOT EXISTS CALC_articles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title VARCHAR(500) NOT NULL,
            excerpt TEXT,
            content TEXT NOT NULL,
            category VARCHAR(100) NOT NULL,
            read_time INTEGER DEFAULT 5,
            author VARCHAR(255) DEFAULT 'FinanceHub',
            image_url TEXT,
            tags TEXT[],
            published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            is_active BOOLEAN DEFAULT true,
            view_count INTEGER DEFAULT 0
          );
        `
      })
    });
    
    if (articlesResponse.ok) {
      console.log('✅ Tabela CALC_articles criada');
    } else {
      const error = await articlesResponse.text();
      console.log('⚠️  Aviso CALC_articles:', error);
    }
    
    // 5. Criar tabela CALC_currency_rates
    console.log('📝 Criando tabela CALC_currency_rates...');
    const currencyResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
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
      })
    });
    
    if (currencyResponse.ok) {
      console.log('✅ Tabela CALC_currency_rates criada');
    } else {
      const error = await currencyResponse.text();
      console.log('⚠️  Aviso CALC_currency_rates:', error);
    }
    
    console.log('🎉 Tentativa de criação das tabelas concluída!');
    console.log('💡 Nota: Se as tabelas não foram criadas, você pode criá-las manualmente no painel do Supabase');
    console.log('🔗 Acesse: https://supabase.com/dashboard/project/kfsteismyqpekbaqwuez');
    
  } catch (error) {
    console.error('❌ Erro durante a criação das tabelas:', error.message);
    console.log('💡 Dica: Verifique se as credenciais do Supabase estão corretas');
  }
}

// Executar
createTables();
