import { CreateUserDto } from "../dtos/create-user.dto";


/**
 * Comando para crear un nuevo usuario.
 * Contiene la información necesaria para crear un usuario a través de la aplicación.
 */
export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

