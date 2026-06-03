// app/infrastructure/repositories/ApiCateringRepository.ts
import type { SolicitudCatering, CateringRepository } from '~/core/domain/catering.model';

export class ApiCateringRepository implements CateringRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl;
  }

  async enviarSolicitud(datos: SolicitudCatering): Promise<boolean> {
    try {
      // 🚀 DESVÍO DE CONTINGENCIA PARA LA DEMO:
      // Conectamos directamente con Formspree en lugar de la API del backend inactiva.
      // Esto mantiene el contrato de la Arquitectura Hexagonal intacto en el frontend.
      const FORMSPREE_URL = 'https://formspree.io/f/mojzapoj';

      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Mapeamos los campos sanitizados del dominio al JSON que espera recibir Formspree
        body: JSON.stringify({
          Nombre: datos.nombre,
          Email: datos.email,
          Fecha: datos.fecha,
          Invitados: datos.invitados,
          Tipo_Evento: datos.tipoEvento,
          Detalles: datos.detalles
        })
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error [ApiCateringRepository - Contingencia Demo]:', error);
      return false;
    }
  }
}