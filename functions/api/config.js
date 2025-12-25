// Cloudflare Pages Function for ultra-fast config delivery
export async function onRequest(context) {
  const { request, env } = context

  // Set aggressive caching headers
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300, s-maxage=3600', // 5min browser, 1hr edge
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'X-Content-Type-Options': 'nosniff',
  }

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  try {
    // In production, you could store config in KV storage for even faster access
    // For now, return a success response for the config API
    const response = {
      success: true,
      message: 'Config API ready',
      timestamp: Date.now()
    }

    return new Response(JSON.stringify(response), { headers })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Config API error', message: error.message }),
      { status: 500, headers }
    )
  }
}
