import type { ProductRepository } from '../domain/product.repository';
import type { Product } from '../domain/product.model';

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(product: Product): Promise<Product> {
    if (product.price <= 0) {
      throw new Error('El precio del plato debe ser mayor que 0.');
    }
    if (!product.name.trim()) {
      throw new Error('El nombre del plato no puede estar vacío.');
    }
    return await this.productRepository.create(product);
  }
}