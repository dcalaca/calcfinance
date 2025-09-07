const { createClient } = require('@supabase/supabase-js')

// Configurações do Supabase
const supabaseUrl = 'https://kfsteismyqpekbaqwuez.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4NTg0MywiZXhwIjoyMDY1MDYxODQzfQ.4pcJS-lSfxwkfp4VoYMFqsgrpSf8qV-LYcVsjdY1nkw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixTables() {
  console.log('🔧 Corrigindo tabelas de orçamento...')
  
  try {
    // Primeiro, verificar se as tabelas existem
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['calc_orcamentos', 'calc_orcamento_itens'])
    
    if (tablesError) {
      console.error('❌ Erro ao verificar tabelas:', tablesError)
      return
    }
    
    console.log('📊 Tabelas existentes:', tables?.map(t => t.table_name) || [])
    
    // Se as tabelas existem, vamos recriá-las
    if (tables && tables.length > 0) {
      console.log('🗑️ Removendo tabelas existentes...')
      
      // Remover tabelas na ordem correta (dependências primeiro)
      await supabase.rpc('exec_sql', { 
        sql: 'DROP TABLE IF EXISTS calc_orcamento_itens CASCADE;' 
      })
      
      await supabase.rpc('exec_sql', { 
        sql: 'DROP TABLE IF EXISTS calc_orcamentos CASCADE;' 
      })
    }
    
    console.log('🔧 Criando tabelas corrigidas...')
    
    // Executar o SQL corrigido
    const sql = `
    -- Tabela de orçamentos (apenas metadados)
    CREATE TABLE IF NOT EXISTS calc_orcamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES calc_users(id) ON DELETE CASCADE,
    mes_referencia DATE NOT NULL,
    nome VARCHAR NOT NULL,
    descricao TEXT,
    status VARCHAR DEFAULT 'ativo',
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(user_id, mes_referencia)
    );

    -- Tabela de itens de orçamento (receitas e despesas)
    CREATE TABLE IF NOT EXISTS calc_orcamento_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orcamento_id UUID NOT NULL REFERENCES calc_orcamentos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES calc_users(id) ON DELETE CASCADE,
    nome VARCHAR NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    categoria VARCHAR NOT NULL,
    tipo VARCHAR NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    data DATE NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- Índices para performance
    CREATE INDEX IF NOT EXISTS idx_orcamentos_user_id ON calc_orcamentos(user_id);
    CREATE INDEX IF NOT EXISTS idx_orcamentos_mes_referencia ON calc_orcamentos(mes_referencia);
    CREATE INDEX IF NOT EXISTS idx_orcamento_itens_orcamento_id ON calc_orcamento_itens(orcamento_id);
    CREATE INDEX IF NOT EXISTS idx_orcamento_itens_user_id ON calc_orcamento_itens(user_id);
    CREATE INDEX IF NOT EXISTS idx_orcamento_itens_tipo ON calc_orcamento_itens(tipo);
    CREATE INDEX IF NOT EXISTS idx_orcamento_itens_data ON calc_orcamento_itens(data);

    -- RLS (Row Level Security)
    ALTER TABLE calc_orcamentos ENABLE ROW LEVEL SECURITY;
    ALTER TABLE calc_orcamento_itens ENABLE ROW LEVEL SECURITY;

    -- Políticas para calc_orcamentos
    CREATE POLICY "Users can view their own orcamentos" ON calc_orcamentos
    FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own orcamentos" ON calc_orcamentos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own orcamentos" ON calc_orcamentos
    FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own orcamentos" ON calc_orcamentos
    FOR DELETE USING (auth.uid() = user_id);

    -- Políticas para calc_orcamento_itens
    CREATE POLICY "Users can view their own orcamento_itens" ON calc_orcamento_itens
    FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own orcamento_itens" ON calc_orcamento_itens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own orcamento_itens" ON calc_orcamento_itens
    FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own orcamento_itens" ON calc_orcamento_itens
    FOR DELETE USING (auth.uid() = user_id);

    -- Função para atualizar updated_at automaticamente
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Triggers para updated_at
    CREATE TRIGGER update_orcamentos_updated_at 
    BEFORE UPDATE ON calc_orcamentos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_orcamento_itens_updated_at 
    BEFORE UPDATE ON calc_orcamento_itens 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `
    
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql })
    
    if (sqlError) {
      console.error('❌ Erro ao executar SQL:', sqlError)
      return
    }
    
    console.log('✅ Tabelas criadas com sucesso!')
    
    // Testar inserção
    console.log('🔧 Testando inserção...')
    
    const { data: testData, error: testError } = await supabase
      .from('calc_orcamentos')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('❌ Erro ao testar:', testError)
    } else {
      console.log('✅ Teste OK - Tabelas funcionando!')
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error)
  }
}

fixTables()
