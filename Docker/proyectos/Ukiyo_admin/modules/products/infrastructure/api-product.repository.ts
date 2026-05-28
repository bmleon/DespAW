import { ofetch } from 'ofetch';
import type { ProductRepository } from '../domain/product.repository';
import type { Product } from '../domain/product.model';

export class ApiProductRepository implements ProductRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://ukiyocazorla.es'; 
  }

  // 1. Obtener todos los platos de la BD
  async findAll(): Promise<Product[]> {
    try {
      // Corregido: de 'products' a 'productos'
      const data = await ofetch<Product[]>(`${this.baseUrl}/api/productos`);
      return data;
    } catch (error) {
      console.error('Error al obtener productos desde la API:', error);
      throw new Error('No se pudieron cargar los productos.');
    }
  }

  // 2. Guardar un plato nuevo
  async create(product: Product): Promise<Product> {
    try {
      // Corregido: de 'products' a 'productos'
      const newProduct = await ofetch<Product>(`${this.baseUrl}/api/productos`, {
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
      // Corregido: de 'products' a 'productos'
      await ofetch(`${this.baseUrl}/api/productos/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error al borrar el producto en la API:', error);
      throw new Error('No se pudo eliminar el producto.');
    }
  }
}