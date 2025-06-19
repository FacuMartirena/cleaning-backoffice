import { OrderStatus } from '../order-status.interface';

export interface Order {
  id: number;
  productId: number;
  productName: string;
  user: string;
  quantity: number;
  date: string;
  building: string;
  status: OrderStatus;
  reason?: string;
}
