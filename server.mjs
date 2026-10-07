import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files = new Map([['/', ['index.html','text/html']], ['/index.html',['index.html','text/html']], ['/style.css',['style.css','text/css']], ['/script.js',['script.js','text/javascript']], ['/assets/portrait.jpeg',['assets/portrait.jpeg','image/jpeg']], ['/profile.txt',['profile.txt','text/plain']]]);
files.set('/assets/satoshi-regular.woff2',['assets/satoshi-regular.woff2','font/woff2']);
files.set('/assets/satoshi-bold.woff2',['assets/satoshi-bold.woff2','font/woff2']);
const server = http.createServer(async (req,res) => {
  const item = files.get(new URL(req.url, 'http://localhost').pathname);
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405, {Allow:'GET, HEAD'});return res.end();}
  if (!item) {res.writeHead(404);return res.end('Not found');}
  try {
    const data = await readFile(new URL(item[0], import.meta.url));
    res.writeHead(200, {'Content-Type':item[1], 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin', 'Cache-Control':'no-store', 'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"});
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {res.writeHead(500);res.end('Unable to load file');}
});
server.listen(5173,'127.0.0.1',()=>console.log('Portfolio: http://127.0.0.1:5173'));
