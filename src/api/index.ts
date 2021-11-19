import { Express, json, Response } from 'express';

import { files } from '../tools/files';
import { swagger } from '../tools/swagger.helpers';
import { IRequest } from '../types';
import { HttpError } from './../tools/wrapper.helpers';
import accountsRouter from './accounts/route';
import authRouter from './auth';
import { authMiddleware } from './auth/auth.middleware';
import itemsRouter from './items';
import purchasesRouter from './purches';

export const registerRouters = (app: Express) => {
  app.use(json());
  app.use(swagger());

  app.use('/auth', authRouter);

  app.use(files());

  app.use('/', authMiddleware);

  app.use('/whoami', (req: IRequest, res: Response) => {
    return res.send(req.user);
  });

  app.use('/purchases', purchasesRouter);
  app.use('/items', itemsRouter);
  app.use('/accounts', accountsRouter);

  app.use('/', (err: HttpError, req, res, next) => {
    return res.status(err?.statusCode || 400).send(err);
  });
};
