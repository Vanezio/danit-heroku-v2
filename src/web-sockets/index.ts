import { Express } from "express";
import { createServer } from "http";
import { isInteger, isObject } from "lodash";
import chatService from "../services/chat.service";
import { Server, Socket } from "socket.io";
import { MessageEntity } from "../db/entities/message.entity";
import { WsChatEventsEnum } from "../enums/ws-chat.events.enum";
import { TDeleteMessage, TMessageEdit, TSendMessage, TSocketClient } from "../types";
import { UserEntity } from "./../db/entities/user.entity";
import { IChatPayload } from "./../types";
import { authSocketMiddleware } from "./auth";
import { WebsocketClientService } from "./socket-clients.service";

export const registerSockets = (app: Express) => {
  const server = createServer(app);

  const io = new Server(8080, {
    cors: {
      credentials: true,
    },
  });

  io.use(authSocketMiddleware);

  io.on("connection", (client: TSocketClient) => {
    WebsocketClientService.joinUserConnection(client);

    const user: UserEntity = client.user;

    // client.use(
    //   async (
    //     [event, payload]: [event: WsChatEventsEnum, payload: IChatPayload],
    //     next
    //   ) => {
    //     if (!isObject(payload) || !isInteger(payload.chatId)) {
    //       return null;
    //     }

    //     const a = await user.isUserInChat(payload.chatId);

    //     return a ? next() : null;
    //   }
    // );

    client.on(WsChatEventsEnum.SEND_MESSAGE, async (payload: TSendMessage) => {
      if (!chatService.isUserInChat(user.id, payload.chatId)) {
        return;
      }
      const message = chatService.createMessage({
        ...payload,
        senderId: user.id,
      });
      WebsocketClientService.emitEventToChat(payload.chatId, WsChatEventsEnum.RECEIVE_MESSAGE, message);
    });

    client.on(WsChatEventsEnum.EDIT_MESSAGE, async (payload: TMessageEdit) => {
      const { messageId } = payload;
      if (!chatService.isMessageSender(user.id, messageId)) {
        return;
      }
      const editedMessage = await chatService.editMessage(payload);
      WebsocketClientService.emitEventToChat(
        editedMessage.chatId,
        WsChatEventsEnum.RECEIVE_EDITED_MESSAGE,
        editedMessage
      );
    });

    client.on(WsChatEventsEnum.DELETE_MESSAGE, async (payload: TDeleteMessage) => {
      if (!chatService.isMessageSender(user.id, payload.messageId)) {
        return;
      }

      const deletedMessage = await chatService.deleteMessage(payload.messageId);

      WebsocketClientService.emitEventToChat(deletedMessage.chatId, WsChatEventsEnum.MESSAGE_DELETED, payload);
    });

    client.on("disconnect", () => {
      WebsocketClientService.closeUserConnection(client);
    });
  });

  return server;
};
