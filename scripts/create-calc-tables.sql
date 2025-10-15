-- =====================================================
-- CALCFY - TABELAS COM PREFIXO CALC_
-- =====================================================
-- Este script cria as tabelas necessárias para o CalcFy
-- com o prefixo CALC_ para aproveitar um projeto Supabase existente

-- =====================================================
-- 1. TABELA DE USUÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS CALC_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- 2. TABELA DE CÁLCULOS FINANCEIROS
-- =====================================================
CREATE TABLE IF NOT EXISTS CALC_calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES CALC_users(id) ON DELETE CASCADE,
    calculation_type VARCHAR(100) NOT NULL,
    input_data JSONB NOT NULL,
    result_data JSONB NOT NULL,
    title VARCHAR(255),
    description TEXT,
    is_favorite BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA DE NOTÍCIAS FINANCEIRAS
-- =====================================================
CREATE TABLE IF NOT EXISTS CALC_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(100) NOT NULL,
    source VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    source_url TEXT,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0
);

-- =====================================================
-- 4. TABELA DE ARTIGOS EDUCACIONAIS
-- =====================================================
CREATE TABLE IF NOT EXISTS CALC_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    read_time INTEGER DEFAULT 5,
    author VARCHAR(255) DEFAULT 'CalcFy',
    image_url TEXT,
    tags TEXT[],
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0
);

-- =====================================================
-- 5. TABELA DE COTAÇÕES DE MOEDAS
-- =====================================================
CREATE TABLE IF NOT EXISTS CALC_currency_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    rate DECIMAL(15,6) NOT NULL,
    variation_percent DECIMAL(8,4),
    source VARCHAR(100) DEFAULT 'AwesomeAPI',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(from_currency, to_currency)
);

-- =====================================================
-- 6. TABELA DE ALERTAS FINANCEIROS
-- =====================================================
CREATE TABLE IF NOT EXISTS CALC_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES CALC_users(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_conditions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TABELA DE TEMPLATES DE CÁLCULO
-- =====================================================
CREATE TABLE IF NOT EXISTS CALC_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    calculation_type VARCHAR(100) NOT NULL,
    template_data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES CALC_users(id) ON DELETE SET NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. TABELA DE PREFERÊNCIAS DO USUÁRIO
-- =====================================================
CREATE TABLE IF NOT EXISTS CALC_user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES CALC_users(id) ON DELETE CASCADE UNIQUE,
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    currency VARCHAR(10) DEFAULT 'BRL',
    language VARCHAR(10) DEFAULT 'pt-BR',
    notifications JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    privacy_settings JSONB DEFAULT '{"profile_public": false, "calculations_public": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para CALC_calculations
CREATE INDEX IF NOT EXISTS idx_calc_calculations_user_id ON CALC_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_calc_calculations_type ON CALC_calculations(calculation_type);
CREATE INDEX IF NOT EXISTS idx_calc_calculations_created_at ON CALC_calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calc_calculations_favorites ON CALC_calculations(user_id, is_favorite) WHERE is_favorite = true;

-- Índices para CALC_news
CREATE INDEX IF NOT EXISTS idx_calc_news_category ON CALC_news(category);
CREATE INDEX IF NOT EXISTS idx_calc_news_published_at ON CALC_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_calc_news_active ON CALC_news(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_calc_news_source ON CALC_news(source);

-- Índices para CALC_articles
CREATE INDEX IF NOT EXISTS idx_calc_articles_category ON CALC_articles(category);
CREATE INDEX IF NOT EXISTS idx_calc_articles_published_at ON CALC_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_calc_articles_active ON CALC_articles(is_active) WHERE is_active = true;

-- Índices para CALC_currency_rates
CREATE INDEX IF NOT EXISTS idx_calc_currency_rates_pair ON CALC_currency_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_calc_currency_rates_updated_at ON CALC_currency_rates(updated_at DESC);

-- Índices para CALC_alerts
CREATE INDEX IF NOT EXISTS idx_calc_alerts_user_id ON CALC_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_calc_alerts_active ON CALC_alerts(is_active) WHERE is_active = true;

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA DE TIMESTAMPS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas relevantes
DROP TRIGGER IF EXISTS update_calc_users_updated_at ON CALC_users;
CREATE TRIGGER update_calc_users_updated_at BEFORE UPDATE ON CALC_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calc_calculations_updated_at ON CALC_calculations;
CREATE TRIGGER update_calc_calculations_updated_at BEFORE UPDATE ON CALC_calculations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calc_news_updated_at ON CALC_news;
CREATE TRIGGER update_calc_news_updated_at BEFORE UPDATE ON CALC_news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calc_articles_updated_at ON CALC_articles;
CREATE TRIGGER update_calc_articles_updated_at BEFORE UPDATE ON CALC_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calc_currency_rates_updated_at ON CALC_currency_rates;
CREATE TRIGGER update_calc_currency_rates_updated_at BEFORE UPDATE ON CALC_currency_rates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calc_alerts_updated_at ON CALC_alerts;
CREATE TRIGGER update_calc_alerts_updated_at BEFORE UPDATE ON CALC_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calc_templates_updated_at ON CALC_templates;
CREATE TRIGGER update_calc_templates_updated_at BEFORE UPDATE ON CALC_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calc_user_preferences_updated_at ON CALC_user_preferences;
CREATE TRIGGER update_calc_user_preferences_updated_at BEFORE UPDATE ON CALC_user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas sensíveis
ALTER TABLE CALC_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE CALC_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE CALC_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE CALC_user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (usuários só veem seus próprios dados)
DROP POLICY IF EXISTS "Users can view own profile" ON CALC_users;
CREATE POLICY "Users can view own profile" ON CALC_users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON CALC_users;
CREATE POLICY "Users can update own profile" ON CALC_users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own calculations" ON CALC_calculations;
CREATE POLICY "Users can view own calculations" ON CALC_calculations FOR SELECT USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Users can insert own calculations" ON CALC_calculations;
CREATE POLICY "Users can insert own calculations" ON CALC_calculations FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own calculations" ON CALC_calculations;
CREATE POLICY "Users can update own calculations" ON CALC_calculations FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own calculations" ON CALC_calculations;
CREATE POLICY "Users can delete own calculations" ON CALC_calculations FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own alerts" ON CALC_alerts;
CREATE POLICY "Users can view own alerts" ON CALC_alerts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own alerts" ON CALC_alerts;
CREATE POLICY "Users can manage own alerts" ON CALC_alerts FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own preferences" ON CALC_user_preferences;
CREATE POLICY "Users can view own preferences" ON CALC_user_preferences FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own preferences" ON CALC_user_preferences;
CREATE POLICY "Users can manage own preferences" ON CALC_user_preferences FOR ALL USING (auth.uid() = user_id);

-- Políticas para tabelas públicas (notícias e artigos)
DROP POLICY IF EXISTS "Anyone can view active news" ON CALC_news;
CREATE POLICY "Anyone can view active news" ON CALC_news FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can view active articles" ON CALC_articles;
CREATE POLICY "Anyone can view active articles" ON CALC_articles FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can view currency rates" ON CALC_currency_rates;
CREATE POLICY "Anyone can view currency rates" ON CALC_currency_rates FOR SELECT TO public;

DROP POLICY IF EXISTS "Anyone can view public templates" ON CALC_templates;
CREATE POLICY "Anyone can view public templates" ON CALC_templates FOR SELECT USING (is_public = true);

-- =====================================================
-- INSERIR DADOS DE EXEMPLO
-- =====================================================

-- Inserir notícias de exemplo
INSERT INTO CALC_news (title, excerpt, content, category, source, author, source_url, image_url, published_at) VALUES
('Dólar fecha em alta de 0,5% cotado a R$ 5,85', 'Moeda americana sobe com expectativas sobre decisões do Fed e cenário político brasileiro', 'O dólar americano fechou em alta de 0,5% nesta sessão, cotado a R$ 5,85. A valorização reflete as expectativas dos investidores sobre as próximas decisões do Federal Reserve americano e incertezas no cenário político brasileiro.', 'Economia', 'InfoMoney', 'Redação InfoMoney', 'https://www.infomoney.com.br', '/placeholder.svg?height=300&width=400&text=economia', NOW() - INTERVAL '2 hours'),

('Ibovespa sobe 1,2% puxado por ações de bancos', 'Principal índice da bolsa brasileira fecha aos 129.850 pontos com volume de R$ 18 bilhões', 'O Ibovespa encerrou a sessão desta quarta-feira em alta de 1,2%, aos 129.850 pontos, com volume financeiro de R$ 18 bilhões. O movimento foi puxado principalmente pelas ações do setor bancário.', 'Bolsa', 'Valor Econômico', 'Redação Valor', 'https://valor.globo.com', '/placeholder.svg?height=300&width=400&text=bolsa', NOW() - INTERVAL '1 hour'),

('Bitcoin supera US$ 44.000 e acumula alta de 15% na semana', 'Criptomoeda é impulsionada por otimismo sobre ETFs e adoção institucional', 'O Bitcoin superou a marca de US$ 44.000 nesta quinta-feira, acumulando alta de 15% na semana. A valorização é atribuída ao crescente otimismo sobre a aprovação de novos ETFs de Bitcoin.', 'Criptomoedas', 'CoinTelegraph Brasil', 'João Silva', 'https://cointelegraph.com.br', '/placeholder.svg?height=300&width=400&text=bitcoin', NOW() - INTERVAL '30 minutes'),

('Banco Central mantém Selic em 11,75% ao ano', 'Copom decide por unanimidade manter taxa básica de juros inalterada', 'O Comitê de Política Monetária (Copom) do Banco Central decidiu manter a taxa Selic em 11,75% ao ano. A decisão foi unânime e marca a terceira reunião consecutiva sem alteração.', 'Juros', 'G1 Economia', 'Redação G1', 'https://g1.globo.com/economia', '/placeholder.svg?height=300&width=400&text=juros', NOW() - INTERVAL '4 hours'),

('Fundos imobiliários batem recorde com R$ 12 bi captados', 'Setor de FIIs cresce 28% no ano com busca por renda passiva', 'Os fundos de investimento imobiliário (FIIs) bateram recorde de captação em 2024, arrecadando R$ 12 bilhões até agora. O crescimento reflete a busca por renda passiva.', 'Economia', 'Exame Invest', 'Maria Santos', 'https://exame.com/invest', '/placeholder.svg?height=300&width=400&text=investimentos', NOW() - INTERVAL '6 hours'),

('Como proteger seu dinheiro da inflação em 2024', 'Especialistas recomendam diversificação e investimentos indexados', 'Com a inflação pressionando o poder de compra, especialistas recomendam estratégias para proteger o patrimônio. Entre as opções estão Tesouro IPCA+ e ações.', 'Finanças Pessoais', 'InfoMoney', 'Pedro Lima', 'https://www.infomoney.com.br/guias', '/placeholder.svg?height=300&width=400&text=financas-pessoais', NOW() - INTERVAL '8 hours');

-- Inserir artigos educacionais de exemplo
INSERT INTO CALC_articles (title, excerpt, content, category, read_time, tags, image_url) VALUES
('O que é CDI e como funciona no mercado brasileiro', 'Entenda o que é o CDI, uma referência fundamental no mercado brasileiro. Conhecê-lo ajuda a comparar investimentos e tomar decisões mais informadas.', 'O CDI (Certificado de Depósito Interbancário) é uma das principais referências de rentabilidade no mercado financeiro brasileiro. É a taxa média praticada nas operações de empréstimo entre bancos, registrada diariamente pela B3.', 'Conceitos Básicos', 5, ARRAY['CDI', 'renda fixa', 'investimentos'], '/placeholder.svg?height=300&width=400&text=CDI'),

('Entendendo a diferença entre renda fixa e variável', 'Descubra as principais características, vantagens e riscos de cada tipo de investimento.', 'Uma das primeiras decisões que todo investidor precisa tomar é como dividir seu dinheiro entre renda fixa e renda variável. A renda fixa oferece previsibilidade, enquanto a renda variável tem potencial de maior retorno mas também maior risco.', 'Conceitos Básicos', 6, ARRAY['renda fixa', 'renda variável', 'investimentos'], '/placeholder.svg?height=300&width=400&text=renda-fixa-variavel'),

('Como montar uma carteira de investimentos diversificada', 'Aprenda os princípios fundamentais da diversificação e como aplicá-los na prática.', 'A diversificação é uma das estratégias mais importantes para reduzir riscos e otimizar retornos. Significa espalhar investimentos entre diferentes classes de ativos, setores e geografias.', 'Investimentos', 8, ARRAY['diversificação', 'carteira', 'estratégia'], '/placeholder.svg?height=300&width=400&text=diversificacao'),

('Como criar e manter uma reserva de emergência', 'Guia completo para construir sua segurança financeira com uma reserva adequada.', 'A reserva de emergência é o primeiro passo para uma vida financeira saudável. É seu seguro contra imprevistos e deve ter de 6 a 12 meses de gastos essenciais.', 'Planejamento Financeiro', 7, ARRAY['reserva de emergência', 'planejamento', 'segurança financeira'], '/placeholder.svg?height=300&width=400&text=reserva-emergencia');

-- Inserir cotações iniciais
INSERT INTO CALC_currency_rates (from_currency, to_currency, rate, variation_percent, source) VALUES
('USD', 'BRL', 5.85, 0.5, 'AwesomeAPI'),
('EUR', 'BRL', 6.42, -0.2, 'AwesomeAPI'),
('GBP', 'BRL', 7.28, 0.8, 'AwesomeAPI'),
('ARS', 'BRL', 0.0058, -1.2, 'AwesomeAPI'),
('BTC', 'BRL', 285000.00, 2.5, 'CoinGecko');

-- =====================================================
-- MENSAGEM DE SUCESSO
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'CalcFy: Todas as tabelas CALC_ foram criadas com sucesso!';
    RAISE NOTICE 'Tabelas criadas: CALC_users, CALC_calculations, CALC_news, CALC_articles, CALC_currency_rates, CALC_alerts, CALC_templates, CALC_user_preferences';
    RAISE NOTICE 'Dados de exemplo inseridos com sucesso!';
    RAISE NOTICE 'Row Level Security (RLS) configurado!';
    RAISE NOTICE 'Índices de performance criados!';
END $$;
