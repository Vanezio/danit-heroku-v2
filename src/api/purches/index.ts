import { Router } from 'express';
import { getPurches } from './get';
import { postPurchases } from './post';
import { deletePurches } from './delete';
import { patchPurchases } from './patch';
import { PurchaseEntity } from '../../db/entities/purchase.entity';
import {
  checkEntityId,
  PatchPurchaseRequest,
  validationMiddleware,
} from '../../tools/wrapper.helpers';
import { PostPurchaseRequest } from './requests/post-item.request';

const router = Router();

router.get('/', getPurches);
router.post('/', validationMiddleware(PostPurchaseRequest), postPurchases);
router.delete('/', deletePurches);
router.patch(
  '/:id',
  checkEntityId(PurchaseEntity),
  validationMiddleware(PatchPurchaseRequest),
  patchPurchases
);

export default router;
