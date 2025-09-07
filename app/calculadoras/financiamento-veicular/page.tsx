import FinanciamentoVeicularClientPage from "./FinanciamentoVeicularClientPage"
import { AuthGuard } from "@/components/auth-guard"

export default function FinanciamentoVeicularPage() {
  return (
    <AuthGuard>
      <FinanciamentoVeicularClientPage />
    </AuthGuard>
  )
}
