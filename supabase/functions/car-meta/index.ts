// supabase/functions/car-meta/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) return Response.redirect('https://autosource.co.zw/', 302)

  // Use the ANON key for read-only access (public)
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

  const title = `${car.year} ${car.make} ${car.model} | ${car.currency} ${car.price.toLocaleString()}`;
  const desc = `View this ${car.condition} ${car.make} ${car.model} in ${car.location_city}. ${car.listing_title}`;
  const image = car.main_image_url;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${desc}">
      <meta property="og:image" content="${image}">
      <meta property="og:type" content="website">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:image" content="${image}">
      <script>window.location.replace('https://autosource.co.zw/car/${id}');</script>
    </head>
    <body>Redirecting...</body>
    </html>
  `

  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
})