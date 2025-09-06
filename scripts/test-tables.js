const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://kfsteismyqpekbaqwuez.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODU4NDMsImV4cCI6MjA2NTA2MTg0M30.nuHieAbGz65Lm5KlNamxO_HS_SFy0DGm6tIIbty7Z8A';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTables() {
  console.log('🔍 Testando acesso às tabelas...');
  
  // Lista de tabelas para testar (maiúsculas e minúsculas)
  const tableNames = [
    'CALC_news',
    'calc_news', 
    'CALC_users',
    'calc_users',
    'CALC_calculations',
    'calc_calculations',
    'CALC_articles',
    'calc_articles',
    'CALC_currency_rates',
    'calc_currency_rates'
  ];
  
  for (const tableName of tableNames) {
    try {
      console.log(`📋 Testando tabela: ${tableName}`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: Acessível! (${data.length} registros encontrados)`);
        
        // Se encontrou a tabela, tentar inserir um dado de teste
        console.log(`📝 Testando inserção em ${tableName}...`);
        
        if (tableName.includes('news')) {
          const { data: insertData, error: insertError } = await supabase
            .from(tableName)
            .insert([
              {
                title: 'Teste de Conexão',
                excerpt: 'Este é um teste de conexão com o Supabase',
                content: 'Teste realizado com sucesso!',
                category: 'Teste',
                source: 'FinanceHub',
                author: 'Sistema',
                published_at: new Date().toISOString()
              }
            ])
            .select();
          
          if (insertError) {
            console.log(`⚠️  Erro na inserção em ${tableName}: ${insertError.message}`);
          } else {
            console.log(`✅ Inserção em ${tableName} funcionando!`);
          }
        }
        
        break; // Se encontrou uma tabela que funciona, parar aqui
      }
    } catch (err) {
      console.log(`❌ ${tableName}: Erro - ${err.message}`);
    }
  }
  
  // Testar autenticação
  console.log('\n🔐 Testando autenticação...');
  const { data: authData, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.log('⚠️  Erro na autenticação:', authError.message);
  } else {
    console.log('✅ Sistema de autenticação funcionando');
    if (authData.user) {
      console.log('👤 Usuário logado:', authData.user.email);
    } else {
      console.log('👤 Nenhum usuário logado');
    }
  }
}

// Executar teste
testTables();
