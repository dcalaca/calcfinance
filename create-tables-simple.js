const { createClient } = require('@supabase/supabase-js')

// Configurações do Supabase
const supabaseUrl = 'https://kfsteismyqpekbaqwuez.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4NTg0MywiZXhwIjoyMDY1MDYxODQzfQ.4pcJS-lSfxwkfp4VoYMFqsgrpSf8qV-LYcVsjdY1nkw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTables() {
  console.log('🔧 Criando tabelas de orçamento...')
  
  try {
    // Executar SQL diretamente
    const { error } = await supabase.rpc('exec_sql', { 
      sql: `
      -- Remover tabelas existentes se houver
      DROP TABLE IF EXISTS calc_orcamento_itens CASCADE;
      DROP TABLE IF EXISTS calc_orcamentos CASCADE;
      
      -- Tabela de orçamentos
      CREATE TABLE calc_orcamentos (
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

      -- Tabela de itens de orçamento
      CREATE TABLE calc_orcamento_itens (
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

      -- Índices
      CREATE INDEX idx_orcamentos_user_id ON calc_orcamentos(user_id);
      CREATE INDEX idx_orcamentos_mes_referencia ON calc_orcamentos(mes_referencia);
      CREATE INDEX idx_orcamento_itens_orcamento_id ON calc_orcamento_itens(orcamento_id);
      CREATE INDEX idx_orcamento_itens_user_id ON calc_orcamento_itens(user_id);

      -- RLS
      ALTER TABLE calc_orcamentos ENABLE ROW LEVEL SECURITY;
      ALTER TABLE calc_orcamento_itens ENABLE ROW LEVEL SECURITY;

      -- Políticas
      CREATE POLICY "Users can view their own orcamentos" ON calc_orcamentos
      FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert their own orcamentos" ON calc_orcamentos
      FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update their own orcamentos" ON calc_orcamentos
      FOR UPDATE USING (auth.uid() = user_id);

      CREATE POLICY "Users can delete their own orcamentos" ON calc_orcamentos
      FOR DELETE USING (auth.uid() = user_id);

      CREATE POLICY "Users can view their own orcamento_itens" ON calc_orcamento_itens
      FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert their own orcamento_itens" ON calc_orcamento_itens
      FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update their own orcamento_itens" ON calc_orcamento_itens
      FOR UPDATE USING (auth.uid() = user_id);

      CREATE POLICY "Users can delete their own orcamento_itens" ON calc_orcamento_itens
      FOR DELETE USING (auth.uid() = user_id);
      `
    })
    
    if (error) {
      console.error('❌ Erro ao criar tabelas:', error)
      return
    }
    
    console.log('✅ Tabelas criadas com sucesso!')
    
  } catch (error) {
    console.error('💥 Erro geral:', error)
  }
}

createTables()
