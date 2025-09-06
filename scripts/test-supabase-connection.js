const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://kfsteismyqpekbaqwuez.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODU4NDMsImV4cCI6MjA2NTA2MTg0M30.nuHieAbGz65Lm5KlNamxO_HS_SFy0DGm6tIIbty7Z8A';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  
  try {
    // Testar conexão básica
    console.log('📡 Testando conexão básica...');
    const { data, error } = await supabase
      .from('CALC_news')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('⚠️  Erro na conexão:', error.message);
      
      // Se a tabela não existir, tentar criar uma tabela de teste
      console.log('🔄 Tentando criar tabela de teste...');
      const { error: createError } = await supabase
        .from('test_connection')
        .select('*')
        .limit(1);
      
      if (createError) {
        console.log('❌ Não foi possível conectar ao Supabase');
        console.log('💡 Verifique se:');
        console.log('   1. As credenciais estão corretas');
        console.log('   2. O projeto Supabase está ativo');
        console.log('   3. As tabelas foram criadas');
        return false;
      }
    } else {
      console.log('✅ Conexão com Supabase estabelecida!');
    }
    
    // Testar autenticação
    console.log('🔐 Testando sistema de autenticação...');
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
    
    // Testar inserção de dados
    console.log('📝 Testando inserção de dados...');
    const { data: insertData, error: insertError } = await supabase
      .from('CALC_news')
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
      console.log('⚠️  Erro na inserção:', insertError.message);
    } else {
      console.log('✅ Inserção de dados funcionando');
      console.log('📊 Dados inseridos:', insertData);
    }
    
    console.log('🎉 Teste de conexão concluído!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    return false;
  }
}

// Executar teste
testConnection();
