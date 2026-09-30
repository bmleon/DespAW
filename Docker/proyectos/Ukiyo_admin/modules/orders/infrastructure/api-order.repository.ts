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
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('user_session');
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      return session?.token || null;
    } catch {
      return null;
    }
  }

  // El backend tiene 5 estados de seguimiento; el dominio de este panel solo
  // distingue 3, así que agrupamos: todo lo que no esté entregado ni cancelado
  // cuenta como "pending" (en curso).
  private mapEstado(estadoBackend: string | null | undefined): Order['status'] {
    if (estadoBackend === 'ENTREGADO') return 'completed';
    if (estadoBackend === 'CANCELADO') return 'cancelled';
    return 'pending';
  }

  private mapPedidoADomain(p: any): Order {
    return {
      id: String(p.id),
      customer: p.cliente_nombre || 'Cliente Web',
      total: Number(p.total) || 0,
      status: this.mapEstado(p.estado_pedido),
      created_at: p.creado_en
    };
  }

  // GET /pedidos está protegido con @Roles('ADMIN'), así que hace falta el token
  async findAll(): Promise<Order[]> {
    try {
      const data = await ofetch<any[]>(`${this.baseUrl}/pedidos`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      return Array.isArray(data) ? data.map(p => this.mapPedidoADomain(p)) : [];
    } catch (error) {
      console.error('Error al obtener los pedidos desde la API:', error);
      return [];
    }
  }
}