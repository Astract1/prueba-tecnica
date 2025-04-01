import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserQuery } from './get-user.query';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort, USER_REPOSITORY } from '../ports/user-repository.port';


//** Maneja la obtención de un usuario por ID. */
//** Este comando se encarga de recuperar un usuario específico del sistema utilizando su ID. */
@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

    /**
     * Ejecuta la consulta para obtener un usuario por su ID.
     * Es decir , busca un usuario en la base de datos utilizando su ID.
     */
  async execute(query: GetUserQuery): Promise<User> {
    return this.userRepository.findById(query.id);
  }
}