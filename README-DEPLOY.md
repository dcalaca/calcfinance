# 🚀 CalcFy - Deploy Guide

## 📋 Pré-requisitos

- ✅ Conta no [Vercel](https://vercel.com)
- ✅ Conta no [GitHub](https://github.com)
- ✅ Projeto no Supabase configurado

## 🔧 Deploy no Vercel

### 1. **Preparar o Repositório GitHub**

```bash
# Inicializar git (se não tiver)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial commit - CalcFy"

# Conectar com GitHub
git remote add origin https://github.com/SEU_USUARIO/calcfinance.git

# Push para GitHub
git push -u origin main
```

### 2. **Deploy no Vercel**

1. **Acesse:** https://vercel.com
2. **Clique em:** "New Project"
3. **Importe** seu repositório GitHub
4. **Configure as variáveis de ambiente:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://kfsteismyqpekbaqwuez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODU4NDMsImV4cCI6MjA2NTA2MTg0M30.nuHieAbGz65Lm5KlNamxO_HS_SFy0DGm6tIIbty7Z8A
SUPABASE_URL=https://kfsteismyqpekbaqwuez.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3RlaXNteXFwZWtiYXF3dWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQ4NTg0MywiZXhwIjoyMDY1MDYxODQzfQ.4pcJS-lSfxwkfp4VoYMFqsgrpSf8qV-LYcVsjdY1nkw
NEXT_PUBLIC_SITE_URL=https://calcfinance.com.br
```

5. **Deploy!** 🚀

### 3. **Configurar Domínio Customizado**

1. **No painel do Vercel:**
   - Vá em "Settings" → "Domains"
   - Adicione: `calcfinance.com.br`
   - Adicione: `www.calcfinance.com.br`

2. **No seu provedor de DNS:**
   ```
   Tipo: CNAME
   Nome: calcfinance.com.br
   Valor: cname.vercel-dns.com
   
   Tipo: CNAME  
   Nome: www.calcfinance.com.br
   Valor: cname.vercel-dns.com
   ```

## 🔧 Deploy Manual (Alternativa)

### **Opção 1: VPS com PM2**

```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
npm install -g pm2

# Clonar projeto
git clone https://github.com/SEU_USUARIO/calcfinance.git
cd calcfinance

# Instalar dependências
pnpm install

# Build do projeto
pnpm build

# Configurar PM2
pm2 start npm --name "calcfinance" -- start
pm2 save
pm2 startup
```

### **Opção 2: Docker**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

## 🌐 Configuração do Domínio

### **DNS Records Necessários:**

```
A     calcfinance.com.br    → IP_DO_SERVIDOR
CNAME www.calcfinance.com.br → calcfinance.com.br
```

### **SSL/HTTPS:**
- ✅ **Vercel:** Automático
- ✅ **Cloudflare:** Automático
- ✅ **Let's Encrypt:** Para VPS

## 📊 Monitoramento

### **Vercel Analytics:**
- Acesse o painel do Vercel
- Veja métricas de performance
- Monitore erros e logs

### **Supabase Dashboard:**
- Monitore uso do banco
- Veja logs de autenticação
- Acompanhe performance

## 🚨 Troubleshooting

### **Erro de Build:**
```bash
# Limpar cache
rm -rf .next
rm -rf node_modules
pnpm install
pnpm build
```

### **Erro de Variáveis:**
- Verifique se todas as env vars estão configuradas
- Confirme se o Supabase está ativo

### **Erro de Domínio:**
- Aguarde propagação DNS (até 24h)
- Verifique configurações de DNS

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deploy:** https://nextjs.org/docs/deployment
- **Supabase Deploy:** https://supabase.com/docs/guides/platform

---

**🎉 Após o deploy, seu site estará disponível em https://calcfinance.com.br!**
