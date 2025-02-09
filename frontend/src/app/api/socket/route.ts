// app/api/socket/route.ts (TypeScript example)
import { Server } from "socket.io";
import { NextRequest, NextResponse } from "next/server";

let io: Server | undefined;

export async function GET(req: NextRequest) {
  // @ts-ignore
  if (!global._io) {
    console.log("Initializing Socket.io...");
    const httpServer = (req as any).socket?.server;
    if (httpServer) {
      io = new Server(httpServer);
      global._io = io;
      io.on("connection", (socket) => {
        console.log("App Router: client connected!", socket.id);
      });
    }
  }
  return NextResponse.json({ message: "Socket.io up and running" });
}
