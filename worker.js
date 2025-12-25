/**
 * Cloudflare Worker - Direct Asset Serving for Paint To Think
 * Serves all static assets directly from KV or fetches from origin
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle SPA routing - serve index.html for all non-asset routes
    if (!pathname.includes('/assets/') && 
        !pathname.includes('/fonts/') && 
        !pathname.includes('/img/') && 
        !pathname.includes('/config/') &&
        !pathname.includes('/video/') &&
        !pathname.includes('.') &&
        pathname !== '/') {
      // SPA route - serve index.html
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/'
        }
      });
    }

    // For all other requests, let Pages handle it
    return fetch(request);
  }
};

