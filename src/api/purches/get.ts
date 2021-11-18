import { wrapper } from '../../tools/wrapper.helpers';
import { Request, Response } from 'express';
import { IRequest } from '../../types';
import { PurchaseStatusEnum } from '../../enums/purchase-status.enum';

export const getPurches = wrapper(async (req: IRequest, res: Response) => {
  const { status } = req.query;
  const statuses = status ? [status] : Object.values(PurchaseStatusEnum);

  const purchase = await req.user.purchases;

  res.status(200).send(purchase.filter((p) => statuses.includes(p.status)));
});
