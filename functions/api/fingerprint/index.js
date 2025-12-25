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

    // Source tag for pow3r.dogg dashboard filtering
    const SOURCE_TAG = 'painttothink';
    
    // Create fingerprint record
    const fingerprintRecord = {
      source: SOURCE_TAG,
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

    // Store in KV with visitor ID as key (tagged with source)
    const kv = env.FINGERPRINT_DATA;
    if (kv) {
      // Store current fingerprint (prefixed with source for dashboard filtering)
      await kv.put(
        `${SOURCE_TAG}:fp:${visitorId}:${timestamp}`,
        JSON.stringify(fingerprintRecord),
        { expirationTtl: 60 * 60 * 24 * 90 } // 90 days
      );

      // Update visitor profile (most recent data)
      const existingProfile = await kv.get(`${SOURCE_TAG}:visitor:${visitorId}`);
      const profile = existingProfile ? JSON.parse(existingProfile) : { 
        source: SOURCE_TAG,
        visits: [] 
      };
      
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
        `${SOURCE_TAG}:visitor:${visitorId}`,
        JSON.stringify(profile),
        { expirationTtl: 60 * 60 * 24 * 365 } // 1 year
      );

      // Index by IP for cross-referencing
      await kv.put(
        `${SOURCE_TAG}:ip:${serverSignals.ip}:${visitorId}`,
        timestamp,
        { expirationTtl: 60 * 60 * 24 * 90 }
      );
    }

    // Forward to pow3r.dogg dashboard for advanced analysis
    // Uses pow3r-defender worker API
    const POW3R_WEBHOOK_URL = env.POW3R_WEBHOOK_URL || 'https://pow3r-defender.memorymusicllc.workers.dev/api/ingest';
    
    try {
      // Non-blocking webhook call (don't await, use waitUntil if available)
      const webhookPayload = {
        source: SOURCE_TAG,
        type: 'fingerprint',
        timestamp,
        data: fingerprintRecord,
        meta: {
          domain: 'paint.toth.ink',
          endpoint: '/api/fingerprint',
        }
      };
      
      // Fire and forget - don't block response
      context.waitUntil?.(
        fetch(POW3R_WEBHOOK_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Source': SOURCE_TAG,
          },
          body: JSON.stringify(webhookPayload),
        }).catch(err => console.error('pow3r.dogg webhook failed:', err))
      );
    } catch (webhookError) {
      // Non-critical - don't fail the request
      console.error('pow3r.dogg webhook error:', webhookError);
    }

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

