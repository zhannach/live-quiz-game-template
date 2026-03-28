import {Game} from "../../types";
import {broadcastMessage} from "../../utils/broadcastMessage";
import {finishQuestion} from "./finishQuestion";

export function sendQuestion(game: Game) {
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
