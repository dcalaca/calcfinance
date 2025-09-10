import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacidadePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Informações que Coletamos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Coletamos informações que você nos fornece diretamente, como:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Nome e endereço de e-mail (quando você se cadastra)</li>
              <li>Dados de orçamento pessoal (quando você usa a ferramenta de orçamento)</li>
              <li>Informações de uso das calculadoras</li>
              <li>Dados de navegação e analytics (cookies e tecnologias similares)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. Como Usamos suas Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Processar suas solicitações e transações</li>
              <li>Enviar comunicações relacionadas ao serviço</li>
              <li>Analisar o uso da plataforma para melhorias</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. Compartilhamento de Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Com seu consentimento explícito</li>
              <li>Para cumprir obrigações legais</li>
              <li>Com prestadores de serviços que nos ajudam a operar a plataforma</li>
              <li>Em caso de fusão, aquisição ou venda de ativos</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>4. Cookies e Tecnologias Similares</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Lembrar suas preferências</li>
              <li>Analisar o tráfego do site</li>
              <li>Melhorar a experiência do usuário</li>
              <li>Fornecer funcionalidades personalizadas</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Você pode controlar o uso de cookies através das configurações do seu navegador.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>5. Segurança dos Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Criptografia de dados sensíveis</li>
              <li>Acesso restrito às informações pessoais</li>
              <li>Monitoramento regular de segurança</li>
              <li>Backup seguro dos dados</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>6. Seus Direitos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Você tem o direito de:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Acessar suas informações pessoais</li>
              <li>Corrigir dados incorretos ou incompletos</li>
              <li>Solicitar a exclusão de suas informações</li>
              <li>Retirar seu consentimento a qualquer momento</li>
              <li>Portabilidade dos dados</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>7. Retenção de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos 
              descritos nesta política, a menos que um período de retenção mais longo seja exigido por lei.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>8. Menores de Idade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nossos serviços não são direcionados a menores de 18 anos. 
              Não coletamos intencionalmente informações pessoais de menores de idade.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>9. Alterações na Política</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Podemos atualizar esta política de privacidade periodicamente. 
              Notificaremos sobre mudanças significativas através do site ou por e-mail.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>10. Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Se você tiver dúvidas sobre esta política de privacidade ou sobre como tratamos suas informações, 
              entre em contato conosco através da página de contato.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
