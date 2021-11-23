import { filter, forEach } from 'lodash';
import { Socket } from 'socket.io';
import { WsChatEventsEnum } from '../enums/ws-chat.events.enum';
import { ISocket } from '../types';
import JwtService from './jwt.service';
import ChatService from './chat.service';

const handleConnection = async (socket: Socket) => {
  const token = socket.handshake.auth.token;

  const user = await JwtService.decode(token);
};

const handleDisconnect = async (socket: Socket) => {
  const token = socket.handshake.auth.token;

  const user = await JwtService.decode(token);
};

class WsService {
  private sockets: ISocket[];

  constructor() {
    this.sockets = [];
  }

  emitEventToUser(userId: number, event: WsChatEventsEnum, payload?: any) {
    forEach(filter(this.sockets, { user: { id: userId } }), (sock) =>
      sock.emit(event as unknown as string, payload)
    );
  }

  async emitEventToChat(
    chatId: number,
    event: WsChatEventsEnum,
    payload?: any
  ) {
    const users = await ChatService.getUsersByChatId(chatId);
    forEach(users, (user) => this.emitEventToUser(user.id, event, payload));
  }

  //   [WsChatEventsEnum.SEND_MESSAGE]: () => {};
  //   [WsChatEventsEnum.RECEIVE_MESSAGE]: () => {};
  //   [WsChatEventsEnum.EDIT_MESSAGE]: () => {};
  //   [WsChatEventsEnum.DELETE_MESSAGE]: () => {};

  registerSocket(socket: ISocket) {}
}
