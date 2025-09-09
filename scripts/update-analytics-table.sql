-- Adicionar campos de IP e localização à tabela de analytics
ALTER TABLE site_analytics 
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS region VARCHAR(100),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100),
ADD COLUMN IF NOT EXISTS isp VARCHAR(255),
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Criar índices para os novos campos
CREATE INDEX IF NOT EXISTS idx_site_analytics_ip ON site_analytics(ip_address);
CREATE INDEX IF NOT EXISTS idx_site_analytics_country ON site_analytics(country);
CREATE INDEX IF NOT EXISTS idx_site_analytics_city ON site_analytics(city);

-- Comentários para documentação
COMMENT ON COLUMN site_analytics.ip_address IS 'Endereço IP do visitante';
COMMENT ON COLUMN site_analytics.region IS 'Região/Estado do usuário';
COMMENT ON COLUMN site_analytics.timezone IS 'Fuso horário do usuário';
COMMENT ON COLUMN site_analytics.isp IS 'Provedor de internet do usuário';
COMMENT ON COLUMN site_analytics.latitude IS 'Latitude da localização';
COMMENT ON COLUMN site_analytics.longitude IS 'Longitude da localização';
