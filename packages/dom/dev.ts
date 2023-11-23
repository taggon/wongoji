Bun.serve({
  port: 3030,
  fetch(req) {
    const url = new URL(req.url);
    let { pathname } = url;

    if (pathname === '/') {
      pathname = '/../index.html';
    }

    try {
      return new Response(Bun.file(`dist${pathname}`));
    } catch {
      return new Response(Bun.file(`index.html`));
    }
  }
});
