// Cloudflare Workers script for serving static assets
export default {
  async fetch(request, env) {
    // Serve static assets from the ASSETS binding
    return env.ASSETS.fetch(request);
  },
};
