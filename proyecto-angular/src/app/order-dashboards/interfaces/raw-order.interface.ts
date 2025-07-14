import { OrderStatus } from './order-status.interface';

export interface RawOrder {
  id: string;
  product: { id: number; name: string };
  user: { firstName: string; lastName: string };
  quantity: number;
  date: string;
  building: string;
  status: OrderStatus;
  reason?: string;
}
