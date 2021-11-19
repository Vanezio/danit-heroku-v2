import { IsEnum, IsInt } from 'class-validator';

import { BaseRequest } from '../../../common/base.request';
import { PurchaseStatusEnum } from '../../../enums/purchase-status.enum';

export class PatchPurchaseRequest extends BaseRequest {
  @IsEnum([PurchaseStatusEnum.CANCELLED, PurchaseStatusEnum.FULFILLED])
  status: PurchaseStatusEnum;
}
