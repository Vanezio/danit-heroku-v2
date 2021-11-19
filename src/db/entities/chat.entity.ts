import { MessageEntity } from './message.entity';
import { ChatMemberEntity } from './chat-member.entity';
import { Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'chats' })
export class ChatEntity extends Base {
  @OneToMany(() => ChatMemberEntity, (member) => member.chat)
  public members: Promise<ChatMemberEntity[]>;

  @OneToMany(() => MessageEntity, (message) => message.chat)
  public messages: Promise<MessageEntity[]>;
}
