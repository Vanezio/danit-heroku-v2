import cors from "cors";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { registerRouters } from "./api";
import { EnvConfig } from "./config";
import { registerSockets } from "./web-sockets";
const app = express();

app.use(cors());
createConnection().then(() => {
  app.get("/ww", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  registerRouters(app);

  express();

  const server = registerSockets(app);

  server.listen(EnvConfig.PORT, () => console.log(`Started on port ${EnvConfig.PORT}`));
  console.log("Connected to DB!");
});
