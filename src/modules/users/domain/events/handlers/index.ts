import { UserCreatedHandler } from "../user-created.handler";


/**
 * Aqui se registran los handlers de eventos de dominio.
 * Se pueden agregar más handlers de eventos de dominio en este archivo.
 */
export const EventHandlers = [
  UserCreatedHandler,
];