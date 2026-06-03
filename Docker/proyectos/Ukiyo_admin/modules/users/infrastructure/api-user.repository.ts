// modules/users/infrastructure/api-user.repository.ts
import { ofetch } from 'ofetch';
import type { UserRepository } from '../domain/user.repository';
import type { User } from '../domain/user.model';

export class ApiUserRepository implements UserRepository {
  private baseUrl = 'https://ukiyocazorla.es/api/usuarios';

  // 🚀 AUTENTICACIÓN REAL ADAPTADA AL BACKEND (SÓLO USERNAME)
  async login(identificadorInput: string, passwordInput: string): Promise<any | null> {
    try {
      console.log(`🔐 Intentando login real contra el Gateway en: https://ukiyocazorla.es/api/auth/login`);
      
      // Enviamos única y estrictamente la estructura que vuestro backend acepta
      const response = await ofetch<any>('https://ukiyocazorla.es/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          username: identificadorInput, // ◄ Enviamos siempre el texto plano aquí
          password: passwordInput
        }
      });

      if (response?.access_token) {
        const userData = response.user;
        
        return {
          token: response.access_token,
          profile: {
            username: userData?.username || identificadorInput,
            role: userData?.role || 'Administrador'
          }
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error de autenticación real en el API Gateway:', error);
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      console.log(`🔌 Conectando Repositorio a: ${this.baseUrl}`);
      const response = await ofetch<any>(this.baseUrl);
      const usersList = Array.isArray(response) ? response : response?.data || [];
      return usersList.map((u: any) => ({
        id: u.id || u._id || String(u),
        name: u.username || u.nombre || u.name || 'Usuario sin nombre', 
        email: u.email || 'sin-email@ukiyo.com',
        role: u.role || u.rol || 'client' 
      }));
    } catch (error) {
      console.error('Error al obtener los usuarios desde la API:', error);
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
      await ofetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw new Error('No se pudo dar de baja al usuario.');
    }
  }
}