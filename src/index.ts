import 'reflect-metadata';

import express, { Request, Response } from 'express';

import { registerRouters } from './api';
import { createConfig, EnvConfig } from './config';
// import { initConnection } from './db/ormconfig-init';

createConfig();

const app = express();

app.get('/', async (req: Request, res: Response) => {
  res.send(`Im alive! ${EnvConfig.PORT}`);
});

registerRouters(app);

initConnection().then(() => {
  app.listen(EnvConfig.PORT, () =>
    console.log(`Started on port ${EnvConfig.PORT}`)
  );
  console.log('Connected to DB!');
});
