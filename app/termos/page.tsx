import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso - CalcFy",
  description: "Leia os termos de uso do CalcFy, nossa plataforma de calculadoras financeiras gratuitas e educação financeira.",
  alternates: {
    canonical: 'https://calcfy.me/termos'
  }
}

export default function TermosPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Aceitação dos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ao acessar e usar o CalcFy, você concorda em cumprir e estar vinculado aos termos e condições de uso aqui descritos. 
              Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. Descrição do Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              O CalcFy é uma plataforma online que oferece calculadoras financeiras gratuitas, ferramentas de orçamento pessoal, 
              notícias do mercado financeiro e conteúdo educativo sobre finanças pessoais.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. Uso Permitido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Você pode usar o CalcFy para:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Calcular juros compostos, financiamentos e investimentos</li>
              <li>Controlar seu orçamento pessoal</li>
              <li>Acessar notícias e conteúdo educativo</li>
              <li>Usar as ferramentas para fins pessoais e educacionais</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>4. Uso Proibido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              É proibido usar o CalcFy para:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Atividades ilegais ou não autorizadas</li>
              <li>Interferir no funcionamento do serviço</li>
              <li>Tentar acessar contas de outros usuários</li>
              <li>Usar o serviço para fins comerciais sem autorização</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>5. Responsabilidades do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Você é responsável por:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Manter a confidencialidade de sua conta</li>
              <li>Fornecer informações precisas e atualizadas</li>
              <li>Usar o serviço de forma ética e responsável</li>
              <li>Respeitar os direitos de propriedade intelectual</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>6. Limitação de Responsabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              O CalcFy é fornecido "como está" e não garantimos que o serviço será ininterrupto ou livre de erros. 
              Não nos responsabilizamos por decisões financeiras tomadas com base nas informações fornecidas pela plataforma.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>7. Modificações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              As alterações entrarão em vigor imediatamente após a publicação. 
              O uso continuado do serviço constitui aceitação dos novos termos.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>8. Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Se você tiver dúvidas sobre estes termos, entre em contato conosco através da página de contato.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
