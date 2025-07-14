import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrdersComponent } from '../../components/orders/orders.component';

@Component({
  standalone: true,
  selector: 'order-dashboard-layout',
  imports: [OrdersComponent],
  templateUrl: './order-dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDashboardLayoutComponent {}
