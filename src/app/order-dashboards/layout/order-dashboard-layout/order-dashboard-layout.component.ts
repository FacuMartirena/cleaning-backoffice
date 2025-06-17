import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrdersComponent } from '../../components/orders/orders.component';

@Component({
  selector: 'order-dashboard-layout',
  imports: [OrdersComponent],
  templateUrl: './order-dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDashboardLayoutComponent {}
