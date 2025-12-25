/**
 * Cloudflare Pages Worker - Direct Asset Serving
 * Handles SPA routing and ensures all assets are served correctly
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle root and SPA routes - serve index.html
    if (pathname === '/' || 
        pathname === '/about' || 
        pathname === '/services' || 
        pathname === '/contact' ||
        (!pathname.includes('.') && !pathname.endsWith('/'))) {
      // Fetch index.html from the deployment
      const indexResponse = await fetch(new URL('/index.html', request.url));
      if (indexResponse.ok) {
        return indexResponse;
      }
    }

    // For all other requests (assets, fonts, images, etc.), fetch normally
    return fetch(request);
  }
};
