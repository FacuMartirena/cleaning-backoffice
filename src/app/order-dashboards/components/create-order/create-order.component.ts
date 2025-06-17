import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService } from '../../services/order.service';
import { ProductService } from '../../../user-dashboard/services/product.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-order',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderComponent {
  fb = inject(FormBuilder);
  ordersService = inject(OrdersService);
  productService = inject(ProductService);
  authService = inject(AuthService);
  router = inject(Router);

  products = this.productService.getProducts();
  user = this.authService.user();

  orderForm = this.fb.group({
    productId: [null, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  onSubmit() {
    if (this.orderForm.invalid) return;

    const product = this.products.find(
      (p) => p.id === Number(this.orderForm.value.productId!)
    );
    if (!product) return;

    this.ordersService.create({
      productId: product.id,
      productName: product.name,
      quantity: this.orderForm.value.quantity!,
      user: this.user.name + ' ' + this.user.surname,
      building: this.user.building,
    });

    this.router.navigateByUrl('/dashboard/orders');
  }
  goBack() {
    this.router.navigateByUrl('/dashboard/orders');
  }
}
