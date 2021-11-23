import { Router } from 'express';

import { UserEntity } from '../../db/entities/user.entity';
import { checkEntityId } from '../../tools/wrapper.helpers';
import { getOwnAccount, getUserAccount } from './get';

const router = Router();

router.get('/whoami', getOwnAccount);
router.get('/:id', checkEntityId(UserEntity), getUserAccount);

export default router;
