"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function LogsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // 1. First fetch the route to ensure server is ready
    fetch("/api/socket").then(() => {
      // 2. Then open Socket.io connection
      const newSocket = io();

      // When we connect, the server will eventually emit "initialLogs"
      newSocket.on("initialLogs", (existingLogs: string[]) => {
        setLogs(existingLogs);
      });

      // Each time the server logs a new message, push it onto our array
      newSocket.on("logMessage", (msg: string) => {
        setLogs((prev) => [...prev, msg]);
      });

      setSocket(newSocket);
    });

    // Cleanup
    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Live Server Console Logs</h1>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>{log}</li>
        ))}
      </ul>
    </div>
  );
}
