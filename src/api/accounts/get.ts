import { Response } from "express";

import { HttpError } from "../../common/errors";
import { UserEntity } from "../../db/entities/user.entity";
import { UserRoleEnum } from "../../enums/user-role.enum";
import { wrapper } from "../../tools/wrapper.helpers";
import { IEntityRequest } from "../../types";
import { AccountResponse } from "./responses/account.response";
import { WhoamiResponse } from "./responses/whoami.response";

export const getUserAccount = wrapper(async (req: IEntityRequest<UserEntity>, res: Response) => {
  const { entity, user } = req;

  if (user.role === UserRoleEnum.CUSTOMER) {
    const purchases = await user.purchases;
    const sellersIds = await Promise.all(
      purchases.map(async el => {
        const item = await el.item;
        return item.sellerId;
      })
    );

    if (sellersIds.includes(entity.id)) {
      return res.status(200).send(new AccountResponse(entity));
    } else {
      throw new HttpError("not found", 404);
    }
  }
});

export const getOwnAccount = wrapper(async (req: IEntityRequest<UserEntity>, res: Response) => {
  const items = await req.user.items;

  const purchases = await req.user.purchases;

  return res.status(200).send(new WhoamiResponse(req.user));
});
