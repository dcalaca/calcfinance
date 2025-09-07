const { createClient } = require('@supabase/supabase-js')

// Use suas credenciais do Supabase aqui
const supabaseUrl = 'SUA_URL_DO_SUPABASE'
const supabaseKey = 'SUA_CHAVE_DO_SUPABASE'

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testTables() {
  console.log('🔍 Testando tabelas...')
  
  // Testar tabela calc_orcamentos
  console.log('\n📊 Testando calc_orcamentos...')
  const { data: orcamentos, error: orcamentosError } = await supabase
    .from('calc_orcamentos')
    .select('*')
    .limit(5)
  
  if (orcamentosError) {
    console.error('❌ Erro ao buscar orçamentos:', orcamentosError.message)
  } else {
    console.log('✅ calc_orcamentos encontrada:', orcamentos?.length || 0, 'registros')
    console.log('📋 Dados:', orcamentos)
  }
  
  // Testar tabela calc_orcamento_itens
  console.log('\n📊 Testando calc_orcamento_itens...')
  const { data: itens, error: itensError } = await supabase
    .from('calc_orcamento_itens')
    .select('*')
    .limit(5)
  
  if (itensError) {
    console.error('❌ Erro ao buscar itens:', itensError.message)
  } else {
    console.log('✅ calc_orcamento_itens encontrada:', itens?.length || 0, 'registros')
    console.log('📋 Dados:', itens)
  }
  
  // Testar tabela antiga
  console.log('\n📊 Testando tabela antiga (se existir)...')
  const { data: oldData, error: oldError } = await supabase
    .from('calc_orcamentos')
    .select('receitas, despesas')
    .limit(1)
  
  if (oldError) {
    console.error('❌ Erro ao buscar dados antigos:', oldError.message)
  } else {
    console.log('📋 Dados antigos (arrays JSON):', oldData)
  }
}

testTables().catch(console.error)
