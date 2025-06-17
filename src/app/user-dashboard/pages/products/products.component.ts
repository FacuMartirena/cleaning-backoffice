import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  products: Product[] = [];
  newName = '';

  constructor(private productService: ProductService) {
    this.load();
  }

  private load() {
    this.products = this.productService.getProducts();
  }

  create() {
    if (!this.newName.trim()) return;
    this.productService.create({ name: this.newName });
    this.newName = '';
    this.load();
  }

  edit(product: Product) {
    const name = prompt('Nuevo nombre', product.name);
    if (name) {
      this.productService.update({ ...product, name });
      this.load();
    }
  }

  delete(product: Product) {
    this.productService.delete(product.id);
    this.load();
  }
}
