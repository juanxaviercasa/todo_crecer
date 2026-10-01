export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405 });
    const route = await env.DB.prepare('SELECT tenant_id, build_id, active_release_id, indexing FROM active_routes WHERE hostname = ?1 AND status = ?2 LIMIT 1').bind(url.hostname, 'active').first();
    if (!route) return new Response('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow' } });
    const relative = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    if (!/^(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+$/.test(relative)) return new Response('Bad request', { status: 400 });
    const object = await env.SITE_ARTIFACTS.get(`tenants/${route.tenant_id}/builds/${route.build_id}/${relative}`);
    if (!object) return new Response('Not found', { status: 404 });
    const headers = new Headers(); object.writeHttpMetadata(headers);
    headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    headers.set('Content-Security-Policy', "default-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'");
    headers.set('X-Content-Type-Options', 'nosniff'); headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('X-Robots-Tag', route.indexing === 'index' ? 'all' : 'noindex, nofollow'); headers.set('X-Release-Id', route.active_release_id);
    return new Response(request.method === 'HEAD' ? null : object.body, { status: 200, headers });
  }
};
