import Script from 'next/script'

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CalcFy",
    "description": "Plataforma completa com calculadoras financeiras, notícias do mercado e educação financeira gratuita.",
    "url": "https://calcfy.me",
    "logo": "https://calcfy.me/logoresumo.png",
    "sameAs": [
      "https://calcfy.me"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://calcfy.me/contato"
    },
    "offers": {
      "@type": "Offer",
      "description": "Calculadoras financeiras gratuitas",
      "price": "0",
      "priceCurrency": "BRL"
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CalcFy",
    "description": "Calculadoras financeiras gratuitas e educação financeira",
    "url": "https://calcfy.me",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://calcfy.me/calculadoras?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const calculatorSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Calculadoras Financeiras",
    "description": "Ferramentas gratuitas para cálculos financeiros",
    "url": "https://calcfy.me/calculadoras",
    "itemListElement": [
      {
        "@type": "SoftwareApplication",
        "name": "Calculadora de Juros Compostos",
        "description": "Calcule o crescimento de seus investimentos com juros compostos",
        "url": "https://calcfy.me/calculadoras/juros-compostos",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "BRL"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "Calculadora de Financiamento",
        "description": "Calcule parcelas de financiamento imobiliário e veicular",
        "url": "https://calcfy.me/calculadoras/financiamento",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "BRL"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "Calculadora de Aposentadoria",
        "description": "Planeje sua aposentadoria com cálculos precisos",
        "url": "https://calcfy.me/calculadoras/aposentadoria",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "BRL"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "Conversor de Moedas",
        "description": "Converta valores entre diferentes moedas em tempo real",
        "url": "https://calcfy.me/calculadoras/conversor-moedas",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "BRL"
        }
      }
    ]
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(calculatorSchema),
        }}
      />
    </>
  )
}
