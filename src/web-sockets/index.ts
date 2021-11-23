import { Express } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { HttpError } from '../common/errors';

import { ISocket, ISocketError } from '../types';

export const registerSockets = (app: Express) => {
  const server = createServer(app);

  const io = new Server(server, {
    cors: {
      origin: `http://localhost:3030`,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket: ISocket, next) => {
    const token = socket.handshake.auth.token;
    return token?.length > 5 ? next() : socket.disconnect(true);
    // .socket._error(new HttpError());
  });

  io.on('connection', (client) => {
    client.on('login', (data) => {
      console.log(data);
      console.log(client.id);
      /* … */
    });
    client.on('disconnect', () => {
      /* … */
    });
  });
  // io.use((socket: ISocketError, next) => {
  //   return socket._error(socket);
  // });

  return server;
};
