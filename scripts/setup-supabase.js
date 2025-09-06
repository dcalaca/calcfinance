const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = 'https://kfsteismyqpekbaqwuez.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4NTg0MywiZXhwIjoyMDY1MDYxODQzfQ.4pcJS-lSfxwkfp4VoYMFqsgrpSf8qV-LYcVsjdY1nkw';

// Criar cliente Supabase com service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSupabase() {
  try {
    console.log('🚀 Iniciando configuração do Supabase...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'create-calc-tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Arquivo SQL carregado com sucesso');
    
    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Encontrados ${commands.length} comandos SQL para executar`);
    
    // Executar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`⏳ Executando comando ${i + 1}/${commands.length}...`);
          
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql_query: command 
          });
          
          if (error) {
            console.log(`⚠️  Aviso no comando ${i + 1}: ${error.message}`);
            // Continuar mesmo com avisos (alguns comandos podem falhar se já existirem)
          } else {
            console.log(`✅ Comando ${i + 1} executado com sucesso`);
          }
        } catch (err) {
          console.log(`⚠️  Erro no comando ${i + 1}: ${err.message}`);
          // Continuar com os próximos comandos
        }
      }
    }
    
    console.log('🎉 Configuração do Supabase concluída!');
    console.log('📊 Verificando tabelas criadas...');
    
    // Verificar se as tabelas foram criadas
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .like('table_name', 'calc_%');
    
    if (tablesError) {
      console.log('⚠️  Não foi possível verificar as tabelas:', tablesError.message);
    } else {
      console.log('📋 Tabelas CALC_ encontradas:');
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
    console.log('💡 Dica: Verifique se as credenciais do Supabase estão corretas');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupSupabase();
}

module.exports = { setupSupabase };
