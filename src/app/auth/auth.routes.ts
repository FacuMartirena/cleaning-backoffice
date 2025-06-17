// src/app/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { NotAuthenticatedGuard } from './guards/not-authenticated.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { AdminGuard } from './guards/admin.guard';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'landing',
        component: LandingPageComponent,
        canActivate: [NotAuthenticatedGuard],
      },
      {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [NotAuthenticatedGuard],
      },
      {
        path: 'register/:id',
        component: RegisterPageComponent,
        canActivate: [NotAuthenticatedGuard],
      },

      {
        path: 'register',
        component: RegisterPageComponent,
        canActivate: [AuthenticatedGuard, AdminGuard],
      },

      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
