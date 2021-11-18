import { Request, Response } from 'express';
import { assign, pick } from 'lodash';
import { ItemEntity } from '../../db/entities/item.entity';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { HttpError, wrapper } from '../../tools/wrapper.helpers';
import { IRequest } from '../../types';

export const postItems = wrapper(async (req: IRequest, res: Response) => {
  const user = req.user;

  if (user.role !== UserRoleEnum.SELLER) {
    throw new HttpError(`This action is not permitted for role ${user.role}`);
  }

  const item = new ItemEntity();

  assign(item, pick(req.body, 'price', 'quantity', 'title'));
  item.seller = user;

  await item.save();

  res.status(201).send(`Item has been created ${item.id}`);
});
