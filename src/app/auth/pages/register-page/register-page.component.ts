// src/app/auth/pages/register-page/register-page.component.ts
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

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent implements OnInit {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  editingUserId: number | null = null;

  registerForm = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    ci: ['', Validators.required],
    charge: ['Limpieza', Validators.required],
    role: ['Usuario', Validators.required],
    building: ['', Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      const user = this.authService.getUsers().find((u) => u.id === id);
      if (user) {
        this.registerForm.patchValue(user);
        this.editingUserId = user.id;
      } else {
        this.router.navigate(['/dashboard/users']);
      }
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return;
    }

    this.isPosting.set(true);
    const form = this.registerForm.value;
    const existingUser = this.editingUserId
      ? this.authService.getUsers().find((u) => u.id === this.editingUserId)
      : null;

    const user: AppUser = {
      id: this.editingUserId ?? Date.now(),
      name: form.name ?? '',
      surname: form.surname ?? '',
      email: form.email ?? '',
      password: form.password ?? '',
      ci: form.ci ?? '',
      charge: (form.charge ?? 'Limpieza') as 'Limpieza' | 'Administrativo',
      role: (form.role ?? 'Usuario') as 'Usuario' | 'Administrador',
      building: form.building ?? '',
      photoUrl: existingUser?.photoUrl ?? 'assets/images/image-test2.png',
      active: existingUser?.active ?? true,
    };

    if (this.editingUserId) {
      const users = this.authService.getUsers();
      const index = users.findIndex((u) => u.id === this.editingUserId);
      if (index !== -1) {
        users[index] = user;
        this.authService.saveUsers(users);
      }
      this.router.navigate(['/dashboard/users']);
      this.isPosting.set(false);
    } else {
      this.authService
        .register(user)
        .pipe(finalize(() => this.isPosting.set(false)))
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard/users']);
          },
          error: () => {
            this.hasError.set(true);
            setTimeout(() => this.hasError.set(false), 2000);
          },
        });
    }
  }
}
