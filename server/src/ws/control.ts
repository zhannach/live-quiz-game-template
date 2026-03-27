import {WebSocket} from "ws";
import {WSMessage, WebSocketWithUserId} from "../types";
import {handleRegister} from "../commands/player/handleRegister";
import {handleCreateGame} from "../commands/gameManagement /handleCreateGame";

export const controlConnection = (ws: WebSocket) => {
  const extWs = ws as WebSocketWithUserId;

  extWs.on("message", (message) => {
    const parsed: WSMessage = JSON.parse(message.toString());

    switch (parsed.type) {
      case "reg":
        handleRegister(extWs, parsed.data);
        break;
      case "create_game":
        handleCreateGame(extWs, parsed.data);
        break;
      default:
        console.log("Unknown message type:", parsed.type);
    }

    console.log(parsed);
  });

  extWs.on("close", () => {
    console.log("Client disconnected");
  });
};
