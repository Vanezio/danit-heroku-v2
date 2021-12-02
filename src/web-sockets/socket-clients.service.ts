import { Socket } from 'socket.io';
import { ChatMemberEntity } from '../db/entities/chat-member.entity';
import { WsChatEventsEnum } from '../enums/ws-chat.events.enum';
export class WebsocketClientService {
  public static clients = new Map<number, Socket[]>();

  public static joinUserConnection(client) {
    const userId = client.handshake.auth?.user?.id || client.user;

    const clients = this.clients.get(userId);

    if (!clients) {
      this.clients.set(userId, [client]);
    } else {
      this.clients.set(userId, [...clients, client]);
    }
  }

  public static async emitEventToChat(
    chatId: number,
    event: WsChatEventsEnum,
    payload?: any
  ) {
    const chatMembers = await ChatMemberEntity.find({ where: { chatId } });

    chatMembers.forEach((member) => {
      const membersConnections = this.clients.get(member.userId);

      membersConnections.forEach((connection) =>
        connection.emit(event, payload)
      );
    });
  }
}
