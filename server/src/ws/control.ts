import {WebSocket} from "ws";
import {WSMessage} from "../types";
import {handleRegister} from "../commands/player/handleRegister";

export const controlConnection = (ws: WebSocket) => {
  ws.on("message", (message) => {
    const parsed: WSMessage = JSON.parse(message.toString());

    switch (parsed.type) {
      case "reg":
        handleRegister(ws, parsed.data);
        break;
      default:
        console.log("Unknown message type:", parsed.type);
    }

    console.log(parsed);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
};
