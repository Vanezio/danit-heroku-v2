import { intersection, map } from 'lodash';
import { createQueryBuilder, In, QueryBuilder } from 'typeorm';
import { ChatMemberEntity } from '../db/entities/chat-member.entity';
import { ChatEntity } from '../db/entities/chat.entity';

class ChatService {
  async getUsersByChatId(chatId: number) {
    const members = await ChatMemberEntity.find({ where: { chatId } });
    const users = await Promise.all(members.map((member) => member.user));
    return users;
  }

  async getChatIdsByUserId(userId: number) {
    const chats = await ChatMemberEntity.find({
      where: { userId },
      select: ['chatId'],
    });

    return map(chats, 'chatId');
  }

  async isUsersAlreadyConnected(userIds: number[]) {
    const usersToChats = await Promise.all(
      userIds.map((userId) => this.getChatIdsByUserId(userId))
    );

    const generalChats = usersToChats.reduce((acc, chats, i) =>
      i === 0 ? chats : intersection(acc, chats)
    );

    return !!generalChats.length;
  }

  async createChat(userIds: number[]) {
    const chat = new ChatEntity();

    await chat.save();

    await Promise.all(
      userIds.map((userId) =>
        ChatMemberEntity.insert({ userId, chatId: chat.id })
      )
    );

    return true;
  }
}

export default new ChatService();
