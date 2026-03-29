import {Game} from "../../types";
import {broadcastMessage} from "../../utils/broadcastMessage.js";

export function finishGame(game: Game) {
  const scoreboard = [...game.players]
    .map((p) => ({
      name: p.name,
      score: p.score,
    }))
    .sort((a, b) => b.score - a.score)
    .map((p, index) => ({
      ...p,
      rank: index + 1,
    }));

  broadcastMessage(game, {
    type: "game_finished",
    data: {scoreboard},
    id: 0,
  });

  game.status = "finished";
}
