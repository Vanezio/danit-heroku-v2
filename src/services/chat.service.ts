import { intersection, map } from 'lodash';
import { TCreateMessage, TMessageEdit } from 'types';
import { ChatMemberEntity } from '../db/entities/chat-member.entity';
import { ChatEntity } from '../db/entities/chat.entity';
import { MessageEntity } from '../db/entities/message.entity';

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

  async isUserInChat(userId: number, chatId: number) {
    const users = await this.getUsersByChatId(chatId);

    return !!users.find((userEnt) => userEnt.id === userId);
  }

  async createMessage(data: TCreateMessage) {
    const message = new MessageEntity(data);
    await message.save();

    return message;
  }

  async isMessageSender(userId: number, messageId: number) {
    const message = await MessageEntity.findOne(messageId);

    return message.senderId === userId;
  }

  async editMessage(payload: TMessageEdit) {
    const message = await MessageEntity.findOne(payload.messageId);
    message.data = payload.data;
    await message.save();

    return message;
  }

  async deleteMessage(messageId: number) {
    const message = await MessageEntity.findOne(messageId);

    return message.remove();
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

  async findUsersChat(firstUserId: number, secondUserId: number) {
    const firstChatMembers = await ChatMemberEntity.find({
      where: { userId: firstUserId },
      select: ['chatId'],
    });

    const secondChatMembers = await ChatMemberEntity.find({
      where: { userId: secondUserId },
      select: ['chatId'],
    });

    let chatId = null;

    firstChatMembers.forEach((chatMember) => {
      const isCommonChat = secondChatMembers.find(
        (secondChatMember) => secondChatMember.chatId === chatMember.chatId
      );

      if (isCommonChat) {
        chatId = chatMember.chatId;
      }
    });

    return chatId;
  }

  async getBroadcastChatIds(usersIds: number[], senderId: number) {
    const chatIds = await Promise.all(
      usersIds.map((userId) => this.findUsersChat(userId, senderId))
    );

    return chatIds.filter((chatId) => chatId);
  }
}

export default new ChatService();
