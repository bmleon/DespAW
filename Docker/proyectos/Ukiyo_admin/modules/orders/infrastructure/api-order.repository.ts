import { ofetch } from 'ofetch';
import type { OrderRepository } from '../domain/order.repository';
import type { Order } from '../domain/order.model';

export class ApiOrderRepository implements OrderRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://ukiyocazorla.es';
  }

  async findAll(): Promise<Order[]> {
    try {
      const data = await ofetch<Order[]>(`${this.baseUrl}/api/orders`);
      return data;
    } catch (error) {
      console.error('Error al obtener los pedidos desde la API:', error);
      throw new Error('No se pudo cargar la lista de pedidos.');
    }
  }
}