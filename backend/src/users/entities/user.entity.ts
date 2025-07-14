import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Orders } from '../../orders/entities/order.entity';
import { UserRole } from './user-role.enum';
import { UserPosition } from './user-position.enum';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  ci: string;

  @Column({ type: 'enum', enum: UserPosition })
  position: UserPosition;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  building: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  photoUrl: string;

  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];
}
