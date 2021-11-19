import { verify } from 'jsonwebtoken';
import path from 'path';
import { promises } from 'fs';
import { config } from 'dotenv';

const init = async () => {
  config();

  const extend = process.env.ENV === 'PROD' ? '.js' : '.ts';

  const opt = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [`entities/*.entity${extend}`],
    migrations: [`migrations/*${extend}`],
    cli: {
      migrationsDir: `.src/db/migrations`,
    },
  };

  await promises.writeFile(
    path.resolve('ormconfig.json'),
    JSON.stringify(opt, null, 4)
  );
};

init().then(() => console.log('ormconfig created'));
