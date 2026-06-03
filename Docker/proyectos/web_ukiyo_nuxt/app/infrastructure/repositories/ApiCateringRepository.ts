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
      const FORMSPREE_URL = 'https://formspree.io/f/mojzapoj';

      // Diccionario para traducir los valores técnicos del <select> a texto elegante para el email
      const nombresEventos: Record<string, string> = {
        corporate: 'Evento Corporativo',
        wedding: 'Boda / Comunión',
        birthday: 'Fiesta Privada'
      };

      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Mapeamos los campos sanitizados traduciendo el tipo de evento en tiempo de envío
        body: JSON.stringify({
          Nombre: datos.nombre,
          Email: datos.email,
          Fecha: datos.fecha,
          Invitados: datos.invitados,
          Tipo_Evento: nombresEventos[datos.tipoEvento] || datos.tipoEvento, // ◄ ¡Traducción automática!
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