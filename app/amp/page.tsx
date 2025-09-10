import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "CalcFy AMP - Calculadoras Financeiras Rápidas",
  description: "Acesse nossas calculadoras financeiras com velocidade máxima em dispositivos móveis. AMP otimizado para melhor performance.",
  alternates: {
    canonical: 'https://calcfy.me/amp'
  }
}

const calculators = [
  {
    name: "Juros Compostos",
    description: "Calcule o crescimento de seus investimentos",
    href: "/calculadoras/juros-compostos",
    icon: "💰"
  },
  {
    name: "Financiamento",
    description: "Simule parcelas de financiamento",
    href: "/calculadoras/financiamento", 
    icon: "🏠"
  },
  {
    name: "Aposentadoria",
    description: "Planeje sua aposentadoria",
    href: "/calculadoras/aposentadoria",
    icon: "👴"
  },
  {
    name: "Conversor de Moedas",
    description: "Converta valores entre moedas",
    href: "/calculadoras/conversor-moedas",
    icon: "💱"
  }
]

export default function AMPPage() {
  return (
    <html>
      <head>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <link rel="canonical" href="https://calcfy.me/amp" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 0;
              background: #f8fafc;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #1e293b;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #64748b;
              font-size: 16px;
            }
            .calculator-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 30px;
            }
            .calculator-card {
              background: white;
              border-radius: 12px;
              padding: 20px;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              text-decoration: none;
              color: inherit;
              transition: transform 0.2s;
            }
            .calculator-card:hover {
              transform: translateY(-2px);
            }
            .calculator-icon {
              font-size: 32px;
              margin-bottom: 10px;
            }
            .calculator-name {
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 5px;
            }
            .calculator-desc {
              font-size: 12px;
              color: #64748b;
            }
            .cta-section {
              background: #3b82f6;
              color: white;
              padding: 30px;
              border-radius: 12px;
              text-align: center;
            }
            .cta-title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .cta-desc {
              margin-bottom: 20px;
              opacity: 0.9;
            }
            .cta-button {
              background: white;
              color: #3b82f6;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              display: inline-block;
            }
          `
        }} />
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">CalcFy</div>
            <div className="subtitle">Calculadoras Financeiras Rápidas</div>
          </div>

          <div className="calculator-grid">
            {calculators.map((calc) => (
              <Link key={calc.name} href={calc.href} className="calculator-card">
                <div className="calculator-icon">{calc.icon}</div>
                <div className="calculator-name">{calc.name}</div>
                <div className="calculator-desc">{calc.description}</div>
              </Link>
            ))}
          </div>

          <div className="cta-section">
            <div className="cta-title">Acesse a Versão Completa</div>
            <div className="cta-desc">
              Para mais funcionalidades e calculadoras avançadas
            </div>
            <Link href="/" className="cta-button">
              Ir para CalcFy Completo
            </Link>
          </div>
        </div>

      </body>
    </html>
  )
}
