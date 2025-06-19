// src/app/order-dashboards/components/order-actions-menu/order-actions-menu.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../interfaces/order.interface.ts/order.interface';
import { OrderStatus } from '../../interfaces/order-status.interface';

@Component({
  standalone: true,
  selector: 'order-actions-menu',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-action.component.html',
})
export class OrderActionsMenuComponent {
  orderStatus = OrderStatus;
  @Input() order!: Order;

  @Output() finalize = new EventEmitter<Order>();
  @Output() reject = new EventEmitter<{ order: Order; reason: string }>();

  showModal = false;
  rejecting = false;
  reason = '';

  openMenu() {
    this.showModal = true;
    this.rejecting = false;
    this.reason = '';
  }

  closeMenu() {
    this.showModal = false;
    this.reason = '';
    this.rejecting = false;
  }

  onFinalize() {
    this.finalize.emit(this.order);
    this.closeMenu();
  }

  beginReject() {
    this.rejecting = true;
  }

  confirmReject() {
    if (this.reason.trim()) {
      this.reject.emit({ order: this.order, reason: this.reason });
      this.closeMenu();
    }
  }
}
