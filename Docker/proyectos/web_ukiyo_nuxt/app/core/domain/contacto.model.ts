// app/core/domain/contacto.model.ts

export interface MensajeContacto {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

export interface ContactoRepository {
  enviarMensaje(datos: MensajeContacto): Promise<boolean>;
}