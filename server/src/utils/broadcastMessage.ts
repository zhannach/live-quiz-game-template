import {Game, WSMessage} from "../types";

export function broadcastMessage(game: Game, message: WSMessage) {
  const msg = JSON.stringify(message);

  for (const player of game.players) {
    player?.ws?.send(msg);
  }
}
