import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
// Adicionar import do Providers
import { Providers } from "@/components/providers"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { StructuredData } from "@/components/structured-data"
// Configuração do console para desenvolvimento
import "@/lib/console-config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CalcFy - Controle sua vida financeira com inteligência",
  description: "Plataforma completa com calculadoras financeiras, notícias do mercado e educação financeira gratuita.",
  keywords: [
    "calculadora financeira",
    "juros compostos",
    "financiamento",
    "aposentadoria",
    "investimentos",
    "conversor moedas",
    "educação financeira",
    "planejamento financeiro",
    "calculadora gratuita",
    "finanças pessoais"
  ],
  authors: [{ name: "CalcFy" }],
  creator: "CalcFy",
  publisher: "CalcFy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: 'Next.js',
  metadataBase: new URL('https://calcfy.me'),
  alternates: {
    canonical: 'https://calcfy.me',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logoresumo.png',
    shortcut: '/logoresumo.png',
    apple: '/logoresumo.png',
  },
  openGraph: {
    title: "CalcFy - Controle sua vida financeira com inteligência",
    description: "Plataforma completa com calculadoras financeiras, notícias do mercado e educação financeira gratuita.",
    url: 'https://calcfy.me',
    siteName: 'CalcFy',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://calcfy.me/logoresumo.png',
        width: 1200,
        height: 630,
        alt: 'CalcFy - Calculadoras Financeiras',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "CalcFy - Controle sua vida financeira com inteligência",
    description: "Plataforma completa com calculadoras financeiras, notícias do mercado e educação financeira gratuita.",
    images: ['https://calcfy.me/logoresumo.png'],
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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-J6CGK8KT80"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-J6CGK8KT80');
            `,
          }}
        />
        <StructuredData />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CalcFy" />
        <link rel="apple-touch-icon" href="/logoresumo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
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
