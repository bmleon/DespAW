import type { Order } from './order.model';

export interface OrderRepository {
  findAll(): Promise<Order[]>;
}