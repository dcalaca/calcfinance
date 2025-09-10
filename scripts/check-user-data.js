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

async function checkUserData() {
  console.log('🔍 Verificando dados dos usuários...')
  
  try {
    // Buscar todos os usuários da tabela calc_users
    const { data: users, error } = await supabase
      .from('calc_users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro ao buscar usuários:', error)
      return
    }
    
    console.log(`📊 Encontrados ${users.length} usuários:`)
    
    users.forEach((user, index) => {
      console.log(`\n👤 Usuário ${index + 1}:`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Nome: ${user.full_name || 'NÃO DEFINIDO'}`)
      console.log(`   Criado em: ${user.created_at}`)
      console.log(`   Último login: ${user.last_login || 'Nunca'}`)
    })
    
    // Verificar se há usuários sem full_name
    const usersWithoutName = users.filter(user => !user.full_name)
    
    if (usersWithoutName.length > 0) {
      console.log(`\n⚠️  ${usersWithoutName.length} usuários sem nome definido:`)
      usersWithoutName.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id})`)
      })
      
      console.log('\n💡 Para corrigir, execute:')
      console.log('   node scripts/update-user-names.js')
    } else {
      console.log('\n✅ Todos os usuários têm nome definido!')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

checkUserData()
