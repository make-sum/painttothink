/**
 * Fingerprint Collection API for paint.toth.ink
 * Stealth fingerprinting with Cloudflare KV storage
 * 
 * Integrates with pow3r.dogg for advanced analysis
 */

export async function onRequest(context) {
  const { request, env } = context;
  
  // CORS headers for stealth collection
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    const timestamp = new Date().toISOString();
    
    // Extract visitor ID (generated client-side)
    const visitorId = data.visitorId || crypto.randomUUID();
    
    // Collect server-side signals
    const serverSignals = {
      ip: request.headers.get('CF-Connecting-IP'),
      country: request.headers.get('CF-IPCountry'),
      city: request.cf?.city,
      region: request.cf?.region,
      asn: request.cf?.asn,
      isp: request.cf?.asOrganization,
      userAgent: request.headers.get('User-Agent'),
      acceptLanguage: request.headers.get('Accept-Language'),
      referer: request.headers.get('Referer'),
      timezone: request.cf?.timezone,
      isBot: request.cf?.isBot,
      tlsVersion: request.cf?.tlsVersion,
      httpProtocol: request.cf?.httpProtocol,
    };

    // Create fingerprint record
    const fingerprintRecord = {
      visitorId,
      timestamp,
      serverSignals,
      clientSignals: data.components || {},
      confidence: data.confidence || 0,
      sessionId: data.sessionId,
      page: data.page || request.headers.get('Referer'),
      raw: {
        ip: serverSignals.ip,
        ua: serverSignals.userAgent,
        lang: serverSignals.acceptLanguage,
      }
    };

    // Store in KV with visitor ID as key
    const kv = env.FINGERPRINT_DATA;
    if (kv) {
      // Store current fingerprint
      await kv.put(
        `fp:${visitorId}:${timestamp}`,
        JSON.stringify(fingerprintRecord),
        { expirationTtl: 60 * 60 * 24 * 90 } // 90 days
      );

      // Update visitor profile (most recent data)
      const existingProfile = await kv.get(`visitor:${visitorId}`);
      const profile = existingProfile ? JSON.parse(existingProfile) : { visits: [] };
      
      profile.lastSeen = timestamp;
      profile.visits.push({
        timestamp,
        ip: serverSignals.ip,
        country: serverSignals.country,
        page: fingerprintRecord.page,
      });
      
      // Keep only last 100 visits
      if (profile.visits.length > 100) {
        profile.visits = profile.visits.slice(-100);
      }
      
      profile.fingerprint = {
        ...fingerprintRecord.clientSignals,
        ...serverSignals,
      };

      await kv.put(
        `visitor:${visitorId}`,
        JSON.stringify(profile),
        { expirationTtl: 60 * 60 * 24 * 365 } // 1 year
      );

      // Index by IP for cross-referencing
      await kv.put(
        `ip:${serverSignals.ip}:${visitorId}`,
        timestamp,
        { expirationTtl: 60 * 60 * 24 * 90 }
      );
    }

    // Optional: Forward to pow3r.dogg for advanced analysis
    // This would integrate with the pow3r defender API
    // Uncomment when pow3r.dogg worker is deployed:
    /*
    if (env.POW3R_WEBHOOK_URL) {
      await fetch(env.POW3R_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'paint.toth.ink',
          type: 'fingerprint',
          data: fingerprintRecord,
        }),
      });
    }
    */

    return new Response(JSON.stringify({ 
      success: true, 
      visitorId,
      // Return minimal data to avoid detection
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Fingerprint collection error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

