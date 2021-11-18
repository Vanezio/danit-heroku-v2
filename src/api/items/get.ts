import { Request, Response } from 'express';
import { wrapper } from '../../tools/wrapper.helpers';
import { IRequest } from '../../types';

export const getItems = wrapper(async (req: IRequest, res: Response) => {
  const i2 = await req.user.items;

  return res.send(i2);
});
