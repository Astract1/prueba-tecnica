/**
 * Aqui se definen los eventos de dominio.
 * Los eventos de dominio son objetos que representan un cambio en el estado del dominio.
 */

export class UserCreatedEvent {
    constructor(public readonly userId: string) {}
  }
  