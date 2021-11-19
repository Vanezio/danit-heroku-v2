import { IsInt } from 'class-validator';

import { BaseRequest } from '../../../common/base.request';

export const MIN_ITEM_PRICE = 1;

export class PostPurchaseRequest extends BaseRequest {
  @IsInt()
  itemId: number;

  @IsInt()
  count: number;
}
