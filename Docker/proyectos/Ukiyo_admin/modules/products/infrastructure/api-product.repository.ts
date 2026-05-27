import { ofetch } from 'ofetch';
import type { ProductRepository } from '../domain/product.repository';
import type { Product } from '../domain/product.model';
export class ApiProductRepository implements ProductRepository {
  private baseUrl: string;

  constructor() {
    // Si da error useRuntimeConfig, usamos process.env o la URL directa de producción por defecto
    this.baseUrl = 'https://tienda.ukiyocazorla.es'; 
  }

  // 1. Obtener todos los platos de la BD
  async findAll(): Promise<Product[]> {
    try {
      const data = await ofetch<Product[]>(`${this.baseUrl}/api/products`);
      return data;
    } catch (error) {
      console.error('Error al obtener productos desde la API:', error);
      throw new Error('No se pudieron cargar los productos.');
    }
  }

  // 2. Guardar un plato nuevo
  async create(product: Product): Promise<Product> {
    try {
      const newProduct = await ofetch<Product>(`${this.baseUrl}/api/products`, {
        method: 'POST',
        body: product
      });
      return newProduct;
    } catch (error) {
      console.error('Error al crear el producto en la API:', error);
      throw new Error('No se pudo guardar el producto.');
    }
  }

  // 3. Borrar un plato
  async delete(id: string): Promise<void> {
    try {
      await ofetch(`${this.baseUrl}/api/products/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error al borrar el producto en la API:', error);
      throw new Error('No se pudo eliminar el producto.');
    }
  }
}