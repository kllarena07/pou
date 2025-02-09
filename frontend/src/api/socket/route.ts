import { NextRequest } from "next/server";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

// Handle WebSocket upgrade
export async function GET(req: NextRequest) {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("Expected WebSocket upgrade", { status: 426 });
  }

  const { socket, response } = createWebSocket(req);
  wss.handleUpgrade(req, socket, Buffer.alloc(0), (ws) => {
    wss.emit("connection", ws, req);
  });

  return response;
}

// Helper function to create a WebSocket connection
function createWebSocket(req: NextRequest) {
  const upgradeHeader = req.headers.get("upgrade");
  if (upgradeHeader?.toLowerCase() !== "websocket") {
    throw new Error("Invalid WebSocket upgrade request");
  }

  const { socket, response } = new Response(null, {
    status: 101,
    webSocket: {},
  });

  return { socket, response };
}
