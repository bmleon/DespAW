// app/core/domain/catering.model.ts

export interface SolicitudCatering {
  nombre: string;
  email: string;
  fecha: string;
  invitados: number;
  tipoEvento: string;
  detalles?: string;
}

// Contrato / Puerto para el envío de formularios
export interface CateringRepository {
  enviarSolicitud(datos: SolicitudCatering): Promise<boolean>;
}