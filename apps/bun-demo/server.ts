// Bunの高速HTTPサーバー実装
const server = Bun.serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);
    
    // ルーティング
    if (url.pathname === "/") {
      return new Response("Welcome to Bun! 🚀", {
        headers: { "Content-Type": "text/plain" },
      });
    }
    
    if (url.pathname === "/json") {
      return Response.json({
        message: "Hello from Bun!",
        timestamp: new Date().toISOString(),
        runtime: "Bun",
        version: Bun.version,
      });
    }
    
    if (url.pathname === "/hello") {
      const name = url.searchParams.get("name") || "World";
      return new Response(`Hello, ${name}!`, {
        headers: { "Content-Type": "text/plain" },
      });
    }
    
    // 404
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`サーバーが起動しました: http://localhost:${server.port}`);