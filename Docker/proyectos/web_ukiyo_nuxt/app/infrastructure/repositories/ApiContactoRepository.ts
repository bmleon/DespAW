// app/infrastructure/repositories/ApiContactoRepository.ts
import type { MensajeContacto, ContactoRepository } from '~/core/domain/contacto.model';

export class ApiContactoRepository implements ContactoRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl;
  }

  async enviarMensaje(datos: MensajeContacto): Promise<boolean> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      return response.ok;
    } catch (error) {
      console.error('❌ Error [ApiContactoRepository]:', error);
      return false;
    }
  }
}