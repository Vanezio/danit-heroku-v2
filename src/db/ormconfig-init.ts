import path from 'path';
import { promises } from 'fs';
import { config } from 'dotenv';
import { EnvConfig } from '../config';

const init = async () => {
  config();

  const extend = `./${EnvConfig.ENV === 'PROD' ? 'dist' : 'src'}/db`;

  const opt = {
    type: 'postgres',
    url: EnvConfig.DATABASE_URL,
    entities: [`${extend}/entities/*.entity{.ts,.js}`],
    migrations: [`${extend}/migrations/*{.ts,.js}`],
    cli: {
      migrationsDir: `./src/db/migrations`,
    },
    synchronize: true,
  };

  await promises.writeFile(
    path.resolve('ormconfig.json'),
    JSON.stringify(opt, null, 4)
  );
};

init().then(() => console.log('ormconfig created'));
