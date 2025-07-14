import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { NotAuthenticatedGuard } from './guards/not-authenticated.guard';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { GoogleCallbackComponent } from './pages/google-page/google-page/google-callback.component';
import { GoogleSuccessComponent } from './pages/google-succes/google-succes.component';

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
        path: 'logout',
        component: LoginPageComponent,
        canActivate: [NotAuthenticatedGuard],
      },
      {
        path: 'register',
        component: RegisterPageComponent,
      },
      {
        path: 'google-succes',
        component: GoogleSuccessComponent,
      },
      {
        path: 'callback',
        component: GoogleCallbackComponent,
      },

      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
