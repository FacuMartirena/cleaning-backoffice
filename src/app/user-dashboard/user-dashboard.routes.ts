// src/app/user-dashboard/user-dashboard.routes.ts
import { Routes } from '@angular/router';
import { UserDashboardLayoutComponent } from './layouts/user-dashboard-layout/user-dashboard-layout.component';
//  ← Importa aquí tu nuevo OrderListComponent
import { UsersComponent } from './components/users/users.component';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ProductsComponent } from './pages/products/products.component';
import { OrdersComponent } from '../order-dashboards/components/orders/orders.component';
import { OrderDashboardLayoutComponent } from '../order-dashboards/layout/order-dashboard-layout/order-dashboard-layout.component';

export const userDashboardRoutes: Routes = [
  {
    path: '',
    component: UserDashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', component: OrderDashboardLayoutComponent },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'orders/create',
        loadComponent: () =>
          import(
            '../order-dashboards/components/create-order/create-order.component'
          ).then((m) => m.CreateOrderComponent),
        canActivate: [AdminGuard],
      },

      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'users/inactivos',
        component: UsersComponent,
        canActivate: [AdminGuard],
      },
      { path: '**', redirectTo: 'orders', pathMatch: 'full' },
    ],
  },
];
