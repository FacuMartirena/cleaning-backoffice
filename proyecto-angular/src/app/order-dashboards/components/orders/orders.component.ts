import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../products-dashboard/interfaces/product.interface';
import { ProductService } from '../../../products-dashboard/services/product.service';
import { Order } from '../../interfaces/order.interface';
import { OrdersService } from '../../services/order.service';
import { OrderStatus } from '../../interfaces/order-status.interface';
import { OrderStatusPipe } from '../../pipes/order-status.pipe';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { AppUser } from '../../../auth/interfaces/appUser.interface';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, OrderStatusPipe],
  templateUrl: './orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  products: Product[] = [];
  orderForm!: FormGroup;
  isCreateModalOpen = false;
  isRejectModalOpen = false;
  selectedOrder: Order | null = null;
  currentUser: AppUser | null = null;
  rejectReason = '';

  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.user();
    this.orderForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
    this.load();
  }

  load(): void {
    this.ordersService.getOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.cdr.markForCheck();
      },
    });

    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.cdr.markForCheck();
      },
    });
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.orderForm.reset();
  }

  onSubmit(): void {
    if (this.orderForm.invalid) return;

    const { productId, quantity } = this.orderForm.value;
    const user = JSON.parse(localStorage.getItem('authUser') || '{}');

    if (!user || !user.id) return;

    this.ordersService
      .create({
        productId,
        quantity,
        userId: user.id,
        building: user.building,
      })
      .subscribe({
        next: () => {
          this.load();
          this.closeCreateModal();
          error: (err) =>
            alert(`Error creando orden: ${err.error.message || err.message}`);
        },
      });
  }

  finalize(orderId: string): void {
    this.ordersService.finalize(orderId).subscribe({
      next: () => this.load(),
      error: (err) => console.error('Error finalizando orden:', err),
    });
  }

  openRejectModal(orderId: string): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return;
    this.selectedOrder = order;
    this.rejectReason = '';
    this.isRejectModalOpen = true;
  }

  closeRejectModal(): void {
    this.selectedOrder = null;
    this.isRejectModalOpen = false;
  }

  reject(): void {
    if (!this.rejectReason.trim() || !this.selectedOrder) return;

    this.ordersService
      .reject(this.selectedOrder.id, this.rejectReason)
      .subscribe(() => {
        this.load();
        this.closeRejectModal();
      });
  }

  get OrderStatus() {
    return OrderStatus;
  }
}
