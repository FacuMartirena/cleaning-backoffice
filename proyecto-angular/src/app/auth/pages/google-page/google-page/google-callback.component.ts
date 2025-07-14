// src/app/auth/pages/google-page/google-page/google-callback.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorModalComponent } from '../../../../shared/error-modal/error-modal.component';

@Component({
  selector: 'app-google-callback',
  templateUrl: './google-callback.component.html',
  imports: [ErrorModalComponent],
})
export class GoogleCallbackComponent implements OnInit {
  isModalOpen = signal(false);
  errorMessage = signal('');

  constructor(private route: ActivatedRoute, private router: Router) {}

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

        const redirectUrl =
          localStorage.getItem('redirectAfterLogin') || '/dashboard/orders';
        localStorage.removeItem('redirectAfterLogin');

        this.router.navigateByUrl(redirectUrl);
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
