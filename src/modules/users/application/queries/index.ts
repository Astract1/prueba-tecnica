import { GetUserHandler } from './get-user.handler';
import { GetUsersHandler } from './get-users.handler';

/**
 * Conjunto de manejadores de consultas relacionados con la obtención de usuarios.
 *
 * Este array contiene los comandos que se encargan de recuperar información de los usuarios,
 * permitiendo obtener un usuario en particular o la lista completa de usuarios del sistema.
 */
export const QueryHandlers = [
  GetUserHandler,
  GetUsersHandler,
];