/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suprimir avisos de desenvolvimento desnecessários
  onDemandEntries: {
    // Período de espera antes de descarregar páginas inativas
    maxInactiveAge: 25 * 1000,
    // Número de páginas que devem ser mantidas simultaneamente
    pagesBufferLength: 2,
  },
  
  // Configurações de imagem
  images: {
    // Otimizações de imagem
    formats: ['image/webp', 'image/avif'],
    // Domínios permitidos para otimização
    domains: [],
  },
  
  // Configurações de compilação
  compiler: {
    // Remover console.log em produção
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configurações de performance
  experimental: {
    // Otimizações de bundle
    optimizeCss: true,
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig