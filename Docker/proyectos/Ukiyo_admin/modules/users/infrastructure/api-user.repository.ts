import { ofetch } from 'ofetch';
import type { UserRepository } from '../domain/user.repository';
import type { User } from '../domain/user.model';

export class ApiUserRepository implements UserRepository {
  private baseUrl = 'https://ukiyocazorla.es';

  async findAll(): Promise<User[]> {
    try {
      const response = await ofetch<any>(this.baseUrl);
      
      // Aseguramos capturar el array tanto si viene directo como si viene envuelto en .data
      const usersList = Array.isArray(response) ? response : response?.data || [];

      // MAPEADO REAL CON TU JSON:
      return usersList.map((u: any) => ({
        id: u.id || u._id || String(u),
        
        // SOLUCIÓN AL "Sin nombre": Tu JSON trae 'username', lo asignamos a 'name'
        name: u.username || u.nombre || u.name || 'Usuario sin nombre', 
        
        email: u.email || 'sin-email@ukiyo.com',
        
        // Tu JSON NO trae rol, mapeamos uno por defecto seguro para evitar caídas
        role: u.role || u.rol || 'client' 
      }));
    } catch (error) {
      console.error('Error al obtener los usuarios desde la API:', error);
      // RETORNO SEGURO: Devuelve un array vacío en vez de lanzar un 'throw'
      // Esto rompe el bloqueo del Promise.all y permite que el Dashboard pinte el contador
      return []; 
    }
  }

  async updateRole(id: string, role: 'admin' | 'client'): Promise<User> {
    try {
      const response = await ofetch<any>(`${this.baseUrl}/${id}/role`, {
        method: 'PUT',
        body: { role }
      });

      return {
        id: response?.id || id,
        name: response?.username || response?.nombre || 'Usuario Actualizado',
        email: response?.email || '',
        role: role
      };
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      throw new Error('No se pudo cambiar el rol del usuario.');
    }
  }

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