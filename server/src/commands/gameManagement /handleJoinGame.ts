import {JoinGameData, WebSocketWithUserId} from "../../types";
import {games} from "./handleCreateGame";
import {users, connections} from "../player/handleRegister";
import {MESSAGES_TYPE} from "../../ws/messages";
import {updatePlayers} from "./updatePlayers";

export function handleJoinGame(ws: WebSocketWithUserId, {code}: JoinGameData) {
  const game = [...games.values()].find((g) => g.code === code);

  if (!game) return;

  const user = users.get(ws.userId);
  if (!user) return;

  if (!game.players.some((p) => p.index === user.index)) {
    game.players.push({
      name: user.name,
      index: user.index,
      score: 0,
      ws: ws,
    });
  } else {
    const existingPlayer = game.players.find((p) => p.index === user.index);
    if (existingPlayer) {
      existingPlayer.ws = ws;
    }
  }

  ws.gameId = game.id;

  ws.send(
    JSON.stringify({
      type: MESSAGES_TYPE.GAME_JOINED,
      data: {gameId: game.id},
      id: 0,
    }),
  );

  const broadcastMsg = JSON.stringify({
    type: MESSAGES_TYPE.PLAYER_JOINED,
    data: {
      playerName: user.name,
      playerCount: game.players.length,
    },
    id: 0,
  });

  game.players.forEach((player) => {
    if (player.ws && player.ws.readyState === 1) {
      player.ws.send(broadcastMsg);
    }
  });

  const hostWs = connections.get(game.hostId);
  const isHostAlsoPlayer = game.players.some((p) => p.index === game.hostId);

  if (hostWs && hostWs.readyState === 1 && !isHostAlsoPlayer) {
    hostWs.send(broadcastMsg);
  }

  updatePlayers(game);
}
