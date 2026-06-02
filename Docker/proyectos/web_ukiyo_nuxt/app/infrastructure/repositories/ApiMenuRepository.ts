// app/infrastructure/repositories/ApiMenuRepository.ts
import type { Plato, MenuRepository } from '~/core/domain/plato.model';

export class ApiMenuRepository implements MenuRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl || 'https://ukiyocazorla.es/api';
  }

  async obtenerCarta(): Promise<Plato[]> {
    try {
      // Atacamos al endpoint correcto donde está el Edamame
      const response = await fetch(`${this.getBaseUrl()}/productos`);
      
      if (!response.ok) throw new Error('Error al obtener la carta desde el servidor');
      
      const data = await response.json();

      if (!Array.isArray(data)) return [];

      // Mapeamos el JSON en español al formato que vuestra interfaz Plato (en inglés) necesita
      return data.map((item: any) => ({
        id: item.id ? String(item.id) : '',
        name: item.nombre || 'Plato sin nombre',
        price: Number(item.precio) || 0,
        description: item.descripcion || 'Sin descripción',
        category: item.categoria || 'entrantes',
        available: item.disponible !== false
      })) as unknown as Plato[];

    } catch (error) {
      console.error('❌ Error [ApiMenuRepository]:', error);
      return [];
    }
  }
}