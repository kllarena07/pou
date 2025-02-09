/*const { createServer } = require("http");
const next = require("next");
const { WebSocketServer } = require("ws");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // Create WebSocket server
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket connected");

    ws.on("message", (message) => {
      console.log("Received:", message.toString());
      ws.send(`Echo: ${message}`);
    });

    ws.on("close", () => {
      console.log("WebSocket disconnected");
    });
  });

  server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
*/