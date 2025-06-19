import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import {
  UserCharge,
  UserRole,
} from '../../auth/interfaces/user-enum.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'side-menu',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './side-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  authService = inject(AuthService);
  router = inject(Router);
  user = computed(() => this.authService.user());

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth', 'login'], { replaceUrl: true });
  }

  ngOnInit(): void {
    this.authService.checkStatusResource.reload();
  }

  isCleaner(): boolean {
    return this.authService.user()?.charge === UserCharge.Limpieza;
  }

  canViewSensitiveSections(): boolean {
    const user = this.authService.user();
    return (
      user?.charge === UserCharge.Administrativo ||
      user?.role === UserRole.Administrador
    );
  }

  constructor() {
    console.log(this.user());
  }
}
