// src/app/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { AppUser } from '../interfaces/appUser.interface';
import { AuthResponse } from '../interfaces/authResponse.interface';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { UserCharge } from '../interfaces/user-enum.interface';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly AUTH_KEY = 'authUser';

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<AppUser | null>(null);

  authStatus = computed(() => this._authStatus());
  user = computed(() => this._user()!);
  isCleaner = computed(() => this.user()?.charge === UserCharge.Limpieza);

  constructor() {
    this.seedDefaultUser();
    this.checkStatus().subscribe();
  }

  private seedDefaultUser() {
    const users = this.getUsers();
    if (!users.length) {
      const defaultUser: AppUser = {
        id: 1,
        name: 'Facundo',
        surname: 'Martirena',
        email: 'admin@globaluy.com',
        password: 'Globo1234',
        ci: '12345678',
        charge: 1,
        role: 1,
        building: 'Torre 1',
        active: true,
        photoUrl: 'assets/images/users/1.jpg',
      };
      this.saveUsers([defaultUser]);
    }
  }

  getUsers(): AppUser[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  saveUsers(users: AppUser[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const user = this.getUsers().find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      return throwError(() => new Error('Credenciales inválidas')).pipe(
        delay(300)
      );
    }
    const token = 'fake-jwt-token';
    return of({ token, user }).pipe(
      delay(300),
      tap(() => {
        this._user.set(user);
        this._authStatus.set('authenticated');
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
        localStorage.setItem('token', token);
      })
    );
  }

  register(newUser: AppUser): Observable<AuthResponse> {
    const exists = this.getUsers().some((u) => u.email === newUser.email);
    if (exists) {
      return throwError(() => new Error('El email ya está en uso')).pipe(
        delay(300)
      );
    }

    const completeUser: AppUser = {
      ...newUser,
      id: Date.now(),
      active: true,
      photoUrl: newUser.photoUrl || 'assets/images/image-test2.png',
    };

    const token = 'fake-jwt-token';
    return of({ token, user: completeUser }).pipe(
      delay(300),
      tap(({ user }) => {
        const users = this.getUsers();
        users.push(user);
        this.saveUsers(users);
      })
    );
  }

  checkStatus(): Observable<boolean> {
    const stored = localStorage.getItem(this.AUTH_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      this._user.set(user);
      this._authStatus.set('authenticated');
      return of(true);
    } else {
      this._user.set(null);
      this._authStatus.set('not-authenticated');
      return of(false);
    }
  }

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(), // ya implementado
  });

  logout(): void {
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem('token');
  }
}
