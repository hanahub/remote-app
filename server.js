import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });
let host = null;
let client = null;

wss.on("connection", ws => {
  ws.on("message", msg => {
    const data = JSON.parse(msg);

    if (data.role === "host") host = ws;
    if (data.role === "client") client = ws;

    if (data.offer && client) client.send(msg);
    if (data.answer && host) host.send(msg);
    if (data.candidate) {
      if (ws === host && client) client.send(msg);
      if (ws === client && host) host.send(msg);
    }
  });
});

console.log("Signaling server running on ws://localhost:3000");
