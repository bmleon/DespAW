// app/infrastructure/repositories/ApiMenuRepository.ts
import type { Plato, MenuRepository } from '~/core/domain/plato.model';

export class ApiMenuRepository implements MenuRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl || 'https://ukiyocazorla.es/api';
  }

  async obtenerCarta(): Promise<Plato[]> {
    try {
      // Atacamos al endpoint correcto donde se guardan los productos
      const response = await fetch(`${this.getBaseUrl()}/productos`);
      
      if (!response.ok) throw new Error('Error al obtener la carta desde el servidor');
      
      const data = await response.json();

      if (!Array.isArray(data)) return [];

      // Mapeamos duplicando los campos en español e inglés para que
      // sea 100% compatible con lo que pida vuestro HTML (.toFixed)
      return data.map((item: any) => {
        const precioNumerico = Number(item.precio) || 0;
        
        return {
          id: item.id ? String(item.id) : '',
          nombre: item.nombre || 'Plato sin nombre',
          name: item.nombre || 'Plato sin nombre',
          
          precio: precioNumerico,
          price: precioNumerico,
          
          descripcion: item.descripcion || 'Sin descripción',
          description: item.descripcion || 'Sin descripción',
          
          categoria: item.categoria || 'entrantes',
          category: item.categoria || 'entrantes',
          
          disponible: item.disponible !== false,
          available: item.disponible !== false
        };
      }) as unknown as Plato[];

    } catch (error) {
      console.error('❌ Error [ApiMenuRepository]:', error);
      return [];
    }
  }
}
// Este repositorio se encarga de obtener la carta desde el endpoint de productos