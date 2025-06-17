import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../interfaces/order.interface.ts/order.interface';
import { OrdersService } from '../../services/order.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'orders-component',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
})
export class OrdersComponent {
  private router = inject(Router);

  orders: Order[] = [];

  constructor(private ordersService: OrdersService) {
    this.load();
  }

  private load() {
    this.orders = this.ordersService.getOrders();
  }

  onCreate(): void {
    this.router.navigate(['/dashboard/orders/create'], { replaceUrl: true });
  }

  finalize(order: Order) {
    this.ordersService.finalize(order.id);
    this.load();
  }

  reject(order: Order) {
    const reason = prompt('Motivo de rechazo');
    if (reason) {
      this.ordersService.reject(order.id, reason);
      this.load();
    }
  }
}
