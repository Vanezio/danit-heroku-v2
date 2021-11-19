import path from 'path';
import { readFileSync, writeFile } from 'fs';
import { config } from 'dotenv';
import { EnvConfig } from '../config';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

export const swagger = (routePath = '/api/docs') => {
  const router = Router();

  const swaggerJSON = readFileSync(path.resolve('swag.json'), 'utf-8');

  router.use(
    routePath,
    swaggerUi.serve,
    swaggerUi.setup(JSON.parse(swaggerJSON))
  );

  console.log('swagger setup');

  return router;
};

console.log(path.resolve(`src/db/files`));
console.log(path.resolve('dist'));
