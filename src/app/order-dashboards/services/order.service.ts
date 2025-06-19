import { Injectable } from '@angular/core';
import { Order } from '../interfaces/order.interface.ts/order.interface';
import { OrderStatus } from '../interfaces/order-status.interface';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly ORDERS_KEY = 'orders';

  constructor() {}

  getOrders(): Order[] {
    return JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
  }

  saveOrders(orders: Order[]): void {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }

  finalize(id: number) {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx !== -1) {
      orders[idx].status = OrderStatus.completed;
      this.saveOrders(orders);
    }
  }

  reject(id: number, reason: string) {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx !== -1) {
      orders[idx].status = OrderStatus.rejected;
      orders[idx].reason = reason;
      this.saveOrders(orders);
    }
  }

  create(order: Omit<Order, 'id' | 'date' | 'status'>): void {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      date: new Date().toISOString(),
      status: OrderStatus.pendent,
    };
    orders.push(newOrder);
    this.saveOrders(orders);
  }
}
