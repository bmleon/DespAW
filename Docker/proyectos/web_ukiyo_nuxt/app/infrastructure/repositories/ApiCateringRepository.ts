// app/infrastructure/repositories/ApiCateringRepository.ts
import type { SolicitudCatering, CateringRepository } from '~/core/domain/catering.model';

export class ApiCateringRepository implements CateringRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl;
  }

  async enviarSolicitud(datos: SolicitudCatering): Promise<boolean> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/catering`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      return response.ok;
    } catch (error) {
      console.error('❌ Error [ApiCateringRepository]:', error);
      return false;
    }
  }
}