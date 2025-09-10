"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const faqs = [
  {
    question: "As calculadoras do CalcFy são gratuitas?",
    answer: "Sim! Todas as calculadoras financeiras do CalcFy são 100% gratuitas. Você pode usar quantas vezes quiser sem pagar nada."
  },
  {
    question: "Preciso me cadastrar para usar as calculadoras?",
    answer: "Sim, até para você salvar seus cálculos e orçamentos dentro do seu perfil."
  },
  {
    question: "Os cálculos são precisos?",
    answer: "Sim! Nossas calculadoras usam fórmulas financeiras padrão e são atualizadas regularmente. Sempre recomendamos consultar um profissional para decisões importantes."
  },
  {
    question: "Posso usar no celular?",
    answer: "Claro! O CalcFy é totalmente responsivo e funciona perfeitamente em smartphones, tablets e computadores."
  },
  {
    question: "Como funciona o conversor de moedas?",
    answer: "O conversor usa cotações em tempo real das principais moedas mundiais, atualizadas automaticamente para garantir precisão."
  },
  {
    question: "Posso salvar meus cálculos?",
    answer: "Sim! Com uma conta gratuita, você pode salvar e acessar seu histórico de cálculos a qualquer momento."
  },
  {
    question: "As notícias são atualizadas?",
    answer: "Sim! Nossas notícias financeiras são atualizadas diariamente com as principais informações do mercado brasileiro e mundial."
  },
  {
    question: "Há algum custo oculto?",
    answer: "Não! O CalcFy é completamente gratuito. Não cobramos taxas, assinaturas ou custos ocultos de qualquer tipo."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-slate-600">
              Tire suas dúvidas sobre o CalcFy e nossas calculadoras financeiras
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-slate-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                    aria-expanded={openIndex === index}
                  >
                    <span className="font-semibold text-slate-900 pr-4">
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-4">
                      <div className="border-t border-slate-200 pt-4">
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">
              Ainda tem dúvidas? Entre em contato conosco!
            </p>
            <a
              href="/contato"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fale Conosco
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
