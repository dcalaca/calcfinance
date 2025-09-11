const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://kfsteismyqpekbaqwuez.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODU4NDMsImV4cCI6MjA2NTA2MTg0M30.nuHieAbGz65Lm5KlNamxO_HS_SFy0DGm6tIIbty7Z8A'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCalculationsTable() {
  console.log('🔍 Testando tabela de cálculos...')
  
  try {
    // Testar diferentes nomes de tabela
    const tableNames = [
      'calc_calculations',
      'CALC_calculations', 
      'finance_calculations',
      'calculations'
    ]
    
    for (const tableName of tableNames) {
      console.log(`\n📋 Testando tabela: ${tableName}`)
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ Erro na tabela ${tableName}:`, error.message)
      } else {
        console.log(`✅ Tabela ${tableName} existe! Registros encontrados:`, data?.length || 0)
        if (data && data.length > 0) {
          console.log('📊 Estrutura do primeiro registro:', Object.keys(data[0]))
        }
      }
    }
    
    // Verificar tabelas disponíveis
    console.log('\n🔍 Listando todas as tabelas disponíveis...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.log('❌ Erro ao listar tabelas:', tablesError.message)
    } else {
      console.log('📋 Tabelas encontradas:')
      tables?.forEach(table => {
        console.log(`  - ${table.table_name}`)
      })
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error)
  }
}

testCalculationsTable()
