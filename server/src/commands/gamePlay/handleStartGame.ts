import {Game, StartGameData, WebSocketWithUserId} from "../../types";
import {broadcastMessage} from "../../utils/broadcastMessage.js";
import {games} from "../gameManagement/handleCreateGame.js";
import {finishQuestion} from "./finishQuestion.js";

export function handleStartGame(ws: WebSocketWithUserId, data: StartGameData) {
  const game = games.get(data.gameId);
  if (!game) return;

  if (game.hostId !== ws.userId) return;

  game.status = "in_progress";
  game.currentQuestion = 0;

  game.players.forEach((p) => {
    p.score = 0;
  });

  sendQuestion(game);
}

function sendQuestion(game: Game) {
  const question = game.questions[game.currentQuestion];

  game.questionStartTime = Date.now();
  game.playerAnswers.clear();

  broadcastMessage(game, {
    type: "question",
    data: {
      questionNumber: game.currentQuestion + 1,
      totalQuestions: game.questions.length,
      text: question.text,
      options: question.options,
      timeLimitSec: question.timeLimitSec,
    },
    id: 0,
  });

  game.questionTimer = setTimeout(() => {
    finishQuestion(game);
  }, question.timeLimitSec * 1000);
}
