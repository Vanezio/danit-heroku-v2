import 'reflect-metadata';

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { createConnection } from 'typeorm';

import { registerRouters } from './api';
import { EnvConfig } from './config';
import { registerSockets } from './web-sockets';

const app = express();

createConnection().then(() => {
  registerRouters(app);
  const server = registerSockets(app);

  server.listen(EnvConfig.PORT, () =>
    console.log(`Started on port ${EnvConfig.PORT}`)
  );
  // io.listen(3030);
  console.log('Connected to DB!');
});
