import { Column, Entity, ManyToOne } from 'typeorm';
import { PurchaseStatusEnum } from '../../enums/purchase-status.enum';
import { Base } from './base.entity';
import { ItemEntity } from './item.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'purchases' })
export class PurchaseEntity extends Base {
  @Column({
    type: 'enum',
    enum: PurchaseStatusEnum,
    default: PurchaseStatusEnum.PENDING,
  })
  public status: PurchaseStatusEnum;

  @Column()
  public itemId: number;

  @Column()
  public customerId: number;

  @Column({
    default: 1,
  })
  public itemQuantity: number;

  @ManyToOne(() => ItemEntity)
  public item: Promise<ItemEntity>;

  @ManyToOne(() => UserEntity)
  public customer: UserEntity;
}
