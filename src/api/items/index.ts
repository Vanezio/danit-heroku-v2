import { Router } from 'express';
import { validationMiddleware } from '../../tools/wrapper.helpers';
import { getItems } from './get';
import { postItems } from './post';
import { PostItemRequest } from './requests/post-item.request';

const router = Router();

router.post('/', validationMiddleware(PostItemRequest), postItems);
router.get('/', getItems);

export default router;
