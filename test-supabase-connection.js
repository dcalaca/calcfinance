// Script para testar a conexão com Supabase e verificar dados
const { createClient } = require('@supabase/supabase-js')

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = 'SUA_URL_DO_SUPABASE'
const supabaseKey = 'SUA_CHAVE_DO_SUPABASE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...')
  
  try {
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
      if (orcamentos && orcamentos.length > 0) {
        console.log('📋 Primeiro orçamento:', orcamentos[0])
      }
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
      if (itens && itens.length > 0) {
        console.log('📋 Primeiro item:', itens[0])
      }
    }
    
    // Testar inserção de um orçamento de teste
    console.log('\n🧪 Testando inserção de orçamento...')
    const { data: novoOrcamento, error: insertError } = await supabase
      .from('calc_orcamentos')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // UUID de teste
        mes_referencia: '2025-01-01',
        nome: 'Teste Orçamento',
        descricao: 'Orçamento de teste'
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Erro ao inserir orçamento:', insertError.message)
    } else {
      console.log('✅ Orçamento inserido com sucesso:', novoOrcamento)
      
      // Testar inserção de um item
      console.log('\n🧪 Testando inserção de item...')
      const { data: novoItem, error: itemError } = await supabase
        .from('calc_orcamento_itens')
        .insert({
          orcamento_id: novoOrcamento.id,
          user_id: '00000000-0000-0000-0000-000000000000',
          nome: 'Teste Item',
          valor: 100.00,
          categoria: 'Teste',
          tipo: 'despesa',
          data: '2025-01-01',
          observacoes: 'Item de teste'
        })
        .select()
        .single()
      
      if (itemError) {
        console.error('❌ Erro ao inserir item:', itemError.message)
      } else {
        console.log('✅ Item inserido com sucesso:', novoItem)
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testConnection()
