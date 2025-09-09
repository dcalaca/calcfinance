import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
// Adicionar import do Providers
import { Providers } from "@/components/providers"
import { AnalyticsProvider } from "@/components/analytics-provider"
// Configuração do console para desenvolvimento
import "@/lib/console-config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CalcFy - Controle sua vida financeira com inteligência",
  description: "Plataforma completa com calculadoras financeiras, notícias do mercado e educação financeira gratuita.",
  generator: 'v0.app',
  metadataBase: new URL('https://calcfy.me'),
  icons: {
    icon: '/calcfy-favicon.svg',
    shortcut: '/calcfy-favicon.svg',
    apple: '/calcfy-favicon.svg',
  },
  openGraph: {
    title: "CalcFy - Controle sua vida financeira com inteligência",
    description: "Plataforma completa com calculadoras financeiras, notícias do mercado e educação financeira gratuita.",
    url: 'https://calcfy.me',
    siteName: 'CalcFy',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CalcFy - Controle sua vida financeira com inteligência",
    description: "Plataforma completa com calculadoras financeiras, notícias do mercado e educação financeira gratuita.",
  },
}

// Envolver o children com Providers
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <AnalyticsProvider>
            <Header />
            {children}
            <Footer />
          </AnalyticsProvider>
        </Providers>
      </body>
    </html>
  )
}
