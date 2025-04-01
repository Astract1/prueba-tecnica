import { IQueryBus, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetUsersQuery } from "./get-users.query";
import { User } from "../../domain/entities/user.entity";
import { UserRepositoryPort, USER_REPOSITORY } from "../ports/user-repository.port";

//** Maneja la obtención de todos los usuarios. */
//** Este comando se encarga de recuperar todos los usuarios del sistema. */
@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

    /**
     * Ejecuta la consulta para obtener todos los usuarios.
     * Es decir , busca todos los usuarios en la base de datos.
     */
  async execute(query: GetUsersQuery): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
