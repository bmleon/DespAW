import type { OrderRepository } from '../domain/order.repository';
import type { Order } from '../domain/order.model';

export class GetOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(): Promise<Order[]> {
    // Aquí la lógica de negocio ordena los pedidos para que los más nuevos salgan primero
    const orders = await this.orderRepository.findAll();
    return orders.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA; // Orden descendente (más recientes arriba)
    });
  }
}