import { assign, keys, omit, pick } from 'lodash';
import { UserEntity } from '../../../db/entities/user.entity';
import { AccountResponse } from './account.response';

export class WhoamiResponse extends AccountResponse {
  balance: number;
  constructor(data?: UserEntity) {
    super(data);
    if (data) {
      this.balance = data.balance;
    }
  }
}
