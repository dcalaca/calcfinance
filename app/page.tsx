import { Hero } from "@/components/hero"
import { BudgetHighlight } from "@/components/budget-highlight"
import { FeaturedCalculators } from "@/components/featured-calculators"
import { MarketAlerts } from "@/components/market-alerts"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <BudgetHighlight />
      <FeaturedCalculators />
      <MarketAlerts />
    </main>
  )
}
