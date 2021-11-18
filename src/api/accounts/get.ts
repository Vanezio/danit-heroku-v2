import {HttpError, wrapper} from '../../tools/wrapper.helpers';
import { Request, Response } from 'express';
import {IEntityRequest, IRequest} from '../../types';

import {UserEntity} from "../../db/entities/user.entity";
import {UserRoleEnum} from "../../enums/user-role.enum";
import {AccountResponse} from "./responses/account.response";

export const getUserAccount = wrapper(async (req: IEntityRequest<UserEntity>, res: Response) => {
  const { entity, user } = req

  if (user.role === UserRoleEnum.CUSTOMER) {
    const purchases = await user.purchases;
    const sellersIds = await Promise.all(purchases.map(async(el) => {
      const item = await el.item;
      return item.sellerId
    }))

    if(sellersIds.includes(entity.id)) {
      return res.status(200).send(new AccountResponse(entity))
    } else {
      throw new HttpError('not found', 404)
    }

  }

});
