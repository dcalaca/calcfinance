'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

export default function MeuOrcamentoPage() {
  return (
    <div className="w-full max-w-none py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Meu Orçamento</h1>
          <p className="text-muted-foreground">
            Controle sua vida financeira de forma simples e eficiente
          </p>
        </div>
        
        {/* Página em manutenção */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-orange-600 mb-2">Página em Manutenção</h2>
                  <p className="text-muted-foreground mb-4">
                  Estamos trabalhando para melhorar sua experiência. 
                  <br />
                  Volte em breve!
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>⏰ Manutenção programada</p>
                  <p>🛠️ Melhorias em andamento</p>
                  <p>📱 Funcionalidade será restaurada em breve</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
        </div>
      </div>
    </div>
  )
}