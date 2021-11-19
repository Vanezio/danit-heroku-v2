import { Router } from 'express';
import { getUserAccount, getOwnAccount } from './get';

import {
  checkEntityId,
  validationMiddleware,
} from '../../tools/wrapper.helpers';
import { PurchaseEntity } from '../../db/entities/purchase.entity';
import { UserEntity } from '../../db/entities/user.entity';

const router = Router();

router.get('/:id', checkEntityId(UserEntity), getUserAccount);

router.get('/whoami', getOwnAccount);

export default router;
