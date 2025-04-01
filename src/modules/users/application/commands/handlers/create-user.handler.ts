import { CommandHandler, ICommandHandler, EventBus } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserCommand } from "../create-user.command";
import { User } from "src/modules/users/domain/entities/user.entity";
import { UserRepositoryPort, USER_REPOSITORY } from "../../ports/user-repository.port";
import { NotificationPort, NOTIFICATION_SERVICE } from "../../ports/notification.port";
import { UserCreatedEvent } from "src/modules/users/domain/events/user-created.event";



@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const { id, updateUserDto } = command;
    
    // Buscar usuario existente
    const user = await this.userRepository.findById(id);
    
    // Actualizar campos
    const updates: any = { ...updateUserDto };
    
    // Si hay password, encriptarlo
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    // Actualizar el usuario
    user.update(updates);
    
    // Guardar cambios
    const updatedUser = await this.userRepository.update(user);
    
    // Enviar notificación
    await this.notificationService.sendUserUpdatedNotification(updatedUser);
    
    return updatedUser;
  }
}
