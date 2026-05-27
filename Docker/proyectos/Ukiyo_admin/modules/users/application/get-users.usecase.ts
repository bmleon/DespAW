import type { UserRepository } from '../domain/user.repository';
import type { User } from '../domain/user.model';

export class GetUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    // Devuelve la lista de usuarios registrados en el sistema
    return await this.userRepository.findAll();
  }
}