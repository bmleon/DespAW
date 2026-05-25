// app/infrastructure/repositories/ApiMenuRepository.ts
import type { Plato, MenuRepository } from '~/core/domain/plato.model';

export class ApiMenuRepository implements MenuRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl;
  }

  async obtenerCarta(): Promise<Plato[]> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/menu`);
      if (!response.ok) throw new Error('Error al obtener la carta');
      return await response.json();
    } catch (error) {
      console.error('❌ Error [ApiMenuRepository]:', error);
      return []; // Devolvemos un array vacío como estrategia de seguridad si falla el back
    }
  }
}