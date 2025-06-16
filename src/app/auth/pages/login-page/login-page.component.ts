import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs';
import { AuthResponse } from '../../interfaces/authResponse.interface';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);
  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], //usar expresion regular del proyecto de forms
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return;
    }

    const { email, password } = this.loginForm.value;

    // Arrancamos el spinner
    this.isPosting.set(true);

    this.authService
      .login(email ?? '', password ?? '') // Observable<AuthResponse>
      .pipe(finalize(() => this.isPosting.set(false)))
      .subscribe({
        next: (resp: AuthResponse) => {
          this.router.navigate(['/dashboard', 'orders'], { replaceUrl: true });
        },
        error: () => {
          // Credenciales inválidas o fallo en el guard
          this.hasError.set(true);
          setTimeout(() => this.hasError.set(false), 2000);
        },
      });
  }

  loginWithGoogle() {
    alert('Funcionalidad simulada: Google login');
  }
}
