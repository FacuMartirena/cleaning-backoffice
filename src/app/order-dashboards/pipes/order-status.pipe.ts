// src/app/pipes/order-status.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../interfaces/order-status.interface';

@Pipe({
  name: 'orderStatus',
  standalone: true,
})
export class OrderStatusPipe implements PipeTransform {
  transform(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.pendent:
        return 'Pendiente';
      case OrderStatus.completed:
        return 'Completado';
      case OrderStatus.rejected:
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  }
}
