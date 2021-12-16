import { config } from "dotenv";
import { keys } from "lodash";
import { TEnvConfig } from "types";

export enum EnvEnum {
  PORT = "PORT",
  SECRET_KEY = "SECRET_KEY",
  ENV = "ENV",
  DATABASE_URL = "DATABASE_URL",
  HEROKU_URL = "HEROKU_URL",
  SOCKET_PORT = "SOCKET_PORT",
}

export let EnvConfig = null as unknown as TEnvConfig;

const initEnv = () => {
  config();
  const env = keys(EnvEnum).reduce((acc, k) => ({ ...acc, [k]: process.env[k] }), {});

  return env as Record<keyof typeof EnvEnum, any>;
};

if (!EnvConfig) {
  EnvConfig = initEnv();
}
