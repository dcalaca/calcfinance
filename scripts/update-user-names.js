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

async function updateUserNames() {
  console.log('🔧 Atualizando nomes dos usuários...')
  
  try {
    // Buscar usuários sem full_name
    const { data: users, error } = await supabase
      .from('calc_users')
      .select('*')
      .is('full_name', null)
    
    if (error) {
      console.error('❌ Erro ao buscar usuários:', error)
      return
    }
    
    if (users.length === 0) {
      console.log('✅ Todos os usuários já têm nome definido!')
      return
    }
    
    console.log(`📊 Encontrados ${users.length} usuários sem nome:`)
    
    for (const user of users) {
      // Extrair nome do email (parte antes do @)
      const emailName = user.email.split('@')[0]
      const fullName = emailName.charAt(0).toUpperCase() + emailName.slice(1)
      
      console.log(`\n👤 Atualizando ${user.email}:`)
      console.log(`   Nome sugerido: ${fullName}`)
      
      // Atualizar o usuário
      const { error: updateError } = await supabase
        .from('calc_users')
        .update({ full_name: fullName })
        .eq('id', user.id)
      
      if (updateError) {
        console.error(`   ❌ Erro ao atualizar: ${updateError.message}`)
      } else {
        console.log(`   ✅ Atualizado com sucesso!`)
      }
    }
    
    console.log('\n🎉 Atualização concluída!')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

updateUserNames()
