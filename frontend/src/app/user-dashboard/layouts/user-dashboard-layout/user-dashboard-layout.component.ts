import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SideMenuComponent } from '../../../shared/side-menu/side-menu.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard-layout',
  imports: [SideMenuComponent, RouterOutlet, CommonModule],
  templateUrl: './user-dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardLayoutComponent {
  isMobileMenuOpen = signal(false);

  toggleMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
