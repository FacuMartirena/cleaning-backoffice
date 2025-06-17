// src/app/order-dashboards/order-dashboards-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDashboardLayoutComponent } from './layout/order-dashboard-layout/order-dashboard-layout.component';

const routes: Routes = [
  // Al entrar a /order-dashboards, carga tu layout (que incluye la lista)
  { path: '', component: OrderDashboardLayoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderDashboardsRoutingModule {}
