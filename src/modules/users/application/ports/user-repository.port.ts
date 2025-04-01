import { User } from "../../domain/entities/user.entity";

/**
 * Interfaz para el repositorio de usuarios.
 * Define los métodos que deben implementarse para interactuar con la base de datos
 * y realizar operaciones CRUD en los usuarios.
 * Buscar usuarios por ID, email, crear, actualizar y eliminar usuarios.
 */

export interface UserRepositoryPort {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
}


export const USER_REPOSITORY = "USER_REPOSITORY";