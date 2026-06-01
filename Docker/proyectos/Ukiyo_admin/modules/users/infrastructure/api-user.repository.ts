import { ofetch } from 'ofetch';
import type { UserRepository } from '../domain/user.repository';
import type { User } from '../domain/user.model';

export class ApiUserRepository implements UserRepository {
  // CORRECCIÓN CLAVE: Añadida la ruta exacta del microservicio de usuarios
  private baseUrl = 'https://ukiyocazorla.es/api/usuarios';

  async findAll(): Promise<User[]> {
    try {
      console.log(`🔌 Conectando Repositorio a: ${this.baseUrl}`);
      const response = await ofetch<any>(this.baseUrl);
      
      // Aseguramos capturar el array tanto si viene directo como si viene envuelto en .data
      const usersList = Array.isArray(response) ? response : response?.data || [];

      // MAPEADO REAL: Convertimos tu JSON (username) al modelo User (name)
      return usersList.map((u: any) => ({
        id: u.id || u._id || String(u),
        name: u.username || u.nombre || u.name || 'Usuario sin nombre', 
        email: u.email || 'sin-email@ukiyo.com',
        role: u.role || u.rol || 'client' 
      }));
    } catch (error) {
      console.error('Error al obtener los usuarios desde la API:', error);
      // Devuelve array vacío para no romper el Promise.all del Dashboard
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