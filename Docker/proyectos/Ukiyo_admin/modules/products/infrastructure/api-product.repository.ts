// modules/products/infrastructure/api-product.repository.ts
import { ofetch } from 'ofetch';
import type { ProductRepository } from '../domain/product.repository';
import type { Product } from '../domain/product.model';

export class ApiProductRepository implements ProductRepository {
  // Ruta base tomada de la configuración runtime (apiBase), no hardcodeada
  private get baseUrl(): string {
    return useRuntimeConfig().public.apiBase as string;
  }

  private getToken(): string | null {
    return useCookie('auth_token').value || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  }

  // 1. Obtener todos los platos de la BD (Mapea de Español al modelo Product)
  async findAll(): Promise<Product[]> {
    try {
      const data = await ofetch<any[]>(`${this.baseUrl}/carta/platos`);

      if (!Array.isArray(data)) return [];

      return data.map((item: any) => ({
        id: item.id ? String(item.id) : undefined,
        name: item.nombre || 'Plato sin nombre',
        description: item.descripcion || '',
        price: Number(item.precio) || 0,
        category: item.categorias?.nombre || 'Sin categoría',
        available: item.disponible !== false
      }));
    } catch (error) {
      console.error('Error al obtener los platos desde la API:', error);
      throw new Error('No se pudieron cargar los platos.');
    }
  }

  // 2. Guardar un plato nuevo
  // ⚠️ IMPORTANTE: "category" aquí debe ser el ID numérico de la categoría (categoriaId),
  // no el nombre en texto. Este repositorio no resuelve ese ID: quien llame a create()
  // debe pasar ya el categoriaId correcto en product.category (como string numérico) o
  // adaptar el tipo Product para incluir un campo categoriaId numérico explícito.
  async create(product: Product): Promise<Product> {
    try {
      const bodyDto = {
        nombre: product.name.trim(),
        precio: Number(product.price),
        categoriaId: Number(product.category),
        descripcion: product.description || `Exquisito plato de ${product.name.trim()} al estilo Ukiyo.`,
        disponible: product.available !== false
      };

      console.log('🚀 Repositorio enviando DTO al backend:', bodyDto);

      const response = await ofetch<any>(`${this.baseUrl}/carta/platos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: bodyDto
      });

      return {
        id: response?.id ? String(response.id) : undefined,
        name: response?.nombre || product.name,
        description: response?.descripcion || product.description,
        price: Number(response?.precio) || product.price,
        category: response?.categorias?.nombre || product.category,
        available: response?.disponible !== false
      };
    } catch (error: any) {
      console.error('Error al crear el plato en la API:', error);
      throw error;
    }
  }

  // 3. Borrar un plato
  async delete(id: string): Promise<void> {
    try {
      await ofetch(`${this.baseUrl}/carta/platos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
    } catch (error) {
      console.error('Error al borrar el plato en la API:', error);
      throw new Error('No se pudo eliminar el plato.');
    }
  }
}