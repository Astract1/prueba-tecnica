import { UpdateUserDto } from "../dtos/update-user.dto";

/**
 * Comando para actualizar un usuario existente.
 * Contiene la información necesaria para actualizar un usuario a través de la aplicación.
 */

export class UpdateUserCommand {
    constructor(
        public readonly id: string,
        public readonly updateUserDto: UpdateUserDto,
    ) {}
}