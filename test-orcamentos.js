const { createClient } = require('@supabase/supabase-js')

// Configurações do Supabase
const supabaseUrl = 'https://kfsteismyqpekbaqwuez.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4NTg0MywiZXhwIjoyMDY1MDYxODQzfQ.4pcJS-lSfxwkfp4VoYMFqsgrpSf8qV-LYcVsjdY1nkw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testOrcamentos() {
  console.log('🔧 Testando conexão com Supabase...')
  
  try {
    // Testar conexão
    const { data, error } = await supabase
      .from('calc_orcamentos')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro ao conectar:', error)
      return
    }
    
    console.log('✅ Conexão OK')
    console.log('📊 Orçamentos encontrados:', data?.length || 0)
    
    // Testar inserção
    console.log('🔧 Testando inserção de orçamento...')
    
    const { data: insertData, error: insertError } = await supabase
      .from('calc_orcamentos')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // ID de teste
        mes_referencia: '2024-01-01',
        nome: 'Teste Orçamento',
        descricao: 'Orçamento de teste',
        status: 'ativo'
      })
      .select()
    
    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError)
    } else {
      console.log('✅ Inserção OK:', insertData)
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error)
  }
}

testOrcamentos()
