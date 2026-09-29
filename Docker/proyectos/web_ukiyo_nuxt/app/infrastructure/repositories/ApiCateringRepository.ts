// app/infrastructure/repositories/ApiCateringRepository.ts
import type { SolicitudCatering, CateringRepository } from '~/core/domain/catering.model';

export class ApiCateringRepository implements CateringRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBase as string;
  }

  // Diccionario para traducir los valores técnicos del <select> a texto legible
  private nombresEventos: Record<string, string> = {
    corporate: 'Evento Corporativo',
    wedding: 'Boda / Comunión',
    birthday: 'Fiesta Privada'
  };

  async enviarSolicitud(datos: SolicitudCatering): Promise<boolean> {
    try {
      const apiBase = this.getBaseUrl();
      const tipoEventoTexto = this.nombresEventos[datos.tipoEvento] || datos.tipoEvento;

      // El backend no tiene un campo separado para "tipo de evento", así que lo incluimos
      // como parte del texto de detalles, junto a lo que haya escrito el cliente
      const detallesCompletos = [
        `Tipo de evento: ${tipoEventoTexto}`,
        datos.detalles ? `Detalles: ${datos.detalles}` : null
      ].filter(Boolean).join('. ');

      const body = {
        clienteNombre: datos.nombre,
        clienteTelefono: datos.telefono,
        clienteEmail: datos.email,
        fechaEvento: new Date(datos.fecha).toISOString(),
        numeroComensales: datos.invitados,
        detallesEvento: detallesCompletos
        // presupuestoEstimado y detalles (platos) se dejan sin enviar:
        // el restaurante los completa más adelante al cotizar el evento
      };

      await $fetch(`${apiBase}/pedidos/catering`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      return true;
    } catch (error) {
      console.error('❌ Error al enviar la solicitud de catering:', error);
      return false;
    }
  }
}