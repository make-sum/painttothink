/**
 * Cloudflare Pages Function: Config Management API
 * =================================================
 * 
 * This function handles GET and PUT requests for site configuration.
 * Configuration is stored in Cloudflare KV for persistence across deployments.
 * 
 * Endpoints:
 * - GET /api/config/get - Retrieve current site configuration
 * - PUT /api/config/update - Update site configuration (requires auth)
 * 
 * Configuration Priority:
 * 1. KV Storage (Cloudflare KV) - Persistent, survives deployments
 * 2. Default Config - Fallback if KV is empty (defined in this file)
 * 
 * Note: The application currently uses src/config/site.config.json directly
 * via useConfig hook. This API is available for dynamic config updates.
 * 
 * To update KV storage:
 * 1. Use the config editor at ?config=t (requires password)
 * 2. Or make a PUT request to /api/config/update with Authorization header
 */

export async function onRequest(context) {
  const { request, env, params } = context;
  const action = params.action;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    /**
     * GET /api/config/get
     * Retrieves site configuration from KV storage or returns default
     */
    if (action === 'get' && request.method === 'GET') {
      // Priority 1: Try to get config from Cloudflare KV storage
      // KV persists across deployments and can be updated via API
      const storedConfig = await env.SITE_CONFIG.get('config');
      
      if (storedConfig) {
        // Return stored config from KV
        return new Response(storedConfig, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }
      
      // Priority 2: If no stored config in KV, return default configuration
      // This default config is used as a fallback for new deployments
      const defaultConfig = {
        site: {
          name: "Paint To Think",
          tagline: "Commercial & Residential Construction",
          tag: "Portland, Oregon",
          description: "Commercial and residential construction company based in Portland, Oregon with over 30 years of experience",
          email: "da@paint.toth.ink",
          phone: "(503) 998-9294",
          address: "Portland, Oregon",
          copyright: "© Paint To Think, 2000"
        },
        navigation: {
          main: [
            { label: "Home", href: "/", icon: "home" },
            { label: "About", href: "/about", icon: "info" },
            { label: "Services", href: "/services", icon: "briefcase" },
            { label: "Contact", href: "/contact", icon: "mail" }
          ]
        },
        services: [
          {
            id: "service-1",
            title: "Framing",
            description: "Structural framing services",
            image: "/img/framing.jpg",
            details: "Expert structural framing for residential and commercial projects"
          },
          {
            id: "service-2",
            title: "Windows & Doors",
            description: "Installation and replacement",
            image: "/img/windows.jpg",
            details: "Professional installation and Portland's favorite window vendors"
          },
          {
            id: "service-3",
            title: "Decks & Outdoor",
            description: "Refined deck designs for those long rain and hot seasons",
            image: "/img/decks.jpg",
            details: "Beautiful custom decks and outdoor living spaces"
          },
          {
            id: "service-4",
            title: "Drywall & Finishing",
            description: "Interior wall services",
            image: "/img/drywall.jpg",
            details: "Professional drywall installation and finishing"
          },
          {
            id: "service-5",
            title: "Commercial Construction",
            description: "Commercial construction for all building types",
            image: "/img/hood.jpg",
            details: "Commercial build out and renovation including retail, office, restuarants, and grow operations"
          },
          {
            id: "service-6",
            title: "Commercial Maintenaince",
            description: "Routine maintenance services for commercial properties",
            image: "/img/services.jpg",
            details: "Dedicated services for maintaining properties including retirement homes, apartments, and retail stores."
          }
        ],
        about: {
          content: "Paint To Think is a commercial and residential construction company based in Portland, Oregon with over 30 years of experience. We specialize in residential remodels, commercial builds, and maintenance services.",
          experience: "30+ years",
          projects: "500+",
          services: [
            "Roofing",
            "Siding",
            "Windows & Doors",
            "Kitchen Remodeling",
            "Bathroom Remodeling",
            "Additions",
            "Decks & Outdoor Spaces",
            "Commercial Construction",
            "Restaurant Build-outs",
            "Office Renovations",
            "Maintenance Services",
            "Large Grow Ops"
          ]
        },
        theme: {
          colors: {
            primary: "#111111",
            secondary: "#666666",
            accent: "#0066cc"
          },
          fonts: {
            primary: "Geist"
          }
        }
      };
      
      return new Response(JSON.stringify(defaultConfig), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
    
    /**
     * PUT /api/config/update
     * Updates site configuration in Cloudflare KV storage
     * Requires authentication via Authorization header
     */
    if (action === 'update' && request.method === 'PUT') {
      // Check authorization - prevents unauthorized config updates
      const authHeader = request.headers.get('Authorization');
      // TODO: In production, use env.CONFIG_PASSWORD from wrangler.toml
      const expectedAuth = 'Bearer admin123';
      
      if (authHeader !== expectedAuth) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }
      
      // Parse and validate the new config from request body
      const newConfig = await request.json();
      
      // Store updated config in Cloudflare KV
      // This persists across deployments and is the source of truth
      await env.SITE_CONFIG.put('config', JSON.stringify(newConfig));
      
      return new Response(JSON.stringify({ success: true, message: 'Config updated successfully' }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Method not allowed
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Config API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
}
