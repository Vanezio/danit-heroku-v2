import { createConnection } from 'typeorm';
import { ItemEntity } from './entities/item.entity';
import { PurchaseEntity } from './entities/purchase.entity';
import { UserEntity } from './entities/user.entity';
import { config } from 'dotenv';

export const initConnection = async () => {
  config();
  await createConnection({
    url: process.env.DATABASE_URL,
    type: 'postgres',
    entities: [UserEntity, ItemEntity, PurchaseEntity],
  });
};
