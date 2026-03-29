import {CreateGameData, Game, WebSocketWithUserId} from "../../types";
import {createGameCode} from "../../utils/createGameCode.js";
import crypto from "crypto";
import {MESSAGES_TYPE} from "../../ws/messages.js";

export const games = new Map<string, Game>();

export function handleCreateGame(
  ws: WebSocketWithUserId,
  data: CreateGameData,
) {
  const gameId = crypto.randomUUID();
  const code = createGameCode();

  const game: Game = {
    id: gameId,
    code,
    hostId: ws.userId!,
    questions: data.questions,
    players: [],
    currentQuestion: -1,
    status: "waiting",
    playerAnswers: new Map(),
  };

  games.set(gameId, game);

  ws.send(
    JSON.stringify({
      type: MESSAGES_TYPE.GAME_CREATED,
      data: {gameId, code},
      id: 0,
    }),
  );
}
