import { redirect } from 'next/navigation'

export default async function AtualizarNoticias() {
  // Forçar atualização das notícias
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3003"

  try {
    // Chamar a API para forçar atualização
    await fetch(`${baseUrl}/api/news/force-update`, {
      cache: "no-store",
      headers: {
        "User-Agent": "CalcFy/1.0",
      },
    })
    
    console.log('🔄 Notícias atualizadas com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao atualizar notícias:', error)
  }

  // Redirecionar para a página de notícias
  redirect('/noticias')
}
