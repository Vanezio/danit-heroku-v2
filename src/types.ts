import { UserEntity } from './db/entities/user.entity';
import { Request } from 'express';
import { UserRoleEnum } from './enums/user-role.enum';
import { BaseEntity } from 'typeorm';
import { ItemEntity } from './db/entities/item.entity';
import { Base } from './db/entities/base.entity';

export interface IRequest extends Request {
  user: UserEntity;
}

export interface IEntityRequest<T extends BaseEntity> extends Request {
  user: UserEntity;

  entity: T;
}

export interface JwtPayload {
  role: UserRoleEnum;

  id: number;

  login: string;
}
