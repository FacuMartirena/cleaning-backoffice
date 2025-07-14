import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    const user = this.authService.user();

    if (!user?.id) {
      return of(this.router.parseUrl('/auth/login'));
    }

    return this.authService.getUserById(user.id).pipe(
      map((refreshedUser) => {
        if (!refreshedUser.active) {
          alert('Tu cuenta está inactiva.');
          this.authService.logout();
          return this.router.parseUrl('/auth/login');
        }
        return true;
      }),
      catchError(() => {
        this.authService.logout();
        return of(this.router.parseUrl('/auth/login'));
      })
    );
  }
}
