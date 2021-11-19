import path from 'path';
import { readFileSync, writeFile } from 'fs';
import express, { Request, Response } from 'express';
import { EnvConfig } from '../config';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

export const swagger = (routePath = '/api/docs') => {
  const router = Router();

  const swaggerJSON = readFileSync(path.resolve('swag1.json'), 'utf-8');

  const swaggerObject = JSON.parse(swaggerJSON);

  swaggerObject.servers = [
    { url: `http://localhost:${EnvConfig.PORT}` },
    { url: EnvConfig.HEROKU_URL },
  ];

  router.get('/', async (req: Request, res: Response) => {
    res.redirect(routePath);
  });

  router.use(routePath, swaggerUi.serve, swaggerUi.setup(swaggerObject));

  console.log('swagger setup');

  return router;
};
