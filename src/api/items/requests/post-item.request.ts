import { IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator';
import { BaseRequest } from '../../../common/base.request';

export const MIN_ITEM_PRICE = 1;

export class PostItemRequest extends BaseRequest {
  @IsNumber()
  @Min(MIN_ITEM_PRICE)
  price: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(0)
  quantity: number;
}
