import crypto from 'crypto';
import { BeforeInsert, Column, Entity, In, OneToMany } from 'typeorm';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { Base } from './base.entity';
import { ChatMemberEntity } from './chat-member.entity';
import { ChatEntity } from './chat.entity';
import { ItemEntity } from './item.entity';
import { PurchaseEntity } from './purchase.entity';

@Entity({ name: 'users' })
export class UserEntity extends Base {
  @Column({
    type: 'text',
    unique: true,
  })
  public login: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.CUSTOMER,
  })
  public role: UserRoleEnum;

  @Column({ select: false })
  public password: string;

  @Column({
    type: 'decimal',
    default: 300,
  })
  public balance: number;

  @OneToMany(() => ItemEntity, (item) => item.seller)
  public items: Promise<ItemEntity[]>;

  @OneToMany(() => PurchaseEntity, (purchase) => purchase.customer)
  public purchases: Promise<PurchaseEntity[]>;

  @OneToMany(() => ChatMemberEntity, (member) => member.user)
  public chatMembers: Promise<ChatMemberEntity[]>;

  @BeforeInsert()
  encryptPassword() {
    this.password = this.getPasswordHash(this.password);
  }

  async isUserInChat(chatId: number) {
    const isUserInChat = (await this.chatMembers).some(
      (member) => member.chatId === chatId
    );
    return isUserInChat;
  }

  async getChats() {
    const chatIds = (await this.chatMembers).map((member) => member.chatId);

    return ChatEntity.find({ where: { id: In(chatIds) } });
    // const aa = await
  }

  verifyPassword(password: string) {
    const passwordHash = this.getPasswordHash(password);

    return this.password === passwordHash;
  }

  getPasswordHash(password: string) {
    return crypto
      .createHash('sha256')
      .update(password, 'binary')
      .digest('base64');
  }
}

// console.log(a);
