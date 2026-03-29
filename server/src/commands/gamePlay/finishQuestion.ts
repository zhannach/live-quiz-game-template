import {Game} from "../../types";
import {broadcastMessage} from "../../utils/broadcastMessage.js";
import {calculateScore} from "../../utils/calculateScore.js";
import {finishGame} from "./finishGame.js";
import {sendQuestion} from "./sendQuestion.js";

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
  const isLastQuestion = game.currentQuestion + 1 >= game.questions.length;

  setTimeout(() => {
    if (isLastQuestion) {
      finishGame(game);
    } else {
      game.currentQuestion++;
      sendQuestion(game);
    }
  }, 2000);
}
