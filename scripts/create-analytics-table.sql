-- Criar tabela para analytics do site
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page VARCHAR(255) NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  session_id VARCHAR(255),
  country VARCHAR(100),
  city VARCHAR(100),
  device VARCHAR(50),
  browser VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_site_analytics_page ON site_analytics(page);
CREATE INDEX IF NOT EXISTS idx_site_analytics_created_at ON site_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_site_analytics_session_id ON site_analytics(session_id);

-- Comentários para documentação
COMMENT ON TABLE site_analytics IS 'Tabela para armazenar dados de analytics do site';
COMMENT ON COLUMN site_analytics.page IS 'Página acessada';
COMMENT ON COLUMN site_analytics.referrer IS 'Página de origem (se houver)';
COMMENT ON COLUMN site_analytics.user_agent IS 'User agent do navegador';
COMMENT ON COLUMN site_analytics.timestamp IS 'Timestamp da visita';
COMMENT ON COLUMN site_analytics.session_id IS 'ID único da sessão';
COMMENT ON COLUMN site_analytics.country IS 'País do usuário (opcional)';
COMMENT ON COLUMN site_analytics.city IS 'Cidade do usuário (opcional)';
COMMENT ON COLUMN site_analytics.device IS 'Tipo de dispositivo (mobile/desktop)';
COMMENT ON COLUMN site_analytics.browser IS 'Navegador utilizado';
COMMENT ON COLUMN site_analytics.created_at IS 'Data de criação do registro';
