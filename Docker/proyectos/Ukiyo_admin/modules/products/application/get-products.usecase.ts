import type { ProductRepository } from '../domain/product.repository';
import type { Product } from '../domain/product.model';

export class GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}