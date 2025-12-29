// supabase/functions/car-meta/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) return Response.redirect('https://autosource.co.zw/', 302)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  const { data: car } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (!car) return Response.redirect('https://autosource.co.zw/', 302)

  // ✅ Construct the full public image URL
  // If main_image_url is a relative path like "main/xxx.jpg"
  const imageUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/listing-images/${car.main_image_url}`

  const title = `${car.year} ${car.make} ${car.model} | ${car.currency} ${car.price.toLocaleString()}`
  const desc = `View this ${car.condition} ${car.make} ${car.model} in ${car.location_city}. ${car.listing_title}`

  // Detect bots
  const userAgent = req.headers.get('User-Agent') || ''
  const isBot = /facebook|twitter|whatsapp|linkedin|instagram|telegram|discord|slack|bot|crawler|preview/i.test(userAgent)

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${desc}">
      <meta property="og:image" content="${imageUrl}">
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://autosource.co.zw/car/${id}">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${desc}">
      <meta name="twitter:image" content="${imageUrl}">
  `

  // Only redirect real users
  if (!isBot) {
    html += `<meta http-equiv="refresh" content="0;url=https://autosource.co.zw/car/${id}" />`
  }

  html += `
    </head>
    <body>
      ${isBot ? '<h1>Preview for social media</h1>' : '<p>Redirecting...</p>'}
    </body>
    </html>
  `

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
})