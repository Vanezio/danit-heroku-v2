import { config } from 'dotenv';
import { Dictionary, keys } from 'lodash';

export enum EnvEnum {
  PORT = 'PORT',
  SECRET_KEY = 'SECRET_KEY',
  ENV = 'ENV',
}

export const EnvConfig = {
  PORT: '',
  SECRET_KEY: '',
  ENV: '',
};

export const createConfig = () => {
  config();
  keys(EnvConfig).map((k) => {
    EnvConfig[k] = process.env[k];
  });
};
