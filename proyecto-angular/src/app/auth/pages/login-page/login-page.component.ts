import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';
import { AuthResponse } from '../../interfaces/authResponse.interface';
import { HttpClient } from '@angular/common/http';
import { ErrorModalComponent } from '../../../shared/error-modal/error-modal.component';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, ErrorModalComponent],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private http = inject(HttpClient);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  isErrorModalOpen = signal(false);
  router = inject(Router);
  authService = inject(AuthService);
  errorMessage = signal('');

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

    this.authService
      .login(email ?? '', password ?? '')
      .pipe(finalize(() => this.isPosting.set(false)))
      .subscribe({
        next: (resp: AuthResponse) => {
          this.router.navigate(['/dashboard', 'products'], {
            replaceUrl: true,
          });
        },
        error: (err) => {
          console.log('Login error:', err); // ⬅️ Agregá esto

          const backendMsg = err?.error?.message;

          if (typeof backendMsg === 'string') {
            if (backendMsg.toLowerCase().includes('inactivo')) {
              this.errorMessage.set(
                'Tu usuario está inactivo. Contacta al administrador.'
              );
            } else if (backendMsg.toLowerCase().includes('credenciales')) {
              this.errorMessage.set(
                'Credenciales inválidas. Revisa tu email y contraseña.'
              );
            } else {
              this.errorMessage.set(backendMsg);
            }
          } else {
            this.errorMessage.set(
              'Error al iniciar sesión. Intenta nuevamente.'
            );
          }

          this.isErrorModalOpen.set(true);
          this.hasError.set(true);
          setTimeout(() => this.hasError.set(false), 2000);
        },
      });
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  closeErrorModal() {
    this.isErrorModalOpen.set(false);
    this.errorMessage.set('');
  }
}
