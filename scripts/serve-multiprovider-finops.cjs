'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../multiprovider-finops/app');
const server = () => http.createServer((request, response) => {
  response.setHeader('X-Robots-Tag', 'noindex, nofollow');
  response.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'");
  if (!['GET', 'HEAD'].includes(request.method)) return response.writeHead(405).end();
  const relative = request.url === '/' ? 'index.html' : request.url.replace(/^\//, '');
  if (relative.includes('..')) return response.writeHead(404).end();
  const file = path.join(root, relative);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return response.writeHead(404).end();
  response.writeHead(200, { 'Content-Type': file.endsWith('.css') ? 'text/css' : 'text/html; charset=utf-8' });
  if (request.method === 'HEAD') return response.end();
  response.end(fs.readFileSync(file));
});
if (require.main === module) server().listen(4221, '127.0.0.1', () => console.log('Multi-provider FinOps: http://127.0.0.1:4221/'));
module.exports = { server };
