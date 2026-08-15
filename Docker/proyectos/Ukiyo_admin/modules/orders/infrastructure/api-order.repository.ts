// modules/orders/infrastructure/api-order.repository.ts
import { ofetch } from 'ofetch';
import type { OrderRepository } from '../domain/order.repository';
import type { Order } from '../domain/order.model';

export class ApiOrderRepository implements OrderRepository {
  // Ruta base tomada de la configuración runtime (apiBase), no hardcodeada
  private get baseUrl(): string {
    return useRuntimeConfig().public.apiBase as string;
  }

  private getToken(): string | null {
    return useCookie('auth_token').value || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  }

  // GET /pedidos está protegido con @Roles('ADMIN'), así que hace falta el token
  async findAll(): Promise<Order[]> {
    try {
      const data = await ofetch<Order[]>(`${this.baseUrl}/pedidos`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      return data;
    } catch (error) {
      console.error('Error al obtener los pedidos desde la API:', error);
      // MODIFICACIÓN CRUCIAL: Comentamos el throw y devolvemos un array vacío.
      // Así, si da error 400, el Dashboard index no se colapsa y puede cargar tus 4 usuarios.
      // throw new Error('No se pudo cargar la lista de pedidos.');
      return [];
    }
  }
}