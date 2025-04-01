import { IQueryBus, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetUsersQuery } from "./get-users.query";
import { User } from "../../domain/entities/user.entity";
import { UserRepositoryPort, USER_REPOSITORY } from "../ports/user-repository.port";


@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: GetUsersQuery): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
