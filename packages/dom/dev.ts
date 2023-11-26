import { watch } from 'fs';
import { resolve } from 'path';
import lightningcss from 'bun-lightningcss'

Bun.serve({
  port: 3000,
  fetch(req) {
    let { pathname } = new URL(req.url);

    if (pathname === '/') {
      pathname = '/index.html';
    }

    const file = Bun.file('.' + pathname);
    if (file.size > 0) {
      return new Response(file);
    }

    return new Response('File not found', { status: 404 });
  }
});

watch('./src', (event, filename) => {
  process.stdout.write(`\n${event} ${filename}. Rebuilding...\n`);

  Bun.build({
    entrypoints: ['./src/lib.ts'],
    outdir: './dist',
    plugins: [lightningcss()],
  });
});
