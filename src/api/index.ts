import fileUpload, { UploadedFile } from 'express-fileupload';
import { HttpError } from './../tools/wrapper.helpers';
import { Express, json, Request, Response } from 'express';
import authRouter from './auth';
import { authMiddleware } from './auth/auth.middleware';
import { IRequest } from '../types';
import itemsRouter from './items';
import purchasesRouter from './purches';
import { omit } from 'lodash';
import accountsRouter from './accounts/route';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swag.json';

export const registerRouters = (app: Express) => {
  app.use(json());
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/auth', authRouter);

  const filesPath = path.join(__dirname, '../db/files/');
  app.use(fileUpload());

  app.post('/upload', async (req, res) => {
    const file = req.files.test as UploadedFile;

    await file.mv(filesPath + file.name);

    return res.send('Success');
  });

  app.get('/download/:name', async (req, res) => {
    const file = `${filesPath}${req.params.name}`;
    return res.download(file);
  });

  app.use('/', authMiddleware);
  app.use('/whoami', (req: IRequest, res: Response) => {
    return res.send(req.user);
  });

  app.use('/purchases', purchasesRouter);
  app.use('/items', itemsRouter);
  app.use('/accounts', accountsRouter);

  app.use('/', (err: HttpError, req, res, next) => {
    res.status(err?.statusCode || 400).send(omit(err, 'statusCode'));
  });
};
