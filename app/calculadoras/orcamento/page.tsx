import { redirect } from 'next/navigation'

export const metadata = {
  title: "Meu Orçamento | FinanceHub",
  description: "Controle sua vida financeira de forma simples e eficiente",
}

export default function OrcamentoPage() {
  // Redirecionar para a página de orçamento principal
  redirect('/meu-orcamento')
}
