// src/app/auth/guards/admin.guard.ts
import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const AdminGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();

  if (user?.role === 'Administrador') {
    return true;
  }

  // Si no es admin, lo redirigimos a orders y no dejamos pasar
  return router.parseUrl('/dashboard/orders');
};
