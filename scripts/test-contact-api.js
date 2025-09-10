const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testContactAPI() {
  console.log('🔧 Testando API de contato...')
  console.log('🔗 Supabase URL:', supabaseUrl)
  console.log('🔑 Supabase Key configurada:', !!supabaseKey)

  try {
    // Testar inserção diretamente
    console.log('\n📝 Testando inserção de mensagem...')
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          nome_completo: 'Teste API',
          email: 'teste@exemplo.com',
          assunto: 'Teste de API',
          mensagem: 'Esta é uma mensagem de teste da API',
          ip_address: '127.0.0.1',
          user_agent: 'Teste Script'
        }
      ])
      .select()

    if (error) {
      console.error('❌ Erro ao inserir mensagem:', error)
      if (error.code === '42P01') {
        console.log('📋 Tabela contact_messages NÃO existe!')
        console.log('📋 Execute o SQL create-contact-table-fixed.sql no Supabase Dashboard')
      }
    } else {
      console.log('✅ Mensagem inserida com sucesso:', data[0]?.id)
      console.log('✅ Tabela contact_messages existe e está funcionando!')
    }

  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

testContactAPI()
