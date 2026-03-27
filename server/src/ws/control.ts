import {WebSocket} from "ws";
import {WSMessage, WebSocketWithUserId} from "../types";
import {dispatchMessage} from "./messages";

export const controlConnection = (ws: WebSocket) => {
  const extWs = ws as WebSocketWithUserId;

  extWs.on("message", (message) => {
    const parsed: WSMessage = JSON.parse(message.toString());

    dispatchMessage(extWs, parsed);
  });

  extWs.on("close", () => {
    console.log("Client disconnected");
  });
};
