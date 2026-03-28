import {Game} from "../../types";
import {broadcastMessage} from "../../utils/broadcastMessage";
import {calculateScore} from "../../utils/calculateScore";
import {finishGame} from "./finishGame";
import { sendQuestion } from "./sendQuestion";

export function finishQuestion(game: Game) {
  const question = game.questions[game.currentQuestion];

  const playerResults = game.players.map((player) => {
    const answer = game.playerAnswers.get(player.index);

    let pointsEarned = 0;
    let correct = false;
    let answered = !!answer;

    if (answer) {
      correct = answer.answerIndex === question.correctIndex;

      if (correct) {
        pointsEarned = calculateScore(
          question,
          answer.timestamp,
          game.questionStartTime!,
        );

        player.score += pointsEarned;
      }
    }

    return {
      name: player.name,
      answered,
      correct,
      pointsEarned,
      totalScore: player.score,
    };
  });

  broadcastMessage(game, {
    type: "question_result",
    data: {
      questionIndex: game.currentQuestion,
      correctIndex: question.correctIndex,
      playerResults,
    },
    id: 0,
  });

  nextStep(game);
}

function nextStep(game: Game) {
  game.currentQuestion++;

  if (game.currentQuestion < game.questions.length) {
    setTimeout(() => sendQuestion(game), 2000);
  } else {
    finishGame(game);
  }
}
