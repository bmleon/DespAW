// app/infrastructure/repositories/ApiOfertasRepository.ts
import type { Oferta, OfertasRepository } from '~/core/domain/oferta.model';

export class ApiOfertasRepository implements OfertasRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl;
  }

  async obtenerOfertasActivas(): Promise<Oferta[]> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/offers`);
      if (!response.ok) throw new Error('Error al obtener las ofertas');
      return await response.json();
    } catch (error) {
      console.error('❌ Error [ApiOfertasRepository]:', error);
      return [];
    }
  }
}