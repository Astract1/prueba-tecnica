import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteUserCommand } from '../delete-user.command';
import { UserRepositoryPort, USER_REPOSITORY } from '../../ports/user-repository.port';


//** Maneja la eliminación de un usuario. */
//** Este comando se encarga de eliminar un usuario del sistema. */
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { id } = command;
    
    // Verificar que el usuario existe
    await this.userRepository.findById(id);
    
    // Eliminar usuario
    await this.userRepository.delete(id);
  }
}