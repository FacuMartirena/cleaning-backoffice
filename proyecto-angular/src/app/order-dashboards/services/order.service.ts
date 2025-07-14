import { Injectable } from '@angular/core';
import { Order } from '../interfaces/order.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { RawOrder } from '../interfaces/raw-order.interface';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<RawOrder[]>(this.apiUrl).pipe(
      map((raws) =>
        raws.map((o) => ({
          id: o.id,
          productId: o.product.id,
          productName: o.product.name,
          user: `${o.user.firstName} ${o.user.lastName}`,
          quantity: o.quantity,
          date: o.date,
          building: o.building,
          status: o.status,
          reason: o.reason,
        }))
      )
    );
  }

  create(order: {
    productId: string;
    quantity: number;
    building: string;
    userId: string;
  }): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order, {
      headers: this.getAuthHeaders(),
    });
  }

  finalize(id: string): Observable<Order> {
    return this.http.patch<Order>(
      `${this.apiUrl}/${id}/finalize`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  reject(id: string, reason: string): Observable<Order> {
    return this.http.patch<Order>(
      `${this.apiUrl}/${id}/reject`,
      { reason },
      { headers: this.getAuthHeaders() }
    );
  }
}
