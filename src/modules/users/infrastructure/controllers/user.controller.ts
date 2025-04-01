import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards, Put, Delete} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { UpdateUserCommand } from '../../application/commands/update-user.command';
import { DeleteUserCommand } from '../../application/commands/delete-user.command';
import { GetUserQuery } from '../../application/queries/get-user.query';
import { GetUsersQuery } from '../../application/queries/get-users.query'


@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.commandBus.execute(
      new CreateUserCommand(createUserDto),
    );
    return UserResponseDto.fromDomain(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.queryBus.execute(new GetUsersQuery());
    return users.map((user: any) => UserResponseDto.fromDomain(user));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.queryBus.execute(new GetUserQuery(id));
    return UserResponseDto.fromDomain(user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.commandBus.execute(
      new UpdateUserCommand(id, updateUserDto),
    );
    return UserResponseDto.fromDomain(user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }
}