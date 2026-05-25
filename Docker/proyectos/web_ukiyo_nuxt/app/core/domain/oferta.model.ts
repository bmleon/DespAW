// app/core/domain/oferta.model.ts

export interface Oferta {
  id: string | number;
  titulo: string;
  descripcion: string;
  descuentoTexto: string; // Ej: "15% DTO" o "2x1"
  codigoPromocional?: string; // Ej: "UKIYO15" (opcional)
  imagen: string;
  fechaFin?: string; // Para saber cuándo expira la oferta
  activa: boolean;
}

// Contrato / Puerto para leer las ofertas del Gateway
export interface OfertasRepository {
  obtenerOfertasActivas(): Promise<Oferta[]>;
}