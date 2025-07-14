import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AppUser } from '../../interfaces/appUser.interface';
import { FormUtils } from '../../../user-dashboard/utils/form-utils';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  hasError = signal(false);
  isPosting = signal(false);
  errorMessage = signal('');

  positions = ['Administrativo', 'Limpieza'];
  roles = ['Administrador', 'Usuario'];

  editingUserId: string | null = null;

  registerForm = this.fb.group({
    firstName: [
      '',
      [Validators.required, Validators.pattern(FormUtils.nameUtils)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.pattern(FormUtils.nameUtils)],
    ],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    ci: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
    position: ['Limpieza', Validators.required],
    role: ['Usuario', Validators.required],
    building: [
      '',
      [Validators.required, Validators.pattern(FormUtils.notOnlySpacesPattern)],
    ],
  });

  public FormUtils = FormUtils;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editingUserId = idParam;
      this.authService.getUserById(idParam).subscribe({
        next: (user) => {
          this.registerForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            ci: user.ci,
            position: user.position,
            role: user.role,
            building: user.building,
          });
        },
        error: () => this.router.navigate(['/dashboard/users']),
      });
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return;
    }

    this.isPosting.set(true);
    const form = this.registerForm.value;

    const user: AppUser = {
      firstName: form.firstName ?? '',
      lastName: form.lastName ?? '',
      email: form.email ?? '',
      password: form.password ?? '',
      ci: form.ci ?? '',
      position: form.position as 'Administrativo' | 'Limpieza',
      role: form.role as 'Administrador' | 'Usuario',
      building: form.building ?? '',
      photoUrl: 'assets/images/image-test2.png',
      active: true,
    };

    if (this.editingUserId) {
      user.id = this.editingUserId;
      const { id, ...userWithoutId } = user;

      this.authService
        .updateUser(this.editingUserId, userWithoutId)
        .pipe(finalize(() => this.isPosting.set(false)))
        .subscribe({
          next: () => this.router.navigate(['/dashboard/users']),
          error: (err) => this.handleError(err),
        });
    } else {
      this.authService
        .register(user)
        .pipe(finalize(() => this.isPosting.set(false)))
        .subscribe({
          next: () => this.router.navigate(['/dashboard/users']),
          error: (err) => this.handleError(err),
        });
    }
  }

  private handleError(err: any) {
    const msg: string =
      err?.error?.message || err?.message || 'Error desconocido';
    this.errorMessage.set(msg);

    if (typeof msg === 'string') {
      if (
        msg.toLowerCase().includes('cédula') ||
        msg.toLowerCase().includes('ci')
      ) {
        this.registerForm.controls.ci.setErrors({ ciTaken: true });
        this.registerForm.controls.ci.markAsTouched();
      }

      if (msg.toLowerCase().includes('email')) {
        this.registerForm.controls.email.setErrors({ emailTaken: true });
        this.registerForm.controls.email.markAsTouched();
      }
    }

    this.hasError.set(true);
    setTimeout(() => {
      this.hasError.set(false);
      this.errorMessage.set('');
    }, 3000);
  }
}
