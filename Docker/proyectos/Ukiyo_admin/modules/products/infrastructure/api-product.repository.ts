import { ofetch } from 'ofetch';
import type { ProductRepository } from '../domain/product.repository';
import type { Product } from '../domain/product.model';

export class ApiProductRepository implements ProductRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://ukiyocazorla.es'; 
  }

  // 1. Obtener todos los platos de la BD (Mapea de Español a tu interfaz Product)
  async findAll(): Promise<Product[]> {
    try {
      const data = await ofetch<any[]>(`${this.baseUrl}/api/productos`);
      
      if (!Array.isArray(data)) return [];

      // Traducimos lo que viene del Back en español al modelo oficial en inglés
      return data.map((item: any) => ({
        id: item.id ? String(item.id) : undefined,
        name: item.nombre || 'Plato sin nombre',
        description: item.descripcion || '',
        price: Number(item.precio) || 0,
        category: item.categoria || 'Sushi', // Si el back no tiene categoría, ponemos 'Sushi' por defecto
        image: item.descripcion?.startsWith('http') ? item.descripcion : undefined, // Opcional: extrae la foto si es URL
        available: item.disponible !== false
      }));
    } catch (error) {
      console.error('Error al obtener productos desde la API:', error);
      throw new Error('No se pudieron cargar los productos.');
    }
  }

  // 2. Guardar un plato nuevo (Mapea de tu interfaz Product al CreateProductoDto del back)
  async create(product: Product): Promise<Product> {
    try {
      // Creamos el JSON plano que exige estrictamente el CreateProductoDto del backend
      const bodyDto = {
        nombre: product.name,
        precio: Number(product.price),
        descripcion: product.description || 'Sin descripción',
        disponible: product.available !== false
      };

      const response = await ofetch<any>(`${this.baseUrl}/api/productos`, {
        method: 'POST',
        body: bodyDto
      });

      // Retornamos el objeto adaptado exactamente a la interfaz oficial 'Product'
      return {
        id: response?.id ? String(response.id) : undefined,
        name: response?.nombre || product.name,
        description: response?.descripcion || product.description,
        price: Number(response?.precio) || product.price,
        category: product.category || 'Sushi', // Mantenemos la categoría que seleccionó el usuario
        image: response?.descripcion?.startsWith('http') ? response.descripcion : undefined,
        available: response?.disponible !== false
      };
    } catch (error) {
      console.error('Error al crear el producto en la API:', error);
      throw new Error('No se pudo guardar el producto.');
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