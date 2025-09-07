-- Tabela de orçamentos mensais
CREATE TABLE IF NOT EXISTS calc_orcamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL, -- Ex: 2024-01-01 para janeiro de 2024
  nome VARCHAR(255) NOT NULL, -- Ex: "Orçamento Janeiro 2024"
  descricao TEXT,
  receitas JSONB DEFAULT '[]'::jsonb, -- Array de receitas
  despesas JSONB DEFAULT '[]'::jsonb, -- Array de despesas
  total_receitas DECIMAL(15,2) DEFAULT 0,
  total_despesas DECIMAL(15,2) DEFAULT 0,
  saldo DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'ativo', -- ativo, arquivado, excluido
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_calc_orcamentos_user_id ON calc_orcamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_calc_orcamentos_mes_referencia ON calc_orcamentos(mes_referencia);
CREATE INDEX IF NOT EXISTS idx_calc_orcamentos_status ON calc_orcamentos(status);

-- RLS (Row Level Security)
ALTER TABLE calc_orcamentos ENABLE ROW LEVEL SECURITY;

-- Política: usuários só podem ver seus próprios orçamentos
CREATE POLICY "Users can view own orcamentos" ON calc_orcamentos
  FOR SELECT USING (auth.uid() = user_id);

-- Política: usuários só podem inserir seus próprios orçamentos
CREATE POLICY "Users can insert own orcamentos" ON calc_orcamentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: usuários só podem atualizar seus próprios orçamentos
CREATE POLICY "Users can update own orcamentos" ON calc_orcamentos
  FOR UPDATE USING (auth.uid() = user_id);

-- Política: usuários só podem deletar seus próprios orçamentos
CREATE POLICY "Users can delete own orcamentos" ON calc_orcamentos
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_calc_orcamentos_updated_at 
  BEFORE UPDATE ON calc_orcamentos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
