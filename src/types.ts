import { UserEntity } from './db/entities/user.entity';
import { Request } from 'express';
import { UserRoleEnum } from './enums/user-role.enum';
import { BaseEntity } from 'typeorm';
import { ItemEntity } from './db/entities/item.entity';
import { Base } from './db/entities/base.entity';
import { Socket } from 'socket.io';
import { WsChatEventsEnum } from './enums/ws-chat.events.enum';

export interface IRequest extends Request {
  user: UserEntity;
}

export interface IEntityRequest<T extends BaseEntity> extends Request {
  user: UserEntity;

  entity: T;
}

export interface ISocketError extends Socket {
  err: Error;
}

export interface ISocket extends Omit<Socket, 'handshake'> {
  user?: UserEntity;

  event?: WsChatEventsEnum;

  handshake: { auth: { token?: string } };

  payload?: { chatId: number; message: string; messageId: number };
}

export interface JwtPayload {
  role: UserRoleEnum;

  id: number;

  login: string;
}

export type TUserSimple = Omit<
  UserEntity,
  'password' | 'purchases' | 'items'
> & {
  items?: ItemEntity[];
  purchases?: ItemEntity[];
};
