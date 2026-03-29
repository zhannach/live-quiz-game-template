import {WebSocket} from "ws";
import {WSMessage, WebSocketWithUserId} from "../types";
import {dispatchMessage} from "./messages.js";
import {games} from "../commands/gameManagement/handleCreateGame.js";
import {updatePlayers} from "../commands/gameManagement/updatePlayers.js";

export const controlConnection = (ws: WebSocket) => {
  const extWs = ws as WebSocketWithUserId;

  extWs.on("message", (message) => {
    const parsed: WSMessage = JSON.parse(message.toString());

    dispatchMessage(extWs, parsed);
  });

  extWs.on("close", () => {
    console.log("Client disconnected", extWs.userId);
    if (extWs.gameId) {
      const game = games.get(extWs.gameId);
      if (game) {
        game.players = game.players.filter((p) => p.index !== extWs.userId);
        updatePlayers(game);
      }
    }
  });
};
