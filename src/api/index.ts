import { Express, json } from 'express';
import { Request, Response } from 'express';

import { HttpError } from '../common/errors';
import { files } from '../tools/files';
import { swagger } from '../tools/swagger';
import accountsRouter from './accounts/route';
import authRouter from './auth';
import { authMiddleware } from './auth/auth.middleware';
import itemsRouter from './items';
import purchasesRouter from './purches';

export const registerRouters = (app: Express) => {
  app.use(json());
  app.use(swagger());

  app.get('/', async (req: Request, res: Response) =>
    res.redirect('/api/docs')
  );

  app.use('/auth', authRouter);

  app.use(files());

  app.use(authMiddleware);

  app.use('/purchases', purchasesRouter);
  app.use('/items', itemsRouter);
  app.use('/accounts', accountsRouter);

  app.use('/', (err: HttpError, req, res, next) => {
    return res.status(err?.statusCode || 400).send(err);
  });

  return app;
};
