import crypto from "crypto";

import {User, RegData, WebSocketWithUserId} from "../../types";
import { MESSAGES_TYPE } from "../../ws/messages";

export const users = new Map<string, User>();
export const connections = new Map<string, WebSocketWithUserId>();

export function handleRegister(ws: WebSocketWithUserId, data: RegData) {
  const {name, password} = data;

  const existingUser = [...users.values()].find((u) => u.name === name);

  if (existingUser) {
    if (existingUser.password !== password) {
      return ws.send(
        JSON.stringify({
          type: "reg",
          data: {
            name,
            index: undefined,
            error: true,
            errorText: "Invalid password",
          },
          id: 0,
        }),
      );
    }

    existingUser.ws = ws;
    connections.set(existingUser.index, ws);
    ws.userId = existingUser.index;

    return ws.send(
      JSON.stringify({
        type: MESSAGES_TYPE.REG,
        data: {
          name,
          index: existingUser.index,
          error: false,
          errorText: "",
        },
        id: 0,
      }),
    );
  }

  const id = crypto.randomUUID();

  const user: User = {
    name,
    password,
    index: id,
    ws,
  };

  users.set(id, user);
  connections.set(id, ws);
  ws.userId = id;

  ws.send(
    JSON.stringify({
      type: MESSAGES_TYPE.REG,
      data: {
        name: user.name,
        index: id,
        error: false,
        errorText: "",
      },
      id: 0,
    }),
  );
}
