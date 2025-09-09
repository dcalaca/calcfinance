"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    const trackVisit = async () => {
      try {
        console.log('🔍 Iniciando rastreamento de visita...')
        console.log('📍 Página atual:', pathname)
        
        // Gerar ID único para a sessão
        const sessionId = sessionStorage.getItem('sessionId') || 
          Math.random().toString(36).substring(2) + Date.now().toString(36)
        
        if (!sessionStorage.getItem('sessionId')) {
          sessionStorage.setItem('sessionId', sessionId)
          console.log('🆔 Nova sessão criada:', sessionId)
        } else {
          console.log('🆔 Sessão existente:', sessionId)
        }

        // Detectar informações do dispositivo
        const userAgent = navigator.userAgent
        const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop'
        
        // Detectar navegador
        let browser = 'unknown'
        if (userAgent.includes('Chrome')) browser = 'Chrome'
        else if (userAgent.includes('Firefox')) browser = 'Firefox'
        else if (userAgent.includes('Safari')) browser = 'Safari'
        else if (userAgent.includes('Edge')) browser = 'Edge'

        // Dados para enviar
        const visitData = {
          page: pathname,
          referrer: document.referrer || null,
          userAgent,
          timestamp: new Date().toISOString(),
          sessionId,
          device,
          browser,
          country: null, // Pode ser implementado com API de geolocalização
          city: null
        }

        console.log('📤 Enviando dados para API:', visitData)

        // Enviar dados para a API (apenas POST para salvar visita)
        const response = await fetch('/api/analytics/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData)
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✅ Visita registrada com sucesso:', result)
        } else {
          console.error('❌ Erro na API:', response.status, response.statusText)
          const errorText = await response.text()
          console.error('❌ Detalhes do erro:', errorText)
        }
      } catch (error) {
        console.error('💥 Erro ao rastrear visita:', error)
      }
    }

    // Aguardar um pouco para garantir que a página carregou
    const timeoutId = setTimeout(trackVisit, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [pathname])
}
