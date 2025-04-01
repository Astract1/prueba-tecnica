// src/modules/users/domain/entities/user.entity.ts
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidad de dominio que representa un usuario en el sistema.
 * Contiene la lógica de negocio relacionada con los usuarios.
 */
export class User {
  /**
   * Identificador único del usuario.
   */
  id: string;

  /**
   * Correo electrónico del usuario (único en el sistema).
   */
  email: string;

  /**
   * Contraseña del usuario (almacenada como hash).
   */
  password: string;

  /**
   * Nombre del usuario.
   */
  firstName: string;

  /**
   * Apellido del usuario.
   */
  lastName: string;

  /**
   * Indica si la cuenta del usuario está activa.
   */
  isActive: boolean;

  /**
   * Fecha de creación del usuario.
   */
  createdAt: Date;

  /**
   * Fecha de la última actualización del usuario.
   */
  updatedAt: Date;

  /**
   * Crea una nueva instancia de Usuario.
   * @param params - Parámetros para crear el usuario.
   */
  constructor(params: {
    id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    // Genera un UUID automáticamente si no se proporciona o está vacío
    this.id = params.id && params.id.trim() !== '' ? params.id : uuidv4();
    this.email = params.email;
    this.password = params.password;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.isActive = params.isActive ?? true;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  /**
   * Actualiza los datos del usuario con los nuevos valores proporcionados.
   * @param params - Campos a actualizar (parcial, solo los campos a cambiar).
   */
  update(params: Partial<Omit<User, 'id' | 'createdAt'>>) {
    // Actualiza las propiedades con los nuevos valores, si se proporcionan
    if (params.email !== undefined) this.email = params.email;
    if (params.password !== undefined) this.password = params.password;
    if (params.firstName !== undefined) this.firstName = params.firstName;
    if (params.lastName !== undefined) this.lastName = params.lastName;
    if (params.isActive !== undefined) this.isActive = params.isActive;
    
    // Siempre actualiza la fecha de actualización
    this.updatedAt = new Date();
  }

  /**
   * Desactiva la cuenta del usuario.
   */
  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
   * Activa la cuenta del usuario.
   */
  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  /**
   * Obtiene el nombre completo del usuario.
   * @returns Nombre completo (nombre + apellido).
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Valida que el usuario tenga todos los campos requeridos.
   * @throws Error si falta algún campo requerido.
   */
  validate(): void {
    if (!this.email) throw new Error('Email is required');
    if (!this.password) throw new Error('Password is required');
    if (!this.firstName) throw new Error('First name is required');
    if (!this.lastName) throw new Error('Last name is required');
  }

  /**
   * Crea una copia del usuario actual.
   * @returns Una nueva instancia de Usuario con los mismos valores.
   */
  clone(): User {
    return new User({
      id: this.id,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      isActive: this.isActive,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    });
  }
}