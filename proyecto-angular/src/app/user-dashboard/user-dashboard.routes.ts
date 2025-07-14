import { Routes } from '@angular/router';
import { UserDashboardLayoutComponent } from './layouts/user-dashboard-layout/user-dashboard-layout.component';
import { UsersComponent } from './components/users/users.component';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ProductsComponent } from '../products-dashboard/component/products.component';
import { OrderDashboardLayoutComponent } from '../order-dashboards/layout/order-dashboard-layout/order-dashboard-layout.component';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { RegisterPageComponent } from '../auth/pages/register-page/register-page.component';

export const userDashboardRoutes: Routes = [
  {
    path: '',
    component: UserDashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      {
        path: 'edit/:id',
        component: RegisterPageComponent,
        canActivate: [AuthenticatedGuard, AdminGuard],
      },
      { path: 'orders', component: OrderDashboardLayoutComponent },
      {
        path: 'products',
        component: ProductsComponent,
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
