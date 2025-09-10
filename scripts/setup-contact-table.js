const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupContactTable() {
  console.log('🔧 Configurando tabela de mensagens de contato...')
  
  try {
    // Ler o arquivo SQL
    const sql = fs.readFileSync('scripts/create-contact-table.sql', 'utf8')
    
    // Executar o SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error('❌ Erro ao executar SQL:', error)
      return
    }
    
    console.log('✅ Tabela contact_messages criada com sucesso!')
    
    // Testar inserção
    console.log('🧪 Testando inserção...')
    const { data: testData, error: testError } = await supabase
      .from('contact_messages')
      .insert([
        {
          nome_completo: 'Teste Sistema',
          email: 'teste@calcfy.me',
          assunto: 'teste',
          mensagem: 'Mensagem de teste do sistema',
          ip_address: '127.0.0.1',
          user_agent: 'Teste Script'
        }
      ])
      .select()
    
    if (testError) {
      console.error('❌ Erro no teste de inserção:', testError)
    } else {
      console.log('✅ Teste de inserção bem-sucedido!')
      console.log('📊 Dados de teste inseridos:', testData[0])
      
      // Limpar dados de teste
      const { error: deleteError } = await supabase
        .from('contact_messages')
        .delete()
        .eq('email', 'teste@calcfy.me')
      
      if (deleteError) {
        console.warn('⚠️ Erro ao limpar dados de teste:', deleteError)
      } else {
        console.log('🧹 Dados de teste removidos')
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

setupContactTable()
