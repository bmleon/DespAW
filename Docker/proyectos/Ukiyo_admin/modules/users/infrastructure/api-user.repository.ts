import { ofetch } from 'ofetch';
import type { UserRepository } from '../domain/user.repository';
import type { User } from '../domain/user.model';

export class ApiUserRepository implements UserRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://tienda.ukiyocazorla.es';
  }

  async findAll(): Promise<User[]> {
    try {
      const data = await ofetch<User[]>(`${this.baseUrl}/api/users`);
      return data;
    } catch (error) {
      console.error('Error al obtener los usuarios desde la API:', error);
      throw new Error('No se pudo cargar la lista de usuarios.');
    }
  }
}