import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly PRODUCTS_KEY = 'products';

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    if (!this.getProducts().length) {
      this.saveProducts([
        { name: 'Aerosol desinfectante', id: 1 },
        { name: 'Limpiador liquido', id: 2 },
      ]);
    }
  }

  getProducts(): Product[] {
    return JSON.parse(localStorage.getItem(this.PRODUCTS_KEY) || '[]');
  }

  saveProducts(products: Product[]): void {
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
  }

  create(product: Omit<Product, 'id'>) {
    const products = this.getProducts();
    const maxId = products.length ? Math.max(...products.map((p) => p.id)) : 0;

    const newProduct: Product = {
      ...product,
      id: maxId + 1,
    };

    products.push(newProduct);
    this.saveProducts(products);
  }

  update(product: Product) {
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.id === product.id);
    if (idx !== -1) {
      products[idx] = product;
      this.saveProducts(products);
    }
  }

  delete(id: number) {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);
  }
}
