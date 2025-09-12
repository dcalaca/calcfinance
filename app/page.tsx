import { Hero } from "@/components/hero"
import { CalculatorsCTA } from "@/components/calculators-cta"
import { MarketAlerts } from "@/components/market-alerts"
import { FAQSection } from "@/components/faq-section"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CalculatorsCTA />
      <MarketAlerts />
      <FAQSection />
    </main>
  )
}
