# 🚀 INSTRUÇÕES PARA CONFIGURAR O SUPABASE

## 📋 Passo a Passo

### 1. Acesse o Painel do Supabase
🔗 **Link:** https://supabase.com/dashboard/project/kfsteismyqpekbaqwuez

### 2. Vá para o SQL Editor
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New query"**

### 3. Execute o Script SQL
Copie e cole o seguinte código SQL no editor:

```sql
-- =====================================================
-- CALCFY - TABELAS COM PREFIXO CALC_
-- =====================================================

-- 1. TABELA DE USUÁRIOS
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

-- 2. TABELA DE CÁLCULOS FINANCEIROS
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

-- 3. TABELA DE NOTÍCIAS FINANCEIRAS
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

-- 4. TABELA DE ARTIGOS EDUCACIONAIS
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

-- 5. TABELA DE COTAÇÕES DE MOEDAS
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

-- 6. TABELA DE ALERTAS FINANCEIROS
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

-- 7. TABELA DE TEMPLATES DE CÁLCULO
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

-- 8. TABELA DE PREFERÊNCIAS DO USUÁRIO
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

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_calc_calculations_user_id ON CALC_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_calc_calculations_type ON CALC_calculations(calculation_type);
CREATE INDEX IF NOT EXISTS idx_calc_calculations_created_at ON CALC_calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calc_news_category ON CALC_news(category);
CREATE INDEX IF NOT EXISTS idx_calc_news_published_at ON CALC_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_calc_articles_category ON CALC_articles(category);
CREATE INDEX IF NOT EXISTS idx_calc_articles_published_at ON CALC_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_calc_currency_rates_pair ON CALC_currency_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_calc_alerts_user_id ON CALC_alerts(user_id);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE CALC_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE CALC_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE CALC_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE CALC_user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can view own profile" ON CALC_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON CALC_users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own calculations" ON CALC_calculations FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert own calculations" ON CALC_calculations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own calculations" ON CALC_calculations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own calculations" ON CALC_calculations FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own alerts" ON CALC_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own alerts" ON CALC_alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own preferences" ON CALC_user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON CALC_user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view active news" ON CALC_news FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active articles" ON CALC_articles FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view currency rates" ON CALC_currency_rates FOR SELECT TO public;
CREATE POLICY "Anyone can view public templates" ON CALC_templates FOR SELECT USING (is_public = true);
```

### 4. Execute o Script
- Clique no botão **"Run"** (▶️)
- Aguarde a execução completar
- Você deve ver mensagens de sucesso

### 5. Verificar as Tabelas
- Vá para **"Table Editor"** no menu lateral
- Você deve ver as tabelas com prefixo `CALC_`:
  - `CALC_users`
  - `CALC_calculations`
  - `CALC_news`
  - `CALC_articles`
  - `CALC_currency_rates`
  - `CALC_alerts`
  - `CALC_templates`
  - `CALC_user_preferences`

## 🔧 Configuração do Projeto

### 1. Criar arquivo .env.local
Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kfsteismyqpekbaqwuez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODU4NDMsImV4cCI6MjA2NTA2MTg0M30.nuHieAbGz65Lm5KlNamxO_HS_SFy0DGm6tIIbty7Z8A
NEXT_PUBLIC_SITE_URL=http://localhost:3000
VERCEL_URL=localhost:3000
SUPABASE_URL=https://kfsteismyqpekbaqwuez.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4NTg0MywiZXhwIjoyMDY1MDYxODQzfQ.4pcJS-lSfxwkfp4VoYMFqsgrpSf8qV-LYcVsjdY1nkw
```

### 2. Testar a Conexão
Execute no terminal:
```bash
pnpm dev
```

## ✅ Próximos Passos

1. ✅ Configurar variáveis de ambiente
2. ✅ Criar tabelas no Supabase
3. 🔄 Testar conexão
4. 🔄 Atualizar sistema de autenticação
5. 🔄 Implementar funcionalidades de login/cadastro

## 🆘 Problemas Comuns

### Erro de Conexão
- Verifique se as credenciais estão corretas
- Confirme se o projeto Supabase está ativo

### Tabelas não aparecem
- Verifique se o script SQL foi executado completamente
- Confirme se não há erros no console do Supabase

### RLS (Row Level Security) não funciona
- Verifique se as políticas foram criadas corretamente
- Confirme se o usuário está autenticado

## 📞 Suporte

Se tiver problemas, verifique:
1. Console do navegador (F12)
2. Logs do Supabase
3. Terminal do projeto
