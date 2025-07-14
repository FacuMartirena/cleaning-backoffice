import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderStatus } from './order.enum';
import { Products } from '../../products/entities/product.entity';
import { Users } from '../../users/entities/user.entity';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column()
  building: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.pendent })
  status: OrderStatus;

  @Column({ nullable: true })
  reason?: string;

  @ManyToOne(() => Products, (product) => product.orders, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Products;

  @ManyToOne(() => Users, (user) => user.orders, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
