import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../interfaces/order.interface.ts/order.interface';
import { OrdersService } from '../../services/order.service';
import { Router } from '@angular/router';
import { OrderActionsMenuComponent } from '../order-action/order-action.component';
import { OrderStatus } from '../../interfaces/order-status.interface';
import { OrderStatusPipe } from '../../pipes/order-status.pipe';
import { AuthService } from '../../../auth/services/auth.service';
import {
  UserCharge,
  UserRole,
} from '../../../auth/interfaces/user-enum.interface';

@Component({
  standalone: true,
  selector: 'orders-component',
  imports: [CommonModule, OrderActionsMenuComponent, OrderStatusPipe],
  templateUrl: './orders.component.html',
})
export class OrdersComponent {
  private router = inject(Router);
  authService = inject(AuthService);
  OrderStatus = OrderStatus;

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

  reject(order: Order, reason: string) {
    this.ordersService.reject(order.id, reason);
    this.load();
  }

  canViewSensitiveSections(): boolean {
    const user = this.authService.user();
    return (
      user?.charge === UserCharge.Administrativo ||
      user?.role === UserRole.Administrador
    );
  }
}
