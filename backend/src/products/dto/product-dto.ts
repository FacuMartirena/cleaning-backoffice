import { Products } from '../entities/product.entity';

export class ProductDto {
  id: string;
  name: string;

  constructor(entity: Products) {
    this.id = entity.id;
    this.name = entity.name;
  }
}
