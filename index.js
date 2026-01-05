import { groqService } from "./services/groq";
import { cerebrasService } from "./services/cerebras";

const services = [groqService, cerebrasService];

let currentServiceIndex = 0;

function getNextService() {
  const service = services[currentServiceIndex];
  currentServiceIndex = (currentServiceIndex + 1) % services.length;
  return service;
}

const server = Bun.serve({
  port: 5555,
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (req.method === "POST" && pathname === "/chat") {
      const { messages } = await req.json();
      const service = getNextService();
      const stream = await service?.chat(messages);

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`El servidor esta funcionando en el puerto ${server.url}`);
