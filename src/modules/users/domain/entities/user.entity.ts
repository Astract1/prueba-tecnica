/**
 * Representa a cualquier User en el sistema.
 */

export class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    /**
     * Crea una instancia de User con los parámetros anteriores.
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

        this.id = params.id ?? '';
        this.email = params.email;
        this.password = params.password;
        this.firstName = params.firstName;
        this.lastName = params.lastName;
        this.isActive = params.isActive ?? true;
        this.createdAt = params.createdAt ?? new Date();
        this.updatedAt = params.updatedAt ?? new Date();
    }


    /**
     * Actualiza los campos del User con los parámetros proporcionados.
     */
    update(params: Partial<Omit<User, 'id' | 'createdAt'>>) {
        Object.assign(this, {
            ...params,
            updatedAt: new Date(),
        });
    }


    /**
     * Desactiva el User.
     * Lo que hace es establecer la propiedad isActive a false y actualizar la fecha de actualización.
     */
    deactivate() {
        this.isActive = false;
        this.updatedAt = new Date();
    }

    /**
     * Activa el User.
     * Lo que hace es establecer la propiedad isActive a true y actualizar la fecha de actualización.
     */

    activate() {
        this.isActive = true;
        this.updatedAt = new Date();
    }

    /**
     * Devuelve el nombre completo del User.
     * Lo que hace es concatenar el primer nombre y el apellido con un espacio entre ellos.
     * ejemplo: "Juan Perez"
     */

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}