import { ofetch } from 'ofetch';
import type { UserRepository } from '../domain/user.repository';
import type { User } from '../domain/user.model';

export class ApiUserRepository implements UserRepository {
  private baseUrl = 'https://ukiyocazorla.es/api/usuarios';

  async findAll(): Promise<User[]> {
    try {
      return await ofetch<User[]>(this.baseUrl);
    } catch (error) {
      console.error('Error al obtener los usuarios desde la API:', error);
      throw new Error('No se pudo cargar la lista de usuarios.');
    }
  }

  async updateRole(id: string, role: 'admin' | 'client'): Promise<User> {
    try {
      return await ofetch<User>(`${this.baseUrl}/${id}/role`, {
        method: 'PUT',
        body: { role }
      });
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