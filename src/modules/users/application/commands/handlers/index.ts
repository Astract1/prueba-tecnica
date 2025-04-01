import { CreateUserHandler } from './create-user.handler';
import { UpdateUserHandler } from './create-user.handler';
import { DeleteUserHandler } from './delete-user.handler';

export const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];