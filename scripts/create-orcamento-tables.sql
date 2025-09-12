-- Script para criar tabelas de orçamento
-- Execute este script no Supabase SQL Editor

-- 1. Criar tabela de itens de orçamento
CREATE TABLE IF NOT EXISTS public.calc_orcamento_itens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  categoria TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  data DATE NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de orçamentos
CREATE TABLE IF NOT EXISTS public.calc_orcamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  mes_referencia TEXT NOT NULL,
  total_receitas DECIMAL(10,2) DEFAULT 0,
  total_despesas DECIMAL(10,2) DEFAULT 0,
  saldo DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'arquivado')),
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar RLS
ALTER TABLE public.calc_orcamento_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calc_orcamentos ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de segurança para calc_orcamento_itens
CREATE POLICY "calc_orcamento_itens_select_own" ON public.calc_orcamento_itens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "calc_orcamento_itens_insert_own" ON public.calc_orcamento_itens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "calc_orcamento_itens_update_own" ON public.calc_orcamento_itens
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "calc_orcamento_itens_delete_own" ON public.calc_orcamento_itens
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Políticas de segurança para calc_orcamentos
CREATE POLICY "calc_orcamentos_select_own" ON public.calc_orcamentos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "calc_orcamentos_insert_own" ON public.calc_orcamentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "calc_orcamentos_update_own" ON public.calc_orcamentos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "calc_orcamentos_delete_own" ON public.calc_orcamentos
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Criar índices
CREATE INDEX IF NOT EXISTS idx_calc_orcamento_itens_user_id ON public.calc_orcamento_itens(user_id);
CREATE INDEX IF NOT EXISTS idx_calc_orcamento_itens_data ON public.calc_orcamento_itens(data);
CREATE INDEX IF NOT EXISTS idx_calc_orcamento_itens_tipo ON public.calc_orcamento_itens(tipo);

CREATE INDEX IF NOT EXISTS idx_calc_orcamentos_user_id ON public.calc_orcamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_calc_orcamentos_mes_referencia ON public.calc_orcamentos(mes_referencia);

-- 7. Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_orcamento_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Triggers para updated_at
CREATE TRIGGER handle_updated_at_calc_orcamento_itens
  BEFORE UPDATE ON public.calc_orcamento_itens
  FOR EACH ROW EXECUTE FUNCTION public.handle_orcamento_updated_at();

CREATE TRIGGER handle_updated_at_calc_orcamentos
  BEFORE UPDATE ON public.calc_orcamentos
  FOR EACH ROW EXECUTE FUNCTION public.handle_orcamento_updated_at();
