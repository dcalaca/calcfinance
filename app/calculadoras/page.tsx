import { Metadata } from "next"
import { CalculadorasPageClient } from "./CalculadorasPageClient"

export const metadata: Metadata = {
  title: "Calculadoras Financeiras Gratuitas - CalcFy",
  description: "Acesse nossas calculadoras financeiras gratuitas: juros compostos, financiamento, aposentadoria, investimentos e muito mais.",
  alternates: {
    canonical: 'https://calcfy.me/calculadoras'
  }
}

export default function CalculadorasPage() {
  return <CalculadorasPageClient />
}