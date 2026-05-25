// app/core/usecases/security.ts

export class SecurityService {
  /**
   * Limpia los textos (Sanitize) para evitar ataques de inyección de código (XSS)
   */
  static sanitizarTexto(texto: string): string {
    if (!texto) return '';
    return texto
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Elimina scripts inyectados
      .replace(/([*`_~[\]()#+\-.!])/g, '') // Filtra caracteres que puedan romper bases de datos NoSQL/SQL o Markdown
      .replace(/</g, '&lt;') // Convierte aperturas de etiquetas HTML
      .replace(/>/g, '&gt;'); // Convierte cierres de etiquetas HTML
  }

  /**
   * Valida estructuras de correos de forma estricta
   */
  static esEmailValido(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Previene fraudes asegurando que no se manden cantidades de invitados negativas o absurdas
   */
  static validarInvitados(cantidad: number): boolean {
    return Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= 1000;
  }
}