// Este archivo contiene la definición del comando DeleteUserCommand, que se utiliza para eliminar un usuario en el sistema.
export class DeleteUserCommand {
  constructor(public readonly id: string) {}
}