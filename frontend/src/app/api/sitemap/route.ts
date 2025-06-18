// app/api/sitemap/route.ts

import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://ของอร่อยสูงเนิน.com'

  const staticUrls = [
    '',
    '/shops',
    '/about',
    '/privacy-policy',
    '/contact',
  ]

  let shops = []
  try {
    const res = await fetch('https://kong-aroy-sungnoen-backend.onrender.com/api/shops/all')
    if (res.ok) {
      shops = await res.json()
    } else {
      console.error('Fetch shops failed:', res.status)
    }
  } catch (error) {
    console.error('Error fetching shops:', error)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls
    .map(
      (path) => `
    <url>
      <loc>${baseUrl}${path}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join('')}

  ${shops
    .map(
      (shop: any) => `
    <url>
      <loc>${baseUrl}/shop/${shop._id}</loc>
      <lastmod>${new Date(shop.updatedAt || Date.now()).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`
    )
    .join('')}
</urlset>
`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
