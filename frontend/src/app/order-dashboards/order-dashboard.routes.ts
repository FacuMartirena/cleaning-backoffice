import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDashboardLayoutComponent } from './layout/order-dashboard-layout/order-dashboard-layout.component';

const routes: Routes = [{ path: '', component: OrderDashboardLayoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderDashboardsRoutingModule {}
