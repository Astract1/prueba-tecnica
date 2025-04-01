/**
 * Representa la respuesta de un usuario en el sistema.
 * Este DTO se utiliza para transferir la información del usuario al cliente sin exponer datos sensibles.
 * Ejemplo de uso: Al crear un nuevo usuario, se devuelve un objeto de este tipo al cliente.
 * Contiene información básica del usuario, como su ID, correo electrónico, nombre, apellidos y estado de actividad.
 */

export class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  
    static fromDomain(user: any): UserResponseDto {
      const dto = new UserResponseDto();
      dto.id = user.id;
      dto.email = user.email;
      dto.firstName = user.firstName;
      dto.lastName = user.lastName;
      dto.isActive = user.isActive;
      dto.createdAt = user.createdAt;
      dto.updatedAt = user.updatedAt;
      return dto;
    }
  }