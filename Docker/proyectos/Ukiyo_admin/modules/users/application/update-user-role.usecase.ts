import type { UserRepository } from '../domain/user.repository';
import type { User } from '../domain/user.model';

export class UpdateUserRoleUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, currentRole: 'admin' | 'client'): Promise<User> {
    const newRole = currentRole === 'admin' ? 'client' : 'admin';
    return await this.userRepository.updateRole(id, newRole);
  }
}