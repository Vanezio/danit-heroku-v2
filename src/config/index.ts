import { config } from 'dotenv';
import { Dictionary, keys } from 'lodash';

export enum EnvEnum {
  PORT = 'PORT',
  SECRET_KEY = 'SECRET_KEY',
  ENV = 'ENV',
  DATABASE_URL = 'DATABASE_URL',
  HEROKU_URL = 'HEROKU_URL',
}

export let EnvConfig: Record<keyof typeof EnvEnum, any> = undefined;

const initEnv = () => {
  config();
  const env = keys(EnvEnum).reduce(
    (acc, k) => ({ ...acc, [k]: process.env[k] }),
    {}
  );

  return env as Record<keyof typeof EnvEnum, any>;
};

if (!EnvConfig) {
  EnvConfig = initEnv();
}
