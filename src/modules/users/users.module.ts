import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UserController } from './infrastructure/controllers/user.controller';
import { UserTypeormEntity } from './infrastructure/adapters/persistence/typeorm/entities/user.typeorm-entity';
import { TypeOrmUserRepository } from './infrastructure/adapters/persistence/typeorm/repositories/user.repository';
import { EmailNotificationService } from './infrastructure/adapters/notifications/email/email.service';
import { CommandHandlers } from './application/commands/handlers';
import { QueryHandlers } from './application/queries/handlers';
import { EventHandlers } from './application/events/handlers';
import { USER_REPOSITORY } from './application/ports/user-repository.port';
import { NOTIFICATION_SERVICE } from './application/ports/notification.port';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserTypeormEntity]),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [
    // Commands
    ...CommandHandlers,
    // Queries
    ...QueryHandlers,
    // Events
    ...EventHandlers,
    // Repositories
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    // Services
    {
      provide: NOTIFICATION_SERVICE,
      useClass: EmailNotificationService,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}