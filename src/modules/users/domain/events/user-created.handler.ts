import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { UserCreatedEvent } from "./user-created.event";

/**
 * Aquì se define el manejador del evento UserCreatedEvent.
 * Este manejador se encarga de manejar el evento cuando un usuario es creado.
 */
@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  private readonly logger = new Logger(UserCreatedHandler.name);

  handle(event: UserCreatedEvent) {
    this.logger.log(`User created: ${event.userId}`);
    // Eventos
  }
}