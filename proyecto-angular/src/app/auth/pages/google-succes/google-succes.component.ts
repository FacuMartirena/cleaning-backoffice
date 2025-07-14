import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { AppUser } from '../../../auth/interfaces/appUser.interface';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorModalComponent } from '../../../shared/error-modal/error-modal.component';

@Component({
  selector: 'app-google-success',
  templateUrl: './google-succes.component.html',
  imports: [ErrorModalComponent],
})
export class GoogleSuccessComponent implements OnInit {
  isModalOpen = signal(false);
  errorMessage = signal('');
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const error = params['error'];

      if (error) {
        this.errorMessage.set(decodeURIComponent(error));
        this.isModalOpen.set(true);
        return;
      }

      if (token) {
        localStorage.setItem('token', token);

        this.http
          .get<AppUser>(`${environment.apiUrl}/auth/current-user`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .subscribe({
            next: (user) => {
              localStorage.setItem('authUser', JSON.stringify(user));
              this.router.navigate(['/dashboard/orders']);
            },
            error: () => {
              this.router.navigate(['/auth/login']);
            },
          });
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.router.navigate(['/auth/login']);
  }
}
