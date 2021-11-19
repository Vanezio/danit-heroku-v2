import { validateOrReject } from 'class-validator';
import { Request, Response } from 'express';
import { BaseEntity } from 'typeorm';

import { BaseRequest } from '../common/base.request';
import { HttpValidationError } from '../common/errors';
import { IEntityRequest, IRequest } from '../types';

export function wrapper(func: Function) {
  return async function (req: Request, res: Response, next: Function) {
    try {
      await func.apply(this, [req, res, next]);
    } catch (err) {
      next(err);
    }
  };
}

export const checkEntityId = <T extends typeof BaseEntity>(entity: T) => {
  return async (
    req: IEntityRequest<BaseEntity>,
    res: Response,
    next: Function
  ) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send('Invalid item id provided');
    }

    const findedEntity = await entity.findOne(id);

    if (!findedEntity) {
      // return new HttpError("Invalid item id provided", 404);
      // TODO create wrapper for middleware and cover it
      return res.status(404).send('Invalid item id provided');
    }

    req.entity = findedEntity;
    next();
  };
};

export const validationMiddleware = <T extends typeof BaseRequest>(entity: T) =>
  wrapper(async (req: IRequest, res: Response, next) => {
    const body = req.body as unknown as T;
    const newEntity = new entity(body);

    await validateOrReject(newEntity).catch((errs) => {
      throw new HttpValidationError(errs);
    });

    next();
  });
