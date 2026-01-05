const server = Bun.serve({
  port: 5555,
  async fetch(req) {
    return new Response("Hello, World!");
  },
});

console.log(`El servidor esta funcionando en el puerto ${server.url}`);
