import { NextResponse } from "next/server"

// Simulate market data - in production, this would fetch from real APIs
export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Mock data that simulates real market indicators
    const marketData = {
      dolar: 5.25 + (Math.random() - 0.5) * 0.1, // USD/BRL
      euro: 5.68 + (Math.random() - 0.5) * 0.1, // EUR/BRL
      bitcoin: 42500 + (Math.random() - 0.5) * 1000, // BTC/USD
      selic: 11.75, // SELIC rate (usually stable)
      ipca: 4.62 + (Math.random() - 0.5) * 0.2, // IPCA inflation
    }

    return NextResponse.json(marketData)
  } catch (error) {
    console.error("Error fetching market data:", error)

    // Return fallback data
    return NextResponse.json({
      dolar: 5.25,
      euro: 5.68,
      bitcoin: 42500,
      selic: 11.75,
      ipca: 4.62,
    })
  }
}
