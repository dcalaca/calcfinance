import { Hero } from "@/components/hero"
import { BudgetHighlight } from "@/components/budget-highlight"
import { FeaturedCalculators } from "@/components/featured-calculators"
import { MarketAlerts } from "@/components/market-alerts"
import { FAQSection } from "@/components/faq-section"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <BudgetHighlight />
      <FeaturedCalculators />
      <MarketAlerts />
      <FAQSection />
    </main>
  )
}
