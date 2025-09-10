const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTableStructure() {
  console.log('🔍 Verificando estrutura da tabela calc_users...')
  
  try {
    // Buscar informações da tabela
    const { data, error } = await supabase
      .from('calc_users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro ao buscar dados:', error)
      return
    }
    
    if (data && data.length > 0) {
      console.log('📊 Colunas da tabela calc_users:')
      const columns = Object.keys(data[0])
      columns.forEach((column, index) => {
        console.log(`   ${index + 1}. ${column}`)
      })
    } else {
      console.log('⚠️ Nenhum dado encontrado na tabela')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

checkTableStructure()
