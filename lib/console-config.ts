// Configuração do console para desenvolvimento
if (process.env.NODE_ENV === 'development') {
  // Suprimir avisos específicos do React em desenvolvimento
  const originalWarn = console.warn
  console.warn = (...args) => {
    // Suprimir avisos específicos do React DevTools
    if (args[0]?.includes?.('Download the React DevTools')) {
      return
    }
    
    // Suprimir avisos de imagem do Next.js
    if (args[0]?.includes?.('Image with src') && args[0]?.includes?.('has either width or height modified')) {
      return
    }
    
    if (args[0]?.includes?.('was detected as the Largest Contentful Paint')) {
      return
    }
    
    // Manter outros avisos
    originalWarn.apply(console, args)
  }
  
  // Suprimir avisos específicos do Next.js
  const originalError = console.error
  console.error = (...args) => {
    // Suprimir avisos de Fast Refresh
    if (args[0]?.includes?.('Fast Refresh')) {
      return
    }
    
    // Manter outros erros
    originalError.apply(console, args)
  }
}
