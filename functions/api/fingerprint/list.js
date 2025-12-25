/**
 * Admin endpoint to list collected fingerprints
 * Requires authentication
 */

export async function onRequest(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Simple auth check (should use proper auth in production)
  const authHeader = request.headers.get('Authorization');
  const expectedPassword = env.CONFIG_PASSWORD || 'admin123';
  
  if (authHeader !== `Bearer ${expectedPassword}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const kv = env.FINGERPRINT_DATA;
    if (!kv) {
      return new Response(JSON.stringify({ error: 'KV not available' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') || 'visitor:';
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // List keys
    const list = await kv.list({ prefix, limit });
    
    // Get values for each key
    const visitors = await Promise.all(
      list.keys.map(async (key) => {
        const value = await kv.get(key.name);
        return {
          key: key.name,
          data: value ? JSON.parse(value) : null,
        };
      })
    );

    return new Response(JSON.stringify({
      count: visitors.length,
      visitors: visitors.filter(v => v.data !== null),
      cursor: list.cursor,
      hasMore: !list.list_complete,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('List fingerprints error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

