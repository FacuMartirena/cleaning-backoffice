import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { userDashboardRoutes } from './user-dashboard/user-dashboard.routes';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { LandingPageComponent } from './auth/pages/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'auth',
    children: authRoutes,
  },
  {
    path: 'dashboard',
    canActivate: [AuthenticatedGuard],
    children: userDashboardRoutes,
  },
  { path: '**', redirectTo: 'auth/landing', pathMatch: 'full' },
];
