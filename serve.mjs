import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname);

const PORT = Number(process.env.PORT) || 4173;
const HOST = process.env.HOST || '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

function resolveFilePath(urlPathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(urlPathname);
  } catch {
    return null;
  }

  const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
  const fullPath = path.resolve(ROOT_DIR, relativePath);

  if (fullPath !== ROOT_DIR && !fullPath.startsWith(ROOT_DIR + path.sep)) {
    return null;
  }

  return fullPath;
}

async function handleRequest(req, res) {
  const method = req.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  const parsedUrl = new URL(req.url || '/', `http://${HOST}:${PORT}`);
  let filePath = resolveFilePath(parsedUrl.pathname);

  if (!filePath) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  try {
    let stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      stats = await fs.stat(filePath);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const data = await fs.readFile(filePath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': data.byteLength,
      'Cache-Control': 'no-cache',
    });

    if (method === 'HEAD') {
      res.end();
      return;
    }

    res.end(data);
  } catch (err) {
    if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) {
      if (parsedUrl.pathname === '/favicon.ico') {
        res.writeHead(204, { 'Cache-Control': 'no-cache' });
        res.end();
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 — Page introuvable');
      return;
    }

    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 — Erreur interne du serveur');
  }
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch(() => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    res.end('500 — Erreur interne du serveur');
  });
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} déjà utilisé. Essayez : $env:PORT=4174; node serve.mjs`);
  } else {
    console.error('Erreur serveur :', err);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`Portfolio ready at http://${HOST}:${PORT}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
