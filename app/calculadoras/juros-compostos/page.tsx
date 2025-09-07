import JurosCompostosClientPage from "./JurosCompostosClientPage"
import { AuthGuard } from "@/components/auth-guard"

export const metadata = {
  title: "Calculadora de Juros Compostos | FinanceHub",
  description:
    "Calcule o crescimento dos seus investimentos com juros compostos. Simule aportes mensais, diferentes taxas e períodos. Ferramenta gratuita e completa.",
  keywords: "juros compostos, calculadora financeira, investimentos, aportes mensais, rentabilidade",
  openGraph: {
    title: "Calculadora de Juros Compostos - FinanceHub",
    description: "Descubra o poder dos juros compostos e veja como seus investimentos podem crescer ao longo do tempo",
    type: "website",
  },
}

export default function JurosCompostosPage() {
  return (
    <AuthGuard>
      <JurosCompostosClientPage />
    </AuthGuard>
  )
}
