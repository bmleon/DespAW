// modules/products/infrastructure/api-product.repository.ts
import { ofetch } from 'ofetch';
import type { ProductRepository } from '../domain/product.repository';
import type { Product } from '../domain/product.model';

export class ApiProductRepository implements ProductRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://ukiyocazorla.es'; 
  }

  // 1. Obtener todos los platos de la BD (Mapea de Español al modelo Product)
  async findAll(): Promise<Product[]> {
    try {
      const data = await ofetch<any[]>(`${this.baseUrl}/api/productos`);
      
      if (!Array.isArray(data)) return [];

      return data.map((item: any) => ({
        id: item.id ? String(item.id) : undefined,
        name: item.nombre || 'Plato sin nombre',
        description: item.descripcion || '',
        price: Number(item.precio) || 0,
        category: item.categoria || 'entrantes', 
        available: item.disponible !== false
      }));
    } catch (error) {
      console.error('Error al obtener productos desde la API:', error);
      throw new Error('No se pudieron cargar los productos.');
    }
  }

  // 2. Guardar un plato nuevo adaptado al DTO en español de tu compañero
  async create(product: Product): Promise<Product> {
    try {
      const bodyDto = {
        nombre: product.name.trim(),
        precio: Number(product.price),
        categoria: product.category.toUpperCase().trim(), // Forzado en mayúsculas para cumplir el DTO
        descripcion: product.description || `Exquisito plato de ${product.name.trim()} al estilo Ukiyo.`,
        disponible: product.available !== false
      };

      console.log('🚀 Repositorio enviando DTO oficial al clúster:', bodyDto);

      const response = await ofetch<any>(`${this.baseUrl}/api/productos`, {
        method: 'POST',
        body: bodyDto
      });

      return {
        id: response?.id ? String(response.id) : undefined,
        name: response?.nombre || product.name,
        description: response?.descripcion || product.description,
        price: Number(response?.precio) || product.price,
        category: response?.categoria || product.category, 
        available: response?.disponible !== false
      };
    } catch (error: any) {
      console.error('Error al crear el producto en la API:', error);
      throw error;
    }
  }

  // 3. Borrar un plato
  async delete(id: string): Promise<void> {
    try {
      await ofetch(`${this.baseUrl}/api/productos/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error al borrar el producto en la API:', error);
      throw new Error('No se pudo eliminar el producto.');
    }
  }
}