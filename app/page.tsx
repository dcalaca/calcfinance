import { Hero } from "@/components/hero"
import { CalculatorsCTA } from "@/components/calculators-cta"
import { CFPHighlight } from "@/components/cfp-highlight"
import { MarketAlerts } from "@/components/market-alerts"
import { FAQSection } from "@/components/faq-section"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CalculatorsCTA />
      <CFPHighlight />
      <MarketAlerts />
      <FAQSection />
    </main>
  )
}
