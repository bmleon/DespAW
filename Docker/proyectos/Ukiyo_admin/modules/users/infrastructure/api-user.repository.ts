import { ofetch } from 'ofetch';
import type { UserRepository } from '../domain/user.repository';
import type { User } from '../domain/user.model';

export class ApiUserRepository implements UserRepository {
  private baseUrl = 'https://ukiyocazorla.es/api/usuarios';

  // 1. Obtener usuarios (Mapea de Español a la interfaz User en Inglés)
  async findAll(): Promise<User[]> {
    try {
      const data = await ofetch<any[]>(this.baseUrl);
      
      if (!Array.isArray(data)) return [];

      // Traducimos el JSON del backend al modelo oficial de tu dominio (Sin 'available')
      return data.map((item: any) => ({
        id: item.id || item._id,
        name: item.nombre || item.name || 'Usuario sin nombre', // Evita el undefined para que toLowerCase() no rompa la web
        email: item.email || 'Sin correo electrónico',
        role: item.rol || item.role || 'client' // Mapea 'rol' a 'role'
      }));
    } catch (error) {
      console.error('Error al obtener los usuarios desde la API:', error);
      // Devolvemos un array vacío en lugar de romper la pantalla si la API falla temporalmente
      return []; 
    }
  }

  // 2. Actualizar Rol (Traduce el rol al DTO que espera el backend)
  async updateRole(id: string, role: 'admin' | 'client'): Promise<User> {
    try {
      // Si tu backend espera el campo en español (ej: "rol"), lo mapeamos aquí
      const bodyDto = {
        rol: role 
      };

      const response = await ofetch<any>(`${`${this.baseUrl}/${id}/role`}`, {
        method: 'PUT',
        body: bodyDto
      });

      // Retornamos la respuesta adaptada exactamente a tu interfaz User (Sin 'available')
      return {
        id: response?.id || id,
        name: response?.nombre || 'Usuario actualizado',
        email: response?.email || '',
        role: response?.rol || response?.role || role
      };
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      throw new Error('No se pudo cambiar el rol del usuario.');
    }
  }

  // 3. Eliminar un usuario
  async delete(id: string): Promise<void> {
    try {
      await ofetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw new Error('No se pudo dar de baja al usuario.');
    }
  }
}