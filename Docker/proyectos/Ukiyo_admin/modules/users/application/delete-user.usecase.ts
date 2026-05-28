import type { UserRepository } from '../domain/user.repository';

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) throw new Error('Se requiere un ID de usuario válido.');
    await this.userRepository.delete(id);
  }
}