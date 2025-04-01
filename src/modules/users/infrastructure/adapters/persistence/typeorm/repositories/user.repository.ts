import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../../../../application/ports/user-repository.port';
import { User } from '../../../../../domain/entities/user.entity';
import { UserTypeormEntity } from '../entities/user.typeorm-entity';

/**
 * Implementación del puerto de repositorio de usuarios utilizando TypeORM.
 * Proporciona métodos para interactuar con la base de datos de usuarios.
 */

@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly userRepository: Repository<UserTypeormEntity>,
  ) {}

    /**
   * Recupera todos los usuarios de la base de datos.
   * @param {string} id - El ID del usuario a buscar.
   */
  async findAll(): Promise<User[]> {
    const entities = await this.userRepository.find();
    return entities.map(this.toDomain);
  }



/**
   * Busca un usuario por su identificador único.
   *
   * @param id - Identificador único del usuario.
   * @returns Devuelve la instancia de User correspondiente.
   * @throws Error si no se encuentra el usuario con el ID proporcionado.
   */

  async findById(id: string): Promise<User> {
    const entity = await this.userRepository.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`User with id ${id} not found`);
    }
    return this.toDomain(entity);
  }

    /**
     * Busca un usuario por su dirección de correo electrónico.
     *
     * @param email - Dirección de correo electrónico del usuario.
     * @returns Devuelve la instancia de User correspondiente.
     * @throws Error si no se encuentra el usuario con el correo electrónico proporcionado.
     */

  async findByEmail(email: string): Promise<User> {
    const entity = await this.userRepository.findOne({ where: { email } });
    if (!entity) {
      throw new Error(`User with email ${email} not found`);
    }
    return this.toDomain(entity);
  }

    /**
     * Crea un nuevo usuario en la base de datos.
     *
     * @param user - Instancia de User a crear.
     * @returns Devuelve la instancia de User creada.
     */

  async create(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const savedEntity = await this.userRepository.save(entity);
    return this.toDomain(savedEntity);
  }

    /**
     * Actualiza un usuario existente en la base de datos.
     *
     * @param user - Instancia de User a actualizar.
     * @returns Devuelve la instancia de User actualizada.
     * @throws Error si no se encuentra el usuario con el ID proporcionado.
     */


  async update(user: User): Promise<User> {
    await this.userRepository.update(user.id, this.toEntity(user));
    return this.findById(user.id);
  }
    

        /**
        * Elimina un usuario de la base de datos.
        *
        * @param id - Identificador único del usuario a eliminar.
        * @throws Error si no se encuentra el usuario con el ID proporcionado.
        */

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

    /**
     * Convierte una entidad de usuario de TypeORM a un objeto de dominio User.
     *
     * @param entity - Entidad de usuario de TypeORM.
     * @returns Objeto de dominio User.
     */

  private toDomain(entity: UserTypeormEntity): User {
    return new User({
      id: entity.id,
      email: entity.email,
      password: entity.password,
      firstName: entity.firstName,
      lastName: entity.lastName,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

    /**
     * Convierte un objeto de dominio User a una entidad de usuario de TypeORM.
     *
     * @param user - Objeto de dominio User.
     * @returns Entidad de usuario de TypeORM.
     */

  private toEntity(user: User): UserTypeormEntity {
    const entity = new UserTypeormEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.password = user.password;
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    entity.isActive = user.isActive;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }
}