// app/infrastructure/repositories/ApiPedidoRepository.ts
import type { Pedido, PedidoRepository } from '~/core/domain/pedido.model';

export class ApiPedidoRepository implements PedidoRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl;
  }

  async crearPedido(pedido: Pedido): Promise<boolean> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Nota de Ciberseguridad futura: Aquí inyectaremos el Token JWT del usuario cuando lo configuremos
        },
        body: JSON.stringify(pedido)
      });
      return response.ok;
    } catch (error) {
      console.error('❌ Error [ApiPedidoRepository]:', error);
      return false;
    }
  }
}