# Configuração DNS na Hostinger para calcfy.me

## 📋 Registros DNS Necessários

### 1. Registro A (Principal)
```
Tipo: A
Nome: @
Valor: 76.76.19.61
TTL: 3600
```

### 2. Registro CNAME (WWW)
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600
```

### 3. Registro TXT (Verificação)
```
Tipo: TXT
Nome: @
Valor: vc-domain-verify=calcfy.me,xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TTL: 3600
```

## 🔧 Passos na Hostinger:

1. **Acesse o painel da Hostinger**
2. **Vá em "DNS Zone" ou "Gerenciar DNS"**
3. **Adicione os registros acima**
4. **Aguarde propagação (até 24h)**

## ⚠️ Importante:

- **Não altere** os registros MX (email)
- **Mantenha** outros registros existentes
- **Aguarde** até 24h para propagação completa

## 🎯 Resultado Esperado:

Após a configuração:
- ✅ SSL automático da Vercel
- ✅ HTTPS funcionando
- ✅ Sem erros de certificado
- ✅ Site funcionando perfeitamente

## 🆘 Se não funcionar:

1. **Verifique** se o domínio está apontando para Vercel
2. **Confirme** os registros DNS estão corretos
3. **Aguarde** mais tempo para propagação
4. **Contate** suporte da Hostinger se necessário
