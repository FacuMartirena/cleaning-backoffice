// src/app/user-dashboard/user-dashboard.routes.ts
import { Routes } from '@angular/router';
import { UserDashboardLayoutComponent } from './layouts/user-dashboard-layout/user-dashboard-layout.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProductsComponent } from './pages/products/products.component';
import { UsersComponent } from './pages/users/users.component';
import { AdminGuard } from '../auth/guards/admin.guard';

export const userDashboardRoutes: Routes = [
  {
    path: '',
    component: UserDashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', component: OrdersComponent },
      { path: 'products', component: ProductsComponent },
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
