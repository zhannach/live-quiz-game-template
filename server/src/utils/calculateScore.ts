import {Question} from "../types";

export function calculateScore(
  question: Question,
  answerTimestamp: number,
  questionStartTime: number,
) {
  const timeTaken = (answerTimestamp - questionStartTime) / 1000;
  const timeRemaining = Math.max(question.timeLimitSec - timeTaken, 0);

  return Math.round(1000 * (timeRemaining / question.timeLimitSec));
}
