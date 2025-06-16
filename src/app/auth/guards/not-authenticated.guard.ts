// src/app/auth/guards/not-authenticated.guard.ts
import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

export const NotAuthenticatedGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth
    .checkStatus()
    .pipe(
      map((isLoggedIn) =>
        isLoggedIn ? router.parseUrl('/dashboard/orders') : true
      )
    );
};
