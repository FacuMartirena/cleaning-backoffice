import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { AppUser } from '../../auth/interfaces/appUser.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.apiUrl);
  }

  updateStatus(id: string, active: boolean): Observable<void> {
    const endpoint = `${this.apiUrl}/${id}/${
      active ? 'activate' : 'deactivate'
    }`;
    return this.http.put<void>(endpoint, {});
  }

  deleteMany(ids: string[]) {
    const token = localStorage.getItem('token');

    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/users/delete-many',
      { ids },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
