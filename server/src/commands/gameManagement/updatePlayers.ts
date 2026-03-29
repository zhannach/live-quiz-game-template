import {Game} from "../../types";
import {connections} from "../player/handleRegister.js";
import {MESSAGES_TYPE} from "../../ws/messages.js";

export function updatePlayers(game: Game) {
  const updatePlayersMsg = JSON.stringify({
    type: MESSAGES_TYPE.UPDATE_PLAYERS,
    data: game.players.map((p) => ({
      name: p.name,
      index: p.index,
      score: p.score,
    })),
    id: 0,
  });

  game.players.forEach((player) => {
    if (player.ws && player.ws.readyState === 1) {
      player.ws.send(updatePlayersMsg);
    }
  });

  const hostWs = connections.get(game.hostId);
  const isHostAlsoPlayer = game.players.some((p) => p.index === game.hostId);

  if (hostWs && hostWs.readyState === 1 && !isHostAlsoPlayer) {
    hostWs.send(updatePlayersMsg);
  }
}
