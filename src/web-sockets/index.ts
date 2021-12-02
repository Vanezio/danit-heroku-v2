import { Express } from 'express';
import { createServer } from 'http';
import { isInteger, isObject } from 'lodash';
import { Server, Socket } from 'socket.io';
import { MessageEntity } from '../db/entities/message.entity';
import { WsChatEventsEnum } from '../enums/ws-chat.events.enum';
import { TDeleteMessage, TSendMessage } from '../types';
import { UserEntity } from './../db/entities/user.entity';
import { IChatPayload } from './../types';
import { authSocketMiddleware } from './auth';
import { WebsocketClientService } from './socket-clients.service';

export const registerSockets = (app: Express) => {
  const server = createServer(app);

  const io = new Server(8080, {
    cors: {
      credentials: true,
    },
  });

  io.use(authSocketMiddleware);

  io.on('connection', (client: Socket) => {
    WebsocketClientService.joinUserConnection(client);

    const user: UserEntity = (client as any).user;

    client.use(
      async (
        [event, payload]: [event: WsChatEventsEnum, payload: IChatPayload],
        next
      ) => {
        if (!isObject(payload) || !isInteger(payload.chatId)) {
          return null;
        }

        const a = await user.isUserInChat(payload.chatId);

        return a ? next() : null;
      }
    );

    client.on(WsChatEventsEnum.SEND_MESSAGE, async (payload: TSendMessage) => {
      const { userId, chatId, data } = payload;

      const message = new MessageEntity();

      message.chatId = chatId;
      message.senderId = userId;
      message.data = data;

      await message.save();

      WebsocketClientService.emitEventToChat(
        chatId,
        WsChatEventsEnum.RECEIVE_MESSAGE,
        message
      );
    });

    client.on(WsChatEventsEnum.EDIT_MESSAGE, (data: IChatPayload) => {});
    client.on(WsChatEventsEnum.DELETE_MESSAGE, (data: TDeleteMessage) => {});

    client.on('disconnect', () => {});
  });

  return server;
};
