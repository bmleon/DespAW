// app/core/domain/pedido.model.ts

export interface LineaPedido {
  platoId: string | number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Pedido {
  id?: string | number;
  clienteId?: string | number;
  items: LineaPedido[];
  total: number;
  fecha?: string;
  estado?: 'pendiente' | 'cocinando' | 'en_camino' | 'entregado';
}

// Contrato / Puerto para procesar el pago o envío del pedido
export interface PedidoRepository {
  crearPedido(pedido: Pedido): Promise<boolean>;
}