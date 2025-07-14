import { Injectable, computed, signal } from '@angular/core';
import { AppUser } from '../interfaces/appUser.interface';
import { AuthResponse } from '../interfaces/authResponse.interface';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly AUTH_KEY = 'authUser';
  private apiUrl = `${environment.apiUrl}`;
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<AppUser | null>(null);

  authStatus = computed(() => this._authStatus());
  user = computed(() => this._user()!);
  isCleaner = computed(() => this.user()?.position === 'Limpieza');

  constructor(private http: HttpClient) {
    this.checkStatus().subscribe();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(({ token, user }) => {
          localStorage.setItem('token', token);
          localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
          this._user.set(user);
          this._authStatus.set('authenticated');
        })
      );
  }

  refreshToken(): Observable<string> {
    const token = localStorage.getItem('token');
    return this.http
      .get<{ token: string }>(`${this.apiUrl}/auth/refresh-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap(({ token }) => {
          localStorage.setItem('token', token);
        }),
        map(({ token }) => token)
      );
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  register(newUser: AppUser): Observable<AuthResponse> {
    return this.http.post<AppUser>(`${this.apiUrl}/users`, newUser).pipe(
      map((createdUser) => ({
        token: 'fake-jwt-token',
        user: createdUser,
      }))
    );
  }

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: string): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: string, user: AppUser): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.apiUrl}/users/${id}`, user);
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem(this.AUTH_KEY);

    if (!token || !stored) {
      this.logout(false);
      return of(false);
    }

    return this.refreshToken().pipe(
      tap(() => {
        const user = JSON.parse(stored);
        this._user.set(user);
        this._authStatus.set('authenticated');
      }),
      map(() => true),

      catchError(() => {
        this.logout(false);
        return of(false);
      })
    );
  }

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

  logout(redirect = true): void {
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem('token');
    if (redirect) {
      window.location.href = `${this.apiUrl}/auth/logout`;
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadUserFromBackend(): void {
    fetch(`${this.apiUrl}/auth/current-user`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((user) => {
        if (user) {
          localStorage.setItem('authUser', JSON.stringify(user));
          localStorage.setItem('token', 'google-jwt-token');
          this._user.set(user);
          this._authStatus.set('authenticated');
        } else {
          this._authStatus.set('not-authenticated');
        }
      })
      .catch(() => {
        this._authStatus.set('not-authenticated');
      });
  }
}
