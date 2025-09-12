import { Hero } from "@/components/hero"
import { FeaturedCalculators } from "@/components/featured-calculators"
import { MarketAlerts } from "@/components/market-alerts"
import { FAQSection } from "@/components/faq-section"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedCalculators />
      <MarketAlerts />
      <FAQSection />
    </main>
  )
}
