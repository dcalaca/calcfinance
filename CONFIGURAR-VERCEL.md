# 🔧 CONFIGURAR VARIÁVEIS DE AMBIENTE NO VERCEL

## ⚠️ PROBLEMA ATUAL
O login está ficando em "Entrando..." porque as variáveis de ambiente do Supabase não estão configuradas no Vercel.

## 🚀 SOLUÇÃO

### 1. Acesse o Painel do Vercel
- Vá para: https://vercel.com/dashboard
- Encontre o projeto "calcfinance"

### 2. Configure as Variáveis de Ambiente
- Clique em **"Settings"** no projeto
- Vá para a aba **"Environment Variables"**
- Adicione as seguintes variáveis:

#### Variáveis Obrigatórias:
```
NEXT_PUBLIC_SUPABASE_URL = https://kfsteismyqpekbaqwuez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODU4NDMsImV4cCI6MjA2NTA2MTg0M30.nuHieAbGz65Lm5KlNamxO_HS_SFy0DGm6tIIbty7Z8A
NEXT_PUBLIC_SITE_URL = https://calcfinance.com.br
SUPABASE_URL = https://kfsteismyqpekbaqwuez.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4NTg0MywiZXhwIjoyMDY1MDYxODQzfQ.4pcJS-lSfxwkfp4VoYMFqsgrpSf8qV-LYcVsjdY1nkw
```

### 3. Configurar para Todos os Ambientes
- Marque as caixas: **Production**, **Preview** e **Development**
- Clique em **"Save"**

### 4. Fazer Novo Deploy
- Após salvar as variáveis, faça um novo deploy
- Ou simplesmente faça um push para o repositório

## ✅ RESULTADO ESPERADO
Após configurar as variáveis de ambiente:
- O login deve funcionar normalmente
- O botão não ficará mais em "Entrando..." indefinidamente
- As funcionalidades de autenticação funcionarão corretamente

## 🔍 VERIFICAÇÃO
Para verificar se está funcionando:
1. Acesse o console do navegador (F12)
2. Tente fazer login
3. Verifique se não há erros relacionados ao Supabase
4. Os logs que adicionei no código devem aparecer no console
