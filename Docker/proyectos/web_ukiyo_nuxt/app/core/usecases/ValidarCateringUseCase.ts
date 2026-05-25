// app/core/usecases/ValidarCateringUseCase.ts
import { SecurityService } from './security';
import type { SolicitudCatering } from '~/core/domain/catering.model';

export class ValidarCateringUseCase {
  /**
   * Ejecuta el control de ciberseguridad. 
   * Si pasa, devuelve el objeto totalmente limpio; si no, devuelve null.
   */
  static procesar(datos: SolicitudCatering): SolicitudCatering | null {
    // 1. Validaciones de estructura crítica
    if (!datos.nombre || datos.nombre.trim().length < 3) return null;
    if (!SecurityService.esEmailValido(datos.email)) return null;
    if (!SecurityService.validarInvitados(datos.invitados)) return null;
    if (!datos.fecha) return null;

    // 2. Proceso de Sanitización activa (Ciberseguridad)
    return {
      nombre: SecurityService.sanitizarTexto(datos.nombre),
      email: datos.email.trim().toLowerCase(),
      fecha: datos.fecha,
      invitados: datos.invitados,
      tipoEvento: datos.tipoEvento,
      detalles: datos.detalles ? SecurityService.sanitizarTexto(datos.detalles) : ''
    };
  }
}