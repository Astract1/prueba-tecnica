import { CommandHandler, ICommandHandler, EventBus } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserCommand } from "../create-user.command";
import { User } from "src/modules/users/domain/entities/user.entity";
import { UserRepositoryPort, USER_REPOSITORY } from "../../ports/user-repository.port";
import { NotificationPort, NOTIFICATION_SERVICE } from "../../ports/notification.port";
import { UserCreatedEvent } from "src/modules/users/domain/events/user-created.event";

//** Maneja la creación de un nuevo usuario. */
//** Este comando se encarga de crear un nuevo usuario en el sistema, cifrar su contraseña y enviar una notificación. */
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { createUserDto } = command;
    
    // Cifrar contraseña Haseada
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Crear nueva instancia de usuario
    const user = new User({
      email: createUserDto.email,
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });
    
    // Guardar usuario
    const savedUser = await this.userRepository.create(user);
    
    // Publicar evento
    this.eventBus.publish(new UserCreatedEvent(savedUser.id));
    
    // Enviar notificación
    await this.notificationService.sendUserCreatedNotification(savedUser);
    //Returnar el usuario creado
    return savedUser;
  }
}