import {
  Component,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  ActivatedRoute,
  RouterModule,
  UrlSegment,
} from '@angular/router';
import { AppUser } from '../../../auth/interfaces/appUser.interface';
import { UserRolePipe } from '../../pipes/user-enum.pipe';
import { UserService } from '../../service/users.service';

@Component({
  standalone: true,
  selector: 'app-users',
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterModule, UserRolePipe],
})
export class UsersComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  users: AppUser[] = [];
  selected: AppUser[] = [];
  searchText = '';
  isInactiveTab = false;

  constructor() {
    this.route.url.subscribe((segments: UrlSegment[]) => {
      this.isInactiveTab = segments.some((s) => s.path === 'inactivos');
      this.loadUsers();
    });
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.cdr.markForCheck();
      },
      error: () => {
        this.users = [];
        this.cdr.markForCheck();
      },
    });
  }

  filteredUsers(): AppUser[] {
    return this.users
      .filter((u) => !!u.active === !this.isInactiveTab)
      .filter((u) =>
        `${u.firstName} ${u.lastName}`
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
    const userIds = this.selected.map((user) => user.id);
    this.userService.deleteMany(userIds).subscribe({
      next: () => {
        this.users = this.users.filter((user) => !userIds.includes(user.id));
        this.selected = [];
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al eliminar usuarios:', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/auth', 'register'], { replaceUrl: true });
  }

  edit(user: AppUser): void {
    this.router.navigate(['/dashboard', 'edit', user.id]);
  }

  delete(user: AppUser): void {
    this.userService.updateStatus(user.id, false).subscribe(() => {
      this.clearSelection();
      this.loadUsers();
    });
  }

  restore(user: AppUser): void {
    this.userService.updateStatus(user.id, true).subscribe(() => {
      this.clearSelection();
      this.loadUsers();
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/image-test2.png';
  }
}
