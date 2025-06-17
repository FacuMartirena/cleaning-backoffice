import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  ActivatedRoute,
  RouterModule,
  UrlSegment,
} from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { AppUser } from '../../../auth/interfaces/appUser.interface';

@Component({
  standalone: true,
  selector: 'app-users',
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterModule], // ← aquí FormsModule
})
export class UsersComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  users: AppUser[] = [];
  selected: AppUser[] = [];
  searchText = '';
  isInactiveTab = false;

  constructor() {
    this.route.url.subscribe((segments: UrlSegment[]) => {
      this.isInactiveTab = segments.some((s) => s.path === 'inactivos');
      this.loadUsers();
    });
    this.loadUsers();
  }

  /** Carga los usuarios desde LocalStorage */
  private loadUsers() {
    this.users = this.authService.getUsers();
  }

  /** Filtra según activo/inactivo y texto de búsqueda */
  filteredUsers(): AppUser[] {
    return this.users
      .filter((u) => u.active !== this.isInactiveTab)
      .filter((u) =>
        `${u.name} ${u.surname}`
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
  }

  toggleSelection(user: AppUser): void {
    const idx = this.selected.findIndex((u) => u.id === user.id);
    idx > -1 ? this.selected.splice(idx, 1) : this.selected.push(user);
  }

  isSelected(user: AppUser): boolean {
    return this.selected.some((u) => u.id === user.id);
  }

  toggleAll(event: Event): void {
    if ((event.target as HTMLInputElement).checked) {
      this.selected = [...this.filteredUsers()];
    } else {
      this.selected = [];
    }
  }

  clearSelection(): void {
    this.selected = [];
  }

  onCreate(): void {
    this.router.navigate(['/auth', 'register'], { replaceUrl: true });
  }

  edit(user: AppUser): void {
    this.router.navigate(['/auth', 'register', user.id]);
  }

  delete(user: AppUser): void {
    const users = this.authService.getUsers();

    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index].active = false;
      this.authService.saveUsers(users);
      this.clearSelection();
      this.loadUsers();
    }
  }

  restore(user: AppUser): void {
    const users = this.authService.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index].active = true;
      this.authService.saveUsers(users);
      this.clearSelection();
      this.loadUsers();
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/image-test2.png';
  }
}
