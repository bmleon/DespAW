import type { User } from './user.model';

export interface UserRepository {
  findAll(): Promise<User[]>;
  updateRole(id: string, role: 'admin' | 'client'): Promise<User>;
  delete(id: string): Promise<void>;
}