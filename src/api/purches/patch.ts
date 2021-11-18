import { Request, Response } from 'express';
import { PurchaseEntity } from '../../db/entities/purchase.entity';
import { HttpError, wrapper } from '../../tools/wrapper.helpers';
import { PurchaseStatusEnum } from '../../enums/purchase-status.enum';
import { ItemEntity } from '../../db/entities/item.entity';
import { IEntityRequest } from '../../types';

export const patchPurchases = wrapper(
  async (req: IEntityRequest<PurchaseEntity>, res: Response) => {
    const { status } = req.body;

    if (!status) {
      throw new HttpError('Please, provide status to change');
    }

    const availableStatuses = Object.values(PurchaseStatusEnum);

    if (!availableStatuses.includes(status)) {
      throw new HttpError(
        `Please, provide valid status to change. Status have to be one of the next: ${availableStatuses.join(
          ', '
        )}`
      );
    }

    const purchase = req.entity;

    if (purchase.customerId !== req.user.id) {
      throw new HttpError('Go fuck yourself');
    }

    if (purchase.status === PurchaseStatusEnum.CANCELLED) {
      throw new HttpError(
        'Cannot change status of cancelled order. Please create new.'
      );
    }

    if (status === PurchaseStatusEnum.CANCELLED) {
      const item = await purchase.item;
      item.quantity += purchase.itemQuantity;
      await item.save();
    }

    purchase.status = status;
    await purchase.save();

    return res
      .status(200)
      .send(`Purchase #${purchase.id} status has been changed to ${status}`);
  }
);
