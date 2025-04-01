import { CreateUserHandler } from './create-user.handler';
import { UpdateUserHandler } from './update-user.handler';
import { DeleteUserHandler } from './delete-user.handler';

//** Exportar todos los manejadores de comandos para ser utilizados en el módulo de usuarios. */
//** Estos manejadores son responsables de manejar la lógica de negocio para cada comando. */
export const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];