import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard',
        '/historico',
        '/analytics',
        '/_next/',
        '/admin/',
        '/private/',
      ],
    },
    sitemap: 'https://calcfy.me/sitemap.xml',
  }
}
