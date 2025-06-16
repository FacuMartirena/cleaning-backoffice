// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { userDashboardRoutes } from './user-dashboard/user-dashboard.routes';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { AdminGuard } from './auth/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
  },
  {
    path: 'dashboard',
    canActivate: [AuthenticatedGuard],
    children: userDashboardRoutes,
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full' },
];
