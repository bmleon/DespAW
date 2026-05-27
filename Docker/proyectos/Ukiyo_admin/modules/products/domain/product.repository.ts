import type { Product } from './product.model';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}