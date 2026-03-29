import {WebSocketServer} from "ws";
import {controlConnection} from "./ws/control.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const wss = new WebSocketServer({port: PORT});

wss.on("connection", (ws) => {
  console.log(`Client connected on ws://localhost:${PORT}`);
  controlConnection(ws);
});
