import { ISocket } from './../types';
import { Socket } from 'socket.io';
import ChatService from '../services/chat.service';
import { HttpError } from '../common/errors';

export function wsWrapper(func: Function) {
  return async function (socket: Socket, next: Function) {
    try {
      await func.apply(this, [socket, next]);
    } catch (err) {
      next(err);
    }
  };
}

export const isChatMemberGuard = async (socket: ISocket, next: Function) => {
  const userChatIds = await ChatService.getChatIdsByUserId(socket.user.id);

  if (!userChatIds.includes(socket?.payload?.chatId)) {
    next(new HttpError());
  }

  next();
};
