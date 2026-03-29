import {handleCreateGame} from "../commands/gameManagement/handleCreateGame.js";
import {handleJoinGame} from "../commands/gameManagement/handleJoinGame.js";
import {handleAnswer} from "../commands/gamePlay/handleAnswer.js";
import {handleStartGame} from "../commands/gamePlay/handleStartGame.js";
import {handleRegister} from "../commands/player/handleRegister.js";
import {WebSocketWithUserId, WSMessage} from "../types";

export const MESSAGES_TYPE = {
  REG: "reg",
  LOGIN: "login",
  CREATE_GAME: "create_game",
  GAME_CREATED: "game_created",
  JOIN_GAME: "join_game",
  GAME_JOINED: "game_joined",
  PLAYER_JOINED: "player_joined",
  UPDATE_PLAYERS: "update_players",
  START_GAME: "start_game",
  QUESTION: "question",
  ANSWER: "answer",
  ANSWER_ACCEPTED: "answer_accepted",
  QUESTION_RESULT: "question_result",
  GAME_FINISHED: "game_finished",
};

export const dispatchMessage = (ws: WebSocketWithUserId, msg: WSMessage) => {
  switch (msg.type) {
    case MESSAGES_TYPE.REG:
    case MESSAGES_TYPE.LOGIN:
      handleRegister(ws, msg.data);
      break;
    case MESSAGES_TYPE.CREATE_GAME:
      handleCreateGame(ws, msg.data);
      break;
    case MESSAGES_TYPE.JOIN_GAME:
      handleJoinGame(ws, msg.data);
      break;
    case MESSAGES_TYPE.START_GAME:
      handleStartGame(ws, msg.data);
      break;
    case MESSAGES_TYPE.ANSWER:
      handleAnswer(ws, msg.data);
      break;
    default:
      console.warn("Unknown message type:", msg.type);
  }
};
