import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();

  if (user?.position === 'Administrativo' || user?.role === 'Administrador') {
    return true;
  }

  return router.parseUrl('/dashboard/orders');
};
