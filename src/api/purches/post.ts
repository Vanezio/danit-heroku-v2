import { Response } from 'express';
import { assign, pick } from 'lodash';
import { PurchaseEntity } from '../../db/entities/purchase.entity';
import { IRequest } from '../../types';
import { HttpError, wrapper } from '../../tools/wrapper.helpers';
import { ItemEntity } from '../../db/entities/item.entity';

export const postPurchases = wrapper(async (req: IRequest, res: Response) => {
  const { itemId, count } = pick(req.body, 'itemId', 'count');

  const item = await ItemEntity.findOne(itemId);
  if (!item) {
    // res.status(404).send('Invalid item chosen');
    throw new HttpError('Invalid item chosen', 404);
  }
  if (item.quantity < count) {
    throw new HttpError(
      `Only ${item.quantity} items available, But you have chosen ${count}. Please check your cart`
    );
  }

  const purchase = new PurchaseEntity();

  item.quantity = item.quantity - count;
  item.save();

  assign(purchase, { item, itemQuantity: count });
  purchase.customer = req.user;

  await purchase.save();

  res.status(201).send('Items has been purchased');
});
