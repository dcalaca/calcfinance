"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Verificar se está no cliente
        if (typeof window === 'undefined') return
        
        // Gerar ID único para a sessão
        const sessionId = sessionStorage.getItem('sessionId') || 
          Math.random().toString(36).substring(2) + Date.now().toString(36)
        
        if (!sessionStorage.getItem('sessionId')) {
          sessionStorage.setItem('sessionId', sessionId)
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

        // Enviar dados para a API (apenas POST para salvar visita)
        const response = await fetch('/api/analytics/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData)
        })

        if (response.ok) {
          // Visita registrada com sucesso
        } else {
          // Erro na API
        }
      } catch (error) {
        // Erro ao rastrear visita
      }
    }

    // Aguardar um pouco para garantir que a página carregou
    const timeoutId = setTimeout(trackVisit, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [pathname])
}
