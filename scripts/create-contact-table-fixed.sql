-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Permitir inserção de mensagens de contato" ON contact_messages;
DROP POLICY IF EXISTS "Permitir leitura de mensagens para usuários autenticados" ON contact_messages;
DROP POLICY IF EXISTS "Permitir atualização de mensagens para usuários autenticados" ON contact_messages;

-- Criar tabela para mensagens de contato (versão simplificada)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  assunto VARCHAR(100) NOT NULL,
  mensagem TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'lida', 'respondida', 'arquivada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES calc_users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de mensagens (qualquer pessoa pode enviar)
CREATE POLICY "Permitir inserção de mensagens de contato" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura apenas para usuários autenticados
CREATE POLICY "Permitir leitura de mensagens para usuários autenticados" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM calc_users 
      WHERE calc_users.id = auth.uid()
    )
  );

-- Política para permitir atualização apenas para usuários autenticados
CREATE POLICY "Permitir atualização de mensagens para usuários autenticados" ON contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM calc_users 
      WHERE calc_users.id = auth.uid()
    )
  );
