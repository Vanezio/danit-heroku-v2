import { assign } from 'lodash';

export class BaseRequest {
  constructor(data: BaseRequest) {
    assign(this, data);
  }
}
