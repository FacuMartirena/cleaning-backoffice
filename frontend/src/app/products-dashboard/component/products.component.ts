import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../interfaces/product.interface';
import { ProductService } from '../services/product.service';
import { ErrorModalComponent } from '../../shared/error-modal/error-modal.component';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [CommonModule, FormsModule, ErrorModalComponent],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  productToDelete: Product | null = null;
  newName = '';
  errorMessage = '';
  selectedProduct: Product | null = null;
  showConfirmButtons = false;
  isCreateModalOpen = false;
  isErrorModalOpen = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading products', err),
    });
  }

  openCreateModal() {
    this.newName = '';
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  create() {
    if (!this.newName.trim()) return;

    this.productService.create({ name: this.newName }).subscribe({
      next: () => {
        this.loadProducts();
        this.closeCreateModal();
      },
    });
  }

  openModal(product: Product) {
    this.selectedProduct = { ...product };
  }
  saveEdit() {
    if (!this.selectedProduct) return;

    this.productService.update(this.selectedProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.selectedProduct = null;
      },
      error: (err) => console.error('Error al actualizar producto:', err),
    });
  }

  cancelEdit() {
    this.selectedProduct = null;
  }

  askDelete(product: Product) {
    this.productService.hasOrders(product.id).subscribe({
      next: (hasOrders) => {
        if (hasOrders) {
          this.productToDelete = product;
          this.errorMessage = `El producto "${product.name}" está asociado a una o más órdenes. Si lo eliminás, también se eliminarán todas las órdenes relacionadas. ¿Deseás continuar?`;
          this.showConfirmButtons = true;
          this.isErrorModalOpen = true;
          this.cdr.detectChanges();
        } else {
          this.productService.delete(product.id).subscribe(() => {
            this.loadProducts();
          });
        }
      },
    });
  }

  confirmDelete() {
    if (!this.productToDelete) return;

    this.productService.delete(this.productToDelete.id).subscribe({
      next: () => {
        this.loadProducts();
        this.closeErrorModal();
      },
      error: () => {
        this.closeErrorModal();
        this.cdr.detectChanges();
      },
    });
  }

  showErrorModal(msg: string) {
    this.errorMessage = msg;
    this.showConfirmButtons = false;
    this.isErrorModalOpen = true;
    this.cdr.detectChanges();
  }

  closeErrorModal() {
    this.isErrorModalOpen = false;
    this.errorMessage = '';
    this.productToDelete = null;
    this.showConfirmButtons = false;
  }
}
