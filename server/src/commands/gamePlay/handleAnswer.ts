import {AnswerData, WebSocketWithUserId} from "../../types";
import {games} from "../gameManagement/handleCreateGame.js";
import {finishQuestion} from "./finishQuestion.js";

export function handleAnswer(ws: WebSocketWithUserId, data: AnswerData) {
  const game = games.get(data.gameId);
  if (!game) return;

  const player = game.players.find((p) => p.index === ws.userId);
  if (!player) return;

  if (game.playerAnswers.has(player.index)) return;

  game.playerAnswers.set(player.index, {
    answerIndex: data.answerIndex,
    timestamp: Date.now(),
  });

  ws.send(
    JSON.stringify({
      type: "answer_accepted",
      data: {
        questionIndex: data.questionIndex,
      },
      id: 0,
    }),
  );

  if (game.playerAnswers.size === game.players.length) {
    if (game.questionTimer) clearTimeout(game.questionTimer);
    finishQuestion(game);
  }
}
